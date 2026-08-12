# Capability: Deck Evolution Analysis

## Purpose
TBD: To analyze the point at which a deck becomes unwinnable across a campaign using a solvability oracle.

## Requirements

### Requirement: Infinite campaign runner with disabled end-game conditions
The script SHALL run campaigns where collapse due to starvation (< 28 active cards) is the only terminal condition. Pyramid clears and perfect wins SHALL NOT terminate the campaign; instead they SHALL apply the survival reward (blessings/anchors for the last clear) and continue to the next round. Other victory checks (sealed-tomb, rank-anchor soft-win) SHALL remain disabled. The deck SHALL still evolve: freeze attrition applies on frozen rounds, and survival rewards apply on pyramid clears. Campaigns SHALL stop when active cards drop below 28 or when the round cap (`--max-rounds`) is reached.

#### Scenario: Campaign continues after pyramid clear or perfect win
- **WHEN** a round ends in `pyramid_clear` or `perfect_win`
- **THEN** the script SHALL apply the survival reward and advance to the next round rather than reporting a victory

#### Scenario: Campaign terminates on collapse starvation
- **WHEN** the number of active (non-entombed) cards drops below 28 at the start of a round
- **THEN** the campaign SHALL terminate with outcome `collapse_starvation`

#### Scenario: Deck still evolves across rounds
- **WHEN** a round ends in freeze (no legal moves)
- **THEN** exposed pyramid cards SHALL advance one attrition stage (scars, curses, entombment)

#### Scenario: Campaign terminates on round cap
- **WHEN** `max_rounds` rounds have been played without a collapse
- **THEN** the campaign SHALL terminate with outcome `timeout`

---

### Requirement: Per-round solvability oracle (multi-probe sampling)
For each sampled round in a campaign, the script SHALL assess whether the current deck state is empirically winnable by running `N_probes` independent simulations with fresh random shuffles of the active card pool. A round is declared **empirically unwinnable** if zero probes produce a `pyramid_clear` or `perfect_win` outcome. The oracle SHALL NOT mutate the persistent deck state. The probe solver is configurable via `--probe-solver` (default `greedy`; alternatives `heuristic`, `beam`, `dfs`).

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
- `--max-rounds INT` (default 100): round cap per campaign (collapse is the only early stop)
- `--probes INT` (default 50): number of random shuffles per oracle call
- `--sample-interval INT` (default 1): run oracle every K rounds (1 = every round)
- `--difficulty CHOICE` (default `archaeologist`): novice/explorer/archaeologist/survivalist
- `--solver CHOICE` (default `greedy`): solver used for the actual campaign rounds (greedy/heuristic/beam/dfs)
- `--probe-solver CHOICE` (default `greedy`): solver used inside the oracle probes (greedy/heuristic/beam/dfs)
- `--seed INT` (default None): random seed for reproducibility
- `--verbose` flag: print per-campaign round-of-first-unwinnable

#### Scenario: Default invocation runs successfully
- **WHEN** script is run with no arguments
- **THEN** it SHALL complete with 100 campaigns × 100 rounds × 50 probes and print all output sections

---

### Requirement: Anchor Absorption enabled in deck evolution analysis
The deck evolution analysis CLI and core simulation module SHALL enable Anchor Absorption by default to evaluate campaign solvability and collapse timelines under the official ruleset.

#### Scenario: Running evolution analysis with Anchor Absorption
- **WHEN** `python sim/deck_evolution_analysis.py` is executed without disabling anchor absorption
- **THEN** campaign simulations SHALL process freeze attrition using `anchor_absorption = True`

---

### Requirement: Per-round deck composition statistics
The script SHALL record per sampled round, from the persistent 52-card `CardState` registry before playing the round, a minimal composition snapshot:
- `active` — count of cards with `attrition_stage < 5`
- `blessed` — count of cards with `blessed == True`
- `cursed` — count of cards with `attrition_stage == 4`
- `anchored` — count of cards with `reward_stage == 2`
Each campaign's per-round `DeckStats` SHALL be included in `round_records` alongside solvability fields and SHALL be aggregatable across campaigns (mean/median per round). Derived `entombed = 52 - active` does not need explicit storage.

#### Scenario: Composition snapshot captured each sampled round
- **WHEN** a sampled round R is evaluated
- **THEN** `round_records[R]` SHALL contain integer fields `active`, `blessed`, `cursed`, `anchored` reflecting the registry state before the round is played

#### Scenario: Snapshot does not affect game logic
- **WHEN** composition stats are recorded
- **THEN** the registry and subsequent round outcome SHALL be identical to a run without composition tracking

