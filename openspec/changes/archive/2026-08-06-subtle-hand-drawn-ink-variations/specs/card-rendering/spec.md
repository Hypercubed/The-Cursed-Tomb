## MODIFIED Requirements

### Requirement: Ink marks render as organic hand-drawn stroke paths
Scars, curses, blessings, top-right anchor immunity marks, and handwritten modified functional values on playing cards SHALL be rendered using organic SVG `<path>` elements and handwriting styles with natural line wobble, stroke taper, and bounded deterministic variations in rotation, scale, and translation position. Positive modifications (Anchors, Fortifying badges, Blessed Hero rings, and Suit Blessing illustrations) SHALL be rendered in vivid Cobalt Blue Pen Ink (`#1d4ed8`). Negative modifications (Attrition scars 1–4, Curse marks/traps, and modified functional rank values) SHALL be rendered in wet Scarlet Red Gel Pen Ink (`#dc2626` / `#e11d48`).

#### Scenario: Attrition scars and curses render as organic scarlet pen strokes
- **WHEN** a card has Attrition Stage 1 to 4 marked or an active Curse
- **THEN** the scar vertical lines, diagonal backslashes, curse forward slashes, curse illustrations, and handwritten functional value numbers SHALL render in organic wet Scarlet Red Gel Pen Ink (`#dc2626` / `#e11d48`) with scarlet drop-shadow halos

#### Scenario: Suit blessings render as organic blue hand-drawn halos
- **WHEN** a card is Blessed
- **THEN** the blessing ring around the suit pip and the central face Blessing illustration SHALL render in organic Cobalt Blue Pen Ink (`#1d4ed8`) with blue drop-shadow halos

#### Scenario: Top-right anchor immunity badges render as organic blue hand-drawn strokes
- **WHEN** a card has a Fortifying (`—`) or Anchored (`+`) immunity badge in the top-right corner zone
- **THEN** the anchor strokes SHALL render in organic Cobalt Blue Pen Ink (`#1d4ed8`) with blue drop-shadow halos

#### Scenario: Pen ink marks apply bounded deterministic hand-drawn transforms
- **WHEN** any pen ink mark (Blessing/Curse center illustration, corner scar overlay, handwritten modified rank value, or anchor immunity badge) is rendered on a card
- **THEN** it SHALL apply a deterministic pseudo-random rotation, scale, and position offset calculated from the card's suit, rank, and mark type so that ink marks appear hand-sketched and uniquely tilted per card without changing across re-renders
