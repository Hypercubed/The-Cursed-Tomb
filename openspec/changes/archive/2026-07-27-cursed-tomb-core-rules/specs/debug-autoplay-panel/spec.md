## MODIFIED Requirements

### Requirement: Greedy solver engine
The system SHALL provide a greedy solver utility function that evaluates the current game state and determines the next legal move according to move priority rules (Single King removal > Unblocked pyramid pairs > Pyramid/Discard pairs > Draw/Cycle).
When the game mode is set to `cursed-tomb`, the solver SHALL evaluate legal moves using Functional Value (accounting for Scars) rather than Printed Rank, and SHALL respect all mechanical constraints (e.g., Red Curse face-down locks, Black Curse pairing restrictions).

#### Scenario: Solver executes single King move
- **WHEN** an unblocked King (rank 13, or a card with Functional Value 13 due to a Red Scar) exists in the pyramid or on top of the discard pile
- **THEN** solver identifies and executes playing that card immediately

#### Scenario: Solver executes pyramid pair removal
- **WHEN** two unblocked pyramid cards' Functional Values sum to 13 and no single Functional-King is playable, AND neither card is restricted by a Black Curse pairing constraint
- **THEN** solver selects and removes the pair of cards

#### Scenario: Solver draws card when no visible move exists
- **WHEN** no unblocked Kings or pairs summing to 13 exist among visible cards (respecting all Cursed Tomb rules), and the draw pile is non-empty
- **THEN** solver draws a card from the draw pile

#### Scenario: Solver detects deadlock
- **WHEN** no visible valid moves exist, the draw pile is empty, and no redraw cycles remain
- **THEN** solver returns null indicating no move is available
