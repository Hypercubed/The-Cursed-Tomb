## Context

Current `sim/deck_evolution_analysis.py` is an infinite-runner: it suppresses all terminals (starvation, perfect win, soft-win, sealed tomb) and runs to `max_rounds`, tracking only `active_cards` + probe winability. `sim/cursed_tomb_sim.py` already implements collapse_starvation (< 28 active), survival rewards, and attrition. `CardState` fields are `attrition_stage` (0..5), `reward_stage` (0..2), `blessed`, `anchor_absorption`, `temp_immune`. Solvers live in `sim/solvers/` (GreedySolver, HeuristicSolver, BeamSearchSolver, DFSSolver) with a factory pattern. See proposal.md for why deck composition time-series are needed.

## Goals / Non-Goals

**Goals:**
- Minimal composition time-series (active, blessed, cursed, anchored) + winability vs. round
- Collapse-only termination (realistic survival curve, not infinite)
- Deterministic, reproducible runs; parallelizable like existing analysis
- CSV for offline re-plotting; PNGs when matplotlib is available

**Non-Goals:**
- By-suit breakdowns, scar-stage histogram, or inventory beyond the minimal set — deferred
- Web-game UI or deployment changes
- New spec capability — extends existing `deck-evolution-analysis` only

## Decisions

**1. Hybrid: extract core, keep script, add notebook (no duplication)**
- New `sim/deck_evolution_core.py` holds pure functions: `DeckStats`, `compute_deck_stats(registry)`, `probe_solvability`, `run_collapse_campaign`, `aggregate_results`, `write_csv*`, `plot_evolution` helper — no `argparse`, no `Pool`, no `if __name__ == "__main__"`.
- `sim/deck_evolution_analysis.py` becomes thin CLI + `multiprocessing.Pool` entry point that imports from core (batch/CI sweeps).
- `notebooks/deck_evolution.ipynb` imports core for interactive use; small defaults (`campaigns=20, max_rounds=50`) run sequentially or with `workers=1`, or simply load an existing CSV from a heavy CLI run for instant re-plots.
- Why: Single source of truth for simulation logic; notebook viable without Pool (Windows `if __name__ == "__main__"` constraint) and git-diff friendly for the `.py` core.
- Alternative considered: Extend `deck_evolution_analysis.py` only and have notebook import it — rejected because importing a script with `argparse`/`Pool` at top level is fragile inside a kernel.

**2. Minimal stats tuple vs. full CardState histogram**
- Why: `active / blessed / cursed / anchored` covers the user's asks (remaining, blessings/curses, anchors, winability) with O(1) per round. Scar vs. vulnerable/doubtful and per-suit splits are honest v2 extensions.
- `entombed = 52 - active` derived, not stored.

**3. Collapse-only termination; victories continue**
- Why: Matches user's "only termination is collapse (<28)" and mirrors real campaign attrition while still surfacing reward dynamics (blessings/anchors accumulate after pyramid clears).
- Implementation: At top of round loop, if `len(active) < 28` → record `collapse_starvation` and break. On `pyramid_clear`/`perfect_win` → `_apply_survival_reward(...)` then continue. No sealed_tomb / rank_anchor / all_immune checks.

**4. Winability oracle unchanged; greedy default, configurable**
- Reuse `probe_solvability()` with `create_solver(probe_solver_name)`; snapshot/restore registry to avoid mutation. Greedy probe cost ~ms keeps `campaigns × (rounds/sample_interval) × probes` tractable. DFS/beam remain opt-in via `--probe-solver`; warn in docs about cost.

**5. Data shape: `round_records` dict gains 4 int fields**
- Before: `{round, active_cards, solvability_ratio, probe_wins, total_probes, is_unwinnable}`
- After: same plus `{blessed, cursed, anchored}` (rename `active_cards` → `active` consistently). `aggregate_results()` computes per-round means (+ median if cheap). Aggregation buckets keyed by sampled round number.

