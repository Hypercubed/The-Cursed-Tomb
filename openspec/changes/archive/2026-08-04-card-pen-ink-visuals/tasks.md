## 1. Natural Base Card Color Tokens

- [x] 1.1 Update base red suit color token (`game-red`) to deep Bicycle Crimson (`#991b1b`) and black suit color token (`game-card-text`) to carbon black (`#1c1917`) in CSS/design system files.

## 2. Component Ink Color Modifications

- [x] 2.1 Update `SlashedRank` component in `PlayingCard.tsx` to render Attrition Stage 1–4 scars (vertical lines, backslashes, forward slashes) using Scarlet Red Gel Pen Ink (`#dc2626` / `#e11d48`) and scarlet drop shadow filter (`drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]`).
- [x] 2.2 Update modified functional rank values rendered next to scars in `PlayingCard.tsx` to use Scarlet Red Gel Pen Ink styling (`#dc2626`, `WebkitTextStroke: '0.6px #dc2626'`, `textShadow: '0 0 1px #dc2626'`).
- [x] 2.3 Update `CardFaceIllustration.tsx` to render Red Curse (`▼`) and Black Curse (`⏍`) center face drawings in Scarlet Red Gel Pen Ink styling.
- [x] 2.4 Verify `SuitPip` (Blessed Hero circle halo), `AnchorBadge` (Fortifying and Anchored badges), and center Blessing illustrations in `CardFaceIllustration.tsx` retain Cobalt Blue Pen Ink styling (`#1d4ed8`).

## 3. Verification

- [x] 3.1 Run application build and test suite (`npm run test` or `npm run build`) to ensure zero visual or compilation regressions.
- [x] 3.2 Verify visual rendering in browser/storybook/component view to ensure clear contrast between natural card inks, blue positive pen marks, and scarlet negative pen marks.
