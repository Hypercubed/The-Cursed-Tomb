## 1. Game Logic Bug Fixes (src/game.ts)

- [ ] 1.1 In `playCard`, replace `state.deck.find(...)` with `getCardById(state.selectedCardId, state)` when resolving the first selected card for pair validation
- [ ] 1.2 Export `drawCard(state)` function: moves top draw-pile card to discard, does not change `redrawsRemaining`
- [ ] 1.3 Export `cyclePile(state)` function: moves discard back to draw pile, decrements finite `redrawsRemaining`, is a no-op when `redrawsRemaining === 0`
- [ ] 1.4 Remove (or unexport) the old `redraw()` function, or keep it as a private internal alias — update all callers
- [ ] 1.5 Update `checkForWin` loss branch: when `redrawsRemaining === null`, declare "lost" only when draw pile is empty AND `canAnyMove` returns false across visible pyramid + full discard pile
- [ ] 1.6 Update `canAnyMove` to accept an optional extra card set so it can check the full discard pile in the infinite-redraw loss check

## 2. UI Logic Updates (src/App.tsx)

- [ ] 2.1 Update `handleRedraw` to call `drawCard` when `drawPile.length > 0`, and `cyclePile` when `drawPile.length === 0`
- [ ] 2.2 Add suit-color logic in `renderCard`: add class `red` to cards with suit ♥ or ♦
- [ ] 2.3 Remove scattered inline `style` props (e.g., `marginTop`, `display: grid` on draw area divs) and replace with named CSS classes
- [ ] 2.4 Update draw button disabled condition and label to reflect the split `drawCard`/`cyclePile` semantics (no functional change for user, just correct naming)

## 3. CSS Updates (src/styles.css)

- [ ] 3.1 Change `.card.removed` from `visibility: hidden` to `display: none` so removed cards do not occupy layout space
- [ ] 3.2 Add `.card.red` rule with a red text color (e.g., `#f87171`) for hearts and diamonds
- [ ] 3.3 Extract inline draw-area layout styles from `App.tsx` into named CSS classes (e.g., `.draw-area`, `.draw-section`)

## 4. Tests (src/game.test.ts)

- [ ] 4.1 Add test: `playCard` pair validation uses live removed state — verify that selecting a removed card then clicking a valid partner does not remove the partner
- [ ] 4.2 Add test: loss detection for finite-redraw exhaustion — verify `checkForWin` returns `'lost'` when draw pile is empty, redraws are 0, and no moves available
- [ ] 4.3 Add test: infinite-redraw deadlock loss — construct a state with no valid moves across visible pyramid and full discard, draw pile empty, redraws `null`, and verify `checkForWin` returns `'lost'`
- [ ] 4.4 Add test: `drawCard` moves top card to discard without decrementing `redrawsRemaining`
- [ ] 4.5 Add test: `cyclePile` moves discard to draw pile and decrements finite `redrawsRemaining`
- [ ] 4.6 Add test: `cyclePile` with `redrawsRemaining === null` leaves counter as `null`
- [ ] 4.7 Add test: `cyclePile` with `redrawsRemaining === 0` returns state unchanged
- [ ] 4.8 Add test: lone King removal from pyramid via `playCard`
