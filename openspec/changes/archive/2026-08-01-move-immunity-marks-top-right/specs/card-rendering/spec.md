## ADDED Requirements

### Requirement: Immunity and Anchor marks render in top-right and bottom-left corners
Each playing card SHALL render Fortifying (`—`) and Anchored (`+`) immunity marks in the top-right corner of the card face (and bottom-left corner rotated 180 degrees) rather than over the suit pip.

#### Scenario: Fortifying card renders single line badge in top-right corner
- **WHEN** a card has `rewardStage = 1` (Fortifying)
- **THEN** a crisp blue horizontal stroke (`—`) SHALL appear in the top-right corner of the card face (and bottom-left corner rotated 180°)

#### Scenario: Anchored card renders cross badge in top-right corner
- **WHEN** a card has `rewardStage = 2` (Anchored)
- **THEN** a crisp blue cross stroke (`+`) SHALL appear in the top-right corner of the card face (and bottom-left corner rotated 180°)

#### Scenario: Suit pip renders only suit symbol and Fallen Hero blessing ring
- **WHEN** a card is rendered with or without an anchor reward stage
- **THEN** the suit pip in the corner index SHALL render strictly the suit icon and (if blessed) the Fallen Hero circle halo (`[O]`), without anchor stroke overlays inside the suit symbol
