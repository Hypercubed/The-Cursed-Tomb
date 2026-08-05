## MODIFIED Requirements

### Requirement: Suit and Rank Grid Visualization
The Deck Codex SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix. Removal state (gold accent outline) SHALL remain clearly visible on removed cards regardless of whether a card is Blessed, Cursed, or Scarred. Cursed cards SHALL render in scarlet red gel ink styling (`bg-red-950/40`, `border-red-600/80`, `text-red-200`). Matrix cells and header legends SHALL render suit-specific Blessed Hero SVG illustrations (∩ Archway, □ Vault Box, Tunnel Shovel, ⊕ Sun Cross) and Cursed SVG icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits).

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid is highlighted with a gold accent removed outline border (`border-game-accent`), preserving any underlying Blessed or Cursed interior status and icons

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid displays as active with its status-specific border (blue for Blessed, scarlet red for Cursed, stone for Normal)

#### Scenario: Visual state of Cursed cards and legend
- **WHEN** a card has Attrition Stage 4 (Red or Black Curse)
- **THEN** its cell in the matrix grid and the modal header legend render with scarlet red gel ink styling and suit-appropriate Curse SVG illustrations (▼ for Red suits, ⏍ for Black suits)

#### Scenario: Visual state of Blessed cards and legend
- **WHEN** a card is a Blessed Hero
- **THEN** its cell in the matrix grid and the modal header legend render with organic blue ink styling and suit-appropriate Blessing SVG illustrations (∩ Archway for Hearts, □ Vault Box for Diamonds, Tunnel Shovel for Spades, ⊕ Sun Cross for Clubs)
