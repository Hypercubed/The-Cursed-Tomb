## 1. Documentation Updates

- [x] 1.1 Update `docs/rules.md` (Section 3 Ink Zones, Section 6 Survival Rewards, and Section 6.C ASCII visual reference diagram) to specify center face blessing illustrations without corner suit pip circles.

## 2. Component Updates

- [x] 2.1 Update `SuitPip` component in `src/components/PlayingCard.tsx` to remove the blue circle SVG overlay logic and `blessed` prop requirement.
- [x] 2.2 Update `getUpperLeftTooltip` in `src/components/PlayingCard.tsx` to remove `[O]` notation from tooltip descriptions.
- [x] 2.3 Update `RulesModal.tsx` Card Anatomy tab text and mockup descriptions to reflect center face blessing illustrations without corner suit pip circles.

## 3. Testing & Verification

- [x] 3.1 Update unit tests in `src/components/PlayingCard.test.tsx` and `src/components/RulesModal.test.tsx` to verify clean suit pip rendering without circle overlays.
- [x] 3.2 Run full test suite (`npm run test`) and build check (`npm run build`) to ensure zero visual or compilation regressions.
