## Context

Currently, `stepToConclusion()` in `useAutoplay` runs a synchronous `while` loop that calls `findNextMove(state, strategy)` up to 250 times. In `perfect` solver mode or on large search spaces, each step evaluates thousands of DFS nodes. Running this synchronously on the main thread locks the UI completely, rendering no visual feedback and blocking user input. Additionally, `DebugPanel.tsx` computes deal winnability synchronously via `useMemo` on every render, adding stutters to UI operations.

## Goals / Non-Goals

**Goals:**
- Implement an asynchronous batch/yielding mechanism (`isThinking`) for instant solver execution so the main thread remains responsive at 60 FPS.
- Display a thematic `🔮 Divining path...` thinking badge in the Debug Panel whenever solver computation or winnability evaluation is in progress.
- Disable solver action buttons during calculation to avoid race conditions or duplicate execution triggers.
- Transition `evaluateWinnability` calculation into an asynchronous background effect/task so UI state updates and card interactions remain stutters-free.

**Non-Goals:**
- Building full Web Worker web worker dynamic bundling infrastructure (micro-task / `requestAnimationFrame` yielding is sufficient and zero-dependency).
- Changing solver search heuristics or game rule logic in `src/solver.ts`.

## Decisions

### 1. Async Micro-Batching in `useAutoplay`
- **Decision**: Replace synchronous `stepToConclusion` `while` loop with an async generator/batching runner using `setTimeout` or `requestAnimationFrame` micro-yields.
- **Rationale**: Gives React and the browser browser-repaint cycles between move batches, allowing the thinking badge to display instantly and frame rate to stay high.
- **Alternative Considered**: Web Worker thread. While Web Workers isolate execution completely, they introduce build setup complexity and serialization overhead for deep GameState objects.

### 2. Thinking State Indicator in `DebugPanel.tsx`
- **Decision**: Expose `isThinking` boolean state from `useAutoplay` (and winnability hook) and render a pulsing `🔮 Divining path...` indicator badge in the Debug Panel.
- **Rationale**: Informs the user that the solver is actively executing without giving the impression that the web page is frozen.

### 3. Async Winnability Status Hook
- **Decision**: Refactor winnability evaluation in `DebugPanel.tsx` (or custom hook) to run inside an asynchronous `useEffect` that updates local state upon completion.
- **Rationale**: Prevents heavy `solveBoard` graph traversals from running synchronously during React component render cycles.

## Risks / Trade-offs

- **[Risk] User cancels while instant solve is mid-computation**:
  - *Mitigation*: Ensure `isThinking` and autoplay cancellation flags clean up cleanly and break out of the async execution loop instantly.
- **[Risk] State updates out of order**:
  - *Mitigation*: Maintain `gameRef` references and cancel stale background winnability tasks when `game` state changes.
