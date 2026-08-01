# Design: Fix Double Attrition on Campaign Round Advance

## Problem Analysis

In `App.tsx`:
1. When `game.status` becomes `'pyramid-collapse'`, `useEffect` calls `recordOutcome` and then:
   ```ts
   const nextCampaignState = applyEndOfWeekLifecycle(activeCampaign);
   setCampaign(nextCampaignState);
   ```
   This mutates the master deck in `nextCampaignState`, advancing bottleneck cards from Stage 0 to Stage 1.

2. When the user clicks "Start Next Round" in `RoundSummaryModal`, `handleNextCampaignRound` calls:
   ```ts
   const nextCampaign = advanceCampaignRound(campaign);
   ```

3. Inside `advanceCampaignRound(campaign)` in `src/game.ts`:
   ```ts
   export function advanceCampaignRound(campaign: CampaignState): CampaignState {
     const updatedCampaign = applyEndOfWeekLifecycle(campaign);
     ...
   }
   ```
   Because `campaign` passed into `advanceCampaignRound` ALREADY had `applyEndOfWeekLifecycle` run on it (the cards in `masterDeck` are already at Stage 1), calling `applyEndOfWeekLifecycle` a second time sees `currentRound.status === 'pyramid-collapse'` and increments the `attritionStage` of those same bottleneck cards a second time (to Stage 2).

## Technical Solution

1. In `src/game.ts`, modify `advanceCampaignRound(campaign: CampaignState)` so that it does not re-invoke `applyEndOfWeekLifecycle`. Since `campaign` has already had `applyEndOfWeekLifecycle` applied when setting up the round summary modal state, `advanceCampaignRound` should directly initialize the new round (`initializeGame`) using `campaign.masterDeck` and `campaign.graveyard`.
2. Alternatively, ensure `applyEndOfWeekLifecycle` checks if lifecycle changes have already been applied to `masterDeck` for `currentRound`, or ensure `advanceCampaignRound` operates on the updated campaign state without double-calling lifecycle hooks.
3. Add automated tests in `src/game.test.ts` to simulate completing a round with `applyEndOfWeekLifecycle` and then advancing with `advanceCampaignRound`, asserting that `attritionStage` advances by exactly 1.
