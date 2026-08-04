"""
Depth-First Search (DFS) Solver.

Uses recursive backtracking with state memoization to search for a guaranteed
winning sequence of moves (pyramid clear or perfect win). Returns the first move
of the shortest winning path found, or falls back to heuristic if unsolvable.
"""

from __future__ import annotations
from typing import Dict, List, Optional, Set, Tuple, TYPE_CHECKING
from .base import BaseSolver, Move
from .heuristic import HeuristicSolver

if TYPE_CHECKING:
    from cursed_tomb_sim import GameState


class DFSSolver(BaseSolver):
    """Backtracking DFS solver for exact solvability analysis."""

    def __init__(self, max_nodes: int = 3000):
        super().__init__(name=f"DFSSolver(max_nodes={max_nodes})")
        self.max_nodes = max_nodes
        self.fallback_solver = HeuristicSolver()
        self.cached_winning_path: List[Move] = []
        self.searched_this_game: bool = False
        self.is_unsolvable: bool = False

    def reset(self) -> None:
        self.cached_winning_path.clear()
        self.searched_this_game = False
        self.is_unsolvable = False

    def _state_key(self, state: GameState) -> Tuple:
        stock_key = tuple(f"{c.rank}{c.suit}" for c in state.stock)
        waste_key = tuple(f"{c.rank}{c.suit}" for c in state.waste)
        vault_key = tuple(f"{c.rank}{c.suit}" for c in state.vault)
        return (frozenset(state.removed), stock_key, waste_key, vault_key, state.redeals_left)

    def solve(self, state: GameState) -> Tuple[bool, List[Move], int]:
        """Performs DFS to find a winning move sequence.
        Returns (is_winnable, winning_move_list, total_nodes_explored).
        """
        visited: Set[Tuple] = set()
        nodes_explored = 0

        def dfs(curr_state: GameState, path: List[Move]) -> Optional[List[Move]]:
            nonlocal nodes_explored
            nodes_explored += 1
            if nodes_explored >= self.max_nodes:
                return None

            terminal, kind = curr_state.is_terminal()
            if terminal:
                if kind in ('perfect_win', 'pyramid_clear'):
                    return path
                return None

            key = self._state_key(curr_state)
            if key in visited:
                return None
            visited.add(key)

            legal_moves = curr_state.get_legal_moves()
            if not legal_moves:
                return None

            removal_moves = [m for m in legal_moves if m.kind in ('pp', 'p', 'pw', 'alone_single', 'vault_p', 'stock_pyramid', 'stock_waste')]
            other_moves = [m for m in legal_moves if m.kind in ('draw', 'redeal')]
            
            removal_moves.sort(key=lambda m: self.fallback_solver._evaluate_move(curr_state, m), reverse=True)
            candidate_moves = removal_moves + other_moves

            for move in candidate_moves:
                next_state = curr_state.clone()
                next_state.apply_move(move)
                win_path = dfs(next_state, path + [move])
                if win_path is not None:
                    return win_path

            return None

        win_sequence = dfs(state, [])
        if win_sequence is not None:
            return True, win_sequence, nodes_explored
        return False, [], nodes_explored

    def select_move(self, state: GameState, legal_moves: List[Move]) -> Optional[Move]:
        if not legal_moves:
            return None

        if self.cached_winning_path:
            return self.cached_winning_path.pop(0)

        if not self.searched_this_game:
            self.searched_this_game = True
            is_winnable, win_sequence, nodes = self.solve(state)
            if is_winnable and win_sequence:
                self.cached_winning_path = win_sequence[1:]
                return win_sequence[0]
            else:
                self.is_unsolvable = True

        return self.fallback_solver.select_move(state, legal_moves)
