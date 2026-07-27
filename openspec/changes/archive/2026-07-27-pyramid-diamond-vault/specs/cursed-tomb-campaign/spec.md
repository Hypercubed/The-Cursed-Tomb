## MODIFIED Requirements

### Requirement: Suit Blessing powers
The game SHALL enforce the persistent powers of Hero Cards when cleared or exposed.

#### Scenario: Hearts Martyr blessing
- **WHEN** a Blessed Hearts card is cleared
- **THEN** the player SHALL be prompted to select one exposed pyramid card to treat as a fully immune Anchor (`[+]`) for the remainder of the current round

#### Scenario: Diamonds Vault blessing
- **WHEN** a Blessed Diamonds card is exposed on top of the Waste pile OR is exposed in the Pyramid layout
- **THEN** the player MAY move it for free into the Diamond Vault slot adjacent to the Waste pile provided the Diamond Vault slot is empty

#### Scenario: Spades Tunnel blessing
- **WHEN** a Blessed Spades card is cleared
- **THEN** the player SHALL be prompted to select one face-down card to flip face-up

#### Scenario: Clubs Equalizer blessing
- **WHEN** a Blessed Clubs card is paired with another card
- **THEN** its partner card SHALL ignore any active Scar value shift and be evaluated strictly by its original Printed Rank
