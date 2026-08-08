# Base Game & Solver Simulation Results

**The Cursed Tomb** — Pyramid Solitaire & Campaign Simulator Suite  
Simulated with [`cursed_tomb_sim.py`](./cursed_tomb_sim.py), [`test_solvers.py`](./test_solvers.py), and supporting scripts.

> **Default solver strategy:** Domain-aware `HeuristicSolver` (multi-factor evaluation: exposed count, row depth, red-curse priority, waste preservation, and blessing synergies).
> **Base-game mechanics:** scars, curses, blessings, and attrition are disabled, matching the standard web-game mode.
> **Vault mechanics:** the Diamond Vault is a multi-card FILO stack. Cards are pushed onto the top; only the top card is playable, and clearing it exposes the card beneath.
> **Seed:** 42 for reproducible runs. Reported commands use four worker processes unless noted otherwise.

---

## Part 1 — Single-Game Win & Round Loss Rates

> **Command:** `python3 sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`

Each game is one round of Pyramid Solitaire. A **Pyramid Clear** means all 28 pyramid cards were cleared. A **Total Victory** means all 52 cards (pyramid and stock/waste) were cleared in that round. A **Round Loss** (or **Freeze**) means the player ran out of legal moves with no draws or redeals remaining.

**Sample size:** 10,000 games per setting

<!-- BEGIN PART 1 TABLE -->
| UI Redraw Setting        | Redraws | Pyramid Clear Rate | Total Victory Rate | Round Loss Rate |
| :----------------------- | :-----: | -----------------: | -----------------: | --------------: |
| 0 redraws (Survivalist)  |    0    |              1.17% |              0.28% |          98.83% |
| 1 redraw  (Archaeologist) |    1    |             14.91% |              3.58% |          85.09% |
| 3 redraws (Explorer)     |    3    |             34.37% |              6.79% |          65.63% |
| 5 redraws (Novice)       |    5    |             34.57% |              6.81% |          65.43% |
<!-- END PART 1 TABLE -->

### Observations

- **0 redraws remains very difficult.** A single pass through the 24-card stock clears the pyramid in 1.17% of games and achieves Total Victory in 0.28%.
- **Total Victory is substantially more achievable under in-flight stock pairing.** At 5 redraws, 6.81% of games clear all 52 cards because exposed Stock cards can be matched directly with Waste or Pyramid cards before entering the Waste pile.
- **Redraws provide diminishing returns.** Pyramid Clear rate rises from 1.17% at 0 redraws to 14.91% at 1, then 34.37% at 3; the increase to 5 redraws is only 0.20 percentage points.

---

## Part 2 — Base-Game Campaign Rounds to Perfect Win

> **Commands:**
> ```bash
> python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty survivalist --max-rounds 500 --solver heuristic --seed 42 --workers 4
> python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty archaeologist --max-rounds 500 --solver heuristic --seed 42 --workers 4
> python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty explorer --max-rounds 500 --solver heuristic --seed 42 --workers 4
> python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty novice --max-rounds 500 --solver heuristic --seed 42 --workers 4
> ```

The base-game campaign has no attrition, so the tomb cannot starve or collapse. Each campaign continues until a Perfect Win clears all 52 cards in one round or the 500-round safety cap is reached.

**Sample size:** 1,000 campaigns per setting; maximum 500 rounds per campaign

<!-- BEGIN PART 2 TABLE -->
| Difficulty    | Redraws | Win Rate within 500 Rounds | Avg Rounds to Win | Median Rounds |
| :------------ | :-----: | -------------------------: | ----------------: | ------------: |
| Survivalist   |    0    |                      69.6% |              197.1 |           176 |
| Archaeologist |    1    |                     100.0% |               30.3 |            21 |
| Explorer      |    3    |                     100.0% |               15.0 |            10 |
| Novice        |    5    |                     100.0% |               15.0 |            10 |
<!-- END PART 2 TABLE -->

---

## Part 3 — Full Rules Campaign

> **Command pattern:**
> ```bash
> python3 sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty [difficulty] --solver heuristic --max-rounds 500 --workers 4
> ```

This section enables scars, curses, blessings, and attrition. The Diamond Vault uses FILO semantics throughout the core simulator. A campaign can end in:

- **Victory:** Perfect Win clears all 52 cards in one round.
- **Collapse:** Starvation.
- **Stall:** no-progress/all-immune deadlock detected by the simulator.
- **Timeout:** the 500-round safety cap is reached.

**Sample size:** 1,000 campaigns per difficulty; maximum 500 rounds per campaign

<!-- BEGIN PART 3 TABLE 1 -->
| Difficulty    | Redraws | Victory (all) | Collapse (all) | Stall | Timeout | Victory / Collapse of Resolved |
| :------------ | :-----: | ------------: | -------------: | ----: | ------: | -----------------------------: |
| Survivalist   |    0    |         2.70% |         97.30% | 0.00% |   0.00% |                 2.70% / 97.30% |
| Archaeologist |    1    |        42.70% |         51.30% | 0.00% |   4.10% |                45.43% / 54.57% |
| Explorer      |    3    |        55.50% |         17.70% | 0.00% |  17.90% |                75.82% / 24.18% |
| Novice        |    5    |        55.50% |         17.50% | 0.00% |  18.10% |                76.03% / 23.97% |
<!-- END PART 3 TABLE 1 -->

