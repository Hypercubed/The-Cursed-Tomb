## MODIFIED Requirements

### Requirement: App shell uses responsive two-column layout on desktop
On viewports ≥ 1024px, the game shell SHALL display a full-width header bar at the top, and a two-column grid below containing a fixed-width left sidebar (setup controls and game status) alongside a main content area (pyramid board and draw zone) inside a fluid container that expands up to a maximum width of 1600px. On desktop viewports, the outer safe-area padding, header footprint, and play container margins SHALL use compact vertical spacing to fit within standard desktop browser window heights without causing page-level vertical scrollbars. The top edges of both the sidebar and the main content area SHALL align at the exact same vertical baseline underneath the top header. On narrower viewports (< 1024px), the layout SHALL stack vertically with responsive padding, collapsible or scroll-aligned sidebar panels, and full-width card container fitting narrow mobile screen widths without horizontal scrollbars.

#### Scenario: Desktop shows header bar and aligned two-column layout
- **WHEN** the viewport is 1024px or wider
- **THEN** a full-width top header SHALL display the game title, and both the setup sidebar and pyramid board area SHALL start at the exact same vertical baseline underneath the header

#### Scenario: Mobile shows stacked layout
- **WHEN** the viewport is narrower than 1024px
- **THEN** all panels SHALL stack vertically with setup controls and stats formatted to fit narrow mobile screen widths without horizontal scrollbars or clipping board visibility

#### Scenario: Desktop layout fits without vertical scrollbars
- **WHEN** viewed on desktop viewports (1024px or wider) with standard window heights (such as 1080p, 900p, or 768p displays)
- **THEN** the header, sidebar, pyramid board, and draw zone SHALL fit within the browser window without triggering page-level vertical scrolling

## ADDED Requirements

### Requirement: Viewport height-aware card scaling
The pyramid board cards, row overlaps, draw zone slot card placeholders, and action buttons SHALL dynamically downscale when the browser viewport height is constrained (e.g., height < 900px or < 800px) on desktop display widths.

#### Scenario: Card size downscales on reduced viewport height
- **WHEN** the desktop browser window height is reduced below 900px
- **THEN** card dimensions and row vertical spacing SHALL automatically adjust to smaller height proportions so the full 7-row pyramid and draw zone fit visually within the available height

#### Scenario: Sidebar handles reduced height gracefully
- **WHEN** the browser window height is insufficient to show the complete sidebar without overflow
- **THEN** the sidebar content SHALL remain internally scrollable without forcing the entire application window to scroll
