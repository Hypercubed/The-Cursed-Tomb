## 1. CSS Keyframe Animations & Utilities

- [x] 1.1 Add `@keyframes` for card selection pulse, card match dissolve, and invalid pair shake in `src/index.css`.
- [x] 1.2 Add `@media (prefers-reduced-motion)` overrides to disable animations for users with motion sensitivity.

## 2. Component Animation State Integration

- [x] 2.1 Update `PlayingCard.tsx` props to support `animatingMatch` and `animatingError` state classes.
- [x] 2.2 Update `PyramidBoard.tsx` and `DrawZone.tsx` to handle temporary animation states when cards are paired or clicked invalidly.

## 3. Win / Loss Celebration & Collapse Animations

- [x] 3.1 Add tomb victory animation effect to `GameShell.tsx` when `game.status === 'won'`.
- [x] 3.2 Add pyramid collapse CSS keyframe animation and staggered tumble effect in `PyramidBoard.tsx` when `game.status === 'lost'`.
- [x] 3.3 Verify visual feedback across selection, matching, error shake, victory, and loss collapse.
