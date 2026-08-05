## MODIFIED Requirements

### Requirement: Pair removal resolves selected card from live game state
When a player selects two cards to pair for removal, the game SHALL read the current removed/selected state of the first selected card from the active game state (pyramid, draw pile, or discard pile), not from the original immutable deck snapshot. In Standard Solitaire mode (`mode === 'standard'`), cards SHALL be rendered with standard ranks and printed values without campaign scars, curses, or suit blessings.

#### Scenario: Pair selected with already-removed first card is rejected
- **WHEN** a card has been removed from the board AND a second card targeting a sum of 13 with it is clicked
- **THEN** the move SHALL be rejected and no cards SHALL be removed

#### Scenario: Valid pair with live card state is accepted
- **WHEN** two unremoved, visible cards whose ranks sum to 13 are selected in sequence
- **THEN** both cards SHALL be removed from the board

#### Scenario: Standard Solitaire mode renders pure printed card ranks
- **WHEN** cards are rendered in Standard Solitaire mode (`mode === 'standard'`)
- **THEN** cards SHALL NOT render campaign scars, attrition lines, functional value shifts (+1/-1 annotations), or suit hero icons
