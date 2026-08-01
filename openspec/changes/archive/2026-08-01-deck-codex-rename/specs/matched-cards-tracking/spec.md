## MODIFIED Requirements

### Requirement: Deck Codex Modal
The system SHALL provide an interactive modal view ("Deck Codex") accessible via a trigger button labeled "View Deck Codex" in the status sidebar.

#### Scenario: Opening the Deck Codex modal
- **WHEN** the player clicks the "View Deck Codex" button in the status sidebar
- **THEN** an overlay modal opens displaying the 4×13 suit/rank deck matrix, campaign card state/mutations, and remaining pair statistics

#### Scenario: Closing the Deck Codex modal
- **WHEN** the player clicks the close button or clicks outside the modal overlay
- **THEN** the modal closes and returns focus to the game board

### Requirement: Suit and Rank Grid Visualization
The Deck Codex SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix, visually distinguishing removed cards from active cards, as well as displaying card campaign state (Scars, Curses, Blessings, Anchors, Entombed status, and Functional Values).

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid is highlighted with a checked/dimmed removed indicator

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid displays as active/unmatched

### Requirement: Remaining Complement Pair Statistics
The Deck Codex SHALL display a summary of remaining complement pairs summing to 13 (Kings, Q+A, J+2, 10+3, 9+4, 8+5, 7+6) to assist strategic decision making.

#### Scenario: Displaying remaining pair counts
- **WHEN** the Deck Codex modal is open
- **THEN** it displays the count of remaining active cards for each rank and pair combination
