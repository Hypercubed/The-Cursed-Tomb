## Why

On standard desktop display resolutions (such as 1080p, 900p, or 768p laptops), the play area currently overflows the browser window vertically and forces a scroll bar. This proposal adjusts the responsive desktop layout and card scaling to fit within standard desktop browser viewports without scrolling.

## What Changes

- **Desktop Safe Area Padding**: Reduce top and bottom padding in `GameShell` safe-area shell on desktop viewports (`lg:` breakpoints) from `32px` to compact padding (`12px-16px`).
- **Streamlined Desktop Header**: Tighten header padding, text spacing, and gap to reduce header vertical footprint on desktop screens.
- **Board & Draw Zone Container Padding**: Reduce vertical padding inside `.mobile-board-panel` and margins around `DrawZone`.
- **Viewport Height-Aware Card Scaling**: Introduce CSS media queries (`max-height`) or responsive viewport scaling so card sizes and vertical row offsets automatically downscale when viewport height is constrained (e.g. `< 900px` and `< 800px`).
- **Sidebar Scroll Alignment**: Allow `GameSidebar` to scroll internally if screen height is exceptionally short while maintaining a fixed-height, scroll-free play area.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `game-layout`: Update responsive layout requirements to ensure the game shell and play area fit standard desktop viewports without requiring vertical page scrolling.

## Impact

- **Affected Components**: `GameShell.tsx`, `App.tsx`, `PyramidBoard.tsx`, `DrawZone.tsx`, `PlayingCard.tsx`, `GameSidebar.tsx`, `index.css`.
- **No Breaking Changes**: Core gameplay logic, solitaire solver, campaign persistence, and mobile viewports remain unaffected.
