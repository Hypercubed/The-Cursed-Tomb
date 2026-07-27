## ADDED Requirements

### Requirement: Persistent 52-card deck with mutation tracking
The campaign SHALL maintain a persistent master deck of 52 cards across multiple rounds, tracking their Attrition Stage (0-5: None, Vulnerable, Doubtful, Scar, Curse, Entombed), Reward Stage (0-2: None, Fortifying `[—]`, Anchored `[+]`), Blessed status (`[O]`), and Graveyard status.

#### Scenario: Card mutations persist into new rounds
- **WHEN** a round ends and a new round begins
- **THEN** cards dealt into the new pyramid SHALL retain all ink marks (Scars, Curses, Blessings, Anchors) earned in previous rounds

### Requirement: Functional Value scaling and Retrospective Anchors
The game SHALL calculate card pairing values dynamically, applying a +1 value shift for Red Scars (stage 3+ Hearts/Diamonds) and a -1 value shift for Black Scars (stage 3+ Spades/Clubs). An Anchor (`[+]`) SHALL prevent future attrition progression but SHALL NOT erase pre-existing Scars or Curses.

#### Scenario: Scarred Red card acts as higher value
- **WHEN** a Red card (e.g., ♥ Queen, printed rank 12) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 13 AND it can be cleared solo as a King

#### Scenario: Scarred Black card acts as lower value
- **WHEN** a Black card (e.g., ♠ 10, printed rank 10) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 9

### Requirement: Attrition Phase on game freeze
When a round freezes (pyramid collapse), the campaign SHALL identify Bottlenecks (exposed cards at lowest remaining base tiers of the frozen pyramid) and increment their Attrition Stage by one stroke unless they possess a completed Anchor (`[+]`) or active temporary immunity.

#### Scenario: Bottleneck card gains an attrition mark
- **WHEN** a round freezes AND an exposed pyramid card is not Anchored
- **THEN** its Attrition Stage SHALL increase by 1

#### Scenario: Entombed card moves to Graveyard
- **WHEN** an attrition mark increases a card's Attrition Stage to 5
- **THEN** the card SHALL be permanently moved to the Graveyard Box AND SHALL NOT be dealt in future rounds

#### Scenario: Anchored card ignores attrition
- **WHEN** a round freezes AND a bottleneck card has a completed Anchor (`[+]`)
- **THEN** its Attrition Stage SHALL NOT be modified

### Requirement: Survival Reward Phase and Rule of Ink Overlap
When a round achieves a Pyramid Clear, the campaign SHALL evaluate the final visual transaction (Pair Clear or Solo King Clear) to assign rewards. If a card already features upper-right failure ink, it SHALL NOT become an Anchor (Rule of Ink Overlap).

#### Scenario: Final pair clear grants Hero and Anchor
- **WHEN** a pair clears the final pyramid cards
- **THEN** the card with the higher functional value SHALL gain the Blessed status (`[O]`) AND the lower-value card SHALL increment its Reward Stage (`[—]` or `[+]`) provided it has no upper-right failure ink

#### Scenario: Solo King clear grants Anchor stroke
- **WHEN** a standalone King clears the final pyramid card
- **THEN** it SHALL increment its Reward Stage (`[—]` or `[+]`) provided it has no upper-right failure ink AND no Fallen Hero blessing SHALL be awarded

### Requirement: Trap mechanics enforcement (Red and Black Curses)
The game SHALL enforce structural traps for Stage 4 Cursed cards.

#### Scenario: Red Curse deals overlapping card face-down
- **WHEN** a card with a Red Curse (Attrition Stage 4, Red suit) is dealt into the pyramid
- **THEN** card(s) placed into the next lower row beneath it SHALL be dealt face-down AND SHALL flip face-up when they become exposed (playable) or via a Spades blessing (Note: Red Curses have no mechanical face-down effect when dealt in the last or second-to-last row)

#### Scenario: Black Curse restricts pairing to pyramid
- **WHEN** a card with a Black Curse (Attrition Stage 4, Black suit) is exposed
- **THEN** it SHALL only be legally pairable with another exposed card within the pyramid structure, ignoring Stock or Waste cards

### Requirement: Suit Blessing powers
The game SHALL enforce the persistent powers of Hero Cards when cleared or exposed.

#### Scenario: Hearts Martyr blessing
- **WHEN** a Blessed Hearts card is cleared
- **THEN** the player SHALL be prompted to select one exposed pyramid card to treat as a fully immune Anchor (`[+]`) for the remainder of the current round

#### Scenario: Diamonds Vault blessing
- **WHEN** a Blessed Diamonds card is exposed on top of the Waste pile
- **THEN** the player MAY move it for free into the Diamond Vault slot adjacent to the Waste pile

#### Scenario: Spades Tunnel blessing
- **WHEN** a Blessed Spades card is cleared
- **THEN** the player SHALL be prompted to select one face-down card to flip face-up

#### Scenario: Clubs Equalizer blessing
- **WHEN** a Blessed Clubs card is paired with another card
- **THEN** its partner card SHALL ignore any active Scar value shift and be evaluated strictly by its original Printed Rank

### Requirement: Campaign End & Audit Conditions (Starvation and Volatile Collapse)
The campaign engine SHALL audit active deck pool size and Graveyard counts between rounds.

#### Scenario: Starvation condition triggers campaign defeat
- **WHEN** fewer than 28 active cards remain in the campaign pool at the start of a new round
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse)

#### Scenario: Volatile Collapse variant condition
- **WHEN** the Volatile Collapse rule is enabled AND all 4 cards of any printed rank reside in the Graveyard Box
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse)
