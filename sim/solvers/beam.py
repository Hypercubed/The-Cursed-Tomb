"""
Beam Search Lookahead Solver.

Evaluates candidate move sequences up to depth N with beam width B
to avoid local greedy traps and maximize multi-turn state quality.
"""

from __future__ import annotations
from typing import List, Optional, Tuple, TYPE_CHECKING
from .base import BaseSolver, Move
from .heuristic import HeuristicSolver

if TYPE_CHECKING:
    from cursed_tomb_sim import GameState


class BeamSearchSolver(BaseSolver):
    """N-step lookahead solver using beam search over cloned game states."""

    def __init__(self, depth: int = 3, beam_width: int = 4):
        super().__init__(name=f"BeamSearchSolver(depth={depth}, beam={beam_width})")
        self.depth = depth
        self.beam_width = beam_width
        self.heuristic = HeuristicSolver()

    def _evaluate_state(self, state: GameState) -> float:
        terminal, kind = state.is_terminal()
        if terminal:
            if kind == 'perfect_win':
                return 10000.0
            elif kind == 'pyramid_clear':
                return 8000.0
            else:
                return -1000.0

        # State quality score
        score = len(state.removed) * 20.0
        # Exposed slots count
        exp_count = len(state.get_legal_moves())
        score += exp_count * 3.0
        # Stock/Waste ratio
        score += len(state.stock) * 0.5
        return score

    def select_move(self, state: GameState, legal_moves: List[Move]) -> Optional[Move]:
        if not legal_moves:
            return None

        # Filter removal moves vs draw/redeal
        removal_moves = [m for m in legal_moves if m.kind in ('pp', 'p', 'pw', 'alone_single', 'vault_p', 'stock_pyramid', 'stock_waste')]
        candidates_to_evaluate = removal_moves if removal_moves else legal_moves

        best_root_move = candidates_to_evaluate[0]
        best_root_score = -float('inf')

        for root_move in candidates_to_evaluate:
            # Branch start
            beam: List[Tuple[GameState, float]] = []
            st_clone = state.clone()
            st_clone.apply_move(root_move)

            root_heuristic = self.heuristic._evaluate_move(state, root_move)
            beam.append((st_clone, root_heuristic + self._evaluate_state(st_clone)))

            # Expand depth
            for step in range(1, self.depth):
                next_beam: List[Tuple[GameState, float]] = []
                for b_state, accum_score in beam:
                    t, _ = b_state.is_terminal()
                    if t:
                        next_beam.append((b_state, accum_score))
                        continue

                    b_moves = b_state.get_legal_moves()
                    if not b_moves:
                        next_beam.append((b_state, accum_score - 500.0))
                        continue

                    # Evaluate immediate legal moves at this depth step
                    for m in b_moves[:self.beam_width]:
                        nxt_st = b_state.clone()
                        nxt_st.apply_move(m)
                        m_score = self.heuristic._evaluate_move(b_state, m)
                        total = accum_score + m_score + self._evaluate_state(nxt_st)
                        next_beam.append((nxt_st, total))

                if not next_beam:
                    break

                next_beam.sort(key=lambda x: x[1], reverse=True)
                beam = next_beam[:self.beam_width]

            branch_best_score = max(sc for _, sc in beam) if beam else -float('inf')
            if branch_best_score > best_root_score:
                best_root_score = branch_best_score
                best_root_move = root_move

        return best_root_move
