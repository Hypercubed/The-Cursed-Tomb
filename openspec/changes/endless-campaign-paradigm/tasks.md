## 1. Core Game Engine Refactoring (`src/game.ts`)

- [x] 1.1 Update `CampaignState` interfaces to include `achievements` object (`roundsSurvived`, `pyramidsCleared`, `perfectWins`, `rankAnchorUnlocked`, `unlockedBadges`) and `volatilityWarning` boolean flag
- [x] 1.2 Update `checkCampaignEnd()` so that `starvation` (`active_cards < 28`) is the sole physical defeat trigger for `CampaignEndModal`
- [x] 1.3 Modify Perfect Win and Rank-Anchor evaluation in `src/game.ts` to record accomplishment badges/metrics and allow campaign round progression to continue
- [x] 1.4 Refactor Volatile Collapse check (4 of a rank entombed) to set an advisory `volatilityWarning` status rather than triggering instant game over

## 2. Frontend UI & Accomplishment Badges (`src/components/`)

- [x] 2.1 Update `RoundSummaryModal.tsx` to display campaign achievement badges, Deck Health %, and advisory volatility warnings
- [x] 2.2 Update `CampaignEndModal.tsx` to show final run summary stats (`Rounds Survived`, `Pyramids Cleared`, `Perfect Wins`, `Deck Health %`) upon Starvation defeat
- [x] 2.3 Add voluntary "Retire Campaign" option to the summary modal allowing players to manually seal their tomb and view final stats

## 3. Simulation Scripts Alignment (`sim/`)

- [x] 3.1 Update `sim/cursed_tomb_sim.py` `run_campaign()` to run until Starvation (< 28 cards) or safety round cap, recording `pyramids_cleared`, `perfect_wins`, and `rank_anchor_unlocked_round`
- [x] 3.2 Update `sim/sweep_thresholds.py` to output endurance statistics (`mean rounds survived`, `pyramids cleared per campaign`, `achievement rates`)

## 4. Verification & Testing

- [x] 4.1 Run unit test suite `npm test` and resolve any test assertions reflecting old binary victory/collapse assertions
- [x] 4.2 Run Python simulation sweep test to confirm clean execution under the new endless campaign rules
