## ADDED Requirements

### Requirement: Infinite campaign runner with disabled end-game conditions
The script SHALL run campaigns where all terminal victory and collapse conditions are suppressed: no starvation collapse (fewer than 28 active cards), no volatile collapse (all 4 of a rank entombed), no perfect-win, no soft-win (rank-anchor victory), and no sealed-tomb victory. The deck SHALL still evolve: freeze attrition applies on frozen rounds, and survival rewards (blessings/anchors) apply on pyramid clears.

#### Scenario: Campaign continues past starvation threshold
- **WHEN** the number of active (non-entombed) cards drops below 28
- **THEN** the campaign SHALL continue running rather than reporting `collapse_starvation`

#### Scenario: Campaign continues past volatile collapse condition
- **WHEN** all 4 cards of a rank become entombed
- **THEN** the campaign SHALL continue running rather than reporting `collapse_volatile`

#### Scenario: Campaign continues after victory condition
- **WHEN** a pyramid clear or perfect win is achieved
- **THEN** the campaign SHALL continue to the next round rather than reporting a victory

#### Scenario: Deck still evolves across rounds
- **WHEN** a round ends in freeze (no legal moves)
- **THEN** exposed pyramid cards SHALL advance one attrition stage (scars, curses, entombment)

---

### Requirement: Per-round solvability oracle (multi-probe sampling)
For each sampled round in a campaign, the script SHALL assess whether the current deck state is empirically winnable by running `N_probes` independent simulations with fresh random shuffles of the active card pool. A round is declared **empirically unwinnable** if zero probes produce a `pyramid_clear` or `perfect_win` outcome. The oracle SHALL NOT mutate the persistent deck state.

#### Scenario: Oracle does not mutate deck state
- **WHEN** the oracle runs N_probes against a deck state at round R
- **THEN** the deck's `attrition_stage`, `reward_stage`, `blessed`, and `anchor_absorption` values SHALL be identical before and after the oracle call

#### Scenario: Empirically winnable deck
- **WHEN** at least 1 of N_probes produces `pyramid_clear` or `perfect_win`
- **THEN** the round is recorded as **winnable** with `probe_wins = k` (k ≥ 1)

#### Scenario: Empirically unwinnable deck
- **WHEN** 0 of N_probes produce `pyramid_clear` or `perfect_win`
- **THEN** the round is recorded as **unwinnable** with `probe_wins = 0`

---

### Requirement: Per-round aggregate statistics output
The script SHALL collect and report, for each sampled round number (across all campaigns):
- Number of campaigns where the round is **unwinnable** (`unwinnable_count`)
- Number of campaigns where the round is **first unwinnable** (`first_unwinnable_count`)
- Mean probe-win fraction (`mean_probe_win_rate`)

#### Scenario: Round statistics table is printed
- **WHEN** all campaigns complete
- **THEN** the script SHALL print a table with columns: `Round | Unwinnable% | First-Unwinnable% | Mean-Probe-WinRate | Cumulative-Unwinnable%`

#### Scenario: ASCII win-rate chart is printed
- **WHEN** all campaigns complete
- **THEN** the script SHALL print an ASCII bar chart showing mean probe win rate vs. round number

---

### Requirement: Summary statistics
The script SHALL print a final summary block reporting:
- Total campaigns run, difficulty, N_probes, solver
- Median and mean round of **first unwinnable** state (across campaigns that ever became unwinnable)
- Fraction of campaigns that **never** became unwinnable within the round cap
- Fraction of campaigns where **all rounds** were unwinnable (immediate impossibility)

#### Scenario: Summary printed after table and chart
- **WHEN** analysis completes
- **THEN** summary block SHALL appear after the per-round table and ASCII chart

#### Scenario: No campaign ever became unwinnable
- **WHEN** zero campaigns reported an unwinnable round
- **THEN** summary SHALL report "No campaigns became unwinnable within N rounds"

---

### Requirement: CLI configuration
The script SHALL accept command-line arguments:
- `--campaigns INT` (default 100): number of campaigns to run
- `--max-rounds INT` (default 100): round cap per campaign (no terminal conditions, so this is the only stop)
- `--probes INT` (default 50): number of random shuffles per oracle call
- `--sample-interval INT` (default 1): run oracle every K rounds (1 = every round)
- `--difficulty CHOICE` (default `archaeologist`): novice/explorer/archaeologist/survivalist
- `--solver CHOICE` (default `heuristic`): solver used for the actual campaign rounds
- `--probe-solver CHOICE` (default `greedy`): solver used inside the oracle probes (fastest)
- `--seed INT` (default None): random seed for reproducibility
- `--verbose` flag: print per-campaign round-of-first-unwinnable

#### Scenario: Default invocation runs successfully
- **WHEN** script is run with no arguments
- **THEN** it SHALL complete with 100 campaigns × 100 rounds × 50 probes and print all output sections
