## ADDED Requirements

### Requirement: Non-blocking asynchronous instant solving
The system SHALL execute multi-step instant solver runs asynchronously, yielding execution to the browser event loop to prevent UI frame freezing and main thread locking.

#### Scenario: Instant solver execution
- **WHEN** user activates instant solver step or autoplay execution (`speedMs === 0`)
- **THEN** solver execution yields between move batches, allowing browser renders and maintaining UI responsiveness

### Requirement: Solver thinking state indicator
The system SHALL display an active "Thinking" indicator badge (`🔮 Divining path...`) inside the Debug & Autoplay panel while solver computations or winnability evaluations are processing, and disable interactive solver action triggers during execution.

#### Scenario: Displaying thinking indicator during calculation
- **WHEN** solver calculation or instant move execution is active
- **THEN** Debug panel displays the thinking indicator badge and disables Step, Strategy, and Force trigger buttons until computation concludes

## MODIFIED Requirements

### Requirement: Strategy selector and winnability UI
The system SHALL display solver strategy selection controls, a deal winnability status badge, and an active computation status indicator inside the Debug & Autoplay UI panel.

#### Scenario: Changing autoplay strategy mode
- **WHEN** user selects a strategy mode from the strategy selector dropdown or toggle
- **THEN** subsequent manual step actions and autoplay iterations use the selected strategy mode

#### Scenario: Displaying deal winnability status
- **WHEN** an active game is displayed and solver calculations are idle
- **THEN** the Debug panel displays the deal's winnability status (`Complete Win`, `Pyramid Clear`, `Unwinnable`, or `Deadlocked`)

#### Scenario: Asynchronous background winnability evaluation
- **WHEN** game state updates or deal resets
- **THEN** winnability status is evaluated asynchronously in the background without blocking main thread card interactions or UI rendering
