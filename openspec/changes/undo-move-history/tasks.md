## 1. Core Engine & History State

- [ ] 1.1 Add `history?: GameState[]` to `GameState` interface and initialize it as empty array in `initializeGame` and `startGame` in `src/game.ts`.
- [ ] 1.2 Update state-modifying actions (`playCard`, `drawCard`, `cyclePile`) in `src/game.ts` to record previous `GameState` snapshots in `history`.
- [ ] 1.3 Implement `undo(state: GameState): GameState` function in `src/game.ts` to restore the most recent snapshot.
- [ ] 1.4 Add unit tests in `src/game.test.ts` for move recording, single and multi-step undoing, and undoing on empty history.

## 2. Persistence Layer Updates

- [ ] 2.1 Update `StoredGameState` and `PersistenceManager` in `src/storage/persistence.ts` to preserve `history` snapshots when saving/loading.
- [ ] 2.2 Add unit tests in `src/storage/persistence.test.ts` for history persistence across reload cycles.

## 3. UI Controls & Keyboard Shortcuts

- [ ] 3.1 Add Undo button to `GameSidebar.tsx` / controls with enabled/disabled state based on history availability.
- [ ] 3.2 Bind global keyboard listeners (`Ctrl+Z`, `Cmd+Z`, `U`) in `App.tsx` to trigger `undo`.
- [ ] 3.3 Verify UI integration, button disabling, and keyboard shortcuts.
