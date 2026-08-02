## MODIFIED Requirements

### Requirement: Trap mechanics enforcement (Red and Black Curses)
The game SHALL enforce structural traps for Stage 4 Cursed cards.

#### Scenario: Red Curse deals overlapping card face-down
- **WHEN** a card with a Red Curse (Attrition Stage 4, Red suit) is dealt into the pyramid
- **THEN** card(s) placed into the next lower row beneath it SHALL be dealt face-down AND SHALL flip face-up when they become exposed (playable) or via a Spades blessing

#### Scenario: Black Curse shuffles paired partner into Stock
- **WHEN** a card with a Black Curse (Attrition Stage 4, Black suit) is paired with a matching partner card
- **THEN** the Black Cursed card SHALL move to the Foundation stack
- **AND** the paired partner card SHALL be shuffled back into the face-down Stock draw pile instead of moving to the Foundation stack
