## ADDED Requirements

### Requirement: Multi-strategy solver engine
The system SHALL provide a unified solver engine supporting three distinct strategy modes: Greedy, Smart (heuristic lookahead), and Perfect (DFS/A* graph search oracle).

#### Scenario: Greedy strategy execution
- **WHEN** solver strategy is set to `greedy`
- **THEN** solver executes moves using rigid priority ordering (King > Pyramid pair > Pyramid/Discard pair > Draw/Cycle)

#### Scenario: Smart heuristic strategy execution
- **WHEN** solver strategy is set to `smart`
- **THEN** solver evaluates candidate moves using an unblock depth heuristic, rank bottleneck protection, and deck cycle economy before picking the highest scoring move

#### Scenario: Perfect solver strategy execution
- **WHEN** solver strategy is set to `perfect`
- **THEN** solver performs a graph search with state hashing across the complete game state (pyramid + remaining stock) to select the next step along a guaranteed winning solution path if one exists

#### Scenario: Deal winnability determination
- **WHEN** the game state updates or a new deal is initialized
- **THEN** the perfect solver evaluates whether the current board is winnable and returns a winnability status (`complete-victory`, `partial-victory`, `unwinnable`, or `deadlocked`)

### Requirement: Strategy selector and winnability UI
The system SHALL display solver strategy selection controls and a deal winnability status badge inside the Debug & Autoplay UI panel.

#### Scenario: Changing autoplay strategy mode
- **WHEN** user selects a strategy mode from the strategy selector dropdown or toggle
- **THEN** subsequent manual step actions and autoplay iterations use the selected strategy mode

#### Scenario: Displaying deal winnability status
- **WHEN** an active game is displayed
- **THEN** the Debug panel displays the deal's winnability status (`Complete Win`, `Pyramid Clear`, `Unwinnable`, or `Deadlocked`)

## MODIFIED Requirements

### Requirement: Autoplay controller
The system SHALL provide an autoplay controller that automatically executes solver moves using the active strategy mode on a configurable timer interval while the game is in progress.

#### Scenario: Autoplay progression
- **WHEN** autoplay is activated during an active game
- **THEN** solver moves execute automatically using the configured strategy mode at the timer interval until the game is won, lost, deadlocked, or paused

#### Scenario: Autoplay continuation past end game
- **WHEN** autoplay is running and the game status transitions to won or lost (or any end state)
- **THEN** autoplay automatically starts a new game and continues solver execution using the configured strategy mode until explicitly paused
