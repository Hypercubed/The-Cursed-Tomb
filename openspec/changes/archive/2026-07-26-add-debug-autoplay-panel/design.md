## Context

Manual testing of Pyramid Solitaire edge cases, state persistence, win/loss conditions, and UI responsiveness currently requires manually playing complete 52-card games. To streamline testing, developers and testers need automated play capabilities and instant state triggers.

## Goals / Non-Goals

**Goals:**
* Implement a standalone `findNextGreedyMove(state)` solver function in `src/solver.ts` to analyze visible cards and return the next optimal action.
* Implement a custom `useAutoplay` hook in React that manages step execution intervals, auto-pausing when games finish or deadlock occurs.
* Add a collapsible `DebugPanel` component inside `GameSidebar` with:
  * Force Win / Force Loss buttons.
  * Step 1 Move button.
  * Start/Pause Autoplay button & Speed selector (50ms vs 200ms vs 500ms).
  * Autoplay metrics counter (move count, status).

**Non-Goals:**
* Implementing an optimal multi-turn lookahead/backtracking solver (greedy 1-step matching is sufficient for rapid test play).
* Production-only analytics tracking for solver play.

## Decisions

### 1. Separate Solver Module (`src/solver.ts`)
* **Decision**: Implement solver logic in a separate pure module rather than inside `src/game.ts`.
* **Rationale**: Keeps core game rules decoupled from dev/testing utilities, making solver logic easy to unit test independently.

### 2. Force Win / Loss via Functional State Mutators
* **Decision**: Add helper functions in `src/game.ts` (or `src/solver.ts`) to produce instant won/lost states (`forceWin(state)`, `forceLoss(state)`).
* **Rationale**: Preserves game engine state shape and guarantees persistence handlers react cleanly to state transitions.

### 3. Sidebar Integration
* **Decision**: Place the `DebugPanel` as a dedicated section in `GameSidebar.tsx`.
* **Rationale**: Gives testers immediate access alongside existing game setup and status controls without requiring hidden modal triggers.

## Risks / Trade-offs

* **[Risk]** Autoplay could loop indefinitely if a deadlocked deck is not properly detected.
  * **Mitigation**: Solver returns `null` when no moves or draws are available, triggering immediate pause in `useAutoplay`.
* **[Risk]** Autoplay state updates might collide with manual user clicks during active play.
  * **Mitigation**: Disable manual card selection buttons or clear selection when Autoplay is actively stepping.
