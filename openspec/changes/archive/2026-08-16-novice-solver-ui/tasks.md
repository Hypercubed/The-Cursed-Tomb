## 1. Solver Engine Core

- [x] 1.1 Add `'novice'` to `SolverStrategy` type definition in `src/solver.ts`
- [x] 1.2 Implement `findNextNoviceMove(state: GameState)` with stochastic error filtering (missing stock pairs, missing kings, ignoring vault, noise jitter, and random fallback)
- [x] 1.3 Update `findNextMove` dispatcher to route `'novice'` strategy to `findNextNoviceMove`

## 2. UI & Autoplay Integration

- [x] 2.1 Add `Novice (Stochastic Beginner)` strategy option to the `<select>` in `src/components/DebugPanel.tsx`
- [x] 2.2 Verify `src/hooks/useAutoplay.ts` persists and executes the `novice` strategy during manual steps and autoplay loops

## 3. Testing & Verification

- [x] 3.1 Add unit tests in `src/solver.test.ts` covering novice strategy dispatch, legal move selection, and non-deadlocking fallback behavior
- [x] 3.2 Run test suite (`npm test`) to ensure all tests pass cleanly
