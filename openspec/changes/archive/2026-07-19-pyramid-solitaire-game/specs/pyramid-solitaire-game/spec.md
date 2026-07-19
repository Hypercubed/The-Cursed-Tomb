## ADDED Requirements

### Requirement: Pyramid solitaire game UI and rules
The system SHALL provide a browser-based Pyramid Solitaire game with standard rules.

#### Scenario: Start a new game
- **WHEN** the user opens the app and starts a new game
- **THEN** the system deals a shuffled standard 52-card deck into a face-up pyramid of 28 cards and a draw pile of 24 cards

#### Scenario: Valid card removal
- **WHEN** the user selects one or two available cards whose values total 13 according to standard card ranks (King=13, Queen=12, Jack=11, Ace=1, numbered cards as their face value)
- **THEN** the system removes only unblocked cards from the pyramid and updates the board state

#### Scenario: Removing a lone King
- **WHEN** the user selects a King that is not blocked by any cards above it
- **THEN** the system removes the King immediately because its value is 13

### Requirement: Redraws configuration
The system SHALL offer a configurable redraw limit for the draw pile.

#### Scenario: No redraws allowed
- **WHEN** the user configures redraws to 0 and exhausts the draw pile
- **THEN** the system prevents additional redraws and only allows card matching against the remaining pyramid or draw card

#### Scenario: Limited redraws
- **WHEN** the user configures redraws to 1 or 2 and exhausts the draw pile
- **THEN** the system allows the user to reshuffle or reuse the draw pile up to the configured number of times

#### Scenario: Infinite redraws
- **WHEN** the user configures redraws to infinite
- **THEN** the system allows the user to cycle through the draw pile indefinitely until the game ends

### Requirement: Win condition selection
The system SHALL allow the user to choose the win condition before starting a game.

#### Scenario: Pyramid-only win condition
- **WHEN** the user selects the pyramid-only win condition and removes all cards from the pyramid
- **THEN** the system declares the game won regardless of remaining draw pile cards

#### Scenario: Complete victory condition
- **WHEN** the user selects the complete victory condition and clears both the pyramid and the draw pile
- **THEN** the system declares the game won only after both areas are empty

### Requirement: Loss detection
The system SHALL detect when no valid moves remain under the current draw configuration.

#### Scenario: No remaining moves
- **WHEN** the pyramid and current draw card cannot form any valid 13 combinations and redraws are exhausted
- **THEN** the system declares the game lost and displays a summary state

### Requirement: User interactions and game state
The system SHALL allow the user to interact with the pyramid, draw pile, and controls in the browser.

#### Scenario: Select card pair
- **WHEN** the user clicks a valid pair of available cards that sum to 13
- **THEN** the cards are removed and the game state updates immediately

#### Scenario: Use draw pile card
- **WHEN** the user clicks a draw card and an available pyramid card that sum to 13
- **THEN** the draw card and pyramid card are removed if the pyramid card is not blocked

#### Scenario: Restart game
- **WHEN** the user clicks the restart button
- **THEN** the system resets to a new shuffled game with the same configuration
