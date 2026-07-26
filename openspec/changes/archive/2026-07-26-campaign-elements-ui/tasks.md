## 1. Domain & Storage Updates

- [x] 1.1 Add `CampaignStats` types and update persistent storage helpers in `src/storage/statsStorage.ts`
- [x] 1.2 Update game outcome handlers in `src/App.tsx` to increment active campaign stats (`pyramidsExplored`, `pyramidsCollapsed`, `isVictory`, `totalAttempts`)

## 2. Sidebar & Confirmation Component Updates

- [x] 2.1 Update `GameSidebar.tsx` to display an Active Campaign section tracking Pyramids Explored, Pyramids Collapsed, and Campaign Victory status
- [x] 2.2 Reframe "Reset" button to "New Campaign" in `GameSidebar.tsx`
- [x] 2.3 Update `ResetConfirmationModal.tsx` message to confirm starting a new campaign and wiping active campaign stats

## 3. Verification & Testing

- [x] 3.1 Run tests and type checks (`npm test`, `npm run build`) to ensure campaign stats logic compiles and passes tests
- [x] 3.2 Verify campaign UI state transitions visually across game wins, losses, partial clears, and resets
