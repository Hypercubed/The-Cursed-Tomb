# Base Game & Solver Simulation Results

**The Cursed Tomb** — Pyramid Solitaire & Campaign Simulator Suite
Simulated with [`cursed_tomb_sim.py`](./cursed_tomb_sim.py), [`test_solvers.py`](./test_solvers.py), and supporting scripts.

> **Default Solver Strategy:** Domain-aware `HeuristicSolver` (multi-factor evaluation: exposed count, row depth, red curse priority, waste preservation, blessing synergies).
> **Legacy mechanics disabled in base game:** scars, curses, blessings, attrition all off (matching the current web UI).
> **Seed:** 42 (reproducible runs)

---

## Part 1 — Single-Game Win & Collapse Rates

> **Command to reproduce:** `python3 base_game_sim.py --solver heuristic`

Each game is one round of pyramid solitaire. A **Win (Pyramid Clear)** means all 28 pyramid cards were cleared (partial or complete victory). A **Total Victory** means all 52 cards (pyramid *and* stock/waste) were cleared in that single round. A **Collapse** means the player ran out of legal moves with no draws or redraws remaining.

**Sample size:** 10,000 games per setting

| UI Redraw Setting | Redraws | Win Rate (Pyramid Clear) | Total Victory Rate (52 Cards) | Collapse Rate |
| :---------------- | :-----: | :----------------------: | :---------------------------: | :-----------: |
| 0 redraws         |    0    |          1.17%           |             0.28%             |    98.83%     |
| 1 redraw          |    1    |          14.91%          |             3.58%             |    85.09%     |
| 3 redraws         |    3    |          34.37%          |             6.79%             |    65.63%     |
| 5 redraws         |    5    |          34.57%          |             6.81%             |    65.43%     |

### Observations

- **0 redraws remains very difficult.** A single pass through the 24-card stock exposes enough cards to clear the pyramid in 1.17% of games, and achieves Total Victory in 0.28%.
- **Total Victory (clearing all 52 cards) is significantly more achievable.** Under in-flight stock pairing rules, Total Victory reaches **6.81%** with 5 redraws (up from 0.12%), because exposed Stock cards can be matched directly with Waste or Pyramid cards before entering the Waste pile.
- **Each redraw provides substantial value.** Going from 0→1 redraws increases pyramid clear rate from 1.17% → 14.91% (a 12.7× improvement); 1→3 redraws more than doubles pyramid clear rate to 34.37%.
- **5 redraws plateaus near the theoretical max (~34.6%).** Going from 3→5 redraws only yields a minimal bump from 34.37% to 34.57%, showing that 3–5 redraws captures virtually all playable board states.

---

## Part 2 — Campaign Rounds to Perfect Win

> **Command to reproduce:** `python3 campaign_rounds_sim.py --campaigns 1000 --difficulty [difficulty] --max-rounds 500`

The rules define the campaign victory condition as a **Perfect Win**: all 52 cards (pyramid *and* stock/waste) cleared in a single round. This is harder than a standard pyramid clear.

Since the base game has no attrition mechanics, **the tomb never collapses** — there is no starvation and no entombment. Every non-victory within the cap is a timeout (the campaign just keeps going).

**Sample size:** 1,000 campaigns per setting, max 500 rounds each

| Difficulty    | Redraws | Win Rate (500 rds) | Avg Rounds to Win | Median Rounds |
| :------------ | :-----: | :----------------: | :---------------: | :-----------: |
| Survivalist   |    0    |       69.6%        |       197.1       |      176      |
| Archaeologist |    1    |       100.0%       |       30.3        |      21       |
| Explorer      |    3    |       100.0%       |       15.0        |      10       |
| Novice        |    5    |       100.0%       |       15.0        |      10       |

---

## Part 3 — Full Rules Campaign (All Legacy Mechanics Enabled)

> **Command to reproduce:** `python3 cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty [difficulty] --solver heuristic`

This section simulates campaigns with **all Cursed Tomb rules active**: scars, curses, blessings, and attrition tracking, including the strict Blessing/Curse mutual exclusivity rule. Unlike Part 2, campaigns can end in **Collapse** (starvation when fewer than 28 active cards remain) or **Victory** (when a Perfect Win clears all 52 cards).

