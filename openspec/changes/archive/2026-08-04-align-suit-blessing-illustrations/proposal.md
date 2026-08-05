## Why

The current suit blessing center-face illustrations (`CardFaceIllustration`) on playing cards do not geometrically align with the solid base suit pips sitting beneath them, causing visual conflict between central illustrations and suit shapes. In addition, the Clubs blessing currently uses a generic infinity symbol (`∞`) rather than an Egyptian tomb expedition symbol. Refining these illustrations improves visual harmony across all suit blessings and aligns the digital game visuals with physical deck iconography.

## What Changes

- **Spades Blessing Illustration**: Flip the tunnel shovel illustration so the blade points **UP** wrapping around the Spade tip `♠`, and the handle shaft extends **DOWN** along the Spade stem.
- **Hearts Blessing Illustration**: Remove the interior arrow `↑` from the Tomb Archway (`∩`), aligning the clean archway outline around the Heart pip `♥`.
- **Clubs Blessing Illustration**: Replace the Infinity symbol (`∞`) with the **Circled Sun Cross (`⊕`)**, centering crosshairs and halo loops around the 3 leaves of the Club pip `♣`.
- **Diamonds Blessing Illustration**: Retain the Vault Box (`□`) as-is.
- **Curse Illustrations**: Retain Red Curse (`▼`) and Black Curse (`⏍`) as-is.
- **UI & Specs Alignment**: Update tooltips in `PlayingCard.tsx`, legends in `RulesModal.tsx`, unit tests in `CardFaceIllustration.test.tsx`, and `docs/rules.md` to reflect the updated illustration symbols.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Align Spades (flipped shovel blade), Hearts (arrow-less archway), and Clubs (`⊕` Sun Cross) center-face blessing illustrations with underlying suit pips and update associated tooltips and documentation.

## Impact

- `src/components/CardFaceIllustration.tsx`: Updated SVG path definitions for Spades, Hearts, and Clubs.
- `src/components/PlayingCard.tsx`: Updated corner tooltip string helpers.
- `src/components/RulesModal.tsx`: Updated rules tab legends.
- `src/components/CardFaceIllustration.test.tsx`: Updated unit test assertions.
- `docs/rules.md`: Updated rules text for suit blessings.
- `openspec/specs/card-rendering/spec.md`: Main spec requirements updated via delta spec.
