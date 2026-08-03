## 1. Modular Solver Framework Setup

- [x] 1.1 Create `sim/solvers/` directory and `sim/solvers/base.py` with `BaseSolver` abstract class and `Move` dataclass.
- [x] 1.2 Refactor `sim/cursed_tomb_sim.py` to extract `GameState` class exposing `.get_legal_moves()`, `.apply_move()`, and `.clone()`.
- [x] 1.3 Implement `GreedySolver` in `sim/solvers/greedy.py` wrapping existing 1-step exposure logic for regression compatibility.

## 2. Implement Advanced Solvers

- [x] 2.1 Implement `HeuristicSolver` in `sim/solvers/heuristic.py` with multi-factor scoring (row depth, red curse priority, pyramid pair preference, blessing triggers).
- [x] 2.2 Implement `BeamSearchSolver` in `sim/solvers/beam.py` supporting configurable lookahead depth ($N=3..5$) and beam width ($B$).
- [x] 2.3 Implement `DFSSolver` in `sim/solvers/dfs.py` with recursive backtracking, state hashing/memoization, and node limit caps.

## 3. CLI Integration & Verification

- [x] 3.1 Update CLI argument parsers in `sim/base_game_sim.py`, `sim/campaign_rounds_sim.py`, and `sim/sweep_thresholds.py` to accept `--solver [greedy|heuristic|beam|dfs]`.
- [x] 3.2 Add a benchmark test script `sim/test_solvers.py` to compare solver win rates and execution speeds on identical deck seeds.
- [x] 3.3 Run campaign balance simulations across difficulties using `HeuristicSolver` and update `sim/RESULTS.md` with findings.
