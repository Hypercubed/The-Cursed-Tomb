## 1. Theme Tokens & CSS Styling

- [x] 1.1 Update `tailwind.config.js` color tokens for light parchment card faces (`game-card-bg`), dark obsidian card text (`game-card-text`), vivid crimson red suits (`game-red`), and warm sandstone panel containers (`game-panel`).
- [x] 1.2 Refine global styles in `src/index.css` for background contrast and ambient overlay brightness.

## 2. Card Component Redesign

- [x] 2.1 Update `PlayingCard.tsx` corner indices to display standard suit characters (`♥`, `♦`, `♠`, `♣`) alongside rank labels with larger, bolder typography.
- [x] 2.2 Add 180-degree rotation/mirroring (`rotate-180`) to the bottom-right corner index in `PlayingCard.tsx`.
- [x] 2.3 Render thematic Egyptian SVG icons (Ankh, Scarab, Khopesh, Was Scepter) in the center hero zone of `PlayingCard.tsx`.
- [x] 2.4 Replace dark brightness filter on blocked cards in `PlayingCard.tsx` with a translucent stone veil overlay (`bg-stone-900/35`) to keep blocked cards readable.

## 3. Verification & Testing

- [x] 3.1 Audit UI contrast across `PyramidBoard.tsx`, `DrawZone.tsx`, `GameSidebar.tsx`, and `App.tsx`.
- [x] 3.2 Run unit tests (`npm test`) and build verification (`npm run build`) to ensure full test suite pass and zero regressions.
