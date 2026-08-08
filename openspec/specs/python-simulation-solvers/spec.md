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

### Requirement: Stock-to-Vault Progress Tracking for Redeal Availability
The Python simulation engine SHALL treat any game state mutation—including cards entering the Diamond Vault from the stock pile—as progress during the stock pass, enabling redeal availability when stock is depleted.

#### Scenario: Redeal permitted after stock auto-vaulting with zero pair clears
- **WHEN** a stock pass results in zero card pair clears but moves one or more blessed Diamond cards from stock into the Vault
- **THEN** the simulation engine marks progress for the pass and permits a redeal move if redeals remain and waste is non-empty

### Requirement: Explicit Stock and Waste Vault Move Evaluation
The simulation engine and solver policies SHALL evaluate moving an exposed Blessed Diamond card from Stock or Waste into the Vault as explicit candidate move options (`vault_stock`, `vault_waste`) during turn selection, rather than automatically intercepting drawn Diamond cards during standard stock draw.

#### Scenario: Stock draw places card into Waste
- **WHEN** a Blessed Diamond card is drawn from the Stock pile during a standard `draw` move execution
- **THEN** the drawn card SHALL be moved to the Waste pile by default unless an explicit stock-to-vault move was selected as the chosen candidate move

#### Scenario: Candidate move generator exposes stock and waste vault options
- **WHEN** the top card of the Stock pile is a Blessed Diamond card, OR the top card of the Waste pile is a Blessed Diamond card
- **THEN** the simulation move generator SHALL generate explicit `vault_stock` and/or `vault_waste` candidate move options for evaluation by active solver policies (`GreedySolver`, `HeuristicSolver`, `BeamSearchSolver`, `DFSSolver`)