#### Scenario: Aggregated composition available
- **WHEN** all campaigns complete
- **THEN** per-round mean values for `active`, `blessed`, `cursed`, `anchored` SHALL be available for table/plot output

---

### Requirement: CSV output
The script SHALL support CSV output via flags `--csv FILE` (aggregated per-round means) and `--csv-per-campaign FILE` (every sampled round of every campaign). CSV columns for per-campaign output SHALL include `campaign`, `round`, `active`, `blessed`, `cursed`, `anchored`, `probe_wins`, `total_probes`, `is_unwinnable`. Aggregated CSV columns SHALL include `round`, `mean_active`, `mean_blessed`, `mean_cursed`, `mean_anchored`, `mean_probe_win_rate`, `unwinnable_count`, `unwinnable_pct`. When a flag is omitted, no file SHALL be written. Overwriting an existing file is allowed. Writing SHALL not affect console output.

#### Scenario: CSV written when flag provided
- **WHEN** the script is invoked with `--csv out.csv`
- **THEN** `out.csv` SHALL exist after completion containing one row per sampled round with aggregated columns

#### Scenario: No CSV when flag omitted
- **WHEN** neither `--csv` nor `--csv-per-campaign` is provided
- **THEN** no CSV file SHALL be created

#### Scenario: CSV reproduces without re-simulation
- **WHEN** a CSV file has been written
- **THEN** it SHALL contain sufficient columns to regenerate the composition and winability time-series plots offline

---

### Requirement: PNG time-series plotting
When `matplotlib` is installed and `--plot FILE` (or `--plot-dir DIR`) is provided, the script SHALL write PNG time-series plot(s) of composition and winability vs. round number. Minimal plots: (1) mean `active` vs. round, (2) mean `blessed`/`cursed`/`anchored` vs. round, (3) mean probe win rate / unwinnable% vs. round — as separate panels or separate files. If `matplotlib` is not installed, the script SHALL emit a warning to stderr and continue without error (console table and CSV still produced). Plot generation SHALL NOT alter simulation results.

#### Scenario: PNG written when matplotlib available and flag provided
- **WHEN** script is invoked with `--plot deck_evolution.png` and `matplotlib` is importable
- **THEN** the PNG file SHALL exist and show the required panels vs. round number

#### Scenario: Graceful fallback without matplotlib
- **WHEN** `matplotlib` is not importable and `--plot` is provided
- **THEN** the script SHALL print a warning to stderr, skip plotting, and exit 0

#### Scenario: Plot reflects CSV data
- **WHEN** both `--csv` and `--plot` are provided
- **THEN** the plotted series SHALL be numerically consistent with the CSV (same aggregation)

---

### Requirement: Interactive notebook
The project SHALL provide a Jupyter notebook at `notebooks/deck_evolution.ipynb` runnable in VS Code and JupyterLab that reuses the pure core module to reproduce the composition and winability analysis interactively. The notebook SHALL render the same time-series plots inline via `matplotlib` and SHALL support loading an existing aggregated or per-campaign CSV to regenerate plots without re-running simulations. The notebook SHALL execute with small default parameters without requiring CLI flags and SHALL NOT require `multiprocessing.Pool` when run inside the notebook kernel. The notebook SHALL provide an additive overlay: kernel-persistent `runs` state accumulates across executions; an "Add run" control appends a newly parameterized run to the collection and re-renders a shared multi-panel figure overlaying all runs with per-run legend entries, and a "Clear" control resets the collection and figure.

#### Scenario: Notebook renders plots inline
- **WHEN** the notebook is executed top-to-bottom with default parameters
- **THEN** inline plots for active, composition (blessed/cursed/anchored), and winability vs. round SHALL appear

#### Scenario: Notebook can load existing CSV
- **WHEN** an aggregated or per-campaign CSV produced by the CLI exists
- **THEN** the notebook SHALL be able to load that CSV and regenerate the same plots without re-running the simulation

#### Scenario: Notebook runs in VS Code and JupyterLab
- **WHEN** the notebook is opened in VS Code or JupyterLab with `ipykernel` installed
- **THEN** execution SHALL complete without error using sequential or single-worker execution

#### Scenario: Additive overlay across runs
- **WHEN** the user triggers "Add run" twice with different difficulty/solver settings
- **THEN** the shared figure SHALL display both runs overlaid with distinct legend entries (e.g. `archaeologist/greedy#1`, `explorer/greedy#2`)

#### Scenario: Clear resets overlay
- **WHEN** the user triggers "Clear"
- **THEN** the `runs` collection and figure SHALL reset so the next "Add run" starts from a single series
