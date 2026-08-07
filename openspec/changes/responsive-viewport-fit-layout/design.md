## Context

See `proposal.md` for motivation. Currently, `GameShell`, `.mobile-board-panel`, and card element sizing rely exclusively on width-based CSS breakpoints (`w-`, `lg:`, `xl:`, `2xl:`). On standard 1080p, 900p, or 768p desktop monitors, browser viewports range from 700px to 880px high, resulting in ~100px-180px vertical overflow and browser scrollbars.

## Goals / Non-Goals

**Goals:**
- Eliminate browser window vertical scrollbars on standard desktop resolutions (1920x1080, 1440x900, 1366x768).
- Keep card artwork, suit icons, and typography clear and legible.
- Maintain responsive stacking on mobile viewports (< 1024px).

**Non-Goals:**
- Altering core game logic, solitaire algorithms, or game state handlers.
- Redesigning mobile portrait or tablet layouts.

## Decisions

### Decision 1: Height-Aware CSS Breakpoints for Desktop Card Dimensions
In `src/index.css`, implement viewport-height media queries (`@media (min-width: 1024px) and (max-height: ...)`):
- **For `max-height: 900px` (e.g. 1080p desktop with browser chrome)**: Set `.playing-card-responsive` and `.playing-card-slot` width to `80px` and height to `106px`. Adjust row offset in `PyramidBoard` to `-mt-13` (52px).
- **For `max-height: 800px` (e.g. 900p / 768p laptop displays)**: Set `.playing-card-responsive` and `.playing-card-slot` width to `72px` and height to `96px`. Adjust row offset in `PyramidBoard` to `-mt-11` (44px).

### Decision 2: Layout Padding & Margin Compression
- **`GameShell.tsx`**: Replace `lg:p-8` with `lg:py-3 lg:px-6` and reduce column gap from `sm:gap-6` to `gap-4 lg:gap-5`.
- **`App.tsx` Header**: Tighten vertical padding from `p-3 sm:p-4` to `py-2.5 px-4` and reduce inner gap.
- **`App.tsx` Board Container**: Change `.mobile-board-panel` padding from `lg:p-6` to `lg:py-3 lg:px-5`.
- **`DrawZone.tsx`**: Reduce top padding from `pt-4` to `pt-2.5`.

### Decision 3: Independent Sidebar Vertical Scroll Container
Update `GameSidebar` wrapper in `GameShell.tsx` to use `lg:sticky lg:top-3 lg:max-h-[calc(100vh-1.5rem)] lg:overflow-y-auto custom-scrollbar` so that if screen height is exceptionally short, the sidebar can scroll internally without forcing the main play area or window to generate a page-level scrollbar.

## Risks / Trade-offs

- **[Risk]** Card text or illustrations might feel small on high-DPI 1080p scaled screens.
  - *Mitigation*: 72x96px is identical to the standard mobile `sm:` card dimension, which has already been validated for clear text and SVG readability.
