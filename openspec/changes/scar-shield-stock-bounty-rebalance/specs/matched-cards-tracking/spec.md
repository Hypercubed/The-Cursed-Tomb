## MODIFIED Requirements

### Requirement: Suit and Rank Grid Visualization
The Deck Codex SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix. Cell backgrounds SHALL communicate lifecycle state only: active cards use the active surface, removed cards use the removed surface, and Entombed (5 Scars `X`) cards use the entombed surface. Active cards SHALL use the gold accent outline. Blessed, Cursed (3–4 Scars), Scarred (2 Scars), Shield (`+`), and related statuses SHALL be communicated by their interior icons/overlays rather than changing the lifecycle background or outline. Matrix cells and header legends SHALL render suit-specific Blessed Hero SVG illustrations (∩ Archway, □ Vault Box, Tunnel Shovel, ⊕ Sun Cross) and Cursed SVG icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits).

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid uses the removed background with a neutral outline, preserving any Blessed or Cursed icons

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid uses the active background with the gold accent outline, while status icons remain visible

#### Scenario: Visual state of entombed cards
- **WHEN** a card reaches 5 Scars (`X`)
- **THEN** its cell uses the entombed background and neutral outline, with the entombed icon visible

#### Scenario: Visual state of Cursed cards and legend
- **WHEN** a card has 3–4 Scars (Red or Black Curse)
- **THEN** its cell in the matrix grid and the modal header legend render with scarlet red styling and suit-appropriate Curse SVG illustrations (▼ for Red suits, ⏍ for Black suits)

#### Scenario: Visual state of Blessed cards and legend
- **WHEN** a card is a Blessed Hero
- **THEN** its cell in the matrix grid and the modal header legend render with organic blue styling and suit-appropriate Blessing SVG illustrations
