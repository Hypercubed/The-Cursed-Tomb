## MODIFIED Requirements

### Requirement: Cards style as light parchment stone slates
Cards SHALL render with a light parchment color background (`#f5f0e6`) and a crisp dark border. The card face text and printed suit pips SHALL use high-contrast dark carbon charcoal (`#1c1917`) for black suits (Spades, Clubs) and authentic deep Bicycle crimson (`#991b1b`) for red suits (Hearts, Diamonds).

#### Scenario: Card displays as light parchment slate
- **WHEN** any card is rendered
- **THEN** the card background SHALL be warm parchment `#f5f0e6` with carbon charcoal (`#1c1917`) text for black suits and deep Bicycle crimson (`#991b1b`) text for red suits

### Requirement: Ink marks render as organic hand-drawn stroke paths
Scars, curses, blessings, and top-right anchor immunity marks on playing cards SHALL be rendered using organic SVG `<path>` elements with natural line wobble, stroke taper, overshoots, and hand-drawn loops. Positive modifications (Anchors, Fortifying badges, Blessed Hero rings, and Suit Blessing illustrations) SHALL be rendered in vivid Cobalt Blue Pen Ink (`#1d4ed8`). Negative modifications (Attrition scars 1–4, Curse marks/traps, and modified functional rank values) SHALL be rendered in wet Scarlet Red Gel Pen Ink (`#dc2626` / `#e11d48`).

#### Scenario: Attrition scars and curses render as organic scarlet pen strokes
- **WHEN** a card has Attrition Stage 1 to 4 marked or an active Curse
- **THEN** the scar vertical lines, diagonal backslashes, curse forward slashes, curse illustrations, and handwritten functional value numbers SHALL render in organic wet Scarlet Red Gel Pen Ink (`#dc2626` / `#e11d48`) with scarlet drop-shadow halos

#### Scenario: Suit blessings render as organic blue hand-drawn halos
- **WHEN** a card is Blessed
- **THEN** the blessing ring around the suit pip and the central face Blessing illustration SHALL render in organic Cobalt Blue Pen Ink (`#1d4ed8`) with blue drop-shadow halos

#### Scenario: Top-right anchor immunity badges render as organic blue hand-drawn strokes
- **WHEN** a card has a Fortifying (`—`) or Anchored (`+`) immunity badge in the top-right corner zone
- **THEN** the anchor strokes SHALL render in organic Cobalt Blue Pen Ink (`#1d4ed8`) with blue drop-shadow halos

## ADDED Requirements

### Requirement: Negative modification overlays use distinct scarlet ink filter and drop shadow
Negative card modification overlays (scars, curses, shifted rank values) SHALL use a dedicated red ink-bleed drop shadow filter (`drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]`) to maintain high contrast and distinct handwritten pen appearance over both red (Hearts/Diamonds) and black (Spades/Clubs) printed card faces.

#### Scenario: Red scar overlay on Heart or Diamond card
- **WHEN** an Attrition Stage 1–4 scar or functional value shift is rendered on a Heart or Diamond card
- **THEN** the overlay SHALL use wet Scarlet Red Gel Pen Ink with a scarlet ink-bleed drop shadow, making the hand-drawn mark distinctly brighter and wetter than the underlying deep Bicycle crimson printed suit and rank text
