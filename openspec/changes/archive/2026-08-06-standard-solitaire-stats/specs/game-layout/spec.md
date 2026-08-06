## MODIFIED Requirements

### Requirement: Game status panel is always visible in the sidebar
The sidebar SHALL display a Progress & Stats panel below the setup controls containing match progress (cards removed). When running in Cursed Tomb mode (`cursed-tomb`), it SHALL display active Campaign statistics (Pyramids Explored, Pyramids Conquered, Pyramids Collapsed, Total Attempts). When running in Standard Solitaire mode (`standard`), it SHALL display standard solitaire career statistics (Total Games Played, Clear/Win Rate %, Complete Victories, Partial Victories, Pyramids Collapsed, Current Streak, and Best Streak).

#### Scenario: Status updates while game is in progress
- **WHEN** cards are removed or the game mode changes
- **THEN** the status sidebar updates the progress metrics and displays the mode-specific stats (Campaign statistics in Cursed Tomb mode, or Standard Solitaire career statistics in Standard mode)

#### Scenario: Displaying Standard Solitaire stats in standard mode
- **WHEN** the game mode is `standard` and career stats are available
- **THEN** the status sidebar displays a dedicated "Standard Solitaire Stats" section presenting Total Games, Win Rate %, Complete Victories, Partial Victories, Collapses, Current Streak, and Best Streak
