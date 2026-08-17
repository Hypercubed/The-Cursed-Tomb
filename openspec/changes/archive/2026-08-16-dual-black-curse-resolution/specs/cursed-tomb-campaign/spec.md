## MODIFIED Requirements

### Requirement: Trap mechanics enforcement (Red and Black Curses)
The game SHALL enforce structural traps for Stage 4 Cursed cards as defined in `docs/rules.md` §4.

#### Scenario: Red Curse deals overlapping card face-down
- **WHEN** a card with a Red Curse (Attrition Stage 4, Red suit: ♥ or ♦, not blessed) is dealt into the pyramid
- **THEN** card(s) placed into the next lower row beneath it SHALL be dealt face-down AND SHALL flip face-up when they become exposed (playable) or via a ♠ Spades blessing
- **AND** the center-face icon SHALL be the Downward Triangle `▼` (trap door)

#### Scenario: Black Curse recycles partner weight into Stock
- **WHEN** a pair is cleared that includes a Black Cursed card (Attrition Stage 4, Black suit: ♠ or ♣, not blessed)
- **THEN** the Black Cursed card SHALL move to the Foundation stack AND the paired partner card SHALL be shuffled back into the face-down Stock draw pile instead of moving to the Foundation stack
- **AND** if both cards in the pair are Black Cursed, the card with the higher functional value SHALL move to the Foundation stack AND only the partner card with the lower functional value SHALL be shuffled back into the face-down Stock draw pile
- **AND** the center-face icon SHALL be the Trapezoid Weight `⏍` (heavy weight)
