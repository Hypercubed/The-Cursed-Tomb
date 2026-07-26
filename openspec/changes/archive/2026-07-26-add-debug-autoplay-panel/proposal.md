## Why

Manual testing of game win/loss flows, scoring, local storage persistence, and edge-case handling is currently slow because it requires playing through entire games by hand. Adding automated greedy solver play ("autoplay") and instant state jump tools will allow developers and testers to rapidly jump to end states and observe gameplay transitions.

## What Changes

* Add a greedy solver engine that identifies valid pyramid pair removals, single King plays, or draw/cycle actions automatically.
* Add an Autoplay controller with start, pause, step-by-step move, and configurable speed controls (e.g., 50ms fast, 200ms normal).
* Add a dedicated Debug & Autoplay section to the game sidebar (or dev environment) featuring:
  * Autoplay controls (Start, Pause, Step Move, Speed selection).
  * Instant state jump buttons (Force Win, Force Loss).
  * Autoplay metrics display (executed moves counter, deadlock detection).

## Capabilities

### New Capabilities
- `debug-autoplay-panel`: Automated greedy solver, autoplay step engine, and instant game-state debugging tools for manual testing.

### Modified Capabilities
<!-- None -->

## Impact

* **Frontend Components**: `src/components/GameSidebar.tsx` or new `src/components/DebugPanel.tsx` component.
* **Game Logic**: New solver helper `src/solver.ts` or extensions to `src/game.ts`.
* **State Management / Hooks**: New `useAutoplay` hook in `src/App.tsx` or custom hook module.
