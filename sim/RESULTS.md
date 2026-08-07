# Base Game & Solver Simulation Results

**The Cursed Tomb** — Pyramid Solitaire & Campaign Simulator Suite  
Simulated with [`cursed_tomb_sim.py`](./cursed_tomb_sim.py), [`test_solvers.py`](./test_solvers.py), and supporting scripts.

> **Default solver strategy:** Domain-aware `HeuristicSolver` (multi-factor evaluation: exposed count, row depth, red-curse priority, waste preservation, and blessing synergies).
> **Base-game mechanics:** scars, curses, blessings, and attrition are disabled, matching the standard web-game mode.
> **Vault mechanics:** the Diamond Vault is a multi-card FILO stack. Cards are pushed onto the top; only the top card is playable, and clearing it exposes the card beneath.
> **Seed:** 42 for reproducible runs. Reported commands use four worker processes unless noted otherwise.

---

## Part 1 — Single-Game Win & Collapse Rates

> **Command:** `python3 sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`

Each game is one round of Pyramid Solitaire. A **Pyramid Clear** means all 28 pyramid cards were cleared. A **Total Victory** means all 52 cards (pyramid and stock/waste) were cleared in that round. A **Collapse** means the player ran out of legal moves with no draws or redeals remaining.

**Sample size:** 10,000 games per setting

| UI Redraw Setting        | Redraws | Pyramid Clear Rate | Total Victory Rate | Collapse Rate |
| :----------------------- | :-----: | -----------------: | -----------------: | ------------: |
| 0 redraws (Survivalist)  |    0    |              1.17% |              0.28% |        98.83% |
| 1 redraw (Archaeologist) |    1    |             14.91% |              3.58% |        85.09% |
| 3 redraws (Explorer)     |    3    |             34.37% |              6.79% |        65.63% |
| 5 redraws (Novice)       |    5    |             34.57% |              6.81% |        65.43% |

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

| Difficulty    | Redraws | Win Rate within 500 Rounds | Avg Rounds to Win | Median Rounds |
| :------------ | :-----: | -------------------------: | ----------------: | ------------: |
| Survivalist   |    0    |                      69.6% |             197.1 |           176 |
| Archaeologist |    1    |                     100.0% |              30.3 |            21 |
| Explorer      |    3    |                     100.0% |              15.0 |            10 |
| Novice        |    5    |                     100.0% |              15.0 |            10 |

---

## Part 3 — Full Rules Campaign

> **Command pattern:**
> ```bash
> python3 sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty [difficulty] --solver heuristic --volatile-collapse --max-rounds 500 --workers 4
> ```

This section enables scars, curses, blessings, attrition, and the optional Volatile Collapse rule. The Diamond Vault uses FILO semantics throughout the core simulator. A campaign can end in:

- **Victory:** Perfect Win clears all 52 cards in one round.
- **Collapse:** Starvation or Volatile Collapse.
- **Stall:** no-progress/all-immune deadlock detected by the simulator.
- **Timeout:** the 500-round safety cap is reached.

**Sample size:** 1,000 campaigns per difficulty; maximum 500 rounds per campaign

| Difficulty    | Redraws | Victory (all) | Collapse (all) | Stall | Timeout | Victory / Collapse of Resolved |
| :------------ | :-----: | ------------: | -------------: | ----: | ------: | -----------------------------: |
| Survivalist   |    0    |         2.70% |         97.30% | 0.00% |   0.00% |                 2.70% / 97.30% |
| Archaeologist |    1    |        43.00% |         50.80% | 2.10% |   4.10% |                45.84% / 54.16% |
| Explorer      |    3    |        56.50% |         17.70% | 7.90% |  17.90% |                76.15% / 23.85% |
| Novice        |    5    |        56.50% |         17.40% | 7.80% |  18.30% |                76.45% / 23.55% |

### Round-resolution metrics

| Difficulty    |     Avg Rounds to Win |    Avg Rounds to Collapse |     Overall Avg to Resolve |
| :------------ | --------------------: | ------------------------: | -------------------------: |
| Survivalist   |  5.9 ± 3.3 (median 5) | 108.4 ± 17.0 (median 107) |  105.7 ± 23.6 (median 106) |
| Archaeologist | 9.5 ± 10.2 (median 8) | 195.8 ± 73.2 (median 175) | 110.4 ± 107.6 (median 123) |
| Explorer      | 8.1 ± 11.8 (median 5) | 281.6 ± 95.6 (median 270) |    73.4 ± 126.0 (median 8) |
| Novice        | 8.1 ± 11.8 (median 5) | 282.7 ± 95.8 (median 270) |    72.8 ± 125.9 (median 8) |

The resolved-rate column excludes stalls and timeouts; the all-outcome columns include every campaign and therefore sum to 100% when combined with Stall and Timeout.

---

## Part 4 — Endless Campaign Endurance Sweep

> **Command:** `python3 sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`

Volatile Collapse is enabled by default in this sweep. The deadlock threshold is 10% of the 300-round cap (30 rounds).

**Sample size:** 1,000 campaigns per setting; maximum 300 rounds per campaign

| Difficulty    | Redraws | Mean Rounds Survived | Pyramids Cleared / Campaign | Perfect Wins / Campaign | Rank-Anchor Achievement |
| :------------ | :-----: | -------------------: | --------------------------: | ----------------------: | ----------------------: |
| Survivalist   |    0    |         105.7 ± 23.6 |                         0.2 |                     0.0 |                    0.0% |
| Archaeologist |    1    |        117.6 ± 105.2 |                         8.4 |                     0.4 |                    0.0% |
| Explorer      |    3    |        122.7 ± 134.3 |                        27.6 |                     0.6 |                    0.1% |
| Novice        |    5    |        122.8 ± 134.4 |                        27.8 |                     0.6 |                    0.1% |

