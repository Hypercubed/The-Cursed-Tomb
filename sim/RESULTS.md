# Base Game & Solver Simulation Results

**The Cursed Tomb** — Pyramid Solitaire & Campaign Simulator Suite  
Simulated with [`cursed_tomb_sim.py`](./cursed_tomb_sim.py), [`test_solvers.py`](./test_solvers.py), and supporting scripts under the official ruleset including Anchor Absorption (max 4 freeze absorptions per anchor shield).

> **Default solver strategy:** Domain-aware `HeuristicSolver` (multi-factor evaluation: exposed count, row depth, red-curse priority, waste preservation, and blessing synergies).
> **Anchor Absorption mechanic:** Anchors absorb up to 4 freeze attrition hits before exhausting (`reward_stage` drops to 0), resuming standard attrition without wiping prior scars.
> **Base-game mechanics:** scars, curses, blessings, and attrition are disabled in Parts 1 & 2, matching standard mode.
> **Vault mechanics:** the Diamond Vault is a multi-card FILO stack. Cards are pushed onto the top; only the top card is playable, and clearing it exposes the card beneath.
> **Seed:** 42 for reproducible runs. Reported commands use worker processes.

---

## Part 1 — Single-Game Win & Round Loss Rates

> **Command:** `python sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`

Each game is one round of Pyramid Solitaire. A **Pyramid Clear** means all 28 pyramid cards were cleared. A **Total Victory** means all 52 cards (pyramid and stock/waste) were cleared in that round. A **Round Loss** (or **Freeze**) means the player ran out of legal moves with no draws or redeals remaining.

**Sample size:** 10,000 games per setting

<!-- BEGIN PART 1 TABLE -->
| UI Redraw Setting        | Redraws | Pyramid Clear Rate | Total Victory Rate | Round Loss Rate |
| :----------------------- | :-----: | -----------------: | -----------------: | --------------: |
| 0 redraws (Survivalist)  |    0    |              1.17% |              0.28% |        98.83% |
| 1 redraw  (Archaeologist) |    1    |             14.91% |              3.58% |        85.09% |
| 3 redraws (Explorer)     |    3    |             34.37% |              6.79% |        65.63% |
| 5 redraws (Novice)       |    5    |             34.57% |              6.81% |        65.43% |
<!-- END PART 1 TABLE -->

### Observations

- **0 redraws remains very difficult.** A single pass through the 24-card stock clears the pyramid in 1.17% of games and achieves Total Victory in 0.28%.
- **Total Victory is substantially more achievable under in-flight stock pairing.** At 5 redraws, 6.81% of games clear all 52 cards because exposed Stock cards can be matched directly with Waste or Pyramid cards before entering the Waste pile.
- **Redraws provide diminishing returns.** Pyramid Clear rate rises from 1.17% at 0 redraws to 14.91% at 1, then 34.37% at 3; the increase to 5 redraws is only 0.20 percentage points.

---

## Part 2 — Base-Game Campaign Rounds to Perfect Win

