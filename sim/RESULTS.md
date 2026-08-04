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
| 2 redraws         |    2    |          31.07%          |             6.34%             |    68.93%     |
| Infinite          |    ∞    |          34.57%          |             6.81%             |    65.43%     |

### Observations

- **0 redraws remains very difficult.** A single pass through the 24-card stock exposes enough cards to clear the pyramid in 1.17% of games, and achieves Total Victory in 0.28%.
- **Total Victory (clearing all 52 cards) is significantly more achievable.** Under in-flight stock pairing rules, Total Victory reaches **6.81%** with infinite redraws (up from 0.12%), because exposed Stock cards can be matched directly with Waste or Pyramid cards before entering the Waste pile.
- **Each redraw provides substantial value.** Going from 0→1 redraws increases pyramid clear rate from 1.17% → 14.91% (a 12.7× improvement); 1→2 redraws more than doubles pyramid clear rate again to 31.07%.
- **Infinite redraws plateaus around ~35%.** Most of the practical benefit from redraws is captured within two cycles (31.07% vs 34.57%).

---

## Part 2 — Campaign Rounds to Perfect Win

> **Command to reproduce:** `python3 campaign_rounds_sim.py --campaigns 1000 --difficulty [difficulty] --max-rounds 500`

The rules define the campaign victory condition as a **Perfect Win**: all 52 cards (pyramid *and* stock/waste) cleared in a single round. This is harder than a standard pyramid clear.

Since the base game has no attrition mechanics, **the tomb never collapses** — there is no starvation and no entombment. Every non-victory within the cap is a timeout (the campaign just keeps going).

**Sample size:** 1,000 campaigns per setting, max 500 rounds each

| Difficulty        | Redraws | Win Rate (500 rds) | Avg Rounds to Win | Median Rounds |
| :---------------- | :-----: | :----------------: | :---------------: | :-----------: |
| Survivalist       |    0    |       75.7%        |       246.3       |      219      |
| Archaeologist     |    1    |       100.0%       |       27.5        |      19       |
| Explorer          |    2    |       100.0%       |       15.3        |      10       |
| Novice (Infinite) |    ∞    |       100.0%       |       14.5        |      10       |

---

## Part 3 — Full Rules Campaign (All Legacy Mechanics Enabled)

> **Command to reproduce:** `python3 cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty [difficulty] --solver heuristic`

This section simulates campaigns with **all Cursed Tomb rules active**: scars, curses, blessings, and attrition tracking. Unlike Part 2, campaigns can now end in **Collapse** (starvation when fewer than 28 active cards remain) as well as Victory.

**Sample size:** 1,000 campaigns per difficulty, max 1,000 rounds each

| Difficulty    | Redraws | Victory Rate | Collapse Rate | Avg Rounds to Win | Avg Rounds to Collapse | Overall Avg Resolve |
| :------------ | :-----: | :----------: | :-----------: | :---------------: | :--------------------: | :-----------------: |
| Survivalist   |    0    |    0.00%     |    100.00%    |         —         |     261.2 ± 167.3      |    261.2 ± 167.3    |
| Archaeologist |    1    |    6.90%     |    93.10%     |   124.9 ± 98.4    |     279.7 ± 186.7      |    269.0 ± 186.0    |
| Explorer      |    2    |    18.90%    |    81.10%     |   131.7 ± 103.0   |     297.0 ± 195.9      |    265.8 ± 194.2    |
| Novice        |    ∞    |    23.50%    |    76.50%     |   129.5 ± 101.6   |     297.0 ± 188.7      |    257.6 ± 186.5    |

---

## Part 4 — Solver Comparison (Greedy vs. Heuristic vs. BeamSearch vs. DFS)

> **Command to reproduce:** `python3 test_solvers.py --games 50 --redraws 2`

Comparative benchmark across identical deck seeds (Difficulty: Explorer / 2 redraws):

| Solver Policy | Single-Game Win Rate | Execution Time (50 games) | Strategy Description |
| :--- | :---: | :---: | :--- |
| **Greedy** | **42.0%** | **0.03s** | 1-step max exposed card count |
| **Heuristic** *(Default)* | **42.0%** | **0.03s** | Multi-factor evaluation (depth, red curse priority, waste preservation) |
| **BeamSearch (D=3, B=4)** | **46.0%** | **0.49s** | 3-step lookahead beam search over cloned game states |
| **DFS (Max 3k nodes)** | **56.0%** | **1.07s** | Exact solvability search with recursive backtracking & memoization |

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