### Round-resolution metrics

<!-- BEGIN PART 3 TABLE 2 -->
| Difficulty    |     Avg Rounds to Win |    Avg Rounds to Collapse |     Overall Avg to Resolve |
| :------------ | --------------------: | ------------------------: | -------------------------: |
| Survivalist   | 5.9 ± 3.3 (median 5.0) | 108.3 ± 17.0 (median 107.0) | 105.5 ± 23.6 (median 106.0) |
| Archaeologist | 9.2 ± 7.6 (median 8.0) | 197.3 ± 74.6 (median 178.0) | 111.9 ± 108.8 (median 123.0) |
| Explorer      | 7.8 ± 12.1 (median 5.0) | 281.9 ± 94.8 (median 267.0) |  74.0 ± 126.8 (median 8.0) |
| Novice        | 7.7 ± 12.1 (median 5.0) | 281.8 ± 94.7 (median 267.0) |  73.4 ± 126.3 (median 8.0) |
<!-- END PART 3 TABLE 2 -->

The resolved-rate column excludes stalls and timeouts; the all-outcome columns include every campaign and therefore sum to 100% when combined with Stall and Timeout.

---

## Part 4 — Endless Campaign Endurance Sweep

> **Command:** `python3 sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`

The deadlock threshold is 10% of the 300-round cap (30 rounds).

**Sample size:** 1,000 campaigns per setting; maximum 300 rounds per campaign

<!-- BEGIN PART 4 TABLE 1 -->
| Difficulty    | Redraws | Mean Rounds Survived | Pyramids Cleared / Campaign | Perfect Wins / Campaign | Rank-Anchor Achievement |
| :------------ | :-----: | -------------------: | --------------------------: | ----------------------: | ----------------------: |
| Survivalist   |    0    |         111.1 ± 23.5 |                        0.2 |                     0.0 |                    0.0% |
| Archaeologist |    1    |        122.8 ± 108.2 |                        8.2 |                     0.4 |                    0.0% |
| Explorer      |    3    |        126.0 ± 135.4 |                       27.9 |                     0.6 |                    0.2% |
| Novice        |    5    |        126.1 ± 135.5 |                       28.4 |                     0.6 |                    0.2% |
<!-- END PART 4 TABLE 1 -->

### End-type rates

<!-- BEGIN PART 4 TABLE 2 -->
| Difficulty    | Starvation | Deadlock | Round Cap |
| :------------ | ---------: | -------: | --------: |
| Survivalist   |     100.0% |     0.0% |      0.0% |
| Archaeologist |      45.4% |     1.6% |     10.3% |
| Explorer      |       9.9% |     8.1% |     26.5% |
| Novice        |       9.9% |     8.1% |     26.5% |
<!-- END PART 4 TABLE 2 -->

---

## Part 5 — Solver Comparison

> **Command:** `python3 sim/test_solvers.py --games 50 --redraws 3 --seed 42`

Comparative benchmark across identical deck seeds at Explorer difficulty (3 redraws):

<!-- BEGIN PART 5 TABLE -->
| Solver Policy       | Single-Game Win Rate | Wins | Losses | Execution Time* | Moves / Game |
| :------------------ | -------------------: | ---: | -----: | --------------: | -----------: |
| Greedy             |                34.0% |   17 |     33 |           0.02s |         50.1 |
| Heuristic          |                34.0% |   17 |     33 |           0.01s |         49.9 |
| BeamSearch (D3,B4) |                42.0% |   21 |     29 |           0.15s |         49.0 |
| DFS (Max 3k nodes) |                46.0% |   23 |     27 |           0.40s |         49.4 |
<!-- END PART 5 TABLE -->

\* Execution time is machine-dependent; the reported values are from the recorded run.

---

## Simulation Scripts & CLI Flags

| Script                                               | Purpose                                 | Reproducible command                                                                                                                                  |
| :--------------------------------------------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`base_game_sim.py`](./base_game_sim.py)             | Part 1: single-game win/collapse rates  | `python3 sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`                                                                 |
| [`campaign_rounds_sim.py`](./campaign_rounds_sim.py) | Part 2: base-game rounds to Perfect Win | `python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty explorer --max-rounds 500 --solver heuristic --seed 42 --workers 4`                 |
| [`cursed_tomb_sim.py`](./cursed_tomb_sim.py)         | Part 3: full-rules campaign runner      | `python3 sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty explorer --solver heuristic --max-rounds 500 --workers 4` |
| [`sweep_thresholds.py`](./sweep_thresholds.py)       | Part 4: cross-difficulty endurance sweep| `python3 sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`                                          |
| [`test_solvers.py`](./test_solvers.py)               | Part 5: solver benchmark comparison     | `python3 sim/test_solvers.py --games 50 --redraws 3 --seed 42`                                                                                        |

### Validation

```bash
python3 -m py_compile sim/cursed_tomb_sim.py sim/compare_vault_sim.py sim/base_game_sim.py sim/campaign_rounds_sim.py sim/sweep_thresholds.py sim/test_solvers.py
python3 sim/test_solvers.py
```
