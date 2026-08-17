## Why

The Python simulation includes a stochastic `NoviceSolver` to model beginner human player mistakes (stock blindness, overlooking solo King removals, ignoring the Diamond Vault, and noisy decision-making). However, the in-browser UI Debug Panel currently only exposes `greedy`, `smart`, and `perfect` solver strategies. Porting the novice solver to the TypeScript UI engine allows developers and game designers to visually observe novice player heuristics, failure points, and simulated campaign runs directly in the UI.

## What Changes

- Add `'novice'` as a supported `SolverStrategy` in the TypeScript solver engine (`src/solver.ts`).
- Implement `findNextNoviceMove(state)` in `src/solver.ts` mimicking the Python simulation's error rates (configurable or calibrated defaults: 30% miss stock pair, 50% ignore vault, 30% miss King, 20% random move choice, noisy greedy heuristic).
- Add the `Novice (Stochastic Beginner)` option to the Debug & Autoplay panel dropdown in `src/components/DebugPanel.tsx`.
- Update `useAutoplay` hooks and test suites to validate that the novice solver dispatches correctly, makes legal moves, and handles edge cases without locking up.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `debug-autoplay-panel`: Extends multi-strategy solver support and UI strategy selector to include the `novice` strategy alongside `greedy`, `smart`, and `perfect`.

## Impact

- `src/solver.ts`: Updates `SolverStrategy` type union and adds novice move search/stochastic filtering logic.
- `src/components/DebugPanel.tsx`: Adds `<option value="novice">` to Strategy select input.
- `src/hooks/useAutoplay.ts`: Supports `'novice'` as a valid strategy string.
- `src/solver.test.ts`: Adds test coverage for novice solver dispatching and fallback behavior.
