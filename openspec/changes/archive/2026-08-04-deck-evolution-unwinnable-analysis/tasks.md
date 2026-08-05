## 1. Script Scaffolding

- [x] 1.1 Create `sim/deck_evolution_analysis.py` with module docstring, imports from `cursed_tomb_sim` and solvers
- [x] 1.2 Implement `parse_args()` with all CLI flags: `--campaigns`, `--max-rounds`, `--probes`, `--sample-interval`, `--difficulty`, `--solver`, `--probe-solver`, `--seed`, `--verbose`
- [x] 1.3 Implement `create_solver(name)` factory helper (mirrors pattern in `sweep_thresholds.py`)

## 2. Infinite Campaign Runner

- [x] 2.1 Implement `run_infinite_campaign(rng, max_redeals, flags, max_rounds, solver)` that loops for `max_rounds` rounds with all terminal conditions disabled
- [x] 2.2 Inside the loop: call `play_round()` for the active (non-entombed) card pool; apply attrition on freeze; apply survival reward on `pyramid_clear`; **do not** check for victory/collapse/starvation/volatile conditions
- [x] 2.3 Handle edge case: if active card count drops below 28, still track round but skip calling `play_round` (pyramid cannot be dealt); mark round as unwinnable
- [x] 2.4 Handle all-anchored equilibrium: detect when all active cards are anchored and flag as stall, stop oracle probing (no further evolution possible)

## 3. Solvability Oracle

- [x] 3.1 Implement `snapshot_deck(registry)` to capture a deep copy of all card states (attrition_stage, reward_stage, blessed, anchor_absorption) without mutating the original
- [x] 3.2 Implement `restore_deck(registry, snapshot)` to restore state after oracle runs
- [x] 3.3 Implement `probe_solvability(active_cards, rng, max_redeals, flags, n_probes, probe_solver)` that: (a) takes a snapshot, (b) runs `n_probes` shuffled `play_round` calls on cloned active card lists, (c) counts `pyramid_clear`+`perfect_win` outcomes, (d) returns `(probe_wins, n_probes)` — does NOT restore (probes work on independent clones)
- [x] 3.4 Verify oracle does not mutate the live campaign's card state — add an assertion or sanity check in development

## 4. Per-Round Data Collection

- [x] 4.1 Define `RoundData` dataclass or dict to store per-campaign: `round_num`, `probe_wins`, `n_probes`, `is_unwinnable`, `is_first_unwinnable`
- [x] 4.2 In `run_infinite_campaign`, call `probe_solvability` every `sample_interval` rounds and record results
- [x] 4.3 Track `first_unwinnable_round` per campaign (first round where `probe_wins == 0`); set to `None` if never unwinnable within cap
- [x] 4.4 Return campaign results as a dict: `{"round_data": [...], "first_unwinnable_round": int|None}`

## 5. Aggregate Statistics

- [x] 5.1 Implement `aggregate_results(all_campaign_results, max_rounds, sample_interval)` that builds per-round arrays: `unwinnable_count[r]`, `first_unwinnable_count[r]`, `mean_probe_win_rate[r]`, `cumulative_unwinnable[r]`
- [x] 5.2 Compute summary stats: median/mean of `first_unwinnable_round` across campaigns that ever became unwinnable; fraction never-unwinnable; fraction always-unwinnable (round 1 unwinnable)

## 6. Output Formatting

- [x] 6.1 Implement `print_round_table(aggregated, n_campaigns)` that prints the per-round table with columns: `Round | Sampled | Unwinnable% | 1st-Unwin% | Mean-Win-Rate | Cumul-Unwin%`
- [x] 6.2 Implement `print_ascii_chart(aggregated, max_rounds)` that renders an ASCII bar chart of mean probe win rate vs. round (bar width proportional to win rate, 50-char scale)
- [x] 6.3 Implement `print_summary(summary_stats, args)` that prints the final summary block with config echo and key findings
- [x] 6.4 Add header banner (script name, config, start time) before simulation begins

## 7. Main Entry Point & Validation

- [x] 7.1 Implement `main()` that: parses args → creates flags (all terminal conditions disabled) → runs N campaigns → aggregates → prints table + chart + summary
- [x] 7.2 Run a quick smoke test: `python3 sim/deck_evolution_analysis.py --campaigns 5 --max-rounds 10 --probes 10` — confirm it runs without error and produces all three output sections
- [x] 7.3 Run a real-scale test: `python3 sim/deck_evolution_analysis.py --campaigns 100 --max-rounds 100 --probes 50` — observe results; confirm data looks sensible (win rate should decline over rounds)
- [x] 7.4 Spot-check: run with `--difficulty novice` vs `--difficulty survivalist` and confirm survivalist shows earlier/more frequent unwinnable states (higher attrition from more freezes)
