## MODIFIED Requirements

### Requirement: App shell uses responsive two-column layout on desktop
On viewports ≥ 1024px, the game shell SHALL display a fixed-width left sidebar (setup controls and game status) alongside a main content area (pyramid board and draw zone) inside a fluid container that expands up to a maximum width of 1600px. On narrower viewports (< 1024px), the layout SHALL stack vertically with responsive padding so the game board remains visually prominent without horizontal overflow.

#### Scenario: Desktop shows sidebar and board side by side in expanded container
- **WHEN** the viewport is 1024px or wider
- **THEN** the setup/status panel SHALL appear in a left sidebar and the pyramid board SHALL occupy the remaining horizontal space within a container scaling up to 1600px max width

#### Scenario: Mobile shows stacked layout
- **WHEN** the viewport is narrower than 1024px
- **THEN** all panels SHALL stack vertically with setup controls at the top and the board below, formatted to fit narrow mobile screen widths without horizontal scrollbars
