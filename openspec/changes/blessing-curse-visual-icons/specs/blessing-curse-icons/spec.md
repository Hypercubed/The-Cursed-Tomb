## ADDED Requirements

### Requirement: Optional blessing icons
The system SHALL support optional icons for suit blessings that players may draw on physical cards or display in the web UI. Icons SHALL be semantically meaningful and map to their corresponding blessing mechanics.

#### Scenario: Hearts blessing icon
- **WHEN** a player draws the optional icon for a Hearts blessing
- **THEN** the icon SHALL be an upward arrow (↑) positioned above the circled suit pip
- **THEN** the icon SHALL represent resurrection/rising from the grave

#### Scenario: Diamonds blessing icon
- **WHEN** a player draws the optional icon for a Diamonds blessing
- **THEN** the icon SHALL be a square or box (□) positioned around the suit pip
- **THEN** the icon SHALL represent a vault or storage container

#### Scenario: Spades blessing icon
- **WHEN** a player draws the optional icon for a Spades blessing
- **THEN** the icon SHALL be a downward arrow (↓) positioned below the circled suit pip
- **THEN** the icon SHALL represent tunneling or digging down

#### Scenario: Clubs blessing icon
- **WHEN** a player draws the optional icon for a Clubs blessing
- **THEN** the icon SHALL be a question mark (?) positioned over the rank number
- **THEN** the icon SHALL cover the functional value to communicate that any value works
- **THEN** the icon SHALL represent a wildcard that pairs with any exposed card

### Requirement: Optional curse icons
The system SHALL support optional icons for curses that players may draw on physical cards or display in the web UI. Icons SHALL distinguish between Red Curse (trap) and Black Curse (weight) effects.

#### Scenario: Red Curse icon
- **WHEN** a player draws the optional icon for a Red Curse
- **THEN** the icon SHALL be a downward triangle (▼) positioned below the X mark
- **THEN** the icon SHALL represent cards falling or trapping below

#### Scenario: Black Curse icon
- **WHEN** a player draws the optional icon for a Black Curse
- **THEN** the icon SHALL be three horizontal lines (≡) positioned below the X mark
- **THEN** the icon SHALL represent a heavy burden or restriction

### Requirement: Icon simplicity for hand-drawing
All blessing and curse icons SHALL be simple enough to draw quickly with a single pen during live play. Icons SHALL require no more than 4 strokes to complete.

#### Scenario: Upward arrow drawing
- **WHEN** a player draws the upward arrow (↑) icon
- **THEN** the icon SHALL require exactly 2 strokes (vertical line + horizontal head)

#### Scenario: Downward arrow drawing
- **WHEN** a player draws the downward arrow (↓) icon
- **THEN** the icon SHALL require exactly 2 strokes (vertical line + horizontal head)

#### Scenario: Square drawing
- **WHEN** a player draws the square (□) icon
- **THEN** the icon SHALL require no more than 4 strokes (four connected lines)

#### Scenario: Question mark drawing
- **WHEN** a player draws the question mark (?) icon
- **THEN** the icon SHALL require exactly 2 strokes (curved line + dot)

#### Scenario: Triangle drawing
- **WHEN** a player draws the triangle (▼) icon
- **THEN** the icon SHALL require exactly 3 strokes (three connected lines)

#### Scenario: Three lines drawing
- **WHEN** a player draws the three lines (≡) icon
- **THEN** the icon SHALL require exactly 3 strokes (three parallel horizontal lines)

### Requirement: Web UI icon rendering
The web UI SHALL render blessing and curse icons using SVG components that match the existing organic ink aesthetic. Icons SHALL use the same blue color scheme and ink-bleed filter as existing marks.

#### Scenario: SVG blessing icon rendering
- **WHEN** a card with a blessing is displayed in the web UI
- **THEN** the system SHALL render the corresponding SVG icon alongside the existing blessing circle
- **THEN** the icon SHALL use the blue color (#1d4ed8) matching existing marks
- **THEN** the icon SHALL apply the ink-bleed filter for organic stroke appearance

#### Scenario: SVG curse icon rendering
- **WHEN** a card with a curse is displayed in the web UI
- **THEN** the system SHALL render the corresponding SVG icon below the X mark
- **THEN** the icon SHALL use the blue color (#1d4ed8) matching existing marks
- **THEN** the icon SHALL apply the ink-bleed filter for organic stroke appearance

#### Scenario: Clubs wildcard value coverage
- **WHEN** a Clubs wildcard card is displayed in the web UI
- **THEN** the question mark icon SHALL render over or replace the displayed rank number
- **THEN** the functional value SHALL still be available via tooltip for accessibility

### Requirement: Icon tooltip information
The web UI SHALL include icon meanings in tooltip text when a user hovers over a card with blessing or curse icons.

#### Scenario: Blessing icon tooltip
- **WHEN** a user hovers over a card with a blessing icon
- **THEN** the tooltip SHALL include the icon's meaning (e.g., "Hearts Resurrection: draws random card from Graveyard")
- **THEN** the tooltip SHALL reference the icon symbol (e.g., "↑")

#### Scenario: Curse icon tooltip
- **WHEN** a user hovers over a card with a curse icon
- **THEN** the tooltip SHALL include the icon's meaning (e.g., "Red Curse: locks next row face-down")
- **THEN** the tooltip SHALL reference the icon symbol (e.g., "▼")

### Requirement: Physical game documentation
The rules documentation SHALL include optional icon drawing instructions with ASCII diagrams showing icon placement and stroke order. Documentation SHALL emphasize that icons are optional enhancements.

#### Scenario: Icon drawing instructions in rules
- **WHEN** a player reads the blessing section in docs/rules.md
- **THEN** the documentation SHALL include ASCII diagrams showing each blessing icon
- **THEN** the documentation SHALL specify icon placement (above/below suit pip, over rank number)
- **THEN** the documentation SHALL state that icons are optional

#### Scenario: Curse icon instructions in rules
- **WHEN** a player reads the curse section in docs/rules.md
- **THEN** the documentation SHALL include ASCII diagrams showing each curse icon
- **THEN** the documentation SHALL specify icon placement (below the X mark)
- **THEN** the documentation SHALL state that icons are optional

### Requirement: Optional icon usage
The system SHALL treat icons as optional additions to existing marks. Cards without icons SHALL render identically to current behavior. Players MAY choose to use icons selectively based on preference.

#### Scenario: Cards without icons
- **WHEN** a card has no optional icons drawn
- **THEN** the card SHALL function identically to cards with icons
- **THEN** the web UI SHALL render the card using only existing marks (circle, X, scars, anchors)

#### Scenario: Selective icon usage
- **WHEN** a player chooses to use icons for only some marks
- **THEN** the system SHALL support mixed usage (some cards with icons, some without)
- **THEN** the game mechanics SHALL not depend on icon presence
