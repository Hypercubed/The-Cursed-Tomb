# Base Game Simulation Results

**The Cursed Tomb** — Pyramid Solitaire base game (no legacy mechanics)
Simulated with [`cursed_tomb_sim.py`](./cursed_tomb_sim.py) and supporting scripts.

> **Player strategy:** Greedy heuristic — always take the move that exposes the most new pyramid cards.
> **Legacy mechanics disabled:** scars, curses, blessings, attrition all off (matching the current web UI).
> **Seed:** 42 (reproducible runs)

---

## Part 1 — Single-Game Win & Collapse Rates

> **Command to reproduce:** `python3 base_game_sim.py`

Each game is one round of pyramid solitaire. A **Win** means all pyramid cards were cleared (partial or complete victory). A **Collapse** means the player ran out of legal moves with no draws or redraws remaining.

**Sample size:** 10,000 games per setting

| UI Redraw Setting | Redraws | Win Rate | Collapse Rate |
| :---------------- | :-----: | :------: | :-----------: |
| 0 redraws         |    0    |  0.61%   |    99.39%     |
| 1 redraw          |    1    |  12.25%  |    87.75%     |
| 2 redraws         |    2    |  33.66%  |    66.34%     |
| Infinite          |    ∞    |  40.67%  |    59.33%     |

### Observations

- **0 redraws is brutally hard.** A single pass through the 24-card stock almost never exposes enough cards to clear all 28 pyramid positions.
- **Each redraw has large marginal value.** Going from 0→1 redraws is a 20× improvement; 1→2 redraws nearly triples win rate again.
- **Infinite redraws plateaus at ~41%.** The greedy heuristic creates board states it can't escape even with unlimited re-passes, because it doesn't look ahead.
- **The gap from 2→∞ is small (~7%).** Most of the practical benefit from redraws is captured within two cycles.

---

## Part 2 — Campaign Rounds to Perfect Win

> **Command to reproduce:** `python3 campaign_rounds_sim.py --campaigns 1000 --difficulty [difficulty] --max-rounds 200`

The rules define the campaign victory condition as a **Perfect Win**: all 52 cards (pyramid *and* stock/waste) cleared in a single round. This is harder than a standard pyramid clear.

Since the base game has no attrition mechanics, **the tomb never collapses** — there is no starvation and no entombment. Every non-victory within the cap is a timeout (the campaign just keeps going).

**Sample size:** 1,000 campaigns per setting, max 200 rounds each

| Difficulty        | Redraws | Win Rate (200 rds) | Avg Rounds to Win | Median Rounds |
| :---------------- | :-----: | :----------------: | :---------------: | :-----------: |
| Survivalist       |    0    |        0.0%        |         —         |       —       |
| Archaeologist     |    1    |        6.4%        |       104.5       |      98       |
| Explorer          |    2    |       21.2%        |       98.9        |      98       |
| Novice (Infinite) |    ∞    |       25.2%        |       93.1        |      83       |

### Observations

- **Survivalist cannot win a campaign.** With a single pass through the stock, the greedy heuristic never clears all 52 cards in any of 1,000 × 200 = 200,000 rounds attempted.
- **Archaeologist wins are late.** With 1 redraw, 6.4% of campaigns win within 200 rounds, with a median of 98 rounds. 92.2% of wins occur after round 20.
- **Explorer wins are significantly more common but still late.** With 2 redraws, 21.2% of campaigns win within 200 rounds, with a median of 98 rounds. 91.0% of wins occur after round 20.
- **Novice has the best win rate and fastest wins.** With infinite redraws, 25.2% of campaigns win within 200 rounds, with a median of 83 rounds. 87.7% of wins occur after round 20. The move cap (2000 moves per round) prevents runaway cycling, making simulation practical.

---

## Part 3 — Full Rules Campaign (All Legacy Mechanics Enabled)

> **Command to reproduce:** `python3 cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty [difficulty]`

This section simulates campaigns with **all Cursed Tomb rules active**: scars, curses, blessings, and attrition tracking. Unlike Part 2, campaigns can now end in **Collapse** (starvation when fewer than 28 active cards remain) as well as Victory.

**Sample size:** 1,000 campaigns per difficulty, max 1,000 rounds each

| Difficulty    | Redraws | Victory Rate | Collapse Rate | Avg Rounds to Win | Avg Rounds to Collapse | Overall Avg Resolve |
| :------------ | :-----: | :----------: | :-----------: | :---------------: | :--------------------: | :-----------------: |
| Survivalist   |    0    |    0.00%     |    100.00%    |         —         |     260.4 ± 166.4      |    260.4 ± 166.4    |
| Archaeologist |    1    |    2.60%     |    97.40%     |   151.7 ± 86.4    |     274.6 ± 179.3      |    271.4 ± 179.2    |
| Explorer      |    2    |    7.80%     |    92.20%     |   149.3 ± 103.7   |     285.5 ± 182.2      |    274.9 ± 182.1    |
| Novice        |    ∞    |    10.50%    |    89.50%     |   143.2 ± 95.8    |     286.0 ± 179.4      |    271.0 ± 182.2    |

### Observations

- **Engine Alignment & Multi-Pass Recycling:** Updating the simulator to allow full pass recycling (while preventing infinite zero-clear loops) allows campaigns to model the in-game engine's multi-pass card pairing accurately, resolving campaigns over ~270 rounds on average.
- **Separate Win vs. Collapse Metrics:** Reporting Victory and Collapse rounds separately highlights the campaign dynamics. Winning campaigns resolve in ~143–152 rounds, while Starvation Collapses unfold over ~260–286 rounds as deck liquidity degrades.
- **High Standard Deviation Across Campaigns:** Standard deviations for both wins (±86–104 rounds) and collapses (±166–182 rounds) are large, explaining why individual campaign experiences vary widely in length.
- **Black Curse & Blessing Synergy:** Black Curse recycling into stock, Hearts waste reshuffling, and Spades tunnel transfers maintain deck liquidity, sustaining campaign playability over hundreds of rounds.

---

## Simulation Scripts

| Script                                               | Purpose                                               |
| :--------------------------------------------------- | :---------------------------------------------------- |
| [`base_game_sim.py`](./base_game_sim.py)             | Part 1: single-game win/collapse rates (10k games)    |
| [`campaign_rounds_sim.py`](./campaign_rounds_sim.py) | Part 2: campaign rounds to Perfect Win (2k campaigns) |
| [`cursed_tomb_sim.py`](./cursed_tomb_sim.py)         | Core simulation engine (shared)                       |

To reproduce Part 1:
```bash
python3 base_game_sim.py
```

To reproduce Part 2:
```bash
python3 campaign_rounds_sim.py
```
