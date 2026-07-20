## Context

The Pyramid Solitaire game (`src/game.ts`, `src/App.tsx`) has two confirmed logic bugs discovered in a code review, plus UI/UX gaps that reduce playability and visual clarity. All changes are confined to the existing four source files: `game.ts`, `App.tsx`, `styles.css`, and `game.test.ts`. No new dependencies or architecture changes are needed.

## Goals / Non-Goals

**Goals:**
- Correct pair-resolution logic so selected-card state is read from live game state, not the frozen initial deck.
- Correct loss detection to cover the infinite-redraws case (`redrawsRemaining === null`).
- Split the dual-purpose `redraw()` function into two clearly named functions.
- Add suit-based coloring (red for ♥/♦) to card rendering.
- Fix the layout so removed cards do not leave invisible ghost gaps.
- Add missing unit tests covering the fixed behaviors and previously untested paths.
- Move scattered inline `style` props in `App.tsx` to CSS classes.

**Non-Goals:**
- Animations or visual transitions beyond what already exists.
- Multiplayer, persistence, or backend integration.
- A complete UI redesign or new layout structure.
- Changes to game rules or configurable options beyond what is already implemented.

## Decisions

- **Read live card state in `playCard` via `getCardById`** instead of `state.deck.find(...)`.
  - `getCardById` already searches pyramid, draw pile, and discard pile in priority order — using it is the minimal, correct fix. The deck field should be considered write-once reference data, not live state.
  - Alternative: remove `state.deck` entirely. Rejected — it may be useful as an audit log (original card order) and removing it is a larger change.

- **Loss detection for infinite redraws: check `canAnyMove` across the full reachable card set**.
  - When `redrawsRemaining === null`, cycling is always possible. The only way to lose is if no valid move exists AND cycling the entire draw/discard pile through would yield no new pairings. A practical heuristic: if the draw pile is exhausted (all cards in discard or pyramid), check `canAnyMove` across visible pyramid + full discard pile. If still no move, declare loss.
  - Alternative: full look-ahead simulation. Rejected — complex and out of scope for this iteration.

- **Split `redraw()` into `drawCard()` and `cyclePile()`**.
  - `drawCard()`: moves one card from draw pile to discard (no cycle count change).
  - `cyclePile()`: moves discard back to draw pile, decrementing `redrawsRemaining` when finite.
  - `App.tsx` button handler chooses which to call based on `drawPile.length`.
  - Alternative: keep as one function with a discriminated return value. Rejected — overloading a single function with two semantically different actions reduces clarity.

- **Suit coloring: CSS class on the card element**.
  - `renderCard` adds a `red` class for ♥ and ♦. CSS handles the color. No style prop needed.
  - Alternative: inline style. Rejected — inline styles are already flagged as a code smell in the review.

- **Removed card layout: `display: none` vs. collapsed placeholder**.
  - Use `display: none` on `.card.removed` to remove it from flow entirely. The pyramid rows use flexbox so sibling cards will shift. This changes the visual pyramid shape but is more natural than ghost gaps.
  - Alternative: keep `visibility: hidden` and use a fixed-width placeholder `div`. This preserves pyramid shape but clutters the DOM. Deferred to a future polish pass.

## Risks / Trade-offs

- [Risk] `display: none` on removed cards shifts the pyramid layout, making later rows look uneven.
  - Mitigation: Accept this for now. A proper pyramid overlay with absolute positioning is a future enhancement.

- [Risk] Splitting `redraw` into two functions changes the public API of `game.ts`. If any external consumers use `redraw()`, they'll need to update.
  - Mitigation: The app is self-contained; `App.tsx` is the only caller. Update both at once.

- [Risk] The infinite-redraw loss heuristic (check after full cycle) may still miss some exotic deadlocks.
  - Mitigation: The heuristic covers the common case. A full simulation-based solver is a future improvement.
