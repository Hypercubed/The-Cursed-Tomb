## ADDED Requirements

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
