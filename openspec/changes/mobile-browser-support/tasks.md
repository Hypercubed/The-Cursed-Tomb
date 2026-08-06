## 1. Viewport & Safe Area Configuration

- [ ] 1.1 Update `index.html` viewport meta tag to support `viewport-fit=cover` and scale controls
- [ ] 1.2 Add CSS utility rules in `src/index.css` for safe area padding (`env(safe-area-inset-*)`), touch action constraints (`touch-action: manipulation`), and tap highlight suppression

## 2. Micro-Haptics Integration

- [ ] 2.1 Create `src/utils/haptics.ts` utility module to safely wrap `navigator.vibrate` with light tap, success pair match, and error shake vibration patterns
- [ ] 2.2 Trigger haptic feedback in card tap handlers, draw pile clicks, and match event handlers across `PlayingCard.tsx`, `DrawZone.tsx`, and `App.tsx`

## 3. Responsive Mobile Card Sizing & Spacing

- [ ] 3.1 Update card dimensions and row overlap scaling in `src/index.css` and `PlayingCard.tsx` for narrow mobile screens (< 380px and < 640px)
- [ ] 3.2 Add active touch press visual feedback state (`:active` and touch press styles) to `PlayingCard.tsx`

## 4. Mobile Layout & Compact Top Bar

- [ ] 4.1 Update `GameShell.tsx` and `GameSidebar.tsx` to render a compact mobile status header and touch-friendly navigation toolbar on screens < 768px
- [ ] 4.2 Adjust dialog and modal paddings in `CampaignEndModal.tsx`, `RoundSummaryModal.tsx`, `RulesModal.tsx`, and `MatchedCardsModal.tsx` for small mobile screens

## 5. Verification & Tests

- [ ] 5.1 Run test suite (`npm test`) and build verification to ensure no regressions
- [ ] 5.2 Test mobile layout rendering and touch interaction responsiveness across simulated mobile viewport dimensions
