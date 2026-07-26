## ADDED Requirements

### Requirement: End state determination based on tomb clearance
The game logic SHALL automatically evaluate and declare end states when card actions occur without requiring an upfront win condition selection:
- `complete-victory`: when all cards in the pyramid AND all cards in the draw pile/discard pile are removed.
- `partial-victory`: when all cards in the pyramid are removed, but cards remain in the draw pile or discard pile (game finishes immediately upon pyramid clearance).
- `pyramid-collapse`: when no valid moves remain while cards are still present in the pyramid.

#### Scenario: Clearing pyramid and deck declares complete victory
- **WHEN** the last remaining pyramid card is removed AND the draw pile and discard pile are empty
- **THEN** the game status SHALL transition to `complete-victory`

#### Scenario: Clearing pyramid with deck cards remaining declares partial victory
- **WHEN** the last remaining pyramid card is removed AND cards remain in the draw pile or discard pile
- **THEN** the game status SHALL transition to `partial-victory`

#### Scenario: Running out of moves with pyramid cards remaining declares pyramid collapse
- **WHEN** no valid pairs or Kings can be matched AND no redraws remain AND cards remain in the pyramid
- **THEN** the game status SHALL transition to `pyramid-collapse`

## MODIFIED Requirements

### Requirement: Loss detection covers infinite-redraw games
The game SHALL detect a pyramid collapse state for games configured with infinite redraws when no valid move is available across all reachable cards (visible pyramid cards + full discard pile) after the draw pile is exhausted.

#### Scenario: Infinite-redraw game with no available moves declares loss
- **WHEN** the draw pile is empty AND all cards in the discard pile are known AND no pair summing to 13 exists among visible pyramid cards and the full discard pile AND no lone King is present
- **THEN** the game status SHALL be set to `pyramid-collapse`

#### Scenario: Infinite-redraw game with remaining draw cards is not declared lost
- **WHEN** the draw pile still has cards remaining
- **THEN** the game status SHALL NOT be set to `pyramid-collapse` regardless of current visible-card move availability
