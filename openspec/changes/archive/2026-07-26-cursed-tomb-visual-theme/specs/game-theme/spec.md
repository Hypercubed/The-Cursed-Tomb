## ADDED Requirements

### Requirement: Ambient torchlight vignette overlay
The root layout SHALL display an ambient overlay radial gradient (darkening the edges of the viewport to black) that mimics flickering torchlight via a subtle scale and opacity animation.

#### Scenario: Torchlight vignette visible in app shell
- **WHEN** the app shell is rendered
- **THEN** it SHALL include an overlay element with a radial gradient centered on the screen that subtly flickers in opacity and scale

### Requirement: Dark sandstone and obsidian color scheme
The app SHALL apply the `#070605` color to the root background (`game-bg`), `#171410` to game containers (`game-panel`), `#383026` to borders (`game-border`), and `#ef4444` to red card text (`game-red`).

#### Scenario: Visual elements display dark sandstone theme colors
- **WHEN** the main layout or card board is rendered
- **THEN** the panels, borders, and background colors SHALL match the dark sandstone color tokens
