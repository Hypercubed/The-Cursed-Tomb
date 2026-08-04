# Capability: Python Simulation Solvers

## Purpose
TBD

## Requirements

### Requirement: Modular Solver Interface
The Python simulation suite SHALL decouple game state transitions from move decision logic, providing a common interface for solver policies (`GreedySolver`, `HeuristicSolver`, `BeamSearchSolver`, `DFSSolver`).

#### Scenario: Running simulation with a selected solver
- **WHEN** the simulation script is executed with `--solver heuristic`
- **THEN** the game engine queries `HeuristicSolver.select_move()` on each turn instead of defaulting to 1-step greedy choice

### Requirement: Scored Heuristic Solver
The simulation suite SHALL provide a `HeuristicSolver` that scores candidate moves using multi-factor evaluation (pyramid row depth, pyramid vs. waste priority, curse lock unlocking, and suit blessing awareness).

#### Scenario: Prioritizing Red Curse unlock
- **WHEN** multiple legal pyramid moves exist and one move unlocks a slot covered by a Red Cursed card
- **THEN** the `HeuristicSolver` assigns a higher score to the move unlocking the Red Cursed slot

#### Scenario: Preserving Waste cards
- **WHEN** both a Pyramid-Pyramid pair and a Pyramid-Waste pair are available with equal exposure scores
- **THEN** the `HeuristicSolver` prioritizes the Pyramid-Pyramid clear to preserve waste pile flexibility

### Requirement: Depth-First Search (DFS) Exact Solvability Solver
The simulation suite SHALL provide a `DFSSolver` using recursive backtracking and state memoization to determine whether a given board deal is 100% winnable under perfect information.

#### Scenario: Determining deal solvability
- **WHEN** a single round deal is analyzed with `DFSSolver`
- **THEN** the solver returns `is_winnable` (True/False), the sequence of optimal moves, and total state nodes explored

### Requirement: Beam Search Lookahead Solver
The simulation suite SHALL provide a `BeamSearchSolver` that evaluates candidate move sequences up to depth $N$ to avoid local greedy traps.

#### Scenario: Lookahead evaluation
- **WHEN** evaluating legal moves at depth $N=3$
- **THEN** the `BeamSearchSolver` retains the top $B$ most promising move branches at each step and executes the root move of the highest-scoring sequence

### Requirement: Simulation CLI Strategy Flag
All simulation scripts (`base_game_sim.py`, `campaign_rounds_sim.py`, `sweep_thresholds.py`) SHALL expose a `--solver` command-line argument.

#### Scenario: CLI argument parsing
- **WHEN** `python sim/campaign_rounds_sim.py --solver beam` is invoked
- **THEN** the campaign simulator uses the Beam Search lookahead solver for all round executions
