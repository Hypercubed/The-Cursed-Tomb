## 1. Design Tokens & Theme

- [ ] 1.1 Update `tailwind.config.js`: replace `game-accent` with `#d97706` (amber-600), `game-accent-light` with `#fbbf24` (amber-400), and add `game-accent-dark` as `#92400e` (amber-800)
- [ ] 1.2 Add `fontFamily.display` extension to `tailwind.config.js` with `['Cinzel', 'Georgia', 'serif']`
- [ ] 1.3 Add Google Fonts `preconnect` and `Cinzel` stylesheet `<link>` tags to `index.html`
- [ ] 1.4 Add subtle repeating-gradient background texture to `body` in `src/index.css`

## 2. PlayingCard Component

- [ ] 2.1 Create `src/components/PlayingCard.tsx` with a `grid grid-rows-[auto_1fr_auto]` card layout
- [ ] 2.2 Render rank label and suit symbol in top-left corner (small, stacked)
- [ ] 2.3 Render a larger centre suit symbol in the middle row for visual richness
- [ ] 2.4 Render mirrored rank and suit in bottom-right corner using `rotate-180`
- [ ] 2.5 Apply `text-game-red` for ♥/♦ suits; `text-game-card-text` for ♠/♣ suits
- [ ] 2.6 Apply selected state styles: `border-game-accent` + accent box-shadow when `selected` prop is true
- [ ] 2.7 Apply blocked state: `opacity-50 cursor-not-allowed` when `blocked` prop is true
- [ ] 2.8 Apply removed state: `invisible` (not `hidden`) to keep row spacing intact
- [ ] 2.9 Apply hover state: `hover:border-game-accent` transition on interactive cards
- [ ] 2.10 Apply focus-visible ring using `game-accent-light` token

## 3. DrawZone Component

- [ ] 3.1 Create `src/components/DrawZone.tsx` as a horizontal flex strip
- [ ] 3.2 Render a draw pile slot on the left with a labelled button that triggers draw or cycle
- [ ] 3.3 Render a discard pile slot on the right using `PlayingCard` for the top discard card
- [ ] 3.4 Show a dashed-border placeholder with "Empty" label when a slot has no card
- [ ] 3.5 Display cycles remaining count below the draw pile slot

## 4. PyramidBoard Component

- [ ] 4.1 Create `src/components/PyramidBoard.tsx` that accepts `pyramid`, `selectedCardId`, `status`, and `onCardClick` props
- [ ] 4.2 Render pyramid rows using `PlayingCard` for each card
- [ ] 4.3 Centre each row horizontally within the board container
- [ ] 4.4 Verify that removed cards collapse in the flex row (invisible, not hidden — consistent with spec)

## 5. GameSidebar Component

- [ ] 5.1 Create `src/components/GameSidebar.tsx` containing setup controls and status panel
- [ ] 5.2 Move redraw cycles select, win condition select, Start, and Reset controls into `GameSidebar`
- [ ] 5.3 Move game status summary (status label, redraws remaining, draw pile count, discard top, selected card) into `GameSidebar`
- [ ] 5.4 Style the sidebar with `bg-game-panel border border-game-border rounded-2xl p-5` and a sticky top offset so it stays visible on desktop

## 6. GameShell & App Composition

- [ ] 6.1 Create `src/components/GameShell.tsx` as the responsive two-column wrapper: `grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6`
- [ ] 6.2 Refactor `App.tsx` to import and compose `GameShell`, `GameSidebar`, `PyramidBoard`, and `DrawZone`
- [ ] 6.3 Keep all `useState` and event handlers in `App.tsx`; pass props down to components
- [ ] 6.4 Apply `font-display` class to the `h1` game title heading
- [ ] 6.5 Remove the "Board" h2 and instructions text that were inside the old board panel (sidebar and layout structure replace this context)
- [ ] 6.6 Confirm the board area and draw zone are in separate containers (pyramid above, draw zone below)

## 7. Cleanup & Verification

- [ ] 7.1 Delete or empty `src/styles.css` (already superseded; confirm no lingering import)
- [ ] 7.2 Run `npm run build` and verify no TypeScript or Tailwind errors
- [ ] 7.3 Visually verify desktop layout: sidebar visible alongside board at ≥ 1024px viewport
- [ ] 7.4 Visually verify mobile layout: panels stack vertically at < 1024px viewport
- [ ] 7.5 Verify amber accent appears on card hover, selection, and focus-visible ring
- [ ] 7.6 Verify `Cinzel` font renders on the h1 heading
- [ ] 7.7 Verify red suits render correctly in the new `PlayingCard` component
- [ ] 7.8 Verify removed cards are invisible but do not collapse sibling card spacing in their row
- [ ] 7.9 Run existing tests (`npm test`) and confirm no regressions
