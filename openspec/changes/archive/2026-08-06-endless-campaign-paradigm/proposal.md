## Why

Simulation analysis revealed that *The Cursed Tomb* is fundamentally an endless deck-building/deck-mutating survival game rather than a race to a rigid victory screen. On lower difficulties (Novice/Explorer), 98%+ of campaigns maintain a solvable deck state indefinitely as players accumulate Anchors and Blessings, while higher difficulties feature a natural survival race against attrition before active cards drop below 28. 

We need to reframe the campaign model in rules, simulations, and the digital game:
1. **Starvation (< 28 active cards)** is the sole physical game end condition.
2. Accomplishments like **Perfect Win** (clearing all 52 cards) and **Rank-Anchor Victory** (anchoring all 13 ranks) are celebrated as in-game **Achievements / Accomplishments** that grant badges, metrics, and score awards without forcing the campaign to end.
3. Defeat checks like **Volatile Collapse** become **Advisory Deck Health Warnings** in the UI rather than forced game-over locks.

## What Changes

- **Modified Campaign Lifecycle**: Campaigns continue indefinitely past Perfect Wins and Rank-Anchor accomplishments until active deck size drops below 28 cards.
- **Starvation Sole Terminal Condition**: Starvation (`active_cards < 28`) is established as the sole hard defeat condition.
- **Advisory Volatile Collapse**: Volatile Collapse (all 4 of a rank entombed) is refactored from a forced game-over state into an advisory **Deck Health Warning** metric ("High Volatility Warning").
- **Digital Achievements & Run Metrics System**: The web app tracks `Perfect Wins`, `Rank-Anchor Badges`, `Pyramids Cleared`, `Rounds Survived`, and `Deck Health Percentage` during and after campaigns.
- **Updated Campaign Simulations**: Simulation scripts (`cursed_tomb_sim.py`, `sweep_thresholds.py`) are updated to evaluate endurance metrics (`Rounds Survived`, `Total Pyramids Cleared`, `Achievements Earned`).

## Capabilities

### New Capabilities
- `campaign-achievements`: Digital achievements and run metrics system tracking Perfect Wins, Rank-Anchor accomplishments, pyramids cleared, and rounds survived.

### Modified Capabilities
- `cursed-tomb-campaign`: Refactor campaign end conditions so Starvation is the sole physical game end, while Perfect Win, Rank-Anchor, and Volatile Collapse become accomplishments/advisory warnings.

## Impact

- **Spec changes**: `specs/cursed-tomb-campaign/spec.md` and new `specs/campaign-achievements/spec.md`.
- **Frontend changes**: Update `src/game.ts`, `src/components/RoundSummaryModal.tsx`, `src/components/CampaignEndModal.tsx`, and state interfaces to track achievements and display advisory warnings.
- **Simulation changes**: Update `sim/cursed_tomb_sim.py` and `sim/sweep_thresholds.py` to match the endless survival campaign paradigm.
