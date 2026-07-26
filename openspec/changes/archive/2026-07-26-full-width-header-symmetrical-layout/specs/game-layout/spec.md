## MODIFIED Requirements

### Requirement: App shell uses responsive two-column layout on desktop
On viewports ≥ 1024px, the game shell SHALL display a full-width header bar at the top, and a two-column grid below containing a fixed-width left sidebar (setup controls and game status) alongside a main content area (pyramid board and draw zone) inside a fluid container that expands up to a maximum width of 1600px. The top edges of both the sidebar and the main content area SHALL align at the exact same vertical baseline underneath the top header. On narrower viewports (< 1024px), the layout SHALL stack vertically with responsive padding so the game board remains visually prominent without horizontal overflow.

#### Scenario: Desktop shows header bar and aligned two-column layout
- **WHEN** the viewport is 1024px or wider
- **THEN** a full-width top header SHALL display the game title, and both the setup sidebar and pyramid board area SHALL start at the exact same vertical baseline underneath the header

#### Scenario: Mobile shows stacked layout
- **WHEN** the viewport is narrower than 1024px
- **THEN** all panels SHALL stack vertically with setup controls at the top and the board below, formatted to fit narrow mobile screen widths without horizontal scrollbars

### Requirement: Sidebar is styled as a leather-bound journal
The left sidebar containing the setup and status panels SHALL use a styled container background with uniform border widths and rounded corners, matching the dark sandstone tomb visual hierarchy without asymmetrical border offsets.

#### Scenario: Sidebar renders with uniform journal framing
- **WHEN** the page is loaded
- **THEN** the sidebar container SHALL display with symmetrical border widths on all sides, rounded corners, and aged parchment/obsidian interior panels
