## Why

With the introduction of large, suit-specific center face illustrations for card blessings (tomb archway `∩`, vault box `□`, flipped shovel, and sun cross `⊕`), drawing a blue circle halo around the top-left corner suit pip (`[O]`) creates visual redundancy. Removing the corner suit circle declutters the top-left corner index, unifies card visual identity between blessings and curses, simplifies physical play notation, and keeps official documentation (`docs/rules.md`) aligned with the digital game.

## What Changes

- Remove the blue hand-drawn circle halo (`[O]`) rendered over the corner suit pip in `SuitPip` on blessed cards.
- Retain suit-specific center face illustrations (`CardFaceIllustration`) as the single visual identity for card blessings.
- Update `docs/rules.md` (Section 3, Section 6, and Section 6.C ASCII visual reference diagram) to specify drawing blessings as center-face illustrations rather than encircling corner suit pips.
- Update `card-rendering` specification requirements and scenarios to specify clean suit pips without corner circle overlays.
- Update `RulesModal.tsx` card anatomy diagrams and core rules documentation to reflect that blessings are rendered exclusively via center face illustrations.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Update suit pip requirement to specify that corner suit pips render without circle halos on blessed cards.

## Impact

- `docs/rules.md`: Update physical rules documentation & ASCII card diagram for suit blessings.
- `src/components/PlayingCard.tsx`: Remove circle SVG overlay from `SuitPip`.
- `src/components/RulesModal.tsx`: Update Card Anatomy and Core Rules text/diagrams.
- `openspec/specs/card-rendering/spec.md`: Update requirement for suit pip rendering.
