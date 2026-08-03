## Context

The `sim/` directory contains Python simulation scripts (`cursed_tomb_sim.py`, `base_game_sim.py`, `campaign_rounds_sim.py`, `sweep_thresholds.py`). Currently, game state manipulation and move selection are tightly coupled inside `play_round()`, which hardcodes a 1-step greedy choice (selecting the move exposing the most new pyramid cards).

To support realistic campaign balancing, we need modular solver classes capable of executing different decision strategies without duplicating game engine logic.

## Goals / Non-Goals

**Goals:**
- Decouple game rules and state mutation from player decision policies.
- Implement `GreedySolver` (maintaining backward compatibility with existing tests).
- Implement `HeuristicSolver` (multi-factor scoring for Pyramid Solitaire + Cursed Tomb mechanics).
- Implement `BeamSearchSolver` ($N$-step lookahead).
- Implement `DFSSolver` (exact solvability search with memoization).
- Add CLI flag `--solver` across all simulation scripts and update `sim/RESULTS.md`.

**Non-Goals:**
- Modifying the TypeScript frontend solver / autoplay in `src/hooks/useAutoplay.ts` (this change is strictly focused on Python simulation tooling).

## Decisions

### 1. Separate `sim/solvers/` Package
We will create a dedicated `sim/solvers/` package with an abstract base class `BaseSolver`:
- `BaseSolver.select_move(game_state, legal_moves)` returns the selected move or action (e.g. `DRAW`, `REDEAL`, or a specific card clear tuple).

*Rationale*: Isolates solver logic from game engine state, enabling easy creation and testing of custom heuristic weights or search algorithms.

### 2. State Clones for Lookahead & DFS
For `BeamSearchSolver` and `DFSSolver`, the `GameState` object will expose a lightweight `.clone()` method and `.apply_move(move)` step function.

*Rationale*: Enables tree search without polluting the main game loop state or incurring high copy overhead.

### 3. Memoization Key for DFS Solver
`DFSSolver` will hash the minimal state tuple: `(frozenset(removed_pyramid_indices), stock_idx, tuple(waste_cards), tuple(vault_cards), redeals_left)`.

*Rationale*: Solitaire state spaces have many path convergences. Memoizing visited state hashes reduces search time from exponential to polynomial in practice.

## Risks / Trade-offs

- **[Risk: DFS Performance on Infinite Redraws]** → Unlimited stock redeals can generate large state spaces in unwinnable deals.  
  *Mitigation*: Enforce a max search node limit (e.g., 50,000 nodes) for `DFSSolver`; if exceeded, report deal as "unresolved" or timed-out.
- **[Risk: Simulation Execution Time]** → Beam Search ($N=3..5$) is slower than Greedy.  
  *Mitigation*: Provide command-line option for sample sizes (`--n-campaigns`) and thread-pool execution if needed.
