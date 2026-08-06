## MODIFIED Requirements

### Requirement: Cards scale dynamically across viewport breakpoints
Individual playing cards and draw/discard slot placeholders SHALL scale responsive card dimensions across viewport breakpoints (e.g. 40px–44px width on narrow mobile viewports <380px, 48px × 64px on standard mobile viewports <640px, 72px × 96px on standard viewports, and 88px–104px width on large/2xl viewports).

#### Scenario: Mobile screens render compact card sizes
- **WHEN** the viewport width is under 640px
- **THEN** playing cards SHALL render at compact dimensions (approx. 40px–48px width) so the 7-card pyramid base fits comfortably on narrow mobile screens without horizontal scrolling

#### Scenario: Ultra-wide and 4K displays render scaled-up cards
- **WHEN** the viewport width is 1536px or wider
- **THEN** playing cards SHALL render at expanded dimensions (approx. 88px to 104px width) for clear visibility and readability

## ADDED Requirements

### Requirement: Touch active visual feedback on mobile cards
When a playing card is pressed on a touch device, it SHALL display an immediate visual active press state (subtle scale down ~0.97 and shadow drop) before touch release to provide instantaneous tactile responsiveness on touchscreens.

#### Scenario: Pressing a card on touch screen provides instant active state
- **WHEN** a player presses down on an available card on a touchscreen
- **THEN** the card SHALL immediately transition into an active press state without tap delay
