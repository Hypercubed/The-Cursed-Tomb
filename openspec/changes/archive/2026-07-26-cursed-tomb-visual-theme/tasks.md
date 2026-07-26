## 1. Setup & Design System Foundation

- [x] 1.1 Update `tailwind.config.js` to override/extend colors (`game-bg`, `game-panel`, `game-border`, `game-card-bg`, `game-red`, `game-accent`).
- [x] 1.2 Update `src/index.css` to add the repeating sandstone linear gradient texture and setup base typography configs.
- [x] 1.3 Implement the `.torch-overlay` CSS class and `@keyframes torch-flicker` animation in `src/index.css`.

## 2. Atmospheric & Shell UI

- [x] 2.1 Add the absolute-positioned `.torch-overlay` container inside `src/components/GameShell.tsx` (using `pointer-events-none`).
- [x] 2.2 Style the sidebar in `src/components/GameSidebar.tsx` with a leather border texture and parchment panels to look like an explorer's journal.

## 3. Card Visual Upgrades

- [x] 3.1 Design and embed inline SVGs for the thematic suits (Ankh, Scarab, Khopesh, Scepter) within `src/components/PlayingCard.tsx` or a shared utility.
- [x] 3.2 Update `PlayingCard.tsx` buttons to apply the basalt background (`bg-game-card-bg`), chiseled stone borders, and glowing box-shadow card selection indicator.

## 4. Pedestals & Altars

- [x] 4.1 Update `src/components/DrawZone.tsx` to render the draw pile button as a stone-block pedestal with a centered golden emblem.
- [x] 4.2 Update `DrawZone.tsx` discard pile placeholder to display as a sandstone altar, lighting up with a gold-glowing border (`game-accent` / shadow) when a card is selected or active.

## 5. Verification

- [x] 5.1 Perform manual visual verification of the layout, vignette animation, and card textures on desktop and mobile screen viewports.
- [x] 5.2 Run unit tests to verify that UI layout styling updates have not impacted the underlying game solitaire model logic.
