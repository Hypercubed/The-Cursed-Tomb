# Card Rendering

## Purpose

Specification for the `PlayingCard` component responsible for rendering individual playing cards with correct layout, colouring, dual-badge suit iconography, and interaction states.

## Requirements

### Requirement: Cards display rank and suit in top-left and bottom-right corners
Each card SHALL render the rank label and standard suit character in the top-left corner. The bottom-right corner SHALL display the same rank label and suit character rotated 180 degrees (mirrored), replicating the standard layout of a traditional playing card for rapid scanning.

#### Scenario: Card shows rank and suit in top-left corner
- **WHEN** a card is rendered
- **THEN** the rank label (A, 2–10, J, Q, K) and standard suit symbol (♥, ♦, ♠, ♣) SHALL appear in the top-left corner of the card face

#### Scenario: Card shows mirrored rank and suit in bottom-right corner
- **WHEN** a card is rendered
- **THEN** the rank label and standard suit symbol SHALL appear in the bottom-right corner, rotated 180 degrees

### Requirement: Card face has a structured interior layout
The card interior SHALL use a CSS grid or flex layout with three zones: top-left corner, centre space, and bottom-right corner. The centre zone MAY display a large suit symbol for visual richness.

#### Scenario: Card face has three layout zones
- **WHEN** any card is rendered
- **THEN** the card SHALL have a distinct top-left area, a centre area, and a bottom-right area that together fill the card's height

### Requirement: Red suits use red colouring for all card text
Cards with hearts (♥) or diamonds (♦) SHALL render all card text (rank, suit symbols) in the red theme colour. Cards with spades (♠) or clubs (♣) SHALL use the default dark card text colour. This requirement supersedes the existing red-suit requirement in `pyramid-solitaire-game` for the new card component.

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
Cards that are blocked (covered by other pyramid cards) SHALL render with a translucent stone veil overlay (`bg-stone-900/35`) and maintain clear rank legibility. Removed cards SHALL be invisible while preserving row alignment.

#### Scenario: Blocked card renders with translucent stone veil overlay
- **WHEN** a card is blocked by a child card in the pyramid
- **THEN** the card SHALL display a translucent dark veil overlay while keeping rank and suit text fully legible

#### Scenario: Removed card is invisible
- **WHEN** a card has been removed from the pyramid
- **THEN** the card SHALL be invisible (visibility: hidden or opacity 0) so sibling cards can fill the row

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

### Requirement: Cards scale dynamically across viewport breakpoints
Individual playing cards and draw/discard slot placeholders SHALL scale responsive card dimensions across viewport breakpoints (e.g. 48px × 64px on mobile, 72px × 96px on standard viewports, and 88px–104px width on large/2xl viewports).

#### Scenario: Mobile screens render compact card sizes
- **WHEN** the viewport width is under 640px
- **THEN** playing cards SHALL render at compact dimensions (approx. 48px width) so the 7-card pyramid base fits without horizontal scrolling

#### Scenario: Ultra-wide and 4K displays render scaled-up cards
- **WHEN** the viewport width is 1536px or wider
- **THEN** playing cards SHALL render at expanded dimensions (approx. 88px to 104px width) for clear visibility and readability

### Requirement: Pyramid row overlap scales proportionally with card height
Pyramid row vertical overlap SHALL scale dynamically according to card height breakpoint tiers so row spacing and card visibility remain proportional across all screen sizes.

#### Scenario: Pyramid rows preserve visual proportions at all viewports
- **WHEN** pyramid rows are rendered on any viewport tier
- **THEN** row negative top margins SHALL scale in proportion to card height (approx. 50% height overlap) so upper card faces remain readable

### Requirement: Card components support animation state classes
The `PlayingCard` component SHALL support optional animation state props (`animatingMatch`, `animatingError`) to attach CSS animation classes dynamically.

#### Scenario: Animating match state attaches dissolve class
- **WHEN** `animatingMatch` is true on `PlayingCard`
- **THEN** the root element SHALL include the `animate-card-dissolve` class
