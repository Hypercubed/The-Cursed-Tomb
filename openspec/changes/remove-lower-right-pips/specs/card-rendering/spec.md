# card-rendering Spec Delta

## MODIFIED Requirements

### Requirement: Cards display rank and suit in top-left and bottom-right corners
Each card SHALL render the rank label and standard suit character exclusively in the top-left corner index area. Lower/bottom corner indices (bottom-right rank/suit pip and bottom-left immunity badge) SHALL NOT be rendered in digital card views.

#### Scenario: Card shows rank and suit in top-left corner
- **WHEN** a card is rendered
- **THEN** the rank label (A, 2–10, J, Q, K) and standard suit symbol (♥, ♦, ♠, ♣) SHALL appear in the top-left corner of the card face

#### Scenario: Lower corner indices are omitted
- **WHEN** a card is rendered
- **THEN** no rank, suit, scar, curse, blessing, or anchor elements SHALL appear in the bottom-right or bottom-left corners of the card face

### Requirement: Card scars and curses overlay rank number pip
Scars and curses SHALL be rendered directly over and beside the rank number pip in the top-left corner index. Attrition stages 1–2 SHALL render light slash marks across the rank number. Attrition stage 3 (Scarred) SHALL render a heavy diagonal slash across the rank number with the effective modified functional value written immediately to the right. Red and Black Curses (stage 4) SHALL render the slashed rank number, curse symbol, and modified value inline.

#### Scenario: Light scars overlay rank number
- **WHEN** a card has attrition stage 1 or 2
- **THEN** light slash mark overlays SHALL be rendered on top of the rank number pip

#### Scenario: Third scar renders heavy diagonal slash with inset modified value
- **WHEN** a card reaches attrition stage 3
- **THEN** a heavy diagonal slash SHALL cross through the rank number, and the modified functional value (e.g. 8 for a red 7) SHALL be written to the right of the slashed rank number

#### Scenario: Curse renders inline curse symbol and modified value
- **WHEN** a card reaches attrition stage 4 (Red or Black Curse)
- **THEN** the slashed rank number, curse indicator (⚡), and modified functional value SHALL be rendered in the rank area of the top-left corner index

### Requirement: Card anchors and blessings overlay suit pip
Anchors and blessings SHALL be rendered directly on or surrounding the suit pip symbol in the top-left corner index. Fortifying anchors (reward stage 1) and Anchors (reward stage 2) SHALL render bold line/cross strokes inside the suit symbol. Blessed Hero status SHALL render a circular ring/halo enclosing the suit symbol.

#### Scenario: Anchor renders bold inside strokes on suit symbol
- **WHEN** a card has reward stage 1 (Fortifying) or reward stage 2 (Anchored)
- **THEN** bold stroke lines (`—` or `+`) SHALL be drawn inside/across the suit symbol

#### Scenario: Blessing renders circular halo around suit symbol
- **WHEN** a card is a Blessed Hero
- **THEN** a circle/halo SHALL enclose the suit symbol in the top-left corner index

### Requirement: Card face has a structured interior layout
The card interior SHALL use a CSS grid or flex layout with top-left index corner area, top-right anchor badge area, and central suit graphics area. Lower corner areas SHALL NOT render index pips.

#### Scenario: Card face has structured layout zones
- **WHEN** any card is rendered
- **THEN** the card SHALL render top-left index area and central space without rendering bottom corner indices

### Requirement: Immunity and Anchor marks render in top-right and bottom-left corners
Each playing card SHALL render Fortifying (`—`) and Anchored (`+`) immunity marks in the top-right corner of the card face. Bottom-left immunity marks SHALL NOT be rendered.

#### Scenario: Fortifying card renders single line badge in top-right corner
- **WHEN** a card has `rewardStage = 1` (Fortifying)
- **THEN** a crisp blue horizontal stroke (`—`) SHALL appear in the top-right corner of the card face

#### Scenario: Anchored card renders cross badge in top-right corner
- **WHEN** a card has `rewardStage = 2` (Anchored)
- **THEN** a crisp blue cross stroke (`+`) SHALL appear in the top-right corner of the card face

#### Scenario: Suit pip renders only suit symbol and Fallen Hero blessing ring
- **WHEN** a card is rendered with or without an anchor reward stage
- **THEN** the suit pip in the corner index SHALL render strictly the suit icon and (if blessed) the Fallen Hero circle halo (`[O]`), without anchor stroke overlays inside the suit symbol
