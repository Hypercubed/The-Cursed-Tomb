## Context

Pyramid Solitaire relies on tracking which cards are still in play vs removed to calculate pair availability (cards summing to 13). Currently, `GameState` in `src/game.ts` marks pyramid cards as `removed: true` when cleared, while removed draw/discard cards are filtered out of `drawPile` and `discardPile`.

To provide both quick reference and deep strategic insight without cluttering the main game layout, we design a 2-tier UI system:
1. A **Status Counter** in `GameSidebar.tsx` showing "Cards Removed: X / 52".
2. A **Matched Cards Tomb Vault** modal (`MatchedCardsModal.tsx`) showing a 4×13 grid (Spades, Hearts, Diamonds, Clubs × Ace to King) and a summary of remaining rank pair counts.

## Goals / Non-Goals

**Goals:**
- Provide clear helper functions in `src/game.ts` to compute:
  - Removed cards set (ids of removed cards across pyramid, draw, discard).
  - Breakdown of remaining cards per rank and complement pairs (13, 12+1, 11+2, 10+3, 9+4, 8+5, 7+6).
- Display a sleek "Cards Removed" line and a "View Matched Cards" button in `GameSidebar.tsx`.
- Create an accessible, styled modal component matching the ancient tomb dark fantasy theme (`#18130e`, gold/bronze accents).

**Non-Goals:**
- Modifying core game logic or win condition rules.
- Undo/redo step history of removals (out of scope for this change).

## Decisions

### 1. Deriving Removed Cards from GameState
- **Decision**: Derive removed card status on-the-fly rather than mutating `GameState` schema, to maintain full backward compatibility with persistence and existing tests.
- **Helper logic**:
  - Active card IDs = `[...pyramid.flat().filter(c => !c.removed), ...drawPile, ...discardPile].map(c => c.id)`
  - A card is removed if its ID (`${suit}${rank}`) is NOT in `Active card IDs`.
- **Alternative considered**: Storing a `removedCards` array in `GameState`. Dismissed because on-the-fly calculation is pure, zero-overhead, and doesn't affect state serialization.

### 2. UI Placement: Sidebar Counter + Trigger Button & Overlay Modal
- **Decision**: Place a compact counter in `GameSidebar.tsx` under the Status section. Below it, add a thematic button `📜 Matched Cards Vault` that triggers a modal overlay.
- **Alternative considered**: Inline accordion in sidebar. Dismissed because a 4×13 grid requires horizontal space, which fits much better in a centered modal overlay.

### 3. Matched Cards Modal Layout & Styling
- **Structure**:
  - **Header**: Title ("Tomb Vault - Matched Cards") and Close button.
  - **4×13 Card Grid**: Columns Ace through King, Rows Spades, Hearts, Diamonds, Clubs. Active cards are faint/dimmed, removed cards are brightly lit with checkmarks or golden borders.
  - **Pair Summary Cards**: 7 mini cards showing complement pairs (e.g. `8 + 5 (13)`) with remaining active counts.

## Risks / Trade-offs

- **[Risk] Mobile Responsive Width for 4×13 Grid** → **Mitigation**: Use horizontally scrollable table/container (`overflow-x-auto`) or compact grid cells for smaller viewports.
- **[Risk] Screen Reader Accessibility for Modal** → **Mitigation**: Add standard dialog aria attributes (`role="dialog"`, `aria-modal="true"`, Esc key handler, backdrop click handler).
