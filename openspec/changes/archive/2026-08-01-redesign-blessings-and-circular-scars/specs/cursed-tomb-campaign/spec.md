## MODIFIED Requirements

### Requirement: Functional Value scaling and Retrospective Anchors
The game SHALL calculate card pairing values dynamically, applying a +1 value shift for Red Scars (stage 3+ Hearts/Diamonds) and a -1 value shift for Black Scars (stage 3+ Spades/Clubs). Functional values SHALL wrap circularly between 1 (Ace) and 13 (King). An Anchor (`[+]`) SHALL prevent future attrition progression but SHALL NOT erase pre-existing Scars or Curses.

#### Scenario: Scarred Red card acts as higher value
- **WHEN** a Red card (e.g., ♥ Queen, printed rank 12) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 13 AND it can be cleared solo as a King

#### Scenario: Scarred Black card acts as lower value
- **WHEN** a Black card (e.g., ♠ 10, printed rank 10) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 9

#### Scenario: Scarred Black Ace wraps circularly to 13
- **WHEN** a Black Ace (e.g., ♠ Ace, printed rank 1) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL wrap to 13 AND it SHALL be clearable solo as a King

#### Scenario: Scarred Red King wraps circularly to 1
- **WHEN** a Red King (e.g., ♥ King, printed rank 13) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL wrap to 1 AND it SHALL be pairable with a Queen (functional value 12)

### Requirement: Suit Blessing powers
The game SHALL enforce the persistent powers of Hero Cards when cleared or exposed.

#### Scenario: Hearts Resurrection blessing
- **WHEN** a Blessed Hearts card is cleared
- **THEN** the game SHALL draw 1 random card from the Graveyard Box (if non-empty) AND return it to the active campaign pool as Attrition Stage 4 (Cursed)
- **AND** IF the Graveyard Box is empty, no action SHALL be taken

#### Scenario: Diamonds Vault blessing
- **WHEN** a Blessed Diamonds card is exposed on top of the Waste pile OR is exposed in the Pyramid layout
- **THEN** the player MAY move it for free into the Diamond Vault slot adjacent to the Waste pile provided the Diamond Vault slot is empty

#### Scenario: Spades Tunnel blessing
- **WHEN** a Blessed Spades card is cleared
- **THEN** the player SHALL be prompted to select one face-down card to flip face-up

#### Scenario: Clubs Universal Wildcard blessing
- **WHEN** a Blessed Clubs card is paired with another exposed card
- **THEN** it SHALL legally pair with ANY exposed card regardless of the partner card's functional value
