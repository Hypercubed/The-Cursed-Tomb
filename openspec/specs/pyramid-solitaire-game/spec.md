# Pyramid Solitaire Game

## Purpose

A pyramid solitaire card game where players remove pairs of cards summing to 13, with configurable win conditions and redraw limits.

## Requirements

### Requirement: Pair removal resolves selected card from live game state
When a player selects two cards to pair for removal, the game SHALL read the current removed/selected state of the first selected card from the active game state (pyramid, draw pile, or discard pile), not from the original immutable deck snapshot.

#### Scenario: Pair selected with already-removed first card is rejected
- **WHEN** a card has been removed from the board AND a second card targeting a sum of 13 with it is clicked
- **THEN** the move SHALL be rejected and no cards SHALL be removed

#### Scenario: Valid pair with live card state is accepted
- **WHEN** two unremoved, visible cards whose ranks sum to 13 are selected in sequence
- **THEN** both cards SHALL be removed from the board

### Requirement: Loss detection covers infinite-redraw games
The game SHALL detect a loss state for games configured with infinite redraws when no valid move is available across all reachable cards (visible pyramid cards + full discard pile) after the draw pile is exhausted.

#### Scenario: Infinite-redraw game with no available moves declares loss
- **WHEN** the draw pile is empty AND all cards in the discard pile are known AND no pair summing to 13 exists among visible pyramid cards and the full discard pile AND no lone King is present
- **THEN** the game status SHALL be set to `lost`

#### Scenario: Infinite-redraw game with remaining draw cards is not declared lost
- **WHEN** the draw pile still has cards remaining
- **THEN** the game status SHALL NOT be set to `lost` regardless of current visible-card move availability

### Requirement: Draw-pile advance and pile cycling are separate operations
The game logic SHALL expose two distinct functions for draw-pile interaction:
- `drawCard(state)`: advances the draw pile by moving the top card to the discard pile; does not affect `redrawsRemaining`.
- `cyclePile(state)`: moves all cards from the discard pile back to the draw pile and decrements `redrawsRemaining` when finite. SHALL be a no-op when `redrawsRemaining === 0`.

#### Scenario: Drawing a card does not consume a redraw
- **WHEN** `drawCard` is called and the draw pile is non-empty
- **THEN** the top draw-pile card SHALL move to the discard pile AND `redrawsRemaining` SHALL remain unchanged

#### Scenario: Cycling the pile consumes one finite redraw
- **WHEN** `cyclePile` is called and `redrawsRemaining` is a finite number greater than 0
- **THEN** the discard pile SHALL become the new draw pile AND `redrawsRemaining` SHALL decrease by 1

#### Scenario: Cycling the pile with infinite redraws does not modify the counter
- **WHEN** `cyclePile` is called and `redrawsRemaining` is `null`
- **THEN** the discard pile SHALL become the new draw pile AND `redrawsRemaining` SHALL remain `null`

#### Scenario: Cycling with 0 redraws remaining is a no-op
- **WHEN** `cyclePile` is called and `redrawsRemaining === 0`
- **THEN** the game state SHALL be returned unchanged

### Requirement: Red suits are visually distinguished on cards
Cards with hearts (♥) or diamonds (♦) suits SHALL be rendered with red text. Cards with spades (♠) or clubs (♣) SHALL use the default light text color. This requirement is now fulfilled by the `PlayingCard` component introduced in the `card-rendering` capability rather than inline logic in `App.tsx`.

#### Scenario: Heart and diamond cards display in red
- **WHEN** a card with suit ♥ or ♦ is rendered on the board or in the discard area
- **THEN** the card text SHALL be rendered in the `game-red` colour token

#### Scenario: Spade and club cards display in default color
- **WHEN** a card with suit ♠ or ♣ is rendered
- **THEN** the card text SHALL use the default `game-card-text` colour token

### Requirement: Removed cards do not occupy layout space
Cards that have been removed from the pyramid SHALL NOT reserve visual space in the row layout. Sibling cards in the same row SHALL fill the available space. This requirement continues to apply in the redesigned `PyramidBoard` component.

#### Scenario: Removed card collapses in layout
- **WHEN** a card is removed from the pyramid
- **THEN** it SHALL no longer occupy space in its row's flex layout