### End-type rates

| Difficulty    | Starvation | Volatile Collapse | Deadlock | Round Cap |
| :------------ | ---------: | ----------------: | -------: | --------: |
| Survivalist   |      24.1% |             73.2% |     0.0% |      0.0% |
| Archaeologist |       8.7% |             37.1% |     2.7% |      8.5% |
| Explorer      |       2.7% |              8.4% |     7.0% |     25.4% |
| Novice        |       2.7% |              8.2% |     7.1% |     25.5% |

---

## Part 5 — FILO Vault Rule Comparison

> **Command:** `python3 sim/compare_vault_sim.py --campaigns 1000 --seed 42 --workers 4`

This focused comparison measures the impact of allowing Blessed Diamond cards exposed in the Pyramid to enter the Vault. Both modes use the updated FILO stack: only the top Vault card can be cleared or paired. In the current comparison implementation, both modes automatically move Blessed Diamonds drawn from Stock into the Vault; **Stock Auto-Vault** is the baseline, while **Pyramid Self-Vault** additionally allows free Vaulting from exposed Pyramid positions.

**Sample size:** 1,000 campaigns per setting; maximum 500 rounds per campaign

| Difficulty    | Mode               | Victory Rate | Collapse Rate | Timeout Rate* | Avg Rounds |
| :------------ | :----------------- | -----------: | ------------: | ------------: | ---------: |
| Survivalist   | Stock Auto-Vault   |        0.00% |       100.00% |         0.00% |       91.5 |
| Survivalist   | Pyramid Self-Vault |        0.00% |       100.00% |         0.00% |       91.6 |
| Archaeologist | Stock Auto-Vault   |        0.10% |        99.90% |         0.00% |      145.6 |
| Archaeologist | Pyramid Self-Vault |        0.10% |        99.30% |         0.60% |      155.5 |
| Explorer      | Stock Auto-Vault   |        2.10% |        96.00% |         1.90% |      225.8 |
| Explorer      | Pyramid Self-Vault |        2.00% |        59.90% |        38.10% |      340.9 |
| Novice        | Stock Auto-Vault   |        1.80% |        96.20% |         2.00% |      226.7 |
| Novice        | Pyramid Self-Vault |        2.10% |        59.30% |        38.60% |      344.0 |

\* `compare_vault_sim.py` prints Victory and Collapse rates; Timeout Rate is the remaining percentage to 100%.

### Interpretation

- Under Explorer and Novice settings, Pyramid Self-Vaulting greatly reduces immediate collapse but increases the number of campaigns reaching the 500-round cap. This means the mechanic often preserves playability without necessarily producing a Perfect Win within the cap.
- The comparison is now stack-correct: Vault candidates expose only `vault[-1]`, and removal uses `.pop()` from the top.
- These results should not be compared directly with Part 3's resolved rates because this focused script has different campaign-resolution and timeout handling.

---

## Part 6 — Solver Comparison

> **Command:** `python3 sim/test_solvers.py --games 50 --redraws 3 --seed 42`

Comparative benchmark across identical deck seeds at Explorer difficulty (3 redraws):

| Solver Policy       | Single-Game Win Rate | Wins | Losses | Execution Time* | Moves / Game |
| :------------------ | -------------------: | ---: | -----: | --------------: | -----------: |
| Greedy              |                48.0% |   24 |     26 |           0.05s |         49.3 |
| Heuristic (default) |                48.0% |   24 |     26 |           0.04s |         48.9 |
| BeamSearch (D3, B4) |                52.0% |   26 |     24 |           0.63s |         49.4 |
| DFS (max 3k nodes)  |                60.0% |   30 |     20 |           1.17s |         48.8 |

\* Execution time is machine-dependent; the reported values are from the recorded run.

---

## Simulation Scripts & CLI Flags

| Script                                               | Purpose                                                       | Reproducible command                                                                                                                                  |
| :--------------------------------------------------- | :------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`base_game_sim.py`](./base_game_sim.py)             | Part 1: single-game win/collapse rates                        | `python3 sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`                                                                 |
| [`campaign_rounds_sim.py`](./campaign_rounds_sim.py) | Part 2: base-game rounds to Perfect Win                       | `python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty explorer --max-rounds 500 --solver heuristic --seed 42 --workers 4`                 |
| [`cursed_tomb_sim.py`](./cursed_tomb_sim.py)         | Part 3: full-rules campaign runner                            | `python3 sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty explorer --solver heuristic --volatile-collapse --max-rounds 500 --workers 4` |
| [`sweep_thresholds.py`](./sweep_thresholds.py)       | Part 4: cross-difficulty endurance sweep                      | `python3 sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`                                          |
| [`compare_vault_sim.py`](./compare_vault_sim.py)     | Part 5: Stock Auto-Vault versus Pyramid Self-Vault comparison | `python3 sim/compare_vault_sim.py --campaigns 1000 --seed 42 --workers 4`                                                                             |
| [`test_solvers.py`](./test_solvers.py)               | Part 6: solver benchmark comparison                           | `python3 sim/test_solvers.py --games 50 --redraws 3 --seed 42`                                                                                        |

### Validation

```bash
python3 -m py_compile sim/cursed_tomb_sim.py sim/compare_vault_sim.py sim/base_game_sim.py sim/campaign_rounds_sim.py sim/sweep_thresholds.py sim/test_solvers.py
python3 sim/test_solvers.py
```
