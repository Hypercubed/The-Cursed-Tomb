## Context

The Cursed Tomb is a web-based Pyramid Solitaire game built with React, Vite, and TailwindCSS. While desktop and tablet layouts work cleanly in two-column grid mode, mobile web viewports (< 768px) present touch friction, tap delay, double-tap zoom triggers, unwanted text highlighting, card sizing overflow on narrow screens (320px–360px), and lack of visual/haptic touch feedback.

## Goals / Non-Goals

**Goals:**
- Eliminate touch latency, blue tap highlights, text selection, and double-tap zoom artifacts on iOS Safari and Android Chrome.
- Integrate Web Vibration API micro-haptics for card selection, pair matching, and draw pile cycling with graceful fallbacks.
- Implement responsive card scaling (down to ~40px width on screens < 380px) so the 7-card pyramid base fits cleanly without horizontal scrollbars.
- Adapt main layout for safe area insets (`env(safe-area-inset-*)`) on devices with notch or home indicator bar (`viewport-fit=cover`).
- Add a compact top status toolbar on mobile viewports so essential stats and action buttons (Rules, Reset) are instantly accessible without scrolling.

**Non-Goals:**
- Native mobile app wrapping (Capacitor/Cordova/React Native).
- Drag-and-drop card physics (gameplay relies on tactile tap-to-select and pair matching).

## Decisions

### 1. Viewport Meta Tag & Touch Action Rules
- **Decision**: Update `index.html` viewport meta tag to `width=device-width, initial-scale=1.0, viewport-fit=cover`. Apply `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` globally across card components and game buttons.
- **Rationale**: Prevents 300ms tap delay and double-tap zoom on iOS/Android while preserving standard single-finger scroll gestures where applicable.

### 2. Micro-Haptic Feedback Utility (`src/utils/haptics.ts`)
- **Decision**: Wrap `navigator.vibrate` calls in a safe helper module that handles browser capability checks, feature flags, and user preference checks.
- **Rationale**: `navigator.vibrate` is supported in Android Chrome but ignored or missing in iOS Safari. Wrapping it in a safe helper ensures zero runtime errors across any device.

### 3. Breakpoint & Card Dimension Tiering
- **Decision**: Introduce CSS variables and Tailwind class tiers for card dimensions:
  - `< 380px`: Card size ~40px × 56px, overlap negative margin -28px.
  - `380px – 640px`: Card size ~48px × 68px, overlap negative margin -34px.
  - `≥ 640px`: Standard desktop scaling.
- **Rationale**: Ensures the 7-card pyramid base (7 × width + gaps) fits comfortably within narrow 320px viewport containers without triggering horizontal overflow.

### 4. Compact Mobile Top Bar
- **Decision**: Render a compact single-row header on `< 768px` viewports containing key metrics (Cards Removed, Victory progress) and quick modal triggers (Rules, Restart).
- **Rationale**: Keeps vital game controls accessible on small screens without requiring users to scroll past the entire left sidebar control panel before viewing the board.

## Risks / Trade-offs

- **[Risk]**: `navigator.vibrate` requires prior user interaction on some mobile browsers.
  - **Mitigation**: Haptic calls are exclusively fired inside `onClick` / `onTouchStart` user event handlers.
- **[Risk]**: Ultra-small cards (< 42px) on 320px screens could compromise rank/suit legibility.
  - **Mitigation**: Use crisp SVG suit graphics and scale rank font sizes proportionally, maintaining high-contrast carbon/crimson colors over parchment slate background.
