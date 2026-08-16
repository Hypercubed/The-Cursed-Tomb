"""
Novice Solver - simulates a human beginner.

Makes plausible novice mistakes:
- misses stock-pyramid pairs (does not see that the top Stock card is active)
- picks a random pair instead of the one that exposes most cards
- ignores free Diamond Vault moves
- misses solo King clears (functional value 13)
Each mistake is stochastic with configurable rates. Default 0.3/0.2/0.5/0.3 matches
empirical gap: ~12% base win @1 redeal vs 15% heuristic, and endless 1.6 vs 5.6 wins @2/3/4.
"""

from __future__ import annotations
import random
from typing import List, Optional, TYPE_CHECKING
from .base import BaseSolver, Move

if TYPE_CHECKING:
    from cursed_tomb_sim import GameState

class NoviceSolver(BaseSolver):
    """Stochastic novice: imperfect stock awareness, noisy choice, vault blindness."""

    def __init__(
        self,
        miss_stock_pair: float = 0.3,
        random_choice: float = 0.2,
        ignore_vault: float = 0.5,
        miss_king: float = 0.3,
        seed: Optional[int] = None,
    ):
        super().__init__(name=f"NoviceSolver(miss_stock={miss_stock_pair:.1f},rand={random_choice:.1f},vault={ignore_vault:.1f})")
        self.miss_stock_pair = miss_stock_pair
        self.random_choice = random_choice
        self.ignore_vault = ignore_vault
        self.miss_king = miss_king
        self.rng = random.Random(seed)

    def reset(self) -> None:
        pass

    def select_move(self, state: "GameState", legal_moves: List[Move]) -> Optional[Move]:
        if not legal_moves:
            return None

        removal = [m for m in legal_moves if m.kind in ("pp","p","pw","alone_single","vault_p","vault_stock","vault_waste","stock_pyramid","stock_waste")]
        if not removal:
            return legal_moves[0]

        # Filter stochastic blindness
        visible: List[Move] = []
        for m in removal:
            if m.kind == "stock_pyramid" and self.rng.random() < self.miss_stock_pair:
                continue
            if m.kind == "stock_waste" and self.rng.random() < self.miss_stock_pair:
                continue
            if m.kind in ("vault_p","vault_stock","vault_waste") and self.rng.random() < self.ignore_vault:
                continue
            if m.kind == "p" and self.rng.random() < self.miss_king:
                continue
            if m.kind == "alone_single" and self.rng.random() < 0.3:
                continue
            visible.append(m)
        if not visible:
            visible = removal

        if self.rng.random() < self.random_choice:
            return self.rng.choice(visible)

        # Noisy greedy: score + uniform noise
        visible.sort(key=lambda m: m.score + self.rng.uniform(-1.0, 1.0), reverse=True)
        return visible[0]