**Sample size:** 1,000 campaigns per difficulty, max 500 rounds each

| Difficulty    | Redraws | Victory Rate (Resolved) | Collapse Rate (Resolved) | Avg Rounds to Win | Avg Rounds to Collapse | Overall Avg Resolve |
| :------------ | :-----: | :---------------------: | :----------------------: | :---------------: | :--------------------: | :-----------------: |
| Survivalist   |    0    |          2.70%          |          97.30%          |     5.9 ± 3.3     |      114.1 ± 15.9      |    111.1 ± 23.5     |
| Archaeologist |    1    |         45.71%          |          54.29%          |    9.6 ± 10.9     |      205.2 ± 73.0      |    115.8 ± 111.5    |
| Explorer      |    3    |         77.45%          |          22.55%          |    8.9 ± 17.2     |      296.2 ± 98.1      |    73.7 ± 129.7     |
| Novice        |    5    |         77.55%          |          22.45%          |    8.8 ± 17.2     |      298.0 ± 99.2      |    73.8 ± 130.4     |

### Endless Campaign Endurance Metrics (Volatile Collapse Enabled)

> **Command to reproduce:** `python3 sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic`

| Difficulty    | Redraws | Mean Rounds Survived | Pyramids Cleared / Camp. | Perfect Wins / Camp. | Starvation Rate | Volatile Collapse Rate |
| :------------ | :-----: | :------------------: | :----------------------: | :------------------: | :-------------: | :--------------------: |
| Survivalist   |    0    |     105.7 ± 23.6     |           0.2            |         0.0          |      24.2%      |         73.1%          |
| Archaeologist |    1    |     117.8 ± 105.6    |           8.2            |         0.4          |      9.0%       |         37.4%          |
| Explorer      |    3    |     121.6 ± 133.8    |           27.1           |         0.6          |      1.8%       |          8.1%          |
| Novice        |    5    |     121.8 ± 134.0    |           27.4           |         0.6          |      1.7%       |          8.0%          |

---

## Part 4 — Solver Comparison (Greedy vs. Heuristic vs. BeamSearch vs. DFS)

> **Command to reproduce:** `python3 test_solvers.py --games 50 --redraws 3`

Comparative benchmark across identical deck seeds (Difficulty: Explorer / 3 redraws):

| Solver Policy | Single-Game Win Rate | Execution Time (50 games) | Strategy Description |
| :--- | :---: | :---: | :--- |
| **Greedy** | **48.0%** | **0.03s** | 1-step max exposed card count |
| **Heuristic** *(Default)* | **48.0%** | **0.03s** | Multi-factor evaluation (depth, red curse priority, waste preservation) |
| **BeamSearch (D=3, B=4)** | **52.0%** | **0.50s** | 3-step lookahead beam search over cloned game states |
| **DFS (Max 3k nodes)** | **60.0%** | **1.06s** | Exact solvability search with recursive backtracking & memoization |

---

## Simulation Scripts & CLI Flags

| Script                                               | Purpose                                               | CLI Flags |
| :--------------------------------------------------- | :---------------------------------------------------- | :--- |
| [`base_game_sim.py`](./base_game_sim.py)             | Part 1: single-game win/collapse rates (10k games)    | `--solver`, `--games`, `--seed` |
| [`campaign_rounds_sim.py`](./campaign_rounds_sim.py) | Part 2: campaign rounds to Perfect Win (2k campaigns) | `--solver`, `--campaigns`, `--max-rounds` |
| [`cursed_tomb_sim.py`](./cursed_tomb_sim.py)         | Core simulation engine & campaign runner              | `--solver`, `--difficulty`, `--campaigns` |
| [`sweep_thresholds.py`](./sweep_thresholds.py)       | Cross-difficulty threshold sweep                      | `--solver`, `--campaigns`, `--max-rounds` |
| [`test_solvers.py`](./test_solvers.py)               | Part 4: solver benchmark comparison                   | `--games`, `--redraws`, `--seed` |

To run the solver benchmark:
```bash
python3 test_solvers.py --games 50
```

To run a campaign difficulty sweep with the Heuristic solver:
```bash
python3 sweep_thresholds.py --campaigns 50 --solver heuristic
```
