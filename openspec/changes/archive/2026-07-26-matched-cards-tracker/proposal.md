## Why

In Pyramid Solitaire, players match exposed cards summing to 13. Currently, players cannot easily see which cards have already been matched and removed from play, making it difficult to calculate card odds (e.g. whether a matching 5 remains for an exposed 8, or if all Kings are gone).

Adding a combined matched cards tracker—featuring a clear counter in the status sidebar and a detailed modal/drawer ("Tomb Vault") displaying cleared cards by suit/rank and remaining complement pairs—helps players make informed strategic choices and provides progress tracking.

## What Changes

- Add a **Cards Removed** counter in the status sidebar showing total cards removed (out of 52) and percentage cleared.
- Add an interactive button/trigger to open a **Matched Cards Vault** ("Tomb Vault") modal or slide-out drawer.
- Implement the **Tomb Vault** modal containing:
  - A full 4×13 suit and rank grid showing removed vs active status for every card in the deck.
  - A summary breakdown of remaining complement pairs (Kings, Q+A, J+2, 10+3, 9+4, 8+5, 7+6).
- Update game state helpers to compute total removed cards and removed status per card across pyramid, draw pile, and discard pile.

## Capabilities

### New Capabilities
- `matched-cards-tracking`: Displays the count of removed cards and an interactive Tomb Vault view showing detailed matched card matrix and pair counts.

### Modified Capabilities

## Impact

- `src/game.ts`: Add utility functions to compute removed cards and remaining rank/pair distributions.
- `src/components/GameSidebar.tsx`: Add "Cards Removed" counter and a button to open the Matched Cards Vault.
- `src/components/MatchedCardsModal.tsx`: New component to render the 4×13 suit matrix and remaining pair stats with the ancient tomb theme.
- `src/App.tsx`: Manage modal state and connect matched card data to UI components.
