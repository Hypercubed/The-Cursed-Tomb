## 1. Card Rendering Component Refactoring

- [x] 1.1 Remove anchor overlay strokes (`—` and `+`) from `SuitPip` in `src/components/PlayingCard.tsx`.
- [x] 1.2 Implement dedicated top-right and bottom-left (rotated 180°) `AnchorBadge` elements in `src/components/PlayingCard.tsx` based on `rewardStage`.
- [x] 1.3 Ensure proper tooltips and accessibility attributes for top-right immunity badges.

## 2. Rules & Codex Documentation Updates

- [x] 2.1 Update `docs/rules.md` (Sections 3, 5, and 6) to state that Anchors (`—` and `+`) are drawn in the top-right (and bottom-left in 180° rotation) corner of physical playing cards.
- [x] 2.2 Align `MatchedCardsModal.tsx` vault legend badges, tooltips, and card representations with top-right anchor positioning.

## 3. Verification & Testing

- [x] 3.1 Run unit and component rendering tests to ensure clean visual appearance across mobile, desktop, and 180° rotated cards.
- [x] 3.2 Verify application build (`npm run build`).
