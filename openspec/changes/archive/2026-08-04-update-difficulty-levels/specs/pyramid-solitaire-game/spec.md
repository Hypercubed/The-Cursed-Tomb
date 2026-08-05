## MODIFIED Requirements

### Requirement: Loss detection covers infinite-redraw games
The game SHALL detect a pyramid collapse state for games configured with infinite redraws when no valid move is available across all reachable cards (visible pyramid cards + full discard pile) after the draw pile is exhausted.

**Note**: This requirement is no longer triggered by the Novice difficulty, which now uses a finite redeal count of 5. It remains applicable only to any custom game configured with `redrawsRemaining: null` (infinite). The Novice preset SHALL use `redrawsRemaining: 5` going forward.

#### Scenario: Infinite-redraw game with no available moves declares loss
- **WHEN** the draw pile is empty AND all cards in the discard pile are known AND no pair summing to 13 exists among visible pyramid cards and the full discard pile AND no lone King is present AND `redrawsRemaining` is `null`
- **THEN** the game status SHALL be set to `pyramid-collapse`

#### Scenario: Infinite-redraw game with remaining draw cards is not declared lost
- **WHEN** the draw pile still has cards remaining AND `redrawsRemaining` is `null`
- **THEN** the game status SHALL NOT be set to `pyramid-collapse` regardless of current visible-card move availability

#### Scenario: Novice difficulty game uses finite redraw limit of 5
- **WHEN** a new game is started with the Novice difficulty setting
- **THEN** `redrawsRemaining` SHALL be initialized to `5` (not `null`)