> **Commands:**
> ```bash
> python sim/campaign_rounds_sim.py --campaigns 1000 --difficulty survivalist --max-rounds 500 --solver heuristic --seed 42 --workers 4
> python sim/campaign_rounds_sim.py --campaigns 1000 --difficulty archaeologist --max-rounds 500 --solver heuristic --seed 42 --workers 4
> python sim/campaign_rounds_sim.py --campaigns 1000 --difficulty explorer --max-rounds 500 --solver heuristic --seed 42 --workers 4
> python sim/campaign_rounds_sim.py --campaigns 1000 --difficulty novice --max-rounds 500 --solver heuristic --seed 42 --workers 4
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

## Part 3 — Full Rules Campaign (Endless)

> **Command pattern:**
> ```bash
> python sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty [difficulty] --solver heuristic --max-rounds 500 --workers 4
> ```

This section enables scars, curses, blessings, attrition, and **Anchor Absorption** (`anchor_absorption = True`) under the **endless paradigm**: **The Cursed Tomb is cursed to fail — there is no final victory.** Every **Pyramid Clear** (28 cards) and **Perfect Win** (52 cards) scores a **Win**, grants Survival Rewards (§6 of the rules), and the campaign continues until **Starvation** (<28 active cards) or the safety cap. `perfect_win` no longer terminates the campaign.

A campaign record reports:

- **Collapse:** Starvation (<28 active cards) — the sole defeat condition.
- **Timeout:** Starvation not reached within `--max-rounds` (campaign would have continued).
- **Deadlock:** No-progress stall (`stall_deadlock` / `all_immune_stall`) detected by the simulator.
- **Scoring:** `pyramids_cleared` (total Wins) and `perfect_wins` counted across the whole campaign.

**Sample size:** 1,000 campaigns per difficulty; maximum 500 rounds per campaign

<!-- BEGIN PART 3 TABLE 1 -->
| Difficulty    | Redraws | Collapse | Timeout | Deadlock | Collapse Rate | Timeout Rate |
| :------------ | :-----: | -------: | ------: | -------: | ------------: | -----------: |
| Survivalist   |    0    |     1000 |       0 |        0 |       100.00% |        0.00% |
| Archaeologist |    1    |      933 |      44 |       23 |        93.30% |        4.40% |
| Explorer      |    3    |      808 |     117 |       75 |        80.80% |       11.70% |
| Novice        |    5    |      806 |     120 |       74 |        80.60% |       12.00% |
<!-- END PART 3 TABLE 1 -->

### Endless scoring & survival

<!-- BEGIN PART 3 TABLE 2 -->
| Difficulty    | Avg Rounds Survived | Avg Rounds to Collapse | Pyramids Cleared | Perfect Wins |
| :------------ | ------------------: | ---------------------: | --------------: | -----------: |
| Survivalist   | 150.7 ± 21.6 (median 148.0) | 150.7 ± 21.6 (median 148.0) | 0.1 ± 0.4 (median 0.0) max 3 | 0.02 (median 0.0) max 1 (23/1000 camps with >=1) |
| Archaeologist | 246.5 ± 92.0 (median 220.0) | 232.0 ± 73.7 (median 215.0) | 7.9 ± 14.2 (median 3.0) max 97 | 0.44 (median 0.0) max 5 (337/1000 camps with >=1) |
| Explorer      | 269.3 ± 136.7 (median 246.0) | 226.1 ± 109.4 (median 214.0) | 33.4 ± 25.9 (median 28.0) max 120 | 1.14 (median 1.0) max 9 (639/1000 camps with >=1) |
| Novice        | 268.6 ± 137.0 (median 245.0) | 225.1 ± 109.6 (median 213.0) | 33.6 ± 25.9 (median 28.0) max 120 | 1.15 (median 1.0) max 9 (643/1000 camps with >=1) |
<!-- END PART 3 TABLE 2 -->

---

## Part 4 — Endless Campaign Endurance Sweep (300 cap)

> **Command:** `python sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`

Same endless rules as Part 3 but capped at 300 rounds for faster sweeps. Starvation is the sole defeat; timeout = would have continued.

**Sample size:** 1,000 campaigns per setting; maximum 300 rounds per campaign

<!-- BEGIN PART 4 TABLE 1 -->
| Difficulty    | Redraws | Mean Rounds Survived | Pyramids Cleared / Campaign | Perfect Wins / Campaign | Rank-Anchor Achievement |
| :------------ | :-----: | -------------------: | --------------------------: | ----------------------: | ----------------------: |
| Survivalist   |    0    |         150.7 ± 21.6 |                        0.1 |                     0.0 |                    0.0% |
| Archaeologist |    1    |         223.7 ± 51.4 |                        7.6 |                     0.4 |                    6.1% |
| Explorer      |    3    |         218.8 ± 78.3 |                       31.7 |                     1.1 |                   47.1% |
| Novice        |    5    |         218.2 ± 78.4 |                       31.8 |                     1.1 |                   47.3% |
<!-- END PART 4 TABLE 1 -->

### End-type rates

<!-- BEGIN PART 4 TABLE 2 -->
| Difficulty    | Starvation | Deadlock | Round Cap |
| :------------ | ---------: | -------: | --------: |
| Survivalist   |     100.0% |     0.0% |      0.0% |
| Archaeologist |      74.5% |     4.0% |     17.4% |
| Explorer      |      22.9% |    10.3% |     30.4% |
| Novice        |      22.6% |     9.9% |     30.4% |
<!-- END PART 4 TABLE 2 -->

---

## Part 5 — Solver Comparison

> **Command:** `python sim/test_solvers.py --games 50 --redraws 3 --seed 42`

<!-- BEGIN PART 5 TABLE -->
| Solver Policy       | Single-Game Win Rate | Wins | Losses | Execution Time* | Moves / Game |
| :------------------ | -------------------: | ---: | -----: | --------------: | -----------: |
| Greedy             |                34.0% |   17 |     33 |           0.02s |         50.1 |
| Heuristic          |                34.0% |   17 |     33 |           0.01s |         49.9 |
| BeamSearch (D3,B4) |                42.0% |   21 |     29 |           0.23s |         49.0 |
| DFS (Max 3k nodes) |                46.0% |   23 |     27 |           0.89s |         49.4 |
| Novice             |                26.0% |   13 |     37 |           0.02s |         48.9 |
<!-- END PART 5 TABLE -->

---

## Simulation Scripts & CLI Flags

| Script                                               | Purpose                                 | Reproducible command                                                                                                                                  |
| :--------------------------------------------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`base_game_sim.py`](./base_game_sim.py)             | Part 1: single-game win/collapse rates  | `python sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`                                                                 |
| [`campaign_rounds_sim.py`](./campaign_rounds_sim.py) | Part 2: base-game rounds to Perfect Win | `python sim/campaign_rounds_sim.py --campaigns 1000 --difficulty explorer --max-rounds 500 --solver heuristic --seed 42 --workers 4`                 |
| [`cursed_tomb_sim.py`](./cursed_tomb_sim.py)         | Part 3: full-rules campaign runner      | `python sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty explorer --solver heuristic --max-rounds 500 --workers 4` |
| [`sweep_thresholds.py`](./sweep_thresholds.py)       | Part 4: cross-difficulty endurance sweep| `python sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`                                          |
| [`test_solvers.py`](./test_solvers.py)               | Part 5: solver benchmark comparison     | `python sim/test_solvers.py --games 50 --redraws 3 --seed 42`                                                                                        |
