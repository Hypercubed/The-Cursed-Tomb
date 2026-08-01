## Why

When completing or losing a round in Cursed Tomb campaign mode, `applyEndOfWeekLifecycle` is executed twice—first when recording the round outcome in `App.tsx` (to populate modal statistics), and a second time when `advanceCampaignRound` is called upon clicking "Start Next Round". As a result, bottleneck cards in a failed round suffer two attrition increments (moving from Stage 0 directly to Stage 2) for a single loss.

## What Changes

- Refactor `advanceCampaignRound` in `src/game.ts` to avoid re-applying `applyEndOfWeekLifecycle` when the current round outcome has already been processed.
- Ensure end-of-round lifecycle state transitions (attrition penalties and survival rewards) are applied strictly once per completed round.
- Add unit tests verifying that advancing a failed or won campaign round applies exactly 1 attrition step or reward step to affected cards.

## Capabilities

### Modified Capabilities
- `cursed-tomb-campaign`: Clarify requirement that end-of-round attrition penalties and survival rewards are applied exactly once per round transition.

## Impact

- `src/game.ts`: `advanceCampaignRound` logic updated.
- `src/App.tsx`: Ensured clean campaign state propagation between round summary modal and next round start.
- `src/game.test.ts`: Regression tests for round lifecycle transition.
