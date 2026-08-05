## MODIFIED Requirements

### Requirement: Suit and Rank Grid Visualization
The Deck Codex SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix. Cell backgrounds SHALL communicate lifecycle state only: active cards use the active surface (`bg-[#2a2016]`), removed cards use the removed surface (`bg-[#18130e]`), and entombed cards use the entombed surface (`bg-stone-950`). Active cards SHALL use the gold accent outline, while removed and entombed cards SHALL use the neutral outline. Blessed, Cursed, Scarred, Anchored, and related statuses SHALL be communicated by their interior icons/overlays rather than changing the lifecycle background or outline. Matrix cells and header legends SHALL render suit-specific Blessed Hero SVG illustrations (∩ Archway, □ Vault Box, Tunnel Shovel, ⊕ Sun Cross) and Cursed SVG icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits).

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid uses the removed background (`bg-[#18130e]`) with a neutral outline (`border-[#251e16]`), preserving any Blessed or Cursed icons

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid uses the active background (`bg-[#2a2016]`) with the gold accent outline (`border-game-accent`), while status icons remain visible

#### Scenario: Visual state of entombed cards
- **WHEN** a card reaches Attrition Stage 5
- **THEN** its cell uses the entombed background (`bg-stone-950`) and neutral outline (`border-[#251e16]`), with the entombed icon visible

#### Scenario: Visual state of Cursed cards and legend
- **WHEN** a card has Attrition Stage 4 (Red or Black Curse)
- **THEN** its cell in the matrix grid and the modal header legend render with scarlet red gel ink styling and suit-appropriate Curse SVG illustrations (▼ for Red suits, ⏍ for Black suits)

#### Scenario: Visual state of Blessed cards and legend
- **WHEN** a card is a Blessed Hero
- **THEN** its cell in the matrix grid and the modal header legend render with organic blue ink styling and suit-appropriate Blessing SVG illustrations (∩ Archway for Hearts, □ Vault Box for Diamonds, Tunnel Shovel for Spades, ⊕ Sun Cross for Clubs)
