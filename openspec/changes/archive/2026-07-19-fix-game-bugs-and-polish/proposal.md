## Why

A code review of the Pyramid Solitaire game identified two logic bugs (stale card state in pair resolution, undetectable loss for infinite-redraw games) and a set of UI/UX gaps (no suit coloring, invisible card gaps, missing loss state feedback) that together leave the game incorrect and rough to play.

## What Changes

- Fix `playCard` to read selected-card state from live game state instead of the original immutable `state.deck`, eliminating the stale-removed-flag bug.
- Fix loss detection to handle the `redrawsRemaining === null` (infinite) case, so deadlocked infinite-redraw games correctly report "lost."
- Split the overloaded `redraw()` function into `drawCard()` (advance draw pile) and `cyclePile()` (recycle discard), and update callers.
- Add suit-based coloring to cards (red for ♥/♦, default for ♠/♣).
- Replace `visibility: hidden` on removed cards with `display: none` (or a collapsed placeholder) so cleared rows no longer leave invisible ghost gaps.
- Add missing unit tests for loss detection, lone King removal, 0-redraw exhaustion, and the fixed pair-validation behavior.
- Minor UI: clarify draw button label when redraws are 0, move scattered inline `style` props to CSS classes.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `pyramid-solitaire-game`: Game logic correctness (pair resolution reads live state, loss detection covers infinite-redraw case); UI rendering (suit coloring, cleared-card layout).

## Impact

- `src/game.ts`: Logic changes to `playCard`, `checkForWin`/`canAnyMove`, and draw-pile handling. Rename/split `redraw`.
- `src/App.tsx`: Update callers of `redraw` to use new function names; add suit color classes to card rendering; move inline styles to CSS.
- `src/styles.css`: Add `.card.red` suit color rule; adjust `.card.removed` to not occupy layout space.
- `src/game.test.ts`: New tests for the fixed behaviors.
