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
4. Diamond Vault uses a multi-card FILO stack: Blessed Diamonds are appended
   to the Vault, only the top card is available for pairing or solo clearing,
   and clearing it exposes the card beneath. The Vault isn't touched by
   redeals and returns to the pool at campaign reset like everything else.
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
from multiprocessing import Pool, cpu_count
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
    blessings: bool = True          # Hero's Blessing unlocks + all 4 suit blessing effects
    attrition: bool = True          # failure track progresses at all on freeze
    max_attrition_stage: int = 5    # stage at which a card is considered entombed (default 5)
    anchor_absorption: bool = False # Anchored cards absorb 4 marks before anchor exhausts (disabled)
    anchor_max_absorption: int = 4  # Number of absorbed marks on + before exhaustion (default 4)
    sealed_tomb_victory: bool = False# Sealed Tomb Win: < 28 living (un-anchored) cards remain (disabled)
    rank_anchor_victory: bool = True # Soft Win: at least 1 card of each printed rank (13 total) is Anchored


@dataclass
class CardState:
    """A physical card. Persists across rounds within a campaign."""
    rank: str
    suit: str
    attrition_stage: int = 0   # 0 none,1 vulnerable,2 doubtful,3 scar,4 curse,5 entombed
    reward_stage: int = 0      # 0 none,1 fortifying,2 anchored (immune forever)
    blessed: bool = False      # Hero's Blessing unlocked (uses own suit for effect)
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
        return flags.curses and not self.blessed and self.attrition_stage >= 4 and self.suit in BLACK

    def is_red_cursed(self, flags):
        return flags.curses and not self.blessed and self.attrition_stage >= 4 and self.suit in RED

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
    if one side is a Clubs Hero card, it can pair with ANY card (treating sum as TARGET)."""
    a_is_clubs_hero = flags.blessings and card_a.blessed and card_a.suit == 'C'
    b_is_clubs_hero = flags.blessings and card_b.blessed and card_b.suit == 'C'
    if a_is_clubs_hero or b_is_clubs_hero:
        return TARGET
    val_a = card_a.functional_value(flags)
    val_b = card_b.functional_value(flags)
    return val_a + val_b


try:
    from solvers.base import Move, BaseSolver
    from solvers.greedy import GreedySolver
    from solvers.heuristic import HeuristicSolver
    from solvers.beam import BeamSearchSolver
    from solvers.dfs import DFSSolver
except ImportError:
    from .solvers.base import Move, BaseSolver
    from .solvers.greedy import GreedySolver
    from .solvers.heuristic import HeuristicSolver
    from .solvers.beam import BeamSearchSolver
    from .solvers.dfs import DFSSolver


@dataclass
class RoundOutcome:
    kind: str            # 'perfect_win' | 'pyramid_clear' | 'freeze'
    moves: int = 0
    last_clear_type: str = None   # 'pair' | 'solo' | None
    last_clear_cards: tuple = None


class GameState:
    """Encapsulates a mutable Pyramid Solitaire / Cursed Tomb game state during a round."""
    def __init__(self, pyr, stock, waste, vault, removed, locks, redeals_left, flags, rng, max_moves=300):
        self.pyr = pyr
        self.stock = stock
        self.waste = waste
        self.vault = vault
        self.removed = set(removed)
        self.locks = {k: set(v) for k, v in locks.items()}
        self.redeals_left = redeals_left
        self.flags = flags
        self.rng = rng
        self.max_moves = max_moves
        self.moves_played = 0
        self.progress_this_pass = False
        self.last_clear_type = None
        self.last_clear_cards = None

    def clone(self) -> GameState:
        st = GameState(
            pyr=list(self.pyr),
            stock=list(self.stock),
            waste=list(self.waste),
            vault=list(self.vault),
            removed=set(self.removed),
            locks={k: set(v) for k, v in self.locks.items()},
            redeals_left=self.redeals_left,
            flags=self.flags,
            rng=self.rng,
            max_moves=self.max_moves,
        )
        st.moves_played = self.moves_played
        st.progress_this_pass = self.progress_this_pass
        st.last_clear_type = self.last_clear_type
        st.last_clear_cards = self.last_clear_cards
        return st

    def is_terminal(self) -> tuple[bool, str | None]:
        if len(self.removed) == N_PYR:
            if not self.stock and not self.waste and not self.vault:
                return True, 'perfect_win'
            return True, 'pyramid_clear'
        if self.moves_played >= self.max_moves:
            return True, 'freeze'
        return False, None

    def get_legal_moves(self) -> list[Move]:
        exp = exposed_slots(self.removed, self.locks)
        moves: list[Move] = []

        for i in range(len(exp)):
            for j in range(i + 1, len(exp)):
                a, b = exp[i], exp[j]
                if pair_sum(self.pyr[a], self.pyr[b], self.flags) == TARGET:
                    score = newly_exposed_after(self.removed, self.locks, (a, b))
                    moves.append(Move('pp', (a, b), score=float(score)))

        for a in exp:
            if self.pyr[a].functional_value(self.flags) == TARGET:
                score = newly_exposed_after(self.removed, self.locks, (a,))
                moves.append(Move('p', (a,), score=float(score)))

        singles = []
        if self.waste:
            singles.append(('waste', None))
        if self.vault:
            singles.append(('vault', len(self.vault) - 1))

        for kind_s, vi in singles:
            single_card = self.waste[-1] if kind_s == 'waste' else self.vault[-1]
            if single_card.functional_value(self.flags) == TARGET:
                moves.append(Move('alone_single', (kind_s, vi), score=0.0))
            for a in exp:
                pcard = self.pyr[a]
                if pair_sum(pcard, single_card, self.flags) == TARGET:
                    score = newly_exposed_after(self.removed, self.locks, (a,))
                    moves.append(Move('pw', (a, kind_s, vi), score=float(score)))

        if self.stock:
            stock_top = self.stock[0]
            if stock_top.functional_value(self.flags) == TARGET:
                moves.append(Move('alone_single', ('stock', None), score=0.0))

            for a in exp:
                pcard = self.pyr[a]
                if pair_sum(pcard, stock_top, self.flags) == TARGET:
                    score = newly_exposed_after(self.removed, self.locks, (a,))
                    moves.append(Move('stock_pyramid', (a,), score=float(score)))

            for kind_s, vi in singles:
                other_card = self.waste[-1] if kind_s == 'waste' else self.vault[-1]
                if pair_sum(stock_top, other_card, self.flags) == TARGET:
                    moves.append(Move('stock_waste', (kind_s, vi), score=0.0))

        if self.flags.blessings:
            for i in exp:
                card = self.pyr[i]
                if card.blessed and card.suit == 'D':
                    moves.append(Move('vault_p', (i,), score=0.0))
            if self.stock and self.stock[0].blessed and self.stock[0].suit == 'D':
                moves.append(Move('vault_stock', (), score=0.0))
            if self.waste and self.waste[-1].blessed and self.waste[-1].suit == 'D':
                moves.append(Move('vault_waste', (), score=0.0))

        if self.stock:
            moves.append(Move('draw', (), score=0.0))
        elif self.redeals_left > 0 and self.waste and self.progress_this_pass:
            moves.append(Move('redeal', (), score=0.0))

        return moves

    def fire_on_clear(self, card: CardState) -> None:
        if not self.flags.blessings or not card.blessed:
            return
        if card.suit == 'H':
            if self.waste:
                self.stock.extend(self.waste)
                self.waste.clear()
                self.rng.shuffle(self.stock)
        elif card.suit == 'S':
            exp = exposed_slots(self.removed, self.locks)
            if exp:
                best_slot = max(exp, key=lambda s: len(COVERS[s]) if s < len(COVERS) else 0)
                self.removed.add(best_slot)
                self.waste.append(self.pyr[best_slot])

    def apply_move(self, move: Move) -> None:
        kind = move.kind
        payload = move.payload

        if kind == 'pp':
            a, b = payload
            card_a, card_b = self.pyr[a], self.pyr[b]
            self.removed.add(a); self.removed.add(b)
            a_bc = card_a.is_black_cursed(self.flags)
            b_bc = card_b.is_black_cursed(self.flags)
            if a_bc and not b_bc:
                self.stock.append(card_b)
                self.rng.shuffle(self.stock)
            elif b_bc and not a_bc:
                self.stock.append(card_a)
                self.rng.shuffle(self.stock)
            elif a_bc and b_bc:
                self.stock.append(card_a)
                self.stock.append(card_b)
                self.rng.shuffle(self.stock)
            self.fire_on_clear(card_a); self.fire_on_clear(card_b)
            self.last_clear_type, self.last_clear_cards = 'pair', (card_a, card_b)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'p':
            a, = payload
            self.removed.add(a)
            self.fire_on_clear(self.pyr[a])
            self.last_clear_type, self.last_clear_cards = 'solo', (self.pyr[a],)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'alone_single':
            kind_s, vi = payload
            if kind_s == 'stock':
                card = self.stock.pop(0)
            elif kind_s == 'waste':
                card = self.waste.pop()
            else:
                card = self.vault.pop()
            self.fire_on_clear(card)
            self.last_clear_type, self.last_clear_cards = 'solo', (card,)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'pw':
            a, kind_s, vi = payload
            card_w = self.waste.pop() if kind_s == 'waste' else self.vault.pop()
            card_a = self.pyr[a]
            self.removed.add(a)
            a_bc = card_a.is_black_cursed(self.flags)
            w_bc = card_w.is_black_cursed(self.flags)
            if a_bc and not w_bc:
                self.stock.append(card_w)
                self.rng.shuffle(self.stock)
            elif w_bc and not a_bc:
                self.stock.append(card_a)
                self.rng.shuffle(self.stock)
            elif a_bc and w_bc:
                self.stock.append(card_a)
                self.stock.append(card_w)
                self.rng.shuffle(self.stock)
            self.fire_on_clear(card_a); self.fire_on_clear(card_w)
            self.last_clear_type, self.last_clear_cards = 'pair', (card_a, card_w)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'stock_pyramid':
            a, = payload
            stock_card = self.stock.pop(0)
            pyr_card = self.pyr[a]
            self.removed.add(a)
            s_bc = stock_card.is_black_cursed(self.flags)
            p_bc = pyr_card.is_black_cursed(self.flags)
            if s_bc and not p_bc:
                self.stock.append(pyr_card)
                self.rng.shuffle(self.stock)
            elif p_bc and not s_bc:
                self.stock.append(stock_card)
                self.rng.shuffle(self.stock)
            elif s_bc and p_bc:
                self.stock.append(stock_card)
                self.stock.append(pyr_card)
                self.rng.shuffle(self.stock)
            self.fire_on_clear(stock_card); self.fire_on_clear(pyr_card)
            self.last_clear_type, self.last_clear_cards = 'pair', (stock_card, pyr_card)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'stock_waste':
            kind_s, vi = payload
            stock_card = self.stock.pop(0)
            other_card = self.waste.pop() if kind_s == 'waste' else self.vault.pop()
            s_bc = stock_card.is_black_cursed(self.flags)
            o_bc = other_card.is_black_cursed(self.flags)
            if s_bc and not o_bc:
                self.stock.append(other_card)
                self.rng.shuffle(self.stock)
            elif o_bc and not s_bc:
                self.stock.append(stock_card)
                self.rng.shuffle(self.stock)
            elif s_bc and o_bc:
                self.stock.append(stock_card)
                self.stock.append(other_card)
                self.rng.shuffle(self.stock)
            self.fire_on_clear(stock_card); self.fire_on_clear(other_card)
            self.last_clear_type, self.last_clear_cards = 'pair', (stock_card, other_card)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'vault_p':
            a, = payload
            card = self.pyr[a]
            self.removed.add(a)
            self.vault.append(card)
            self.moves_played += 1
            self.progress_this_pass = True

        elif kind == 'vault_stock':
            if self.stock:
                card = self.stock.pop(0)
                self.vault.append(card)
                self.moves_played += 1
                self.progress_this_pass = True

        elif kind == 'vault_waste':
            if self.waste:
                card = self.waste.pop()
                self.vault.append(card)
                self.moves_played += 1
                self.progress_this_pass = True

        elif kind == 'draw':
            if self.stock:
                drawn = self.stock.pop(0)
                self.waste.append(drawn)
                self.moves_played += 1

        elif kind == 'redeal':
            if self.redeals_left > 0 and self.waste and self.progress_this_pass:
                self.stock = self.waste
                self.waste = []
                self.redeals_left -= 1
                self.moves_played += 1
                self.progress_this_pass = False

    def apply_freeze_attrition(self) -> None:
        exp = exposed_slots(self.removed, self.locks)
        for i in exp:
            card = self.pyr[i]
            if card.temp_immune:
                continue
            if self.flags.anchor_absorption and card.reward_stage >= 2:
                if card.anchor_absorption < self.flags.anchor_max_absorption:
                    card.anchor_absorption += 1
                    if card.anchor_absorption >= self.flags.anchor_max_absorption:
                        card.reward_stage = 0
                        card.attrition_stage = 0
                    continue
            if card.is_anchored():
                continue
            if card.attrition_stage < self.flags.max_attrition_stage:
                card.attrition_stage += 1


def play_round(pool, rng, max_redeals, flags, max_moves=300, full_registry=None, solver=None):
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
    for i, card in enumerate(pyr):
        if card.is_red_cursed(flags):
            for c in COVERS[i]:
                locks.setdefault(c, set()).add(i)

    state = GameState(pyr, stock, waste, vault, removed, locks, max_redeals, flags, rng, max_moves)

    if solver is None:
        solver = HeuristicSolver()

    while True:
        terminal, kind = state.is_terminal()
        if terminal:
            return RoundOutcome(kind, state.moves_played, state.last_clear_type, state.last_clear_cards)

        legal_moves = state.get_legal_moves()
        if not legal_moves:
            break

        selected_move = solver.select_move(state, legal_moves)
        if selected_move is None:
            break

        state.apply_move(selected_move)

    if flags.attrition:
        state.apply_freeze_attrition()

    return RoundOutcome('freeze', state.moves_played)


def _apply_survival_reward(last_clear_type, last_clear_cards, flags):
    if last_clear_type == 'pair':
        a, b = last_clear_cards
        va, vb = a.functional_value(flags), b.functional_value(flags)
        higher, lower = (a, b) if va > vb else (b, a)
        if flags.blessings and not higher.blessed and higher.attrition_stage < 4:
            higher.blessed = True
        prev_stage = lower.reward_stage
        lower.reward_stage = min(2, lower.reward_stage + 1)
        if lower.reward_stage == 2 and prev_stage < 2:
            lower.anchor_absorption = 0
    elif last_clear_type == 'solo':
        card, = last_clear_cards
        prev_stage = card.reward_stage
        card.reward_stage = min(2, card.reward_stage + 1)
        if card.reward_stage == 2 and prev_stage < 2:
            card.anchor_absorption = 0


def run_campaign(rng, max_redeals, flags, max_rounds, deadlock_limit=None, solver=None):
    # `registry` holds all 52 physical cards for the entire campaign,
    # including entombed ones.
    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    rounds_played = 0
    pyramids_cleared = 0
    perfect_wins = 0
    rank_anchor_unlocked_round = None

    consecutive_stalls = 0
    for round_num in range(1, max_rounds + 1):
        rounds_played = round_num
        active = [c for c in registry if c.attrition_stage < flags.max_attrition_stage]
        if len(active) < N_PYR:
            return {
                "result": "collapse_starvation",
                "rounds": rounds_played,
                "pyramids_cleared": pyramids_cleared,
                "perfect_wins": perfect_wins,
                "rank_anchor_unlocked_round": rank_anchor_unlocked_round,
            }

        if flags.sealed_tomb_victory:
            living = [c for c in active if not c.is_anchored()]
            if len(living) < N_PYR:
                return {
                    "result": "victory_sealed",
                    "rounds": rounds_played,
                    "pyramids_cleared": pyramids_cleared,
                    "perfect_wins": perfect_wins,
                    "rank_anchor_unlocked_round": rank_anchor_unlocked_round,
                }

        # Check if ALL remaining active cards in the campaign are immune/anchored
        if all(c.is_anchored() for c in active):
            return {
                "result": "all_immune_stall",
                "rounds": rounds_played,
                "pyramids_cleared": pyramids_cleared,
                "perfect_wins": perfect_wins,
                "rank_anchor_unlocked_round": rank_anchor_unlocked_round,
            }

        # Take snapshot of deck state before round
        state_before = [(c.attrition_stage, c.reward_stage, c.blessed, c.anchor_absorption) for c in registry]

        outcome = play_round(active, rng, max_redeals, flags, full_registry=registry, solver=solver)

        if outcome.kind == 'perfect_win':
            return {
                "result": "victory",
                "rounds": rounds_played,
                "pyramids_cleared": pyramids_cleared + 1,
                "perfect_wins": perfect_wins + 1,
                "rank_anchor_unlocked_round": rank_anchor_unlocked_round,
            }

        if outcome.kind == 'pyramid_clear':
            pyramids_cleared += 1
            _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

        if rank_anchor_unlocked_round is None:
            anchored_ranks = {c.rank for c in registry if c.is_anchored()}
            if len(anchored_ranks) == len(RANKS):
                rank_anchor_unlocked_round = rounds_played

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
                return {
                    "result": "stall_deadlock",
                    "rounds": rounds_played,
                    "pyramids_cleared": pyramids_cleared,
                    "perfect_wins": perfect_wins,
                    "rank_anchor_unlocked_round": rank_anchor_unlocked_round,
                }
        else:
            consecutive_stalls = 0

    return {
        "result": "timeout",
        "rounds": rounds_played,
        "pyramids_cleared": pyramids_cleared,
        "perfect_wins": perfect_wins,
        "rank_anchor_unlocked_round": rank_anchor_unlocked_round,
    }


DIFFICULTIES = {
    "novice": 5,             # 6 total passes
    "explorer": 3,           # 4 total passes
    "archaeologist": 1,      # 2 total passes
    "survivalist": 0,        # 1 single pass
}


def _run_single_campaign_worker(args):
    camp_seed, difficulty, flags, max_rounds, solver_name = args
    rng = random.Random(camp_seed)
    max_redeals = DIFFICULTIES[difficulty]
    solver = get_solver(solver_name) if isinstance(solver_name, str) else solver_name
    return run_campaign(rng, max_redeals, flags, max_rounds, solver=solver)


def run_many_campaigns(difficulty, campaigns, seed, flags, max_rounds, verbose=False, solver=None, n_workers=None, solver_name="heuristic"):
    if n_workers is None:
        n_workers = cpu_count() or 1

    actual_seed = seed if seed is not None else random.randint(0, 1_000_000_000)
    base_rng = random.Random(actual_seed)
    max_redeals = DIFFICULTIES[difficulty]

    victories = 0
    collapses = 0
    timeouts = 0
    stall_deadlocks = 0
    victory_rounds = []
    collapse_rounds = []
    rounds_to_resolution = []  # victories + collapses only (excludes timeouts)

    worker_args = [
        (base_rng.randint(0, 1_000_000_000), difficulty, flags, max_rounds, solver_name)
        for _ in range(campaigns)
    ]

    def process_result(i, result):
        nonlocal victories, collapses, timeouts, stall_deadlocks
        res_type = result["result"]
        rds = result["rounds"]
        if res_type == "victory":
            victories += 1
            victory_rounds.append(rds)
            rounds_to_resolution.append(rds)
        elif res_type == "timeout":
            timeouts += 1
        elif res_type == "stall_deadlock":
            stall_deadlocks += 1
        else:
            collapses += 1
            collapse_rounds.append(rds)
            rounds_to_resolution.append(rds)
        if verbose:
            print(f"campaign {i:>4}: {res_type:<22} rounds={rds}")

    if n_workers > 1 and campaigns >= 10:
        chunk = max(1, campaigns // (n_workers * 4))
        with Pool(processes=n_workers) as pool:
            for i, result in enumerate(pool.imap_unordered(_run_single_campaign_worker, worker_args, chunksize=chunk), 1):
                process_result(i, result)
    else:
        for i, args_item in enumerate(worker_args, 1):
            result = _run_single_campaign_worker(args_item)
            process_result(i, result)

    print(f"\n=== The Cursed Tomb -- Campaign Simulation ===")
    print(f"difficulty:          {difficulty} (max_redeals={max_redeals})")
    print(f"scars:               {'on' if flags.scars else 'off'}")
    print(f"curses:              {'on' if flags.curses else 'off'}")
    print(f"blessings:           {'on' if flags.blessings else 'off'}")
    print(f"attrition track:     {'on' if flags.attrition else 'off'}")
    print(f"campaign round cap:  {max_rounds}")
    print(f"campaigns run:       {campaigns}")
    print(f"workers:             {n_workers}")
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
    p.add_argument("--solver", choices=["greedy", "heuristic", "beam", "dfs"], default="heuristic", help="solver strategy")
    p.add_argument("--seed", type=int, default=None)
    p.add_argument("--no-scars", action="store_true", help="disable the stage-3 scar value shift")
    p.add_argument("--no-curses", action="store_true", help="disable stage-4 red/black curse effects")
    p.add_argument("--no-blessings", action="store_true", help="disable Hero's Blessing unlocks and all suit blessing effects")
    p.add_argument("--no-attrition", action="store_true",
                   help="disable the whole failure ink track (cards never scar/curse/entomb; "
                        "campaigns then can only end via victory or timeout)")
    p.add_argument("--max-rounds", type=int, default=500,
                   help="safety cap on rounds per campaign before declaring a timeout")
    p.add_argument("--verbose", action="store_true", help="print per-campaign results")
    p.add_argument("--workers", type=int, default=cpu_count(), help="number of parallel worker processes")
    return p.parse_args()


def get_solver(name: str):
    s = name.lower()
    if s == 'greedy':
        return GreedySolver()
    elif s == 'heuristic':
        return HeuristicSolver()
    elif s == 'beam':
        return BeamSearchSolver()
    elif s == 'dfs':
        return DFSSolver()
    raise ValueError(f"Unknown solver: {name}")


def main():
    args = parse_args()
    flags = RuleFlags(
        scars=not args.no_scars,
        curses=not args.no_curses,
        blessings=not args.no_blessings,
        attrition=not args.no_attrition,
    )
    run_many_campaigns(
        difficulty=args.difficulty,
        campaigns=args.campaigns,
        seed=args.seed,
        flags=flags,
        max_rounds=args.max_rounds,
        verbose=args.verbose,
        solver_name=args.solver,
        n_workers=args.workers,
    )


if __name__ == "__main__":
    main()
