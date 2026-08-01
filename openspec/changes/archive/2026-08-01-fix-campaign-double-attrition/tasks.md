# Tasks: Fix Campaign Double Attrition

## Tasks

- [x] 1.1 Refactor `advanceCampaignRound` in `src/game.ts` to prevent duplicate calls to `applyEndOfWeekLifecycle`.
- [x] 1.2 Verify `App.tsx` campaign round advance handler passes the updated campaign state cleanly.
- [x] 2.1 Add unit tests in `src/game.test.ts` to verify `advanceCampaignRound` increments attrition by exactly 1 per round loss.
- [x] 2.2 Run full test suite and verify build passes cleanly.
