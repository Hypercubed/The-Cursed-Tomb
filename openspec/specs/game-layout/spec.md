# Game Layout

## Purpose

Responsive layout and structure for the Pyramid Solitaire game, dividing the UI into a setup and status sidebar and a main board area.

## Requirements

### Requirement: App shell uses responsive two-column layout on desktop
On viewports ≥ 1024px, the game shell SHALL display a full-width header bar at the top, and a two-column grid below containing a fixed-width left sidebar (setup controls and game status) alongside a main content area (pyramid board and draw zone) inside a fluid container that expands up to a maximum width of 1600px. The top edges of both the sidebar and the main content area SHALL align at the exact same vertical baseline underneath the top header. On narrower viewports (< 1024px), the layout SHALL stack vertically with responsive padding, collapsible or scroll-aligned sidebar panels, and full-width card container fitting narrow mobile screen widths without horizontal scrollbars.

#### Scenario: Desktop shows header bar and aligned two-column layout
- **WHEN** the viewport is 1024px or wider
- **THEN** a full-width top header SHALL display the game title, and both the setup sidebar and pyramid board area SHALL start at the exact same vertical baseline underneath the header

#### Scenario: Mobile shows stacked layout
- **WHEN** the viewport is narrower than 1024px
- **THEN** all panels SHALL stack vertically with setup controls and stats formatted to fit narrow mobile screen widths without horizontal scrollbars or clipping board visibility

### Requirement: Compact mobile header status bar
On viewports narrower than 768px, the game shell SHALL render a compact sticky top header showing essential game progress (cards removed, current streak, active mode) and quick action triggers (Reset, Rules) so key controls remain reachable without requiring scrolling past the sidebar.

#### Scenario: Mobile header displays quick controls and stats
- **WHEN** viewed on a screen narrower than 768px
- **THEN** the top header SHALL present a compact single-row toolbar with key stat counts and action buttons

### Requirement: Pyramid board is the visual centrepiece
The pyramid SHALL be rendered in a dedicated hero section that occupies the majority of the available board area with generous padding and centred alignment. It SHALL NOT share its container with the draw/discard zone.

#### Scenario: Pyramid and draw zone are in separate containers
- **WHEN** a game is in progress
- **THEN** the pyramid rows SHALL be rendered in a container that is visually distinct and separated from the draw/discard zone below it

#### Scenario: Pyramid rows are horizontally centred in their container
- **WHEN** any pyramid row is rendered
- **THEN** the cards in that row SHALL be centred horizontally within the available board width

### Requirement: Draw and discard zone is a dedicated strip
The draw pile and discard pile SHALL be displayed in a horizontal strip below the pyramid, visually separated by a divider or gap. Each pile SHALL have a clearly labelled card slot placeholder when empty. When running in Standard Solitaire mode (`mode === 'standard'`), the Diamond Vault slot SHALL be hidden to provide a classic 2-slot Stock and Waste pile layout. When running in Cursed Tomb mode (`mode === 'cursed-tomb'`), the Diamond Vault slot SHALL be visible.

#### Scenario: Draw zone appears below the pyramid
- **WHEN** a game is in progress
- **THEN** a draw/discard strip SHALL appear below the pyramid board with the draw pile slot on the left and the discard pile slot on the right

#### Scenario: Empty pile slot shows a placeholder
- **WHEN** the draw pile or discard pile is empty
- **THEN** the corresponding slot SHALL display a visible placeholder with a label (e.g. "Empty")

#### Scenario: Vault slot is hidden in Standard Solitaire mode
- **WHEN** the game mode is `standard`
- **THEN** the `♦ Vault` slot SHALL NOT be rendered in the Draw zone

#### Scenario: Vault slot is visible in Cursed Tomb mode
- **WHEN** the game mode is `cursed-tomb`
- **THEN** the `♦ Vault` slot SHALL be rendered in the Draw zone

### Requirement: Game setup panel is always visible in the sidebar
Setup controls (redraw cycles, win condition, start/reset buttons) SHALL be housed in the left sidebar and remain visible during gameplay so the player can restart without scrolling.

#### Scenario: Setup controls remain in sidebar during active game
- **WHEN** a game is in progress
- **THEN** the redraw, win-condition controls, and start/reset buttons SHALL remain visible in the sidebar without requiring a scroll

### Requirement: Game status panel is always visible in the sidebar
The sidebar SHALL display a Progress & Stats panel below the setup controls containing match progress (cards removed). When running in Cursed Tomb mode (`cursed-tomb`), it SHALL display active Campaign statistics (Pyramids Explored, Pyramids Conquered, Pyramids Collapsed, Total Attempts). When running in Standard Solitaire mode (`standard`), it SHALL display standard solitaire career statistics (Total Games Played, Clear/Win Rate %, Complete Victories, Partial Victories, Pyramids Collapsed, Current Streak, and Best Streak).

#### Scenario: Status updates while game is in progress
- **WHEN** cards are removed or the game mode changes
- **THEN** the status sidebar updates the progress metrics and displays the mode-specific stats (Campaign statistics in Cursed Tomb mode, or Standard Solitaire career statistics in Standard mode)

#### Scenario: Displaying Standard Solitaire stats in standard mode
- **WHEN** the game mode is `standard` and career stats are available
- **THEN** the status sidebar displays a dedicated "Standard Solitaire Stats" section presenting Total Games, Win Rate %, Complete Victories, Partial Victories, Collapses, Current Streak, and Best Streak

#### Scenario: Sidebar displays active campaign and lifetime statistics
- **WHEN** the sidebar status panel renders in Cursed Tomb mode
- **THEN** it SHALL display the active Campaign progress (Pyramids Explored, Pyramids Collapsed, Total Attempts) alongside the player's lifetime record

### Requirement: Reset Confirmation Dialog Interface
The application SHALL present a themed modal dialog when New Campaign is clicked to confirm starting a new campaign and resetting active campaign statistics.

#### Scenario: Modal displays tomb aesthetic and confirmation options
- **WHEN** the reset confirmation dialog is active
- **THEN** it SHALL be rendered in a modal overlay formatted with dark tomb styling, displaying a message asking to confirm starting a new campaign, a Confirm button, and a Cancel button

### Requirement: Draw and discard piles render as pedestals

The draw pile SHALL render with a stone pedestal visual containing a golden icon on its face. The discard pile SHALL render with a sandstone altar aesthetic that displays a glowing golden runic frame when a card is active or selected.

#### Scenario: Draw pile displays as a stone block
- **WHEN** the draw pile is rendered
- **THEN** it SHALL show a stone-block design with a centered golden icon

#### Scenario: Discard pile displays altar styling
- **WHEN** the discard pile is rendered
- **THEN** it SHALL show a sandstone altar slot, and show a glowing golden frame when a card is selected or active

### Requirement: Sidebar is styled as a leather-bound journal
The left sidebar containing the setup and status panels SHALL use a styled container background with uniform border widths and rounded corners, matching the dark sandstone tomb visual hierarchy without asymmetrical border offsets.

#### Scenario: Sidebar renders with uniform journal framing
- **WHEN** the page is loaded
- **THEN** the sidebar container SHALL display with symmetrical border widths on all sides, rounded corners, and aged parchment/obsidian interior panels

