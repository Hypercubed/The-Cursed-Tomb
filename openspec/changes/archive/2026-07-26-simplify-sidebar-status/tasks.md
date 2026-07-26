## 1. Sidebar Component Cleanup

- [x] 1.1 Update `GameSidebarProps` interface in `src/components/GameSidebar.tsx` to remove `statusLabel`, `redrawsRemaining`, `drawPileCount`, `topDiscardLabel`, and `selectedCardLabel`.
- [x] 1.2 Remove the redundant status data rows (`Status`, `Redraws`, `Draw pile`, `Discard top`, `Selected`) from `GameSidebar.tsx`.
- [x] 1.3 Rename sidebar status section title from `☥ Status` to `📊 Progress & Stats`.

## 2. Parent Container Integration

- [x] 2.1 Update `App.tsx` sidebar props passing to remove the 5 redundant status props.
- [x] 2.2 Remove unused local calculations or unused variables in `App.tsx` if any become redundant.

## 3. Verification

- [x] 3.1 Verify project builds without TypeScript errors (`npm run build`).
- [x] 3.2 Verify test suite passes (`npm test`).
