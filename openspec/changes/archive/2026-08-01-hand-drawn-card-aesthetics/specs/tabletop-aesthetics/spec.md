## ADDED Requirements

### Requirement: Card face background displays paper cardstock texture
The individual playing cards SHALL render with a subtle paper cardstock texture overlay (or CSS noise/linen texture pattern) that mimics physical card stock without obscuring rank or suit readability.

#### Scenario: Card face shows paper texture overlay
- **WHEN** any playing card is rendered
- **THEN** it SHALL display a tactile cardstock paper texture effect over the parchment background while preserving crisp text contrast

### Requirement: Card layout applies subtle deterministic rotation offsets
Cards dealt into the pyramid layout SHALL apply a subtle, deterministic rotational tilt offset (between -1.5° and +1.5°) derived from the card's position or identity, creating a natural hand-dealt layout aesthetic.

#### Scenario: Pyramid cards display natural rotation tilt
- **WHEN** cards are rendered inside the pyramid board layout
- **THEN** each card SHALL receive a subtle rotation transform so cards appear naturally laid on a table by hand

#### Scenario: Hovering or selecting card levels rotation
- **WHEN** a pyramid card is hovered or selected by the user
- **THEN** its rotation SHALL transition smoothly to 0° or scale cleanly so selection highlights remain aligned and crisp
