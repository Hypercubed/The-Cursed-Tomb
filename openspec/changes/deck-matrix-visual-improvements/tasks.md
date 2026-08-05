## 1. Decouple Matrix Cell Removal Outline & Status Styling

- [ ] 1.1 In `src/components/MatchedCardsModal.tsx`, refactor matrix cell styling logic into two decoupled layers: an interior status layer (fill & text colors for Blessed, Cursed, Scarred, Entombed) and a border/removal layer that preserves the `border-game-accent` amber outline whenever `isRemoved` is true.
- [ ] 1.2 Update Cursed card styling (Stage 4 Attrition) in matrix cells to use scarlet red gel ink colors (`bg-red-950/40`, `border-red-600/80`, `text-red-200`, `ring-1 ring-red-500/60`, `shadow-[0_0_8px_rgba(220,38,38,0.25)]`).

## 2. Integrate SVG Artwork & Update Header Legend

- [ ] 2.1 Import `CardFaceIllustration` (or render compact SVG icons) in `MatchedCardsModal.tsx` for Blessed and Cursed matrix cell suit pips.
- [ ] 2.2 Update the modal header legend in `MatchedCardsModal.tsx` to render Blessed Hero in blue ink with SVG icons (∩ Archway, □ Vault Box, Tunnel Shovel, ⊕ Sun Cross) and Cursed in scarlet red ink with SVG icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits).
- [ ] 2.3 Verify matrix grid visually in browser or test suite to ensure removed cards with Blessed/Cursed statuses render clear gold borders and sharp unclipped SVG icons.
