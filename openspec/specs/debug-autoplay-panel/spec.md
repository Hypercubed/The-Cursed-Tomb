# debug-autoplay-panel

## Requirements

### Requirement: Greedy solver engine
The system SHALL provide a greedy solver utility function that evaluates the current game state and determines the next legal move according to move priority rules (Single King removal > Unblocked pyramid pairs > Pyramid/Discard pairs > Draw/Cycle).

#### Scenario: Solver executes single King move
- **WHEN** an unblocked King (rank 13) exists in the pyramid or on top of the discard pile
- **THEN** solver identifies and executes playing that King immediately

#### Scenario: Solver executes pyramid pair removal
- **WHEN** two unblocked pyramid cards sum to 13 and no single King is playable
- **THEN** solver selects and removes the pair of cards

#### Scenario: Solver draws card when no visible move exists
- **WHEN** no unblocked Kings or pairs summing to 13 exist among visible cards, and the draw pile is non-empty
- **THEN** solver draws a card from the draw pile

#### Scenario: Solver detects deadlock
- **WHEN** no visible valid moves exist, the draw pile is empty, and no redraw cycles remain
- **THEN** solver returns null indicating no move is available

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

### Requirement: Autoplay controller
The system SHALL provide an autoplay controller that automatically executes solver moves using the active strategy mode on a configurable timer interval while the game is in progress, preserving campaign state and resolving hero targeting modes.

#### Scenario: Autoplay progression
- **WHEN** autoplay is activated during an active game
- **THEN** solver moves execute automatically using the configured strategy mode at the timer interval until the game is won, lost, deadlocked, or paused

#### Scenario: Autoplay continuation past end game
- **WHEN** autoplay is running and the game status transitions to won or lost (or any end state)
- **THEN** autoplay automatically starts a new game and continues solver execution using the configured strategy mode until explicitly paused
- **AND IF** an active campaign is present, starting a new game SHALL reuse the campaign's master deck and graveyard rather than resetting to an unmarked default deck

#### Scenario: Solver hero power targeting resolution
- **WHEN** solver execution encounters an active hero power targeting mode (`targeting-spades` or `targeting-hearts`)
- **THEN** the solver SHALL automatically select a valid target card (revealing a face-down card for Spades or granting temporary immunity to an exposed card for Hearts) and reset `interactionMode` to `normal` without stalling or force-resigning

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

### Requirement: Debug and Autoplay UI panel
The system SHALL display a dedicated Debug & Autoplay panel within the game sidebar containing instant game state jump buttons and autoplay controls.

#### Scenario: Force instant win
- **WHEN** user clicks the "Force Win" debug button
- **THEN** the system identifies remaining pyramid cards, records a synthetic last cleared pair (preferring valid 13-pairs or highest-value cards) on the game state, clears remaining pyramid cards, changes status to won, and triggers win state and campaign lifecycle persistence

#### Scenario: Force instant loss
- **WHEN** user clicks the "Force Loss" debug button
- **THEN** remaining draw cards and redraws are zeroed out, status changes to lost, and loss state persistence triggers

#### Scenario: Step move control
- **WHEN** user clicks the "Step (1 Move)" button
- **THEN** exactly one greedy solver move is executed on the current board

### Requirement: Campaign-aware board restarts
When starting or restarting a game from the Debug & Autoplay panel while a campaign is active, the system SHALL initialize the new game using the active campaign's persistent master deck and graveyard to preserve all card markings (attrition scars, anchor badges, hero blessing rings).

#### Scenario: Manual or automatic restart during campaign autoplay
- **WHEN** a game start or restart is triggered from the Debug panel while a campaign is active
- **THEN** cards dealt to the pyramid, draw pile, and discard pile retain all accumulated attrition stages, reward stages, and blessing statuses from the campaign's master deck
