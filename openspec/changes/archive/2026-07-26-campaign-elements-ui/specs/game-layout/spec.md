## MODIFIED Requirements

### Requirement: Game status panel is always visible in the sidebar
The sidebar SHALL display a Progress & Stats panel below the setup controls containing match progress (cards removed), active Campaign statistics (Pyramids Explored, Pyramids Collapsed, Total Attempts, Campaign Victory status), and cumulative player statistics, omitting redundant single-game status indicators that are displayed in the header and draw zone.

#### Scenario: Status updates while game is in progress
- **WHEN** the player removes a pair or completes a game
- **THEN** the sidebar panel SHALL immediately reflect the updated cards removed count, active campaign progress, and lifetime statistics

#### Scenario: Sidebar displays active campaign and lifetime statistics
- **WHEN** the sidebar status panel renders
- **THEN** it SHALL display the active Campaign progress (Pyramids Explored, Pyramids Collapsed, Total Attempts) alongside the player's lifetime record

### Requirement: Reset Confirmation Dialog Interface
The application SHALL present a themed modal dialog when New Campaign is clicked to confirm starting a new campaign and resetting active campaign statistics.

#### Scenario: Modal displays tomb aesthetic and confirmation options
- **WHEN** the reset confirmation dialog is active
- **THEN** it SHALL be rendered in a modal overlay formatted with dark tomb styling, displaying a message asking to confirm starting a new campaign, a Confirm button, and a Cancel button
