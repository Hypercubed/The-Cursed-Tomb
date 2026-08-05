## MODIFIED Requirements

### Requirement: Card anchors and blessings overlay suit pip
Corner suit pips SHALL render strictly the standard suit symbol character (♥, ♦, ♠, ♣) without circle halos or corner overlays. Immunity anchors SHALL render in the top-right corner, and Fallen Hero blessings SHALL render as suit-specific center face illustrations (`CardFaceIllustration`).

#### Scenario: Suit pip renders without circle halo
- **WHEN** a card is a Blessed Hero
- **THEN** the suit pip in the top-left corner index SHALL render strictly the standard suit icon without any circle or halo overlay

#### Scenario: Anchor renders in top-right corner badge
- **WHEN** a card has reward stage 1 (Fortifying) or reward stage 2 (Anchored)
- **THEN** bold stroke lines (`—` or `+`) SHALL be rendered in the top-right anchor badge zone, leaving the corner suit pip clean

### Requirement: Immunity and Anchor marks render in top-right and bottom-left corners
Each playing card SHALL render Fortifying (`—`) and Anchored (`+`) immunity marks in the top-right corner of the card face. Bottom-left immunity marks SHALL NOT be rendered.

#### Scenario: Fortifying card renders single line badge in top-right corner
- **WHEN** a card has `rewardStage = 1` (Fortifying)
- **THEN** a crisp blue horizontal stroke (`—`) SHALL appear in the top-right corner of the card face

#### Scenario: Anchored card renders cross badge in top-right corner
- **WHEN** a card has `rewardStage = 2` (Anchored)
- **THEN** a crisp blue cross stroke (`+`) SHALL appear in the top-right corner of the card face

#### Scenario: Suit pip renders only standard suit symbol
- **WHEN** a card is rendered with or without an anchor reward stage or blessing
- **THEN** the suit pip in the corner index SHALL render strictly the suit symbol, without circle halos or stroke overlays
