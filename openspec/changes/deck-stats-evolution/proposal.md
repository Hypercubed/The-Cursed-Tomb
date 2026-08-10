## Why

Campaign balance requires understanding how the persistent 52-card deck degrades over successive rounds. The current `deck_evolution_analysis` oracle tracks only winnability and active-card count with all terminal conditions suppressed. We need richer per-round composition time-series (blessings, curses, anchors) plotted vs. round number to identify when and why decks become unwinnable under realistic collapse rules.

## What Changes

- **Deck composition tracking**: Collect minimal per-round stats from the persistent `CardState` registry: `active` (attrition_stage < 5), `blessed`, `cursed` (attrition_stage == 4), `anchored` (reward_stage == 2). Derived `entombed = 52 - active` included implicitly.
- **Collapse-only termination**: Replace infinite-runner (no terminals) with realistic termination: campaigns stop on `collapse_starvation` (< 28 active cards); `perfect_win` / `pyramid_clear` victories apply survival rewards and continue to the next round. No sealed-tomb, soft-win, or all-immune stall checks in this analysis mode.
- **CSV output**: Emit per-campaign-per-round rows and an aggregated-by-round CSV for offline re-plotting without re-simulation.
- **PNG plotting**: Generate matplotlib time-series plots (active, composition, winability vs. round) when `matplotlib` is available; graceful ASCII/skip fallback otherwise.
- **Configurable solvers**: Campaign solver and probe solver selectable via `--solver` / `--probe-solver` (greedy default, heuristic/beam/dfs optional); winability probing retains multi-probe Monte Carlo with fresh shuffles.
- **Hybrid script + notebook**: Extract pure campaign/probe core to `sim/deck_evolution_core.py` (no argparse, no Pool) for reuse. Keep `sim/deck_evolution_analysis.py` as CLI + parallel Pool entry point. Add `notebooks/deck_evolution.ipynb` for interactive VS Code / JupyterLab analysis (widgets/sliders, inline matplotlib, CSV-load path for heavy sweeps).
- **Additive overlay in notebook**: Notebook keeps kernel-persistent `runs` list; an "Add run" button (difficulty/solver/campaigns widgets) appends a new run to the same multi-panel figure with legend entries per configuration. A "Clear" control resets the overlay. Re-clicking Add overlays without duplicating state on kernel restart is handled via optional CSV autosave.
- **Dependencies**: Add `matplotlib` + `ipykernel` (optional/notebook extra) to `pyproject.toml`.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `deck-evolution-analysis`: Extend infinite-runner spec to cover collapse-only termination, per-round deck composition statistics, CSV emission, and PNG plotting requirements.

## Impact

- New `sim/deck_evolution_core.py` — pure functions (run campaign, probe, stats, aggregation) with no CLI/Pool for notebook reuse.
- `sim/deck_evolution_analysis.py` — refactored to import core; adds stats collector, CSV writer, plotting, collapse-only termination, flag changes, remains the batch/CI entry point.
- New `notebooks/deck_evolution.ipynb` — interactive VS Code / JupyterLab analysis reusing core; inline plots, optional widget sliders, fast CSV-load path for heavy sweeps.
- `pyproject.toml` / `uv` dependencies — add `matplotlib` (+ `ipykernel` for notebook extra).
- `openspec/specs/deck-evolution-analysis/spec.md` — delta spec for new requirements (including notebook).
- No web-game (`src/`) or deployment changes.
