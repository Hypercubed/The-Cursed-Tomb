# Card Rendering

## Purpose

TBD — Specification for the `PlayingCard` component responsible for rendering individual playing cards with correct layout, colouring, and interaction states.

## Requirements

### Requirement: Cards display rank and suit in top-left and bottom-right corners
Each card SHALL render the rank label and suit symbol in the top-left corner. The bottom-right corner SHALL display the same rank and suit rotated 180 degrees (mirrored), replicating the layout of a standard playing card.

#### Scenario: Card shows rank and suit in top-left corner
- **WHEN** a card is rendered
- **THEN** the rank label (A, 2–10, J, Q, K) and suit symbol SHALL appear in the top-left corner of the card face

#### Scenario: Card shows mirrored rank and suit in bottom-right corner
- **WHEN** a card is rendered
- **THEN** the rank label and suit symbol SHALL also appear in the bottom-right corner, rotated 180 degrees

### Requirement: Card face has a structured interior layout
The card interior SHALL use a CSS grid or flex layout with three zones: top-left corner, centre space, and bottom-right corner. The centre zone MAY display a large suit symbol for visual richness.

#### Scenario: Card face has three layout zones
- **WHEN** any card is rendered
- **THEN** the card SHALL have a distinct top-left area, a centre area, and a bottom-right area that together fill the card's height

### Requirement: Red suits use red colouring for all card text
Cards with hearts (♥) or diamonds (♦) SHALL render all card text (rank, suit symbols) in the red theme colour. Cards with spades (♠) or clubs (♣) SHALL use the default light card text colour. This requirement supersedes the existing red-suit requirement in `pyramid-solitaire-game` for the new card component.

#### Scenario: Heart and diamond card text renders in red
- **WHEN** a card with suit ♥ or ♦ is rendered
- **THEN** all rank and suit text on that card SHALL use the `game-red` colour token

#### Scenario: Spade and club card text renders in default colour
- **WHEN** a card with suit ♠ or ♣ is rendered
- **THEN** all rank and suit text on that card SHALL use the default `game-card-text` colour token

### Requirement: Card selection state is visually distinct
A selected card SHALL display an accent-coloured border and a subtle glow shadow to indicate selection. An unselected interactive card SHALL show the default border with an accent border on hover.

#### Scenario: Selected card has accent border and glow
- **WHEN** a card's id matches the game's `selectedCardId`
- **THEN** the card SHALL render with the `game-accent` border colour and an accent box-shadow

#### Scenario: Hovered card shows accent border
- **WHEN** the user hovers over an interactive (non-blocked, non-removed) card
- **THEN** the card border SHALL transition to the `game-accent` colour

### Requirement: Blocked and removed cards have distinct disabled states
Cards that are blocked (covered by other pyramid cards) SHALL render at 100% opacity. Removed cards SHALL be invisible but MAY still occupy space to preserve row alignment (row collapse is handled at the layout level).

#### Scenario: Blocked card renders at 100% opacity
- **WHEN** a card is blocked by a child card in the pyramid
- **THEN** the card SHALL render at 100% opacity and show a not-allowed cursor

#### Scenario: Removed card is invisible
- **WHEN** a card has been removed from the pyramid
- **THEN** the card SHALL be invisible (visibility: hidden or opacity 0) so sibling cards can fill the row
