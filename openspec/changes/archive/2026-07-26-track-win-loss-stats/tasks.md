## 1. Storage & Persistence

- [x] 1.1 Add `StoredStats` interface, `cursed_tomb_stats` key, and default stats to `src/storage/persistence.ts`
- [x] 1.2 Implement `getStats()`, `saveStats()`, `recordWin()`, `recordLoss()`, and `resetStats()` in `PersistenceManager`
- [x] 1.3 Add unit tests for stats persistence and recovery in `src/storage/persistence.test.ts`

## 2. Component & UI Implementation

- [x] 2.1 Create `ResetConfirmationModal.tsx` component with tomb-styled dialog UI
- [x] 2.2 Update `GameSidebar.tsx` to display Wins, Losses, Win Rate %, and Streak metrics in the Status section
- [x] 2.3 Wire Reset button in `GameSidebar.tsx` to trigger the confirmation modal

## 3. Game State Integration & Verification

- [x] 3.1 Integrate stats state in `App.tsx`, triggering automatic win/loss stat updates on game completion
- [x] 3.2 Add outcome guard to ensure each game session records its win/loss result exactly once
- [x] 3.3 Connect confirmation modal actions in `App.tsx` to reset active game state and stats
- [x] 3.4 Verify unit tests and manually test win/loss recording and reset modal behavior

