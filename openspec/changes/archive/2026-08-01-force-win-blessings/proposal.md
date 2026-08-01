## Why

Currently, clicking the "Force Loss" debug button triggers a pyramid collapse state where unremoved bottleneck cards accumulate attrition (curses/scars). However, clicking "Force Win" clears all remaining pyramid cards without recording a `lastClearedPair`. As a result, `applyEndOfWeekLifecycle` sees an empty `lastClearedPair` and fails to apply end-of-round Hero blessings or Anchor rewards during Cursed Tomb campaign mode testing.

Updating "Force Win" to automatically identify and record a synthetic `lastClearedPair` from the remaining pyramid cards before clearing them will ensure campaign mode testing accurately triggers Hero blessings and Anchor rewards upon force-winning a round.

## What Changes

- Modify `forceWin(state)` in `src/solver.ts` to inspect remaining unremoved pyramid cards before clearing them.
- Look for a valid pair summing to 13 (or a single King) among remaining cards to set as `lastClearedPair`.
- If no natural 13-pair exists, pick the 2 highest-value (or exposed) remaining pyramid cards as `lastClearedPair` (or 1 card if only 1 remains).
- Preserve existing `lastClearedPair` if the pyramid is already completely cleared prior to calling `forceWin`.
- Update `debug-autoplay-panel` spec scenario to specify that Force Win populates `lastClearedPair` so end-of-round blessings and rewards are processed.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `debug-autoplay-panel`: Specify that Force Win sets `lastClearedPair` from remaining pyramid cards prior to clearing the board, ensuring end-of-round lifecycle blessings and rewards are applied in campaign mode.

## Impact

- `src/solver.ts`: Updates `forceWin(state)` logic to set `lastClearedPair`.
- `src/game.ts` / `src/App.tsx`: `applyEndOfWeekLifecycle` now naturally receives a valid `lastClearedPair` when `forceWin` is triggered, applying 1 Blessing (Hero) and 1 Reward (Anchor).
- `src/solver.test.ts` / `src/game.test.ts`: Automated tests for `forceWin` asserting `lastClearedPair` population and campaign lifecycle blessing application.
