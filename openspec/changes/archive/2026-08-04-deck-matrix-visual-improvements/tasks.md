## 1. Decouple Matrix Cell Removal Outline & Status Styling

- [x] 1.1 In `src/components/MatchedCardsModal.tsx`, refactor matrix cell styling logic into lifecycle background/outline and independent status icon layers: active uses the dark brown surface with gold outline, removed uses the near-black surface with neutral outline, and entombed uses the stone surface with neutral outline.
- [x] 1.2 Keep Cursed, Blessed, and Scarred identities in their icon/overlay artwork without allowing status colors to alter lifecycle backgrounds or outlines.

## 2. Integrate SVG Artwork & Update Header Legend

- [x] 2.1 Import `CardFaceIllustration` (or render compact SVG icons) in `MatchedCardsModal.tsx` for Blessed and Cursed matrix cell suit pips.
- [x] 2.2 Update the modal header legend in `MatchedCardsModal.tsx` to render Blessed Hero in blue ink with SVG icons (∩ Archway, □ Vault Box, Tunnel Shovel, ⊕ Sun Cross) and Cursed in scarlet red ink with SVG icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits).
- [x] 2.3 Verify matrix grid in the test suite to ensure active, removed, and entombed lifecycle surfaces/outlines remain clear alongside sharp status icons.
