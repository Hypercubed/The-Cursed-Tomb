## 1. Solver & Core Utilities

- [x] 1.1 Implement `findNextGreedyMove(state)` helper in `src/solver.ts` prioritizing King removals, pyramid pairs, pyramid/discard pairs, and draw/cycle actions
- [x] 1.2 Implement helper function `forceWin(state)` and `forceLoss(state)` in `src/solver.ts` or `src/game.ts`
- [x] 1.3 Add unit tests in `src/solver.test.ts` for single King plays, pair matches, draw decisions, and deadlock detection

## 2. Autoplay Hook & UI Components

- [x] 2.1 Implement custom `useAutoplay` hook in `src/hooks/useAutoplay.ts` managing play/pause state, interval timer, and step execution
- [x] 2.2 Create `DebugPanel` component in `src/components/DebugPanel.tsx` with Force Win, Force Loss, Step Move, Autoplay Start/Pause, and Speed controls
- [x] 2.3 Integrate `DebugPanel` into `GameSidebar.tsx` and wire handlers into `src/App.tsx`

## 3. Verification & Testing

- [x] 3.1 Verify automated solver play completes valid games and halts cleanly on win or loss
- [x] 3.2 Verify Force Win and Force Loss buttons trigger correct game status overlays and local storage persistence updates
- [x] 3.3 Run unit and integration tests (`npm test` / `npx vitest`) to ensure zero regressions
