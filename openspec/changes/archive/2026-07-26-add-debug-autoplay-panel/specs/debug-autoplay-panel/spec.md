## ADDED Requirements

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

### Requirement: Autoplay controller
The system SHALL provide an autoplay controller that automatically executes greedy solver moves on a configurable timer interval while the game is in progress.

#### Scenario: Autoplay progression
- **WHEN** autoplay is activated during an active game
- **THEN** solver moves execute automatically at the configured speed interval until the game is won, lost, deadlocked, or paused

#### Scenario: Autoplay automatic pause on game completion
- **WHEN** autoplay is running and the game status transitions to won or lost
- **THEN** autoplay automatically halts and resets active state

### Requirement: Debug and Autoplay UI panel
The system SHALL display a dedicated Debug & Autoplay panel within the game sidebar containing instant game state jump buttons and autoplay controls.

#### Scenario: Force instant win
- **WHEN** user clicks the "Force Win" debug button
- **THEN** the remaining pyramid cards are cleared, status changes to won, and win state persistence triggers

#### Scenario: Force instant loss
- **WHEN** user clicks the "Force Loss" debug button
- **THEN** remaining draw cards and redraws are zeroed out, status changes to lost, and loss state persistence triggers

#### Scenario: Step move control
- **WHEN** user clicks the "Step (1 Move)" button
- **THEN** exactly one greedy solver move is executed on the current board
