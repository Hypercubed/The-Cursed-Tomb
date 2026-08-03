"""
Greedy Solver implementation.
Always picks the legal move that exposes the highest number of new pyramid cards.
Ties are broken by candidate move order. If no removal move exists, it draws/redeals.
"""

from __future__ import annotations
from typing import List, Optional, TYPE_CHECKING
from .base import BaseSolver, Move

if TYPE_CHECKING:
    from cursed_tomb_sim import GameState


class GreedySolver(BaseSolver):
    """1-step greedy solver that prioritizes maximizing newly exposed cards."""

    def __init__(self):
        super().__init__(name="GreedySolver")

    def select_move(self, state: GameState, legal_moves: List[Move]) -> Optional[Move]:
        if not legal_moves:
            return None

        # Filter removal moves (pp, p, pw, alone_single, vault_p) vs draw/redeal moves
        removal_moves = [m for m in legal_moves if m.kind in ('pp', 'p', 'pw', 'alone_single', 'vault_p')]
        if removal_moves:
            # Sort by score descending; pick highest
            removal_moves.sort(key=lambda m: m.score, reverse=True)
            return removal_moves[0]

        # No removal move; draw or redeal if available
        draw_moves = [m for m in legal_moves if m.kind in ('draw', 'redeal')]
        if draw_moves:
            return draw_moves[0]

        return None
