## Why

Playing Pyramid Solitaire solely via mouse clicks can feel slow and repetitive during rapid play sessions. Adding global keyboard shortcuts enables desktop players to draw cards (`D` or `Space`), cycle stock (`C`), deselect cards (`Escape`), and trigger a new deal (`N`) fluidly without moving the cursor.

## What Changes

- Add keyboard shortcut event listener hook (`useKeyboardShortcuts`) bound to global window key events.
- Support `Space` / `D` to draw a card or cycle the stock pile.
- Support `Escape` to clear current card selection.
- Support `N` to trigger the new game prompt / reset.
- Support `?` / `H` to toggle a Keyboard Shortcuts modal / legend overlay.
- Display subtle keyboard hint badges on UI buttons (e.g. `[D]` on Draw button, `[Esc]` on Deselect).

## Capabilities

### New Capabilities
- `keyboard-shortcuts`: Comprehensive keyboard shortcut bindings and visual key legend for core game controls.

### Modified Capabilities
- `pyramid-solitaire-game`: Expose keyboard action handlers for drawing, cycling, and deselecting.

## Impact

- **React Custom Hook (`src/hooks/useKeyboardShortcuts.ts`)**: Encapsulates keyboard event registration and modal focus protection.
- **UI Components (`DrawZone.tsx`, `GameSidebar.tsx`, `App.tsx`)**: Render shortcut badges and legend modal.
