## Why

The current Python simulation suite (`sim/`) relies on a basic 1-step greedy solver (`play_round`) that evaluates moves solely by the immediate count of newly exposed pyramid cards. This naive decision-making leads to premature game freezes, unnatural campaign collapses, and inaccurate balance metrics. 

To accurately analyze Cursed Tomb campaign rules, card attrition rates, and win-rate theoretical bounds, we need smarter solvers—including multi-factor domain heuristics, lookahead search, and exact Depth-First Search (DFS)—to simulate realistic, competent player behavior during campaign balancing sweeps.

## What Changes

- **Modular Solver Architecture**: Refactor simulation turn-taking in `sim/` so game rules/state transitions are decoupled from decision policies.
- **Scored Heuristic Solver**: Implement a domain-aware heuristic solver evaluating pyramid depth, row hierarchy, suit blessing synergies (Spades Tunneling, Hearts Reshuffle), and curse lock reduction (Red Cursed cards).
- **Depth-First Search (DFS) / Solvability Solver**: Add a backtracking DFS solver with state memoization to determine exact solvability and true upper-bound win rates for single-round Pyramid Solitaire configurations.
- **Beam Search Lookahead**: Implement an $N$-step lookahead solver for campaign simulations to balance move planning speed with intelligent state evaluation.
- **CLI Strategy Selection**: Update `base_game_sim.py`, `campaign_rounds_sim.py`, and `sweep_thresholds.py` to accept `--solver [greedy|heuristic|beam|dfs]` flags.

## Capabilities

### New Capabilities
- `python-simulation-solvers`: Pluggable solver engine and strategy implementations (Heuristic, Beam Search, DFS) for Python campaign and base game simulations.

### Modified Capabilities

None.

## Impact

- `sim/cursed_tomb_sim.py`: Refactored turn execution and exposed state API.
- `sim/solvers/`: New package containing `base.py`, `greedy.py`, `heuristic.py`, `beam.py`, and `dfs.py`.
- `sim/base_game_sim.py`, `sim/campaign_rounds_sim.py`, `sim/sweep_thresholds.py`: Updated CLI and execution loops to select solvers.
- `sim/RESULTS.md`: Updated with baseline comparison data across solver strategies.
