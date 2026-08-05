## Why

In the Deck Codex (Deck Status Matrix in `MatchedCardsModal.tsx`), the visual indicator for removed cards is currently overridden whenever a card has a campaign status (Blessed, Cursed, or Scarred) because card status styles evaluate first in a single `if/else if` hierarchy. Furthermore, Cursed cards in the matrix grid and header legend render in blue ink instead of scarlet red ink, and suit-specific Blessed and Cursed SVG illustrations introduced in `CardFaceIllustration.tsx` are missing from the matrix grid cells and header legend.

## What Changes

- **Decouple Matrix Lifecycle State from Card Status**: Ensure active, removed, and entombed cards use distinct lifecycle backgrounds and outlines regardless of whether a card is Blessed, Cursed, Scarred, or normal. Active cards use the gold outline; removed and entombed cards use the neutral outline.
- **Correct Cursed Card Ink & Colors**: Update Cursed cards (Stage 4 Attrition) in the matrix grid and modal header legend to render with scarlet red gel ink styling (`bg-red-950/40`, `border-red-600/80`, `text-red-200`, `ring-red-500/60`), matching `CardFaceIllustration.tsx`.
- **Integrate Blessed & Cursed SVG Illustrations**: Render suit-specific Blessed Hero illustrations (∩ Archway for Hearts, □ Vault Box for Diamonds, Tunnel Shovel for Spades, ⊕ Sun Cross for Clubs) and Cursed icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits) inside matrix cells.
- **Update Matrix Header Legend**: Update the header legend to show the active, removed, and entombed lifecycle surfaces/outlines alongside the Blessed and Cursed SVG icons.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `matched-cards-tracking`: Update Deck Status Matrix cell visualization requirements to ensure removal indicators remain visible alongside card status, Cursed cards use scarlet red gel ink styling, and suit-specific Blessed and Cursed SVG icons are rendered in matrix cells and header legend.

## Impact

- `src/components/MatchedCardsModal.tsx`
- Matrix cell layout and legend rendering logic
