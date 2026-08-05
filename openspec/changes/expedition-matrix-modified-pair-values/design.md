## Context

In Pyramid Solitaire, complement pairs sum to 13 (Kings=13 solo, Q+A, J+2, 10+3, 9+4, 8+5, 7+6). In standard mode, card ranks never change. However, in Expedition Mode (`cursed-tomb`), cards acquire Scars and Curses that shift their functional rank values (`+1` for Red, `-1` for Black), as well as Blessings (Clubs Rally wildcard).

Currently, `getRemainingPairStats` calculates active card counts strictly by `card.rank`, leading to misleading pair counts when cards have shifted values (e.g., counting a Red Queen as a 12 needing an Ace, when it actually functions as a 13 and clears solo).

## Goals / Non-Goals

**Goals:**
- Compute remaining complement pair counts using each active card's functional value (`getFunctionalValue(card, mode)`) when in Expedition Mode.
- Provide visual shift badges/chips in `MatchedCardsModal` pair cards to inform the player when active cards have shifted values into or out of that pair slot.
- Display a wildcard indicator when the Clubs Blessed card is active in the deck.
- Maintain exact existing calculations and visual representation in Standard Mode.

**Non-Goals:**
- Changing standard mode pair statistics logic or UI.
- Modifying game matching mechanics (this is purely visual/stat tracking in Expedition Deck & Stats modal).

## Decisions

### 1. Mode-Aware Functional Rank Counts in `getRemainingPairStats`
- **Decision**: Update `getRemainingPairStats(state: GameState)` (and/or `getActiveRankCounts`) to accept game mode and optional `masterDeck` state.
- **Rationale**: When mode is `cursed-tomb`, cards in active piles (pyramid, drawPile, discardPile) will be counted by `getFunctionalValue(card, mode)` rather than `card.rank`.
- **Alternatives Considered**: Creating a completely separate function for expedition pair stats vs updating `getRemainingPairStats`. Updating `getRemainingPairStats` to support optional mode parameter avoids code duplication and allows callers (like `App.tsx` and `MatchedCardsModal.tsx`) to seamlessly receive mode-accurate stats.

### 2. PairStat Data Model Enhancement
- **Decision**: Extend `PairStat` interface with optional fields for Expedition Mode:
  - `functionalModifications1?: string[]`: Human-readable summary of cards modified in rank 1 (e.g., `["+1 Red Q ➔ K"]`).
  - `functionalModifications2?: string[]`: Human-readable summary of cards modified in rank 2.
  - `hasWildcard?: boolean`: True if a wildcard blessing (e.g., Clubs Rally) is currently active.
- **Rationale**: Keeps rendering logic in `MatchedCardsModal` clean and declarative without duplicating rank-shift math inside the React component.

### 3. Visual Layout in `MatchedCardsModal`
- **Decision**:
  - Render an Expedition badge in the "Remaining Complement Pairs (Sums to 13)" section header when in `cursed-tomb` mode: `⚡ Functional Pair Odds`.
  - Display compact badge chips inside pair cards for any active modified cards (e.g. `⚡ 1 Red Q ➔ K`).
  - Render a `♣ Wildcard Active` pill in the section header when the Clubs Blessed card is active.

## Risks / Trade-offs

- **[Risk]** Players might be confused if base printed cards don't match standard pair categories.
  - **Mitigation**: Add clear tooltip and shift annotation pills (e.g., `1 Red Q ➔ K`) directly inside the pair cards, explicitly explaining why the count reflects functional rank.
- **[Risk]** Entombed cards incorrectly counted in pair stats.
  - **Mitigation**: Entombed cards (attrition stage 5) are excluded from `drawPile`, `discardPile`, and active `pyramid` cards, ensuring they are not counted in active functional pair counts.
