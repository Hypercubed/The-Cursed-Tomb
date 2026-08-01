## 1. Core Engine & History State

- [ ] 1.1 Add `history?: GameState[]` and `future?: GameState[]` fields to `GameState` interface and initialize them as empty arrays in `initializeGame` / `startGame` in `src/game.ts`.
- [ ] 1.2 Update state-modifying functions (`playCard`, `drawCard`, `cyclePile`) in `src/game.ts` to push pruned state snapshots to `history` and clear `future`.
- [ ] 1.3 Implement `undo(state: GameState): GameState` and `redo(state: GameState): GameState` reducer functions in `src/game.ts`.
- [ ] 1.4 Add comprehensive unit tests in `src/game.test.ts` for move recording, single/multi-step undoing, redoing, and future invalidation on new move.

## 2. Debug Panel Controls Integration

- [ ] 2.1 Add `onUndo?: () => void` and `onRedo?: () => void` props to `DebugPanel.tsx`.
- [ ] 2.2 Render Undo and Redo debug buttons in `DebugPanel.tsx` under a "Time Travel" / history controls section with appropriate disabled states.
- [ ] 2.3 Connect `onUndo` and `onRedo` in `src/App.tsx` to dispatch `undo` and `redo` actions to the game state.

## 3. Verification

- [ ] 3.1 Verify persistence compatibility in `src/storage/persistence.ts` to ensure smooth serialization.
- [ ] 3.2 Run test suite (`npm test`) and verify all game engine and debug panel tests pass.
