# Mobile Touch Interactions

## Purpose

Touch action, double-tap zoom prevention, safe area insets, and haptic feedback interactions on mobile touch-enabled devices.

## Requirements

### Requirement: Touch action and double-tap zoom prevention
The application SHALL apply touch-action controls (`touch-action: manipulation`) and prevent unwanted double-tap zoom gestures on interactive card elements, game buttons, and board areas to ensure responsive single-tap interaction on mobile browsers.

#### Scenario: Tapping card rapidly does not trigger page zoom
- **WHEN** a player rapidly taps cards on mobile browser viewports
- **THEN** the browser SHALL NOT perform double-tap screen zooming or text selection on game elements

### Requirement: Micro-haptic tactile feedback
The application SHALL trigger micro-haptic vibration feedback using the web Vibration API (`navigator.vibrate`) on touch devices for card selection, card matching, and draw pile taps when supported by the mobile browser.

#### Scenario: Tapping an interactive card triggers light haptic pulse
- **WHEN** a player taps an available card on a touch-enabled browser
- **THEN** the application SHALL trigger a brief haptic vibration pulse (approx. 10ms–15ms) if `navigator.vibrate` is supported

#### Scenario: Completing a valid card pair match triggers success haptic pattern
- **WHEN** a player successfully matches a pair of cards on a touch-enabled browser
- **THEN** the application SHALL trigger a distinct double-pulse haptic vibration pattern (e.g. [20ms, 40ms, 20ms])

### Requirement: Mobile safe area inset padding
The main game shell and fixed header elements SHALL incorporate CSS `env(safe-area-inset-*)` values so that game content, status header, and bottom draw zone clear mobile hardware notches, home indicator bars, and device corners.

#### Scenario: Viewport with notch or home bar applies safe area padding
- **WHEN** the game is rendered on a device with safe area insets (e.g., iPhone with notch or home bar)
- **THEN** top, bottom, left, and right layout containers SHALL include `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, and `env(safe-area-inset-right)` padding
