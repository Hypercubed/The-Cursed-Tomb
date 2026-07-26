## 1. Asynchronous Solver Engine (`src/hooks/useAutoplay.ts`)

- [x] 1.1 Add `isThinking` state and export it from `useAutoplay` hook.
- [x] 1.2 Refactor `stepToConclusion` to execute solver moves asynchronously in batches using `setTimeout` micro-yields to prevent UI freezing.
- [x] 1.3 Add cancellation support so `stop()` or pausing instantly halts active async solver loops.

## 2. Async Winnability Evaluation & Debug UI (`src/components/DebugPanel.tsx`)

- [x] 2.1 Refactor winnability computation to run asynchronously in a background `useEffect` and store `isEvaluating` state.
- [x] 2.2 Add thematic `🔮 Divining path...` thinking indicator badge to the Debug Panel status section.
- [x] 2.3 Disable Step, Strategy selector, and Force trigger buttons while `isThinking` or `isEvaluating` is true.

## 3. Verification & Testing

- [x] 3.1 Write unit tests in `src/hooks/useAutoplay.test.ts` verifying async step execution and `isThinking` state transitions.
- [x] 3.2 Verify manual UI performance during Instant mode solving and ensure main thread does not lock up.

