## MODIFIED Requirements

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
