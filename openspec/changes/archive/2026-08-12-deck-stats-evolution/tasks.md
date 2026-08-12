## 1. Core extraction & runner

- [x] 1.1 Extract pure core to `sim/deck_evolution_core.py`: `DeckStats`, `compute_deck_stats(registry)`, `probe_solvability`, `run_collapse_campaign`, `aggregate_results`, CSV/plotting helpers — no argparse/Pool
- [x] 1.2 Change runner termination: stop on `active < 28` (collapse_starvation); victories (`pyramid_clear`/`perfect_win`) apply `_apply_survival_reward` and continue; cap at `max_rounds` (now in core)
- [x] 1.3 Refactor `sim/deck_evolution_analysis.py` to import from core; keep CLI + Pool as thin wrapper; ensure `RuleFlags` scars/curses/blessings/attrition on, sealed_tomb/rank_anchor off
- [x] 1.4 Preserve `first_unwinnable_round` semantics through refactor

## 2. Composition stats

- [x] 2.1 Add `DeckStats` helper and per-round counting of `active` (attrition_stage<5), `blessed`, `cursed` (stage==4), `anchored` (reward_stage==2) read-only from registry before round play
- [x] 2.2 Extend `round_records` entries with `{active, blessed, cursed, anchored}` and ensure probe path does not consume RNG or mutate state
- [x] 2.3 Extend `aggregate_results` to compute per-round means for composition fields and `n_contributing` (campaigns still alive at that round)

## 3. Solver configurability

- [x] 3.1 Ensure `--solver` and `--probe-solver` accept `greedy|heuristic|beam|dfs` with greedy defaults; wire through worker args and `create_solver`

## 4. CSV output

- [x] 4.1 Add CLI flags `--csv FILE` and `--csv-per-campaign FILE`; no file when omitted
- [x] 4.2 Implement aggregated CSV writer (`round`, `mean_active`, `mean_blessed`, `mean_cursed`, `mean_anchored`, `mean_probe_win_rate`, `unwinnable_count`, `unwinnable_pct`, `n_contributing`)
- [x] 4.3 Implement per-campaign CSV writer (`campaign`, `round`, `active`, `blessed`, `cursed`, `anchored`, `probe_wins`, `total_probes`, `is_unwinnable`)

## 5. Plotting

- [x] 5.1 Add `matplotlib` (+ `ipykernel` notebook extra) to `pyproject.toml` (check existing `Pillow`/`fpdf2` style)
- [x] 5.2 Add `--plot FILE` / `--plot-dir DIR` flags; optional `import matplotlib.pyplot` with `HAS_MPL` guard and stderr warning fallback
- [x] 5.3 Implement `plot_evolution()` in core (reused by CLI and notebook) with 2–3 panels sharing X=round: active; blessed/cursed/anchored; winability/unwinnable%, consistent with aggregated CSV

## 6. Notebook

- [x] 6.1 Create `notebooks/deck_evolution.ipynb` (6–8 cells) importing from `sim.deck_evolution_core`: kernel-persistent `runs` state, inline matplotlib, small-default live run or CSV-load branch, optional sliders
- [x] 6.2 Implement widget controls: `difficulty`/`solver`/`campaigns` selectors + "Add run" (append to `runs`, overlay legend) and "Clear" (reset)
- [x] 6.3 Verify notebook runs in VS Code and JupyterLab with sequential `workers=1`, overlay of 2 distinct configs on one figure, CSV-load path, and no Pool required

## 7. Console & verification

- [x] 7.1 Update `print_round_table` / `print_ascii_chart` / `print_summary` to include composition means and per-round contributor count
- [x] 7.2 Manual verification: run `python sim/deck_evolution_analysis.py --campaigns 10 --max-rounds 30 --probes 10 --csv /tmp/agg.csv --csv-per-campaign /tmp/per.csv --plot /tmp/evo.png` and confirm CSVs + PNG (or warning) plus table output
- [x] 7.3 Run `openspec validate --change deck-stats-evolution --strict` and address findings

