## MODIFIED Requirements

### Requirement: Game status panel is always visible in the sidebar
The sidebar SHALL display a Progress & Stats panel below the setup controls containing match progress (cards removed) and player lifetime statistics (wins, losses, win rate, and streak), omitting redundant single-game status indicators that are displayed in the header and draw zone.

#### Scenario: Status updates while game is in progress
- **WHEN** the player removes a pair or completes a game
- **THEN** the sidebar panel SHALL immediately reflect the updated cards removed count and lifetime statistics

#### Scenario: Sidebar displays accumulated win loss statistics
- **WHEN** the sidebar status panel renders
- **THEN** it SHALL display the player's total Wins, Losses, Win Rate percentage, and Current Streak
