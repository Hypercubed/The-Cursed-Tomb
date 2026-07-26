# Card Rendering Delta

## ADDED Requirements

### Requirement: Card components support animation state classes
The `PlayingCard` component SHALL support optional animation state props (`animatingMatch`, `animatingError`) to attach CSS animation classes dynamically.

#### Scenario: Animating match state attaches dissolve class
- **WHEN** `animatingMatch` is true on `PlayingCard`
- **THEN** the root element SHALL include the `animate-card-dissolve` class
