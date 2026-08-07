## 1. Container & Header Layout Padding Compression

- [x] 1.1 Update `GameShell.tsx` outer safe-area padding and column gap for desktop screens (`lg:py-3 lg:px-6`, `lg:gap-5`).
- [x] 1.2 Update `App.tsx` Header bar to use compact padding (`py-2.5 px-4`) and streamlined flex spacing.
- [x] 1.3 Update `App.tsx` main board panel (`.mobile-board-panel`) to use compact vertical padding on desktop (`lg:py-3 lg:px-5`).
- [x] 1.4 Update `DrawZone.tsx` container padding to reduce vertical whitespace (`pt-2.5 pb-1`).

## 2. Height-Aware Card Sizing & Sidebar Scroll Container

- [x] 2.1 Add `@media (min-width: 1024px) and (max-height: 900px)` card & slot CSS rules in `src/index.css` (`80px x 106px`).
- [x] 2.2 Add `@media (min-width: 1024px) and (max-height: 800px)` card & slot CSS rules in `src/index.css` (`72px x 96px`).
- [x] 2.3 Update `PyramidBoard.tsx` row overlap offsets for height-constrained desktop viewports (`-mt-13` / `-mt-11`).
- [x] 2.4 Update `GameShell.tsx` sidebar wrapper styling to enable sticky internal scrollbar when viewport height is constrained (`lg:max-h-[calc(100vh-1.5rem)] lg:overflow-y-auto`).

## 3. Verification & Validation

- [x] 3.1 Test layout at 1920x1080, 1440x900, 1366x768, and 1280x800 desktop resolutions to confirm zero vertical window scrollbars.
- [x] 3.2 Verify mobile and tablet layout responsiveness (< 1024px) remains fully functional.
- [x] 3.3 Run existing test suite (`npm test`) to ensure no visual or interactive component regressions.
