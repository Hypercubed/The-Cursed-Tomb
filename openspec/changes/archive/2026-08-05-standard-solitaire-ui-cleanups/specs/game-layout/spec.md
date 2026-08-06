## MODIFIED Requirements

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

### Requirement: Game status panel is always visible in the sidebar
The sidebar SHALL display a Progress & Stats panel below the setup controls containing match progress (cards removed). When running in Cursed Tomb mode, it SHALL display active Campaign statistics (Pyramids Explored, Pyramids Conquered, Pyramids Collapsed, Total Attempts). When running in Standard Solitaire mode, it SHALL hide campaign progress statistics or display standard solitaire stats (Complete Victories, Partial Victories, Collapses/Losses, Win %, Streaks).

#### Scenario: Status updates while game is in progress
- **WHEN** the player removes a pair or completes a game
- **THEN** the sidebar panel SHALL immediately reflect the updated cards removed count, active campaign/standard progress, and lifetime statistics

#### Scenario: Sidebar displays active campaign and lifetime statistics
- **WHEN** the sidebar status panel renders in Cursed Tomb mode
- **THEN** it SHALL display the active Campaign progress (Pyramids Explored, Pyramids Collapsed, Total Attempts) alongside the player's lifetime record

#### Scenario: Sidebar hides campaign statistics in Standard Solitaire mode
- **WHEN** the sidebar status panel renders in Standard Solitaire mode
- **THEN** it SHALL NOT render active campaign progression metrics (Pyramids Explored, Conquered, Collapsed)
