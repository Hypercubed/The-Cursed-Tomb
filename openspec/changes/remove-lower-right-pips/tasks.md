## 1. Specification & Delta Updates

- [ ] 1.1 Verify delta spec in `openspec/changes/remove-lower-right-pips/specs/card-rendering/spec.md`

## 2. Component Refactoring

- [ ] 2.1 Refactor `PlayingCard.tsx` layout to remove bottom row elements (bottom-right rotated corner index and bottom-left rotated anchor badge)
- [ ] 2.2 Adjust `PlayingCard` grid / flex layout container styling to optimize top row and central suit icon spacing

## 3. Verification & Testing

- [ ] 3.1 Run tests and build checks to ensure no broken layout assertions or rendering failures
- [ ] 3.2 Verify visual card layout cleanly displays top-left index, top-right anchor badge, and center suit graphics
