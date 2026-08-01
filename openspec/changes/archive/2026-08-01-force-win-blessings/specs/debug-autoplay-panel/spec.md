## MODIFIED Requirements

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
