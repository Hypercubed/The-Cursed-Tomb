#!/usr/bin/env python3
"""
The Cursed Tomb (v1.8) -- Campaign Simulator
=============================================================

Simulates full CAMPAIGNS (not single rounds) of the Cursed Tomb ruleset:
a persistent, mutating variant of Pyramid Solitaire where the same 52
physical cards carry ink marks (scars, curses, entombment, anchors,
blessings) across many rounds until the campaign ends in:
  - VICTORY   : a Perfect Win (all 52 cards reach the Foundation in one round)
  - COLLAPSE  : Starvation (fewer than 28 active cards remain for a pyramid)
                or Volatile Collapse (all 4 cards of one rank entombed, optional rule)
  - TIMEOUT   : neither happened within --max-rounds (safety valve; reported
                separately, not counted in win/collapse rates)

Interpretive notes (the source rules have some ambiguity; these are the
choices this simulator makes, called out here for transparency):

1. "Bottlenecks" (attrition targets on freeze) = every currently exposed,
   not-face-down pyramid card at the moment no legal move remains. This is
   the most natural reading of "cards left completely exposed ... of the
   frozen pyramid."
2. "Functional Value" governs ALL math, including alone-clears. In base
   Pyramid only Kings (printed 13) clear solo; here, ANY card whose current
   Functional Value equals the target (13) clears solo -- so a scarred
   Queen (12+1) can become a solo-clearer too. This follows directly from
   the rules' own definition of Functional Value as "used during gameplay
   calculations."
3. The "Rule of Ink Overlap" (reward lost if the card already has failure
   ink) is applied to both Final Pair Clears and Solo King/Sibling Clears,
   for consistency, even though the text only spells it out under (A).
4. Diamond Vault is simplified: a vaulted card becomes an extra, independent
   "available single" (like a second waste-top) for the rest of the round,
   and isn't touched by redeals. It returns to the pool at the campaign
   reset like everything else.
5. Hearts (Martyr) protection target: the most at-risk currently-exposed
   pyramid card (highest attrition stage) is chosen as the beneficiary.
6. A round is declared frozen (no legal move AND no useful draw/redeal left)
   if a full stock+redeal cycle passes with zero clears, or after a
   generous move cap -- whichever comes first. This avoids infinite loops
   in a deterministic greedy player without changing the intended rules.

Player strategy is the same fast greedy heuristic as the base simulator:
always take the legal move that exposes the most new pyramid cards.
"""

from __future__ import annotations

import argparse
import random
import statistics
from dataclasses import dataclass, field

RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
RANK_VALUES = {r: i + 1 for i, r in enumerate(RANKS)}  # A=1 ... K=13
RED = {'H', 'D'}
BLACK = {'S', 'C'}
SUITS = ['S', 'H', 'D', 'C']
TARGET = 13
ROWS = 7  # always deals a 7-row / 28-card pyramid


@dataclass
class RuleFlags:
    """Toggles for individual Cursed Tomb mechanics, independent of difficulty.
    All default True/False to match the base ruleset as written."""
    scars: bool = True              # stage-3 functional value shift (+1 red / -1 black)
    curses: bool = True             # stage-4 red trap / black pairing restriction
    blessings: bool = True          # Fallen Hero unlocks + all 4 suit blessing effects
    attrition: bool = True          # failure track progresses at all on freeze
    volatile_collapse: bool = False # optional "all 4 of a rank entombed" instant collapse


@dataclass
class CardState:
    """A physical card. Persists across rounds within a campaign."""
    rank: str
    suit: str
    attrition_stage: int = 0   # 0 none,1 vulnerable,2 doubtful,3 scar,4 curse,5 entombed
    reward_stage: int = 0      # 0 none,1 fortifying,2 anchored (immune forever)
    blessed: bool = False      # Fallen Hero blessing unlocked (uses own suit for effect)
    temp_immune: bool = False  # this-round-only immunity granted by a Hearts blessing

    def __repr__(self):
        return f"{self.rank}{self.suit}"

    def base_value(self):
        return RANK_VALUES[self.rank]

    def functional_value(self, flags):
        v = RANK_VALUES[self.rank]
        if flags.scars and self.attrition_stage >= 3:  # scar effect persists through curse stage too
            v += 1 if self.suit in RED else -1
        return v

    def is_black_cursed(self, flags):
        return flags.curses and self.attrition_stage == 4 and self.suit in BLACK

    def is_red_cursed(self, flags):
        return flags.curses and self.attrition_stage == 4 and self.suit in RED

    def is_anchored(self):
        return self.reward_stage >= 2


