# Card Rendering

## Purpose

Specification for the `PlayingCard` component responsible for rendering individual playing cards with correct layout, colouring, dual-badge suit iconography, and interaction states.
## Requirements
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

### Requirement: Attrition Scar Tooltips and Legends
Tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`. Generic header legends (such as in Matched Cards Tomb Vault) SHALL display `|#\| Scarred` instead of literal `|N\| Scarred`.

#### Scenario: Tooltips interpolate card rank label
- **GIVEN** a card with Attrition Stage 1, 2, or 3
- **THEN** tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`

#### Scenario: Generic header legend displays hash symbol
- **GIVEN** a generic header legend (such as in Matched Cards Tomb Vault)
- **THEN** the legend SHALL display `|#\| Scarred` instead of literal `|N\| Scarred`

### Requirement: Attrition Stage modal display
The Round Summary modal SHALL display accurate descriptions for cards receiving attrition marks, explicitly indicating that Stage 1 (Vulnerable) and Stage 2 (Doubtful) cards have no functional value shift, while Stage 3 cards display their active +1 or -1 functional value shift.

#### Scenario: Stage 1 card displayed in Round Summary modal
- **WHEN** a card increases to Attrition Stage 1
- **THEN** the modal SHALL display "Stage 1 (Vulnerable |N): 1st attrition stroke (No functional value shift yet)"
- **AND** SHALL NOT state that the functional value has shifted

#### Scenario: Stage 3 card displayed in Round Summary modal
- **WHEN** a card increases to Attrition Stage 3
- **THEN** the modal SHALL display its active functional value shift (+1 for Red, -1 for Black) and effective modified rank

### Requirement: Card face has a structured interior layout
The card interior SHALL use a CSS grid or flex layout with top-left index corner area, top-right anchor badge area, and central suit graphics area. Lower corner areas SHALL NOT render index pips.

#### Scenario: Card face has structured layout zones
- **WHEN** any card is rendered
- **THEN** the card SHALL render top-left index area and central space without rendering bottom corner indices

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

### Requirement: Ink marks render as organic hand-drawn stroke paths
Scars, curses, blessings, and top-right anchor immunity marks on playing cards SHALL be rendered using organic SVG `<path>` elements with natural line wobble, stroke taper, overshoots, and un-closed hand-drawn loops instead of rigid geometric `<line>` or `<circle>` primitives.

#### Scenario: Attrition scars and curses render as organic pen strokes
- **WHEN** a card has Attrition Stage 1 to 4 marked
- **THEN** the scar vertical lines, diagonal backslashes, and curse forward slashes SHALL render using organic SVG path definitions with slight stroke wobble and overshoots

#### Scenario: Suit blessings render as hand-drawn organic halos
- **WHEN** a card is Blessed
- **THEN** the blessing ring around the suit pip SHALL render as an organic hand-drawn loop path rather than a perfect geometric circle

#### Scenario: Top-right anchor immunity badges render as organic hand-drawn strokes
- **WHEN** a card has a Fortifying (`—`) or Anchored (`+`) immunity badge in the top-right corner zone
- **THEN** the anchor strokes SHALL render using organic SVG path definitions with slight stroke wobble and natural pen caps

### Requirement: SVG ink bleed filters apply paper-soaking texture to pen marks
Ink marks (scars, curses, top-right anchor badges, blessings) and handwritten modified rank values SHALL have an inline SVG noise filter (`feTurbulence` / `feDisplacementMap`) applied to simulate marker ink bleeding into paper cardstock edges.

#### Scenario: Pen marks display ink bleed micro-texture
- **WHEN** any pen ink mark (including top-right anchor badges) or handwritten rank value is rendered on a card
- **THEN** it SHALL apply an ink-bleed filter giving the line edges subtle paper-soaking roughness

