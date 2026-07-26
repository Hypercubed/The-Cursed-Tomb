## ADDED Requirements

### Requirement: Cards style as basalt stone tablets with hieroglyphs
Cards SHALL render with a dark basalt color background (`#1c1915`) and a light border that simulates a chiseled stone slate. The card borders SHALL incorporate subtle decorative hieroglyphic patterns.

#### Scenario: Card displays as chiseled basalt slate
- **WHEN** any card is rendered
- **THEN** the card background SHALL be basalt grey `#1c1915` with a border simulating chiseled slate and decorative hieroglyphic patterns

### Requirement: Card suits use thematic Egyptian symbols
The card suit symbols for Hearts (♥), Diamonds (♦), Spades (♠), and Clubs (♣) SHALL be rendered using themed symbols representing Ankhs, Scarabs, Khopeshes, and Was Scepters, while maintaining standard red/black color differentiation.

#### Scenario: Hearts render as Ankhs
- **WHEN** a Heart card is rendered
- **THEN** it SHALL render an Ankh symbol in the red suit color

#### Scenario: Diamonds render as Scarabs
- **WHEN** a Diamond card is rendered
- **THEN** it SHALL render a Scarab symbol in the red suit color

#### Scenario: Spades render as Khopeshes
- **WHEN** a Spade card is rendered
- **THEN** it SHALL render a Khopesh symbol in the default card text color

#### Scenario: Clubs render as Was Scepters
- **WHEN** a Club card is rendered
- **THEN** it SHALL render a Was Scepter symbol in the default card text color
