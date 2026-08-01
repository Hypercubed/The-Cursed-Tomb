## MODIFIED Requirements

### Requirement: Cards display rank and suit in top-left and bottom-right corners
Each card SHALL render the rank label and standard suit character in the top-left corner. The bottom-right corner SHALL display the identical rank label, suit character, scar, curse, anchor, blessing, and modified functional value indicators rotated 180 degrees (mirrored), preserving full rotational symmetry across both corner indices.

#### Scenario: Card shows rank and suit in top-left corner
- **WHEN** a card is rendered
- **THEN** the rank label (A, 2–10, J, Q, K) and standard suit symbol (♥, ♦, ♠, ♣) SHALL appear in the top-left corner of the card face

#### Scenario: Card shows mirrored rank and suit in bottom-right corner
- **WHEN** a card is rendered
- **THEN** the rank label, suit symbol, scars/curses, anchors/blessings, and modified functional value SHALL appear in the bottom-right corner, rotated 180 degrees

## ADDED Requirements

### Requirement: Card scars and curses overlay rank number pip
Scars and curses SHALL be rendered directly over and beside the rank number pip in both top-left and bottom-right corner indices. Attrition stages 1–2 SHALL render light slash marks across the rank number. Attrition stage 3 (Scarred) SHALL render a heavy diagonal slash across the rank number with the effective modified functional value written immediately to the right. Red and Black Curses (stage 4) SHALL render the slashed rank number, curse symbol, and modified value inline.

#### Scenario: Light scars overlay rank number
- **WHEN** a card has attrition stage 1 or 2
- **THEN** light slash mark overlays SHALL be rendered on top of the rank number pip

#### Scenario: Third scar renders heavy diagonal slash with inset modified value
- **WHEN** a card reaches attrition stage 3
- **THEN** a heavy diagonal slash SHALL cross through the rank number, and the modified functional value (e.g. 8 for a red 7) SHALL be written to the right of the slashed rank number

#### Scenario: Curse renders inline curse symbol and modified value
- **WHEN** a card reaches attrition stage 4 (Red or Black Curse)
- **THEN** the slashed rank number, curse indicator (⚡), and modified functional value SHALL be rendered in the rank area of both corner indices

### Requirement: Card anchors and blessings overlay suit pip
Anchors and blessings SHALL be rendered directly on or surrounding the suit pip symbol in both top-left and bottom-right corner indices. Fortifying anchors (reward stage 1) and Anchors (reward stage 2) SHALL render bold line/cross strokes inside the suit symbol. Blessed Hero status SHALL render a circular ring/halo enclosing the suit symbol.

#### Scenario: Anchor renders bold inside strokes on suit symbol
- **WHEN** a card has reward stage 1 (Fortifying) or reward stage 2 (Anchored)
- **THEN** bold stroke lines (`—` or `+`) SHALL be drawn inside/across the suit symbol

#### Scenario: Blessing renders circular halo around suit symbol
- **WHEN** a card is a Blessed Hero
- **THEN** a circle/halo SHALL enclose the suit symbol in both corner indices
