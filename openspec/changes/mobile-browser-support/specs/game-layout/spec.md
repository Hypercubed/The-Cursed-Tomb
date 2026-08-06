## MODIFIED Requirements

### Requirement: App shell uses responsive two-column layout on desktop
On viewports ≥ 1024px, the game shell SHALL display a full-width header bar at the top, and a two-column grid below containing a fixed-width left sidebar (setup controls and game status) alongside a main content area (pyramid board and draw zone) inside a fluid container that expands up to a maximum width of 1600px. The top edges of both the sidebar and the main content area SHALL align at the exact same vertical baseline underneath the top header. On narrower viewports (< 1024px), the layout SHALL stack vertically with responsive padding, collapsible or scroll-aligned sidebar panels, and full-width card container fitting narrow mobile screen widths without horizontal scrollbars.

#### Scenario: Desktop shows header bar and aligned two-column layout
- **WHEN** the viewport is 1024px or wider
- **THEN** a full-width top header SHALL display the game title, and both the setup sidebar and pyramid board area SHALL start at the exact same vertical baseline underneath the header

#### Scenario: Mobile shows stacked layout
- **WHEN** the viewport is narrower than 1024px
- **THEN** all panels SHALL stack vertically with setup controls and stats formatted to fit narrow mobile screen widths without horizontal scrollbars or clipping board visibility

## ADDED Requirements

### Requirement: Compact mobile header status bar
On viewports narrower than 768px, the game shell SHALL render a compact sticky top header showing essential game progress (cards removed, current streak, active mode) and quick action triggers (Reset, Rules) so key controls remain reachable without requiring scrolling past the sidebar.

#### Scenario: Mobile header displays quick controls and stats
- **WHEN** viewed on a screen narrower than 768px
- **THEN** the top header SHALL present a compact single-row toolbar with key stat counts and action buttons
