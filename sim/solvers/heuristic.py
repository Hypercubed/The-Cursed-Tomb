"""
Domain-aware Heuristic Solver for Pyramid Solitaire & Cursed Tomb.

Multi-factor evaluation:
- Newly exposed card count
- Pyramid vs Waste priority (prefers clearing pyramid cards)
- Pyramid row depth (higher position cards unlock larger subtrees)
- Red Curse unlock priority
- Blessing synergy awareness (Hearts reshuffle, Spades tunneling)
"""

from __future__ import annotations
from typing import List, Optional, TYPE_CHECKING
from .base import BaseSolver, Move

if TYPE_CHECKING:
    from cursed_tomb_sim import GameState


class HeuristicSolver(BaseSolver):
    """Multi-factor heuristic solver evaluating tactical Cursed Tomb board state."""

    def __init__(self):
        super().__init__(name="HeuristicSolver")

    def _evaluate_move(self, state: GameState, move: Move) -> float:
        if move.kind not in ('pp', 'p', 'pw', 'alone_single', 'vault_p', 'vault_stock', 'vault_waste', 'stock_pyramid', 'stock_waste'):
            return 0.0

        score = move.score * 10.0  # Base exposed cards weight

        # Pyramid-Pyramid pair preference
        if move.kind == 'pp':
            score += 5.0
            a, b = move.payload
            card_a, card_b = state.pyr[a], state.pyr[b]

            # Row height bonus (higher up in pyramid = lower row index = larger tree)
            row_a = a // 7  # approximate or derived from slot index
            row_b = b // 7
            score += (7 - row_a) * 1.5 + (7 - row_b) * 1.5

            # Red Curse unlock priority
            if card_a.is_red_cursed(state.flags) or card_b.is_red_cursed(state.flags):
                score += 8.0

        elif move.kind == 'p':
            score += 3.0
            a, = move.payload
            card_a = state.pyr[a]
            if card_a.is_red_cursed(state.flags):
                score += 8.0

        elif move.kind == 'pw':
            a, kind_s, vi = move.payload
            card_a = state.pyr[a]
            if card_a.is_red_cursed(state.flags):
                score += 6.0
            # Slight penalty for consuming waste unless it exposes new cards
            if move.score == 0:
                score -= 2.0

        elif move.kind == 'stock_pyramid':
            score += 4.0
            a, = move.payload
            card_a = state.pyr[a]
            if card_a.is_red_cursed(state.flags):
                score += 6.0

        elif move.kind == 'stock_waste':
            score += 2.0

        elif move.kind == 'alone_single':
            # Low priority to clear waste solo unless it's a King
            score -= 3.0

        elif move.kind == 'vault_p':
            # Self-vaulting a Diamond hero card is useful when stuck
            score += 2.0

        elif move.kind in ('vault_stock', 'vault_waste'):
            score += 2.5 if move.kind == 'vault_stock' else 2.0
            if state.vault:
                top_v = state.vault[-1]
                if top_v.functional_value(state.flags) == 13:
                    score -= 2.0
                else:
                    from cursed_tomb_sim import exposed_slots, pair_sum
                    exp = exposed_slots(state.removed, state.locks)
                    for a in exp:
                        if pair_sum(state.pyr[a], top_v, state.flags) == 13:
                            score -= 2.0
                            break

        # Blessing synergy evaluation
        if state.flags.blessings:
            # Spades Tunnel check
            if move.kind in ('pp', 'p', 'pw', 'stock_pyramid'):
                cards = []
                if move.kind == 'pp':
                    a, b = move.payload
                    cards = [state.pyr[a], state.pyr[b]]
                elif move.kind in ('p', 'pw', 'stock_pyramid'):
                    a = move.payload[0]
                    cards = [state.pyr[a]]
                for c in cards:
                    if c.blessed and c.suit == 'S':
                        score += 6.0
                    elif c.blessed and c.suit == 'H' and len(state.waste) >= 4:
                        score += 5.0  # High value stock reshuffle when waste is deep

        return score

    def select_move(self, state: GameState, legal_moves: List[Move]) -> Optional[Move]:
        if not legal_moves:
            return None

        removal_moves = [m for m in legal_moves if m.kind in ('pp', 'p', 'pw', 'alone_single', 'vault_p', 'vault_stock', 'vault_waste', 'stock_pyramid', 'stock_waste')]
        if removal_moves:
            # Score each removal move
            scored_moves = [(self._evaluate_move(state, m), m) for m in removal_moves]
            scored_moves.sort(key=lambda x: x[0], reverse=True)
            return scored_moves[0][1]

        draw_moves = [m for m in legal_moves if m.kind in ('draw', 'redeal')]
        if draw_moves:
            return draw_moves[0]

        return None
