#!/usr/bin/env python3
"""
The Cursed Tomb (v0.0.9) -- Campaign Simulator
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
    volatile_collapse: bool = True  # optional "all 4 of a rank entombed" instant collapse
    max_attrition_stage: int = 5    # stage at which a card is considered entombed (default 5)
    anchor_absorption: bool = False # Anchored cards absorb 4 marks before anchor exhausts (disabled)
    anchor_max_absorption: int = 4  # Number of absorbed marks on + before exhaustion (default 4)
    sealed_tomb_victory: bool = False# Sealed Tomb Win: < 28 living (un-anchored) cards remain (disabled)


@dataclass
class CardState:
    """A physical card. Persists across rounds within a campaign."""
    rank: str
    suit: str
    attrition_stage: int = 0   # 0 none,1 vulnerable,2 doubtful,3 scar,4 curse,5 entombed
    reward_stage: int = 0      # 0 none,1 fortifying,2 anchored (immune forever)
    blessed: bool = False      # Fallen Hero blessing unlocked (uses own suit for effect)
    temp_immune: bool = False  # this-round-only immunity granted by a Hearts blessing
    anchor_absorption: int = 0 # 0..4 marks absorbed by current Anchor

    def __repr__(self):
        return f"{self.rank}{self.suit}"

    def base_value(self):
        return RANK_VALUES[self.rank]

    def functional_value(self, flags):
        v = RANK_VALUES[self.rank]
        if flags.scars and self.attrition_stage >= 3:  # scar effect persists through curse stage too
            v += 1 if self.suit in RED else -1
            v = ((v - 1) % 13) + 1  # Circular A <-> K modulo wrapping (1..13)
        return v

    def is_black_cursed(self, flags):
        return flags.curses and self.attrition_stage >= 4 and self.suit in BLACK

    def is_red_cursed(self, flags):
        return flags.curses and self.attrition_stage >= 4 and self.suit in RED

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
    """Sum used for a proposed pairing, honoring the Clubs (Universal Wildcard) blessing:
    if one side is a Clubs Fallen Hero, it can pair with ANY card (treating sum as TARGET)."""
    a_is_clubs_hero = flags.blessings and card_a.blessed and card_a.suit == 'C'
    b_is_clubs_hero = flags.blessings and card_b.blessed and card_b.suit == 'C'
    if a_is_clubs_hero or b_is_clubs_hero:
        return TARGET
    val_a = card_a.functional_value(flags)
    val_b = card_b.functional_value(flags)
    return val_a + val_b


@dataclass
class RoundOutcome:
    kind: str            # 'perfect_win' | 'pyramid_clear' | 'freeze'
    moves: int = 0
    last_clear_type: str = None   # 'pair' | 'solo' | None
    last_clear_cards: tuple = None


def play_round(pool, rng, max_redeals, flags, max_moves=300, full_registry=None):
    """Plays one round in-place against the persistent CardState objects in
    `pool` (mutating attrition/reward/blessed/temp_immune fields as events
    happen). `pool` must have length >= 28. Returns a RoundOutcome."""
    if full_registry is None:
        full_registry = pool
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
    clears_this_pass = 0
    last_clear_cards = None
    last_clear_type = None

    def fire_on_clear(card):
        """Blessing side-effects that trigger whenever a blessed card clears."""
        if not flags.blessings or not card.blessed:
            return
        if card.suit == 'H':  # Stock Reshuffle: free Waste pile reshuffle into Stock
            if waste:
                stock.extend(waste)
                waste.clear()
                rng.shuffle(stock)
        elif card.suit == 'S':  # Tunnel: move exposed pyramid card to Waste
            exp = exposed_slots(removed, locks)
            if exp:
                # Select exposed slot that unlocks the most cards below
                best_slot = max(exp, key=lambda s: len(COVERS[s]) if s < len(COVERS) else 0)
                removed.add(best_slot)
                waste.append(pyr[best_slot])
        # Diamonds (Vault) handled at draw time; Clubs (Universal Wildcard) handled in pair_sum

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
                if pair_sum(pcard, single_card, flags) == TARGET:
                    score = newly_exposed_after(removed, locks, (a,))
                    candidates.append((score, 'pw', (a, kind_s, vi)))

        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            _, kind, payload = candidates[0]
            if kind == 'pp':
                a, b = payload
                card_a, card_b = pyr[a], pyr[b]
                removed.add(a); removed.add(b)
                a_bc = card_a.is_black_cursed(flags)
                b_bc = card_b.is_black_cursed(flags)
                if a_bc and not b_bc:
                    stock.append(card_b)
                    rng.shuffle(stock)
                elif b_bc and not a_bc:
                    stock.append(card_a)
                    rng.shuffle(stock)
                elif a_bc and b_bc:
                    stock.append(card_a)
                    stock.append(card_b)
                    rng.shuffle(stock)
                fire_on_clear(card_a); fire_on_clear(card_b)
                last_clear_type, last_clear_cards = 'pair', (card_a, card_b)
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
                card_w = waste.pop() if kind_s == 'waste' else vault.pop(vi)
                card_a = pyr[a]
                removed.add(a)
                a_bc = card_a.is_black_cursed(flags)
                w_bc = card_w.is_black_cursed(flags)
                if a_bc and not w_bc:
                    stock.append(card_w)
                    rng.shuffle(stock)
                elif w_bc and not a_bc:
                    stock.append(card_a)
                    rng.shuffle(stock)
                elif a_bc and w_bc:
                    stock.append(card_a)
                    stock.append(card_w)
                    rng.shuffle(stock)
                fire_on_clear(card_a); fire_on_clear(card_w)
                last_clear_type, last_clear_cards = 'pair', (card_a, card_w)
            moves_played += 1
            clears_this_pass += 1
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
                    clears_this_pass += 1
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

        # stock just ran out for this pass.
        # allow redeal if redeals_left > 0 AND (progress was made OR this is the first pass of the round).
        if redeals_left > 0 and waste and clears_this_pass > 0:
            stock = waste
            waste = []
            redeals_left -= 1
            moves_played += 1
            clears_this_pass = 0
            continue

        break  # truly stuck: no stock, no useful redeal, no legal move

    # FREEZE: apply attrition to bottlenecks (currently exposed, non-immune cards)
    if flags.attrition:
        exp = exposed_slots(removed, locks)
        for i in exp:
            card = pyr[i]
            if card.temp_immune:
                continue
            if flags.anchor_absorption and card.reward_stage >= 2:
                if card.anchor_absorption < flags.anchor_max_absorption:
                    card.anchor_absorption += 1
                    if card.anchor_absorption >= flags.anchor_max_absorption:
                        card.reward_stage = 0
                        card.attrition_stage = 0
                    continue
            if card.is_anchored():
                continue
            if card.attrition_stage < flags.max_attrition_stage:
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
        if lower.attrition_stage < 3:
            prev_stage = lower.reward_stage
            lower.reward_stage = min(2, lower.reward_stage + 1)
            if lower.reward_stage == 2 and prev_stage < 2:
                lower.anchor_absorption = 0
        # else: Ink Overlap -- reward lost
    elif last_clear_type == 'solo':
        card, = last_clear_cards
        if card.attrition_stage < 3:
            prev_stage = card.reward_stage
            card.reward_stage = min(2, card.reward_stage + 1)
            if card.reward_stage == 2 and prev_stage < 2:
                card.anchor_absorption = 0


def run_campaign(rng, max_redeals, flags, max_rounds, deadlock_limit=None):
    # `registry` holds all 52 physical cards for the entire campaign,
    # including entombed ones (needed for the volatile-collapse rank check).
    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    rounds_played = 0

    consecutive_stalls = 0
    for round_num in range(1, max_rounds + 1):
        rounds_played = round_num
        active = [c for c in registry if c.attrition_stage < flags.max_attrition_stage]
        if len(active) < N_PYR:
            return {"result": "collapse_starvation", "rounds": rounds_played}

        if flags.sealed_tomb_victory:
            living = [c for c in active if not c.is_anchored()]
            if len(living) < N_PYR:
                return {"result": "victory_sealed", "rounds": rounds_played}

        # Check if ALL remaining active cards in the campaign are immune/anchored
        if all(c.is_anchored() for c in active):
            return {"result": "all_immune_stall", "rounds": rounds_played}

        # Take snapshot of deck state before round
        state_before = [(c.attrition_stage, c.reward_stage, c.blessed, c.anchor_absorption) for c in registry]

        outcome = play_round(active, rng, max_redeals, flags, full_registry=registry)

        if outcome.kind == 'perfect_win':
            return {"result": "victory", "rounds": rounds_played}

        if outcome.kind == 'pyramid_clear':
            _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

        if outcome.kind == 'freeze' and flags.volatile_collapse:
            by_rank = {}
            for c in registry:
                if c.attrition_stage >= flags.max_attrition_stage:
                    by_rank.setdefault(c.rank, 0)
                    by_rank[c.rank] += 1
            if any(count >= 4 for count in by_rank.values()):
                return {"result": "collapse_volatile", "rounds": rounds_played}

        # Check if any physical card state changed during this round
        state_after = [(c.attrition_stage, c.reward_stage, c.blessed, c.anchor_absorption) for c in registry]
        if state_before == state_after:
            consecutive_stalls += 1
            if deadlock_limit is None:
                deadlock_threshold = max(1, int(max_rounds * 0.10))
            elif isinstance(deadlock_limit, float) and deadlock_limit < 1.0:
                deadlock_threshold = max(1, int(max_rounds * deadlock_limit))
            else:
                deadlock_threshold = int(deadlock_limit)
            if consecutive_stalls >= deadlock_threshold:
                return {"result": "stall_deadlock", "rounds": rounds_played}
        else:
            consecutive_stalls = 0

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
    stall_deadlocks = 0
    victory_rounds = []
    collapse_rounds = []
    rounds_to_resolution = []  # victories + collapses only (excludes timeouts)

    for i in range(campaigns):
        result = run_campaign(rng, max_redeals, flags, max_rounds)
        if result["result"] == "victory":
            victories += 1
            victory_rounds.append(result["rounds"])
            rounds_to_resolution.append(result["rounds"])
        elif result["result"] == "timeout":
            timeouts += 1
        elif result["result"] == "stall_deadlock":
            stall_deadlocks += 1
        else:
            collapses += 1
            collapse_rounds.append(result["rounds"])
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
    if stall_deadlocks:
        print(f"stall (deadlock):    {stall_deadlocks}  (all-immune or no-progress deadlock)")
    if timeouts:
        print(f"timeouts (round cap):{timeouts}  (increase --max-rounds to resolve these)")
    resolved = victories + collapses
    if resolved:
        print(f"victory rate:        {victories / resolved:.2%} (of resolved campaigns)")
        print(f"collapse rate:       {collapses / resolved:.2%} (of resolved campaigns)")
    print(f"victory rate (all):  {victories / campaigns:.2%}")
    print(f"collapse rate (all): {collapses / campaigns:.2%}")
    print(f"timeout rate (all):  {timeouts / campaigns:.2%}")
    if victory_rounds:
        v_mean = statistics.mean(victory_rounds)
        v_std = statistics.stdev(victory_rounds) if len(victory_rounds) > 1 else 0.0
        print(f"avg rounds to win:      {v_mean:.1f} ± {v_std:.1f} (median {statistics.median(victory_rounds):.1f})")
    else:
        print(f"avg rounds to win:      N/A (0 wins)")
    if collapse_rounds:
        c_mean = statistics.mean(collapse_rounds)
        c_std = statistics.stdev(collapse_rounds) if len(collapse_rounds) > 1 else 0.0
        print(f"avg rounds to collapse: {c_mean:.1f} ± {c_std:.1f} (median {statistics.median(collapse_rounds):.1f})")
    else:
        print(f"avg rounds to collapse: N/A (0 collapses)")
    if rounds_to_resolution:
        r_mean = statistics.mean(rounds_to_resolution)
        r_std = statistics.stdev(rounds_to_resolution) if len(rounds_to_resolution) > 1 else 0.0
        print(f"overall avg to resolve: {r_mean:.1f} ± {r_std:.1f} (median {statistics.median(rounds_to_resolution):.1f})")


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
    p.add_argument("--max-rounds", type=int, default=500,
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
