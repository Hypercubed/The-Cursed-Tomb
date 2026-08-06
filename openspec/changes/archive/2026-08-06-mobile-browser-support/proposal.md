## Why

Playing Pyramid Solitaire on mobile browsers currently suffers from touch handling friction (such as accidental zooming, tap delays, scroll interference), oversized or cramped card scaling on small screens, missing safe-area inset spacing, and suboptimal mobile layout responsiveness. Enhancing mobile browser support improves accessibility, touch responsiveness, visual sizing, and layout ergonomics across iOS Safari and Android Chrome devices.

## What Changes

- **Touch Handling & Gestures**: Prevent unwanted double-tap zoom, page pull-to-refresh during card dragging/tapping, tap highlight artifacts, and browser gesture interference (`touch-action`, `user-select`).
- **Tactile Touch Feedback**: Add micro-haptic vibration feedback (`navigator.vibrate`) on card selections, matches, and draw pile taps where supported, along with touch-active visual press states.
- **Responsive Card Scaling**: Intelligently scale card dimensions and row overlap spacing dynamically based on container/viewport dimensions to ensure the full 7-row pyramid and draw zone remain visible without vertical/horizontal scrolling on small screens (down to 320px width).
- **Mobile Layout & Safe Area Adaptation**: Support `env(safe-area-inset-*)` for notched screens, optimize mobile header/navigation layout, adjust modal padding for touch keyboards/small screens, and provide compact sidebar controls on mobile stack.

## Capabilities

### New Capabilities

- `mobile-touch-interactions`: Touch gesture controls, touch-action constraints, haptic feedback integration, and safe-area inset layout adaptations for mobile viewports.

### Modified Capabilities

- `game-layout`: Enhances vertical stack layout, board container sizing, compact mobile status header, and modal touch spacing for small viewports (< 768px and < 1024px).
- `card-rendering`: Adds responsive scaling factors for mobile card sizes, touch tap target optimization, and touch press visual state feedback.

## Impact

- Affected frontend code: `index.html`, `src/index.css`, `src/App.tsx`, `src/components/PyramidBoard.tsx`, `src/components/PlayingCard.tsx`, `src/components/DrawZone.tsx`, `src/components/GameShell.tsx`, `src/components/GameSidebar.tsx`, and modal components.
- Browser APIs used: `navigator.vibrate`, CSS `env(safe-area-inset-*)`, viewport meta attributes, CSS touch action.