def compute_layout(rows):
    positions = [(r, c) for r in range(rows) for c in range(r + 1)]
    index = {pos: i for i, pos in enumerate(positions)}
    covers = []
    for (r, c) in positions:
        if r + 1 < rows:
            covers.append((index[(r + 1, c)], index[(r + 1, c + 1)]))
        else:
            covers.append(())
    return positions, covers


POSITIONS, COVERS = compute_layout(ROWS)
N_PYR = len(POSITIONS)


def exposed_slots(removed, locks):
    out = []
    for i, cov in enumerate(COVERS):
        if i in removed:
            continue
        if any(c not in removed for c in cov):
            continue
        if any(locker not in removed for locker in locks.get(i, ())):
            continue
        out.append(i)
    return out


def newly_exposed_after(removed, locks, extra_removed):
    before = set(exposed_slots(removed, locks))
    after_removed = removed | set(extra_removed)
    after = set(exposed_slots(after_removed, locks))
    return len(after - before - after_removed)


def pair_sum(card_a, card_b, flags):
    """Sum used for a proposed pairing, honoring the Clubs (Equalizer) blessing:
    if one side is a Clubs Fallen Hero, the OTHER side is read at its base
    printed value instead of its (possibly scarred) functional value."""
    a_is_clubs_hero = flags.blessings and card_a.blessed and card_a.suit == 'C'
    b_is_clubs_hero = flags.blessings and card_b.blessed and card_b.suit == 'C'
    val_a = card_a.base_value() if b_is_clubs_hero else card_a.functional_value(flags)
    val_b = card_b.base_value() if a_is_clubs_hero else card_b.functional_value(flags)
    return val_a + val_b


@dataclass
class RoundOutcome:
    kind: str            # 'perfect_win' | 'pyramid_clear' | 'freeze'
    moves: int = 0
    last_clear_type: str = None   # 'pair' | 'solo' | None
    last_clear_cards: tuple = None


