## 1. Game Core Engine Updates

- [x] 1.1 Update `GameState['status']` type in `src/game.ts` to `'ready' | 'in-progress' | 'complete-victory' | 'partial-victory' | 'pyramid-collapse'` and remove `WinCondition` type and `winCondition` property from `GameState`.
- [x] 1.2 Refactor `checkForWin()` in `src/game.ts` to evaluate Option A end states (`complete-victory`, `partial-victory`, `pyramid-collapse`).
- [x] 1.3 Update game initialization and turn execution functions in `src/game.ts` to work without `winCondition`.
- [x] 1.4 Update unit tests in `src/game.test.ts` and `src/solver.ts` to test the new status outcomes.

## 2. Persistence & Storage Updates

- [x] 2.1 Update `StoredSettings` and `StoredStats` interfaces in `src/storage/persistence.ts` to track `completeVictories`, `partialVictories`, and `pyramidCollapses` while removing `selectedWinCondition`.
- [x] 2.2 Add legacy storage data migration/fallback logic in `PersistenceManager` for existing local storage payloads.
- [x] 2.3 Update unit tests in `src/storage/persistence.test.ts` to verify storage saving and migration.

## 3. UI & Component Integration

- [x] 3.1 Remove win condition selection dropdown and props from `src/components/GameSidebar.tsx`.
- [x] 3.2 Update statistics display in `GameSidebar.tsx` to present Complete Victories, Partial Victories, and Pyramid Collapses.
- [x] 3.3 Update `src/App.tsx` status display badges and game flow handlers to respond to the new end states.

## 4. Verification

- [x] 4.1 Run full test suite (`npm test` / `vitest`) to ensure all game logic, persistence, and solver tests pass.
- [x] 4.2 Run app build (`npm run build`) to ensure type safety across all components.
