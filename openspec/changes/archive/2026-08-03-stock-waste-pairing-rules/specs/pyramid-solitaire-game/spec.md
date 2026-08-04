## ADDED Requirements

### Requirement: Exposed Stock card pairing before discarding
The top card of the draw pile (`drawPile[0]`) SHALL be exposed and eligible for selection and pairing with any exposed pyramid card, the top card of the discard pile (`discardPile[0]`), or cleared singly if its functional value is 13, prior to being moved into the discard pile.

#### Scenario: Pairing top stock card with exposed pyramid card
- **WHEN** the top card of the draw pile is selected AND an exposed pyramid card is selected such that their functional values sum to 13
- **THEN** both cards SHALL be removed from their respective zones AND the card underneath in the draw pile SHALL become the new exposed top stock card

#### Scenario: Pairing top stock card with top discard card
- **WHEN** the top card of the draw pile is selected AND the top card of the discard pile (`discardPile[0]`) is selected such that their functional values sum to 13
- **THEN** both cards SHALL be removed from their respective zones AND the card underneath in the discard pile SHALL become the new top discard card

#### Scenario: Clearing single King directly from top stock card
- **WHEN** the top card of the draw pile has a functional value of 13 AND is selected for single removal
- **THEN** the stock card SHALL be removed from the board AND the card underneath in the draw pile SHALL become the new exposed top stock card

### Requirement: Dedicated Stock-to-Waste pass action
The game engine and user interface SHALL expose an explicit action (`discardStockCard`) to move the top exposed card from the draw pile onto the top of the discard pile when no match is made or when the player chooses to hold the card.

#### Scenario: Passing top stock card to discard pile
- **WHEN** the `discardStockCard` action is invoked and the draw pile is non-empty
- **THEN** the top card of the draw pile SHALL be moved to the top of the discard pile (`discardPile[0]`) AND `redrawsRemaining` SHALL remain unchanged

## MODIFIED Requirements

### Requirement: Draw-pile advance and pile cycling are separate operations
The game logic SHALL expose distinct functions for draw-pile interaction:
- `discardStockCard(state)`: advances the draw pile by moving the top exposed card to the discard pile; does not affect `redrawsRemaining`.
- `cyclePile(state)`: moves all cards from the discard pile back to the draw pile and decrements `redrawsRemaining` when finite. SHALL be a no-op when `redrawsRemaining === 0`.

#### Scenario: Discarding a stock card does not consume a redraw
- **WHEN** `discardStockCard` is called and the draw pile is non-empty
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
