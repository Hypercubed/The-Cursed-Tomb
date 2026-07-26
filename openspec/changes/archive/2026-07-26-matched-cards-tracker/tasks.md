## 1. Game Helper Logic & State Computations

- [x] 1.1 Implement helper functions in `src/game.ts` to compute active vs removed cards set and removed count out of 52.
- [x] 1.2 Implement helper function in `src/game.ts` to calculate remaining count per rank and complement pair counts.
- [x] 1.3 Add unit tests in `src/game.test.ts` for removed card counts and pair statistics.

## 2. Matched Cards Vault Modal Component

- [x] 2.1 Create `src/components/MatchedCardsModal.tsx` displaying the 4×13 suit/rank card matrix and remaining pair statistics.
- [x] 2.2 Add accessible modal controls (overlay backdrop, close button, Esc key listener) and ancient tomb visual styling.

## 3. Sidebar Integration & Application State

- [x] 3.1 Update `src/components/GameSidebar.tsx` to include the "Cards Removed" status counter and "Matched Cards Vault" trigger button.
- [x] 3.2 Update `src/App.tsx` to manage modal visibility state and pass removed card metrics to components.
- [x] 3.3 Verify full integration with unit and build tests (`npm run build`).
