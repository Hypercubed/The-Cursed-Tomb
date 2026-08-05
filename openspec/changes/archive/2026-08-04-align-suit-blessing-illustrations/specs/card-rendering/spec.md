## MODIFIED Requirements

### Requirement: Single-identity center card face drawings
The web UI SHALL render blessing and curse illustrations directly on the center face of mutated cards using SVG components with organic stroke styling matching existing ink marks. The card face SHALL enforce single-identity rendering, displaying either a Blessing drawing OR a Curse drawing, but never both. Blessing illustrations SHALL be geometrically aligned with underlying center suit pips.

#### Scenario: Card face rendering for Blessed cards
- **WHEN** a Blessed card is rendered (at any Attrition Stage 0–4)
- **THEN** the center face of the card SHALL render the suit-specific Blessing illustration:
  - Hearts: Clean tomb archway (`∩`) framing the heart pip without interior arrow
  - Diamonds: Vault box (`□`) framing the diamond pip
  - Spades: Upward-pointing shovel blade wrapping around the spade tip with handle shaft extending downwards along the spade stem
  - Clubs: Circled Sun Cross (`⊕`) centered over the club leaves
- **THEN** the card face SHALL NOT render any Curse illustration

#### Scenario: Card face rendering for Cursed cards
- **WHEN** a Cursed card (Stage 4 with active Curse effect) is rendered
- **THEN** the center face of the card SHALL render the corresponding Curse illustration:
  - Red Curse: Downward-pointing triangle (`▼`)
  - Black Curse: Unicode trapezoid weight (`⏍`, trapezoid body with handle loop)
- **THEN** the card face SHALL NOT render any Blessing illustration
