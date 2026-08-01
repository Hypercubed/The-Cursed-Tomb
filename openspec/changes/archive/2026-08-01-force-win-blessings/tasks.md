## 1. Implement Synthetic Last Cleared Pair in `forceWin`

- [x] 1.1 Update `forceWin(state, complete)` in `src/solver.ts` to inspect remaining unremoved cards in `state.pyramid` before clearing them.
- [x] 1.2 Implement logic to find a valid 13-pair or fall back to top 2 highest-value remaining cards (or single card if 1 remains) and assign to `nextState.lastClearedPair`.

## 2. Automated Tests & Verification

- [x] 2.1 Add unit tests in `src/solver.test.ts` verifying that `forceWin` populates `lastClearedPair` from remaining pyramid cards.
- [x] 2.2 Add unit test in `src/game.test.ts` verifying that triggering `forceWin` followed by `applyEndOfWeekLifecycle` awards 1 Hero Blessing and 1 Anchor Reward in campaign mode.
- [x] 2.3 Run full test suite and verify build passes cleanly.
