## MODIFIED Requirements

### Requirement: Card suits use standard suit symbols with dual-badge system
The corner indices of cards SHALL display standard suit indicators (♥, ♦, ♠, ♣) for instant suit recognition, and the central card zone SHALL render large standard suit SVG symbols (Heart for Hearts, Diamond for Diamonds, Spade for Spades, and Club for Clubs).

#### Scenario: Hearts render as standard Hearts in central zone with Heart badge in corners
- **WHEN** a Heart card is rendered
- **THEN** it SHALL display standard ♥ suit symbols in corner indices and a central standard Heart SVG symbol in red suit color

#### Scenario: Diamonds render as standard Diamonds in central zone with Diamond badge in corners
- **WHEN** a Diamond card is rendered
- **THEN** it SHALL display standard ♦ suit symbols in corner indices and a central standard Diamond SVG symbol in red suit color

#### Scenario: Spades render as standard Spades in central zone with Spade badge in corners
- **WHEN** a Spade card is rendered
- **THEN** it SHALL display standard ♠ suit symbols in corner indices and a central standard Spade SVG symbol in default black suit color

#### Scenario: Clubs render as standard Clubs in central zone with Club badge in corners
- **WHEN** a Club card is rendered
- **THEN** it SHALL display standard ♣ suit symbols in corner indices and a central standard Club SVG symbol in default black suit color
