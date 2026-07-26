## MODIFIED Requirements

### Requirement: Cards display rank and suit in top-left and bottom-right corners
Each card SHALL render the rank label and standard suit character in the top-left corner. The bottom-right corner SHALL display the same rank label and suit character rotated 180 degrees (mirrored), replicating the standard layout of a traditional playing card for rapid scanning.

#### Scenario: Card shows rank and suit in top-left corner
- **WHEN** a card is rendered
- **THEN** the rank label (A, 2–10, J, Q, K) and standard suit symbol (♥, ♦, ♠, ♣) SHALL appear in the top-left corner of the card face

#### Scenario: Card shows mirrored rank and suit in bottom-right corner
- **WHEN** a card is rendered
- **THEN** the rank label and standard suit symbol SHALL appear in the bottom-right corner, rotated 180 degrees

### Requirement: Cards style as light parchment stone slates
Cards SHALL render with a light parchment color background (`#f5f0e6`) and a crisp dark border. The card face text SHALL use high-contrast dark obsidian charcoal (`#1c1710`) for black suits and vibrant crimson (`#dc2626`) for red suits.

#### Scenario: Card displays as light parchment slate
- **WHEN** any card is rendered
- **THEN** the card background SHALL be warm parchment `#f5f0e6` with dark high-contrast rank and suit text

### Requirement: Card suits use thematic Egyptian symbols with dual-badge system
The corner indices of cards SHALL display standard suit indicators (♥, ♦, ♠, ♣) for instant suit recognition, while the central card zone SHALL render large thematic Egyptian SVG symbols (Ankh for Hearts, Scarab for Diamonds, Khopesh for Spades, and Was Scepter for Clubs).

#### Scenario: Hearts render as Ankhs in central zone with Heart badge in corners
- **WHEN** a Heart card is rendered
- **THEN** it SHALL display standard ♥ suit symbols in corner indices and a central Ankh SVG symbol in red suit color

#### Scenario: Diamonds render as Scarabs in central zone with Diamond badge in corners
- **WHEN** a Diamond card is rendered
- **THEN** it SHALL display standard ♦ suit symbols in corner indices and a central Scarab SVG symbol in red suit color

#### Scenario: Spades render as Khopeshes in central zone with Spade badge in corners
- **WHEN** a Spade card is rendered
- **THEN** it SHALL display standard ♠ suit symbols in corner indices and a central Khopesh SVG symbol in default black suit color

#### Scenario: Clubs render as Was Scepters in central zone with Club badge in corners
- **WHEN** a Club card is rendered
- **THEN** it SHALL display standard ♣ suit symbols in corner indices and a central Was Scepter SVG symbol in default black suit color

### Requirement: Blocked and removed cards have distinct disabled states
Cards that are blocked (covered by other pyramid cards) SHALL render with a translucent stone veil overlay (`bg-stone-900/35`) and maintain clear rank legibility. Removed cards SHALL be invisible while preserving row alignment.

#### Scenario: Blocked card renders with translucent stone veil overlay
- **WHEN** a card is blocked by a child card in the pyramid
- **THEN** the card SHALL display a translucent dark veil overlay while keeping rank and suit text fully legible

#### Scenario: Removed card is invisible
- **WHEN** a card has been removed from the pyramid
- **THEN** the card SHALL be invisible (visibility: hidden or opacity 0) so sibling cards can fill the row
