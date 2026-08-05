## Why

In the Deck Codex (Deck Status Matrix in `MatchedCardsModal.tsx`), the visual indicator for removed cards is currently overridden whenever a card has a campaign status (Blessed, Cursed, or Scarred) because card status styles evaluate first in a single `if/else if` hierarchy. Furthermore, Cursed cards in the matrix grid and header legend render in blue ink instead of scarlet red ink, and suit-specific Blessed and Cursed SVG illustrations introduced in `CardFaceIllustration.tsx` are missing from the matrix grid cells and header legend.

## What Changes

- **Decouple Matrix Removal State from Card Status**: Ensure removed cards always display a distinct gold/amber removed outline border (`border-game-accent`) regardless of whether the card is Blessed, Cursed, Scarred, or normal.
- **Correct Cursed Card Ink & Colors**: Update Cursed cards (Stage 4 Attrition) in the matrix grid and modal header legend to render with scarlet red gel ink styling (`bg-red-950/40`, `border-red-600/80`, `text-red-200`, `ring-red-500/60`), matching `CardFaceIllustration.tsx`.
- **Integrate Blessed & Cursed SVG Illustrations**: Render suit-specific Blessed Hero illustrations (∩ Archway for Hearts, □ Vault Box for Diamonds, Tunnel Shovel for Spades, ⊕ Sun Cross for Clubs) and Cursed icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits) inside matrix cells.
- **Update Matrix Header Legend**: Update the header legend to accurately display Blessed Hero in blue ink with SVG icons, Cursed in scarlet red ink with SVG icons, and Removed with an explicit gold outline indicator.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `matched-cards-tracking`: Update Deck Status Matrix cell visualization requirements to ensure removal indicators remain visible alongside card status, Cursed cards use scarlet red gel ink styling, and suit-specific Blessed and Cursed SVG icons are rendered in matrix cells and header legend.

## Impact

- `src/components/MatchedCardsModal.tsx`
- Matrix cell layout and legend rendering logic
