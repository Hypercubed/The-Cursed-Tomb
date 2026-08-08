"""
Base class and data types for simulation solvers.
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, List, Optional, Tuple, TYPE_CHECKING

if TYPE_CHECKING:
    from cursed_tomb_sim import GameState


@dataclass(frozen=True)
class Move:
    """Represents a discrete action in the game."""
    kind: str  # 'pp', 'p', 'pw', 'alone_single', 'vault_p', 'vault_stock', 'vault_waste', 'stock_pyramid', 'stock_waste', 'draw', 'redeal'
    payload: Tuple[Any, ...] = ()
    score: float = 0.0

    def __repr__(self) -> str:
        return f"Move({self.kind}, {self.payload}, score={self.score:.2f})"


class BaseSolver(ABC):
    """Abstract base class for all solver strategies."""

    def __init__(self, name: str = "BaseSolver"):
        self.name = name

    @abstractmethod
    def select_move(self, state: GameState, legal_moves: List[Move]) -> Optional[Move]:
        """Selects a Move from legal_moves given the current GameState.
        Returns None if no move should be taken (or game is over).
        """
        pass