def play_round(pool, rng, max_redeals, flags, max_moves=4000):
    """Plays one round in-place against the persistent CardState objects in
    `pool` (mutating attrition/reward/blessed/temp_immune fields as events
    happen). `pool` must have length >= 28. Returns a RoundOutcome."""
    rng.shuffle(pool)
    pyr = pool[:N_PYR]
    stock = list(pool[N_PYR:])
    waste = []
    vault = []
    for c in pool:
        c.temp_immune = False

    removed = set()
    locks = {}
    # A red-cursed card at slot i traps the card(s) that physically overlap
    # it from below (i.e. the slots in COVERS[i]) as face-down until slot i
    # itself is cleared.
    for i, card in enumerate(pyr):
        if card.is_red_cursed(flags):
            for c in COVERS[i]:
                locks.setdefault(c, set()).add(i)

    redeals_left = max_redeals
    moves_played = 0
    progress_this_pass = False  # any clear since stock was last filled (deal or redeal)
    last_clear_cards = None
    last_clear_type = None

    def fire_on_clear(card):
        """Blessing side-effects that trigger whenever a blessed card clears."""
        if not flags.blessings or not card.blessed:
            return
        if card.suit == 'H':  # Martyr: grant temp immunity to the most at-risk exposed card
            exp = exposed_slots(removed, locks)
            candidates = [pyr[i] for i in exp if pyr[i] is not card]
            if candidates:
                target_card = max(candidates, key=lambda c: c.attrition_stage)
                target_card.temp_immune = True
        elif card.suit == 'S':  # Tunnel: flip one locked/face-down card free
            for slot, lockers in list(locks.items()):
                if slot not in removed and any(l not in removed for l in lockers):
                    locks[slot] = set()
                    break
        # Diamonds (Vault) handled at draw time; Clubs (Equalizer) handled in pair_sum

    while moves_played < max_moves:
        if len(removed) == N_PYR:
            if not stock and not waste and not vault:
                return RoundOutcome('perfect_win', moves_played, last_clear_type, last_clear_cards)
            return RoundOutcome('pyramid_clear', moves_played, last_clear_type, last_clear_cards)

        exp = exposed_slots(removed, locks)
        candidates = []  # (score, kind, payload)

        for i in range(len(exp)):
            for j in range(i + 1, len(exp)):
                a, b = exp[i], exp[j]
                if pair_sum(pyr[a], pyr[b], flags) == TARGET:
                    score = newly_exposed_after(removed, locks, (a, b))
                    candidates.append((score, 'pp', (a, b)))

        for a in exp:
            if pyr[a].functional_value(flags) == TARGET:
                score = newly_exposed_after(removed, locks, (a,))
                candidates.append((score, 'p', (a,)))

        singles = []  # ('waste', None) or ('vault', idx)
        if waste:
            singles.append(('waste', None))
        for vi in range(len(vault)):
            singles.append(('vault', vi))

        for kind_s, vi in singles:
            single_card = waste[-1] if kind_s == 'waste' else vault[vi]
            if single_card.functional_value(flags) == TARGET:
                candidates.append((0, 'alone_single', (kind_s, vi)))
            for a in exp:
                pcard = pyr[a]
                if pcard.is_black_cursed(flags):
                    continue  # Black Curse: pyramid-only pairing
                if pair_sum(pcard, single_card, flags) == TARGET:
                    score = newly_exposed_after(removed, locks, (a,))
                    candidates.append((score, 'pw', (a, kind_s, vi)))

        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            _, kind, payload = candidates[0]
            if kind == 'pp':
                a, b = payload
                removed.add(a); removed.add(b)
                fire_on_clear(pyr[a]); fire_on_clear(pyr[b])
                last_clear_type, last_clear_cards = 'pair', (pyr[a], pyr[b])
            elif kind == 'p':
                a, = payload
                removed.add(a)
                fire_on_clear(pyr[a])
                last_clear_type, last_clear_cards = 'solo', (pyr[a],)
            elif kind == 'alone_single':
                kind_s, vi = payload
                card = waste.pop() if kind_s == 'waste' else vault.pop(vi)
                fire_on_clear(card)
                last_clear_type, last_clear_cards = 'solo', (card,)
            elif kind == 'pw':
                a, kind_s, vi = payload
                card = waste.pop() if kind_s == 'waste' else vault.pop(vi)
                removed.add(a)
                fire_on_clear(pyr[a]); fire_on_clear(card)
                last_clear_type, last_clear_cards = 'pair', (pyr[a], card)
            moves_played += 1
            progress_this_pass = True
            continue

        # Check Pyramid Diamond Hero self-vaulting if no immediate removal candidate took priority
        if flags.blessings:
            vaulted_p_card = False
            for i in exp:
                card = pyr[i]
                if card.blessed and card.suit == 'D':
                    removed.add(i)
                    vault.append(card)
                    moves_played += 1
                    progress_this_pass = True
                    vaulted_p_card = True
                    break
            if vaulted_p_card:
                continue

        # no removal move available -- draw, or redeal, or freeze
        if stock:
            drawn = stock.pop(0)
            if flags.blessings and drawn.blessed and drawn.suit == 'D':
                vault.append(drawn)  # free Vault action, doesn't consume the "turn"
            else:
                waste.append(drawn)
            moves_played += 1
            continue
        # stock just ran out for this pass
        if redeals_left > 0 and waste and progress_this_pass:
            # only worth redealing if this pass actually cleared something;
            # a fully zero-progress pass is deterministic and would just
            # replay identically forever.
            stock = waste
            waste = []
            redeals_left -= 1
            moves_played += 1
            progress_this_pass = False
            continue

        break  # truly stuck: no stock, no useful redeal, no legal move

    # FREEZE: apply attrition to bottlenecks (currently exposed, non-immune cards)
    if flags.attrition:
        exp = exposed_slots(removed, locks)
        for i in exp:
            card = pyr[i]
            if card.is_anchored() or card.temp_immune:
                continue
            if card.attrition_stage < 5:
                card.attrition_stage += 1

    # Reward pass, only meaningful if the pyramid actually got cleared this
    # round (handled above via early return); reaching here means a freeze,
    # so no survival reward applies.
    return RoundOutcome('freeze', moves_played)


def _apply_survival_reward(last_clear_type, last_clear_cards, flags):
    if last_clear_type == 'pair':
        a, b = last_clear_cards
        va, vb = a.functional_value(flags), b.functional_value(flags)
        higher, lower = (a, b) if va > vb else (b, a)
        if flags.blessings and not higher.blessed:
            higher.blessed = True
        if lower.attrition_stage == 0:
            lower.reward_stage = min(2, lower.reward_stage + 1)
        # else: Ink Overlap -- reward lost
    elif last_clear_type == 'solo':
        card, = last_clear_cards
        if card.attrition_stage == 0:
            card.reward_stage = min(2, card.reward_stage + 1)


def run_campaign(rng, max_redeals, flags, max_rounds):
    # `registry` holds all 52 physical cards for the entire campaign,
    # including entombed ones (needed for the volatile-collapse rank check).
    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    rounds_played = 0

    for round_num in range(1, max_rounds + 1):
        rounds_played = round_num
        active = [c for c in registry if c.attrition_stage < 5]
        if len(active) < N_PYR:
            return {"result": "collapse_starvation", "rounds": rounds_played}

        outcome = play_round(active, rng, max_redeals, flags)

        if outcome.kind == 'perfect_win':
            return {"result": "victory", "rounds": rounds_played}

        if outcome.kind == 'pyramid_clear':
            _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

        if outcome.kind == 'freeze' and flags.volatile_collapse:
            by_rank = {}
            for c in registry:
                if c.attrition_stage == 5:
                    by_rank.setdefault(c.rank, 0)
                    by_rank[c.rank] += 1
            if any(count >= 4 for count in by_rank.values()):
                return {"result": "collapse_volatile", "rounds": rounds_played}

    return {"result": "timeout", "rounds": rounds_played}


