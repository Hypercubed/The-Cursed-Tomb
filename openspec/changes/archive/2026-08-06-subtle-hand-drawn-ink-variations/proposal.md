## Why

The current blessing and curse illustrations, corner attrition scars, handwritten modified rank values, and top-right anchor badges are rendered using static geometry and fixed angles. Adding subtle, deterministic pseudo-random variations to their rotation, translation, and scale will give cards an authentic, hand-sketched ink-on-parchment feel without causing visual jitter or layout instability.

## What Changes

- **Hand-Drawn Center Illustrations**: Apply subtle, bounded deterministic rotation (-3°..+3°), translation offset (±2.5px), and scale (0.95x..1.05x) to blessing/curse illustrations in `CardFaceIllustration`.
- **Hand-Drawn Corner Scars**: Apply subtle rotation (-2°..+2°) and scale (0.95x..1.05x) to top-left attrition scar SVG overlays.
- **Hand-Drawn Modified Rank Values**: Replace the static -4° rotation on modified rank number labels with deterministic card-specific rotation (-7°..-1°), font scale (0.92x..1.08x), and translation offset (±1.5px).
- **Hand-Drawn Anchor Immunity Badges**: Apply subtle rotation (-4°..+4°) and scale (0.95x..1.05x) to top-right fortifying (—) and anchored (+) pen strokes.
- **Deterministic Card Seeding**: Derive all organic transformations deterministically from `(suit, rank, markType)` so every card has a stable, unique personality that never shifts during re-renders.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Update requirements to mandate organic hand-drawn stroke variations (bounded deterministic tilt, size, and position offset) across all pen ink elements on playing cards.

## Impact

- **Affected Code**: `src/components/PlayingCard.tsx`, `src/components/CardFaceIllustration.tsx`, and associated unit tests.
- **Performance / Stability**: Pure deterministic client-side rendering with zero runtime overhead or layout jitter.
