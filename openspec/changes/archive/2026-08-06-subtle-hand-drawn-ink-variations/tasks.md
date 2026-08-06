## 1. Deterministic Seeding Utilities

- [x] 1.1 Create deterministic seed and transformation helper function `getHandDrawnTransform(suit, rank, markType)` in card rendering utilities.
- [x] 1.2 Add unit tests for `getHandDrawnTransform` verifying bounded output ranges and deterministic consistency across invocations.

## 2. Card Component Integration

- [x] 2.1 Pass `rank` prop into `CardFaceIllustration` and apply deterministic transform (`transform` / `style`) to Blessing and Curse SVG groups.
- [x] 2.2 Update `SlashedRank` in `PlayingCard.tsx` to apply deterministic transform to the Attrition Scar SVG overlay.
- [x] 2.3 Update `SlashedRank` in `PlayingCard.tsx` to apply deterministic rotation, font scale, and offset to the handwritten modified rank number.
- [x] 2.4 Update `AnchorBadge` in `PlayingCard.tsx` to apply deterministic transform to the Fortifying and Anchored SVG pen strokes.

## 3. Verification & UI Testing

- [x] 3.1 Run unit tests and component tests to ensure all tests pass cleanly.
- [x] 3.2 Verify visual card rendering across pyramid board, draw zone, round summary, and matched card modals.