DIFFICULTIES = {
    "novice": 9999,          # unlimited redeals
    "explorer": 2,           # 3 total passes
    "archaeologist": 1,      # 2 total passes
    "survivalist": 0,        # 1 single pass
}


def run_many_campaigns(difficulty, campaigns, seed, flags, max_rounds, verbose=False):
    rng = random.Random(seed)
    max_redeals = DIFFICULTIES[difficulty]

    victories = 0
    collapses = 0
    timeouts = 0
    rounds_to_resolution = []  # victories + collapses only (excludes timeouts)

    for i in range(campaigns):
        result = run_campaign(rng, max_redeals, flags, max_rounds)
        if result["result"] == "victory":
            victories += 1
            rounds_to_resolution.append(result["rounds"])
        elif result["result"] == "timeout":
            timeouts += 1
        else:
            collapses += 1
            rounds_to_resolution.append(result["rounds"])
        if verbose:
            print(f"campaign {i + 1:>4}: {result['result']:<22} rounds={result['rounds']}")

    print(f"\n=== The Cursed Tomb -- Campaign Simulation ===")
    print(f"difficulty:          {difficulty} (max_redeals={max_redeals})")
    print(f"scars:               {'on' if flags.scars else 'off'}")
    print(f"curses:              {'on' if flags.curses else 'off'}")
    print(f"blessings:           {'on' if flags.blessings else 'off'}")
    print(f"attrition track:     {'on' if flags.attrition else 'off'}")
    print(f"volatile collapse:   {'enabled' if flags.volatile_collapse else 'disabled'}")
    print(f"campaign round cap:  {max_rounds}")
    print(f"campaigns run:       {campaigns}")
    print(f"victories:           {victories}")
    print(f"collapses:           {collapses}")
    if timeouts:
        print(f"timeouts (uncapped): {timeouts}  (increase --max-rounds to resolve these)")
    resolved = victories + collapses
    if resolved:
        print(f"victory rate:        {victories / resolved:.2%} (of resolved campaigns)")
        print(f"collapse rate:       {collapses / resolved:.2%} (of resolved campaigns)")
    print(f"victory rate (all):  {victories / campaigns:.2%}")
    print(f"collapse rate (all): {collapses / campaigns:.2%}")
    if rounds_to_resolution:
        print(f"avg rounds to resolve a campaign: {statistics.mean(rounds_to_resolution):.1f}")
        print(f"median rounds to resolve:         {statistics.median(rounds_to_resolution):.1f}")


def parse_args():
    p = argparse.ArgumentParser(description="The Cursed Tomb: campaign simulator")
    p.add_argument("--campaigns", type=int, default=200, help="number of campaigns to simulate")
    p.add_argument("--difficulty", choices=list(DIFFICULTIES.keys()), default="archaeologist")
    p.add_argument("--seed", type=int, default=None)
    p.add_argument("--volatile-collapse", action="store_true",
                   help="enable the optional Volatile Collapse variant rule")
    p.add_argument("--no-scars", action="store_true", help="disable the stage-3 scar value shift")
    p.add_argument("--no-curses", action="store_true", help="disable stage-4 red/black curse effects")
    p.add_argument("--no-blessings", action="store_true", help="disable Fallen Hero unlocks and all suit blessing effects")
    p.add_argument("--no-attrition", action="store_true",
                   help="disable the whole failure ink track (cards never scar/curse/entomb; "
                        "campaigns then can only end via victory or timeout)")
    p.add_argument("--max-rounds", type=int, default=1000,
                   help="safety cap on rounds per campaign before declaring a timeout")
    p.add_argument("--verbose", action="store_true", help="print per-campaign results")
    return p.parse_args()


def main():
    args = parse_args()
    flags = RuleFlags(
        scars=not args.no_scars,
        curses=not args.no_curses,
        blessings=not args.no_blessings,
        attrition=not args.no_attrition,
        volatile_collapse=args.volatile_collapse,
    )
    run_many_campaigns(
        difficulty=args.difficulty,
        campaigns=args.campaigns,
        seed=args.seed,
        flags=flags,
        max_rounds=args.max_rounds,
        verbose=args.verbose,
    )


if __name__ == "__main__":
    main()
