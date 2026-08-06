## Context

Playing cards in *The Cursed Tomb* feature ink-drawn modifications including Attrition scars (Stages 1–4), modified rank values, top-right Anchor immunity badges (Stage 1–2), and center face Blessing/Curse suit illustrations (`CardFaceIllustration`). Currently, these ink marks render with static angles and coordinates, giving a synthetic SVG appearance. We want to introduce bounded, deterministic pseudo-random variations to position, scale, and rotation so every card's ink marks look uniquely hand-sketched while remaining consistent across re-renders.

## Goals / Non-Goals

**Goals:**
- Implement a pure, deterministic hash helper `getHandDrawnTransform(suit, rank, markType)` that returns bounded rotation, scale, and translation offset values.
- Apply subtle organic transformations to:
  1. Center face Blessing & Curse SVG illustrations (`CardFaceIllustration`)
  2. Corner Attrition Scar SVG overlays (`SlashedRank` SVG)
  3. Handwritten modified rank value labels (`SlashedRank` modified value span)
  4. Corner Anchor Immunity Badges (`AnchorBadge` SVG)
- Ensure 100% stable rendering (same suit + rank always produces identical transform values across re-renders).

**Non-Goals:**
- Modifying underlying game logic or card rules.
- Animating rotation or scale over time (transformations are static per card).

## Decisions

### Decision 1: Deterministic Card Seeding over `Math.random()`
- **Rationale**: `Math.random()` during component render causes re-render jitter, visual layout pops, and React hydration mismatches. A deterministic hash based on `(suit, rank, markType)` creates fixed visual character per card without state management or side-effects.

### Decision 2: Bounded Transformation Ranges per Mark Type
- **Center Illustrations (`CardFaceIllustration`)**: Rotation `-3.0°..+3.0°`, Scale `0.95..1.05`, Translation `±2.5px`.
- **Corner Scars (`SlashedRank` SVG)**: Rotation `-2.0°..+2.0°`, Scale `0.95..1.05`.
- **Modified Rank Text (`SlashedRank` label)**: Rotation `-7.0°..-1.0°` (centered around existing `-4°`), Scale `0.92..1.08`, Translation `±1.5px`.
- **Anchor Badges (`AnchorBadge` SVG)**: Rotation `-4.0°..+4.0°`, Scale `0.95..1.05`, Translation `±1.0px`.

### Decision 3: Simple Integer Hash Function
Use string charCode & rank arithmetic:
```ts
function hashSeed(suit: string, rank: number, markType: string): number {
  const str = `${suit}_${rank}_${markType}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 10007;
  }
  return hash / 10007; // Returns 0..1
}
```

## Risks / Trade-offs

- **[Risk]** Excessive translation could push corner ink marks outside their card boundaries.
  - **Mitigation**: Translation bounds are strictly capped (`±1.0px` to `±2.5px`) and transforms use center transform origin.
