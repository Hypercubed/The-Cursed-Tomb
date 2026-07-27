## MODIFIED Requirements

### Requirement: Suit and Rank Grid Visualization
The Matched Cards Tomb Vault SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix, visually distinguishing removed cards from active cards.
When in Cursed Tomb mode, each cell in the 4×13 matrix SHALL also visually display the card's current campaign state, including Attrition Stage (Scars, Curses, Entombed/Graveyard status), Upward Path Stage (Anchors), Hero Blessings (`[O]`), and its effective Functional Value.

#### Scenario: Displaying card mutations and functional values in matrix
- **WHEN** the Matched Cards Tomb Vault modal is open during a Cursed Tomb campaign
- **THEN** each card's cell displays its current ink marks (Scars/Curses/Blessings/Anchors), Entombed status if in Graveyard, and adjusted Functional Value

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid is highlighted with a checked/dimmed removed indicator

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid displays as active/unmatched
