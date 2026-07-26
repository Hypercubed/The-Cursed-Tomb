## ADDED Requirements

### Requirement: Cards scale dynamically across viewport breakpoints
Individual playing cards and draw/discard slot placeholders SHALL scale responsive card dimensions across viewport breakpoints (e.g. 48px × 64px on mobile, 72px × 96px on standard viewports, and 88px–104px width on large/2xl viewports).

#### Scenario: Mobile screens render compact card sizes
- **WHEN** the viewport width is under 640px
- **THEN** playing cards SHALL render at compact dimensions (approx. 48px width) so the 7-card pyramid base fits without horizontal scrolling

#### Scenario: Ultra-wide and 4K displays render scaled-up cards
- **WHEN** the viewport width is 1536px or wider
- **THEN** playing cards SHALL render at expanded dimensions (approx. 88px to 104px width) for clear visibility and readability

### Requirement: Pyramid row overlap scales proportionally with card height
Pyramid row vertical overlap SHALL scale dynamically according to card height breakpoint tiers so row spacing and card visibility remain proportional across all screen sizes.

#### Scenario: Pyramid rows preserve visual proportions at all viewports
- **WHEN** pyramid rows are rendered on any viewport tier
- **THEN** row negative top margins SHALL scale in proportion to card height (approx. 50% height overlap) so upper card faces remain readable
