## MODIFIED Requirements

### Requirement: Suit Blessing powers
The game SHALL enforce the persistent powers of Hero Cards when cleared or exposed.

#### Scenario: Hearts Resurrection blessing
- **WHEN** a Blessed Hearts card is cleared
- **THEN** the game SHALL draw 1 random card from the Graveyard Box (if non-empty) AND return it to the active campaign pool as Attrition Stage 4 (Cursed)
- **AND** IF the Graveyard Box is empty, no action SHALL be taken

#### Scenario: Diamonds Vault blessing
- **WHEN** a Blessed Diamonds card is exposed on top of the Waste pile OR is exposed in the Pyramid layout
- **THEN** the player MAY move it for free into the Diamond Vault slot adjacent to the Waste pile by selecting the card and clicking the empty Diamond Vault slot provided the Diamond Vault slot is empty

#### Scenario: Spades Tunnel blessing
- **WHEN** a Blessed Spades card is cleared
- **THEN** the player SHALL be prompted to select one face-down card to flip face-up

#### Scenario: Clubs Universal Wildcard blessing
- **WHEN** a Blessed Clubs card is paired with another exposed card
- **THEN** it SHALL legally pair with ANY exposed card regardless of the partner card's functional value