**6. CSV: two optional files**
- `--csv FILE` — aggregated (one row per sampled round, means + unwinnable stats). Primary use for external plotting.
- `--csv-per-campaign FILE` — long form (one row per sampled round per campaign). Enables spaghetti plots / variance analysis. Both use `csv.DictWriter`; created after aggregation so no per-worker I/O.

**7. PNGs via `matplotlib`, optional import**
- `try: import matplotlib.pyplot as plt; HAS_MPL=True except ImportError: HAS_MPL=False`. `--plot FILE` or `--plot-dir DIR` writes 2–3 panels (active; blessed/cursed/anchored; winability/unwinnable%) sharing X=round. Fallback: `print("matplotlib not installed; skipping plot", file=sys.stderr)` and exit 0.
- Alternative considered: `plotext` ASCII-only — rejected per user's "PNGs if we can make it work in python."

**8. Notebook file layout (6–8 cells) — additive overlay**
- Cell 1 (markdown): Title + usage notes, sequential execution.
- Cell 2 (python): Imports (`matplotlib`, `pandas` optional, `ipywidgets` optional), `sys.path` shim, `from sim.deck_evolution_core import ...`, `HAS_MPL` check.
- Cell 3 (python): Kernel-persistent state — global `runs: list[Run]` (keyed by `{difficulty,solver,index,agg_df}`) initialized only if absent; helper `plot_all(runs)` that clears and redraws a shared `fig, axes` 3-panel figure with per-run legend.
- Cell 4 (python): Widgets — `Dropdown(difficulty)`, `Dropdown(solver)`, `IntSlider(campaigns/max_rounds/probes/sample_interval)` when `ipywidgets` available, else static defaults.
- Cell 5 (python): Controls — `Button("Add run")` on_click: sequential `run_collapse_campaign` loop (no Pool) or `pd.read_csv` CSV-load branch → `runs.append(...)` → `plot_all(runs)`; `Button("Clear")` resets `runs` and figure. CSV autosave optional to survive kernel restart.
- Cell 6+ (python): Initial `plot_all` rendering call and notes on Windows `Pool` constraint (`workers=1` in notebook; heavy sweeps via CLI → CSV load).
- Notebook `workers` is 1 or sequential; heavy sweeps are expected via CLI then CSV load.

**9. Dependency addition**
- Add `matplotlib` to `pyproject.toml` dependencies; add `ipykernel` in an optional `notebook` extra (or dev group) for Jupyter/VS Code execution. Keep `fpdf2`, `Pillow`, `pyyaml` as is. `pandas` + `ipywidgets` are optional niceties, not required.

## Risks / Trade-offs

- [Probe cost dominates runtime] `campaigns × rounds × probes × solver_cost` still high. Greedy probes mitigate; DFS on large sweeps remains expensive → Mitigation: keep `sample_interval` and `probes` tunable; document cost table.
- [RNG determinism] Adding stats must not consume RNG or reorder operations vs. prior runs. → Mitigation: compute stats before `probe_solvability`/`play_round` without touching `rng`.
- [State mutation] Composition read must not alter `registry` (snapshot discipline). → Mitigation: read-only counting; probe already snapshot/restores.
- [Early termination reduces long tails] Collapsed campaigns contribute fewer late rounds, biasing late-round means toward survivors. → Mitigation: report `n_contributing_campaigns` per round; document censoring.
- [matplotlib not in CI] Optional import means PNG path untested without dep. → Mitigation: add `matplotlib` to dev/sim extra and CI cache.

## Migration Plan

- No data migration. Default invocation (`python sim/deck_evolution_analysis.py`) behavior changes from infinite to collapse-terminating; document as breaking for that script only. Add `--no-collapse` flag if backward compat is needed (optional, not required for v1).
- New files (`deck_evolution_core.py`, notebook) are additive.
- Rollback: revert `deck_evolution_analysis.py` and spec delta; core and notebook remain but become unused.

## Open Questions

- None blocking. Per-round `n_contributing` column vs. implicit `unwinnable_count` denominator — include explicitly for clarity. Exact PNG layout (one file multi-panel vs. per-metric files) can be finalized during implementation without changing spec.
