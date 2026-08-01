# Design: Standard Center Card Suit Images

## Context

The `PlayingCard` component previously rendered custom thematic Egyptian SVG icons (Ankh, Scarab, Khopesh, Was Scepter) in the center zone of each card face. While decorative, these icons differed from standard playing card suit symbols, introducing cognitive friction for players scanning cards during fast-paced play. Corner suit indicators already use standard suit characters (`♥`, `♦`, `♠`, `♣`).

## Goals / Non-Goals

**Goals:**
- Update the `SuitIcon` helper component in `PlayingCard.tsx` to render clean, standard SVG vector graphics for Hearts, Diamonds, Spades, and Clubs in the center card zone.
- Ensure the center suit SVG scales seamlessly across all viewport breakpoints (`w-4 h-4` up to `xl:w-10 xl:h-10`).
- Maintain existing color tokens (`text-game-red` for Hearts/Diamonds, `text-game-card-text` for Spades/Clubs).

**Non-Goals:**
- Changing corner suit indicators (`SuitPip`) or Blessed Hero halo effects.
- Changing card background textures, borders, or scar/curse overlays.

## Decisions

### Decision 1: Standard Vector Paths in `SuitIcon`

Instead of pulling an external icon package or loading external image files, inline SVG vector paths will be updated directly within `SuitIcon` in `src/components/PlayingCard.tsx`.

*Rationale:*
- Zero extra bundle size or HTTP requests.
- Full SVG scalability and automatic CSS `fill="currentColor"` inheritance.
- Consistent rendering across all screen resolutions.

*Alternatives Considered:*
- *External PNG/SVG Image Files*: Requires asset loading and network/build overhead.
- *Unicode text inside center zone*: Does not scale as smoothly as SVG vectors and is dependent on system font rendering.

## Risks / Trade-offs

- **Visual Familiarity vs Thematic Identity**: Moving from Egyptian glyphs to standard card suits slightly reduces thematic flair in the center card zone, but significantly improves UI clarity and playability.
  - *Mitigation*: The light parchment texture, ancient scar/curse blue ink overlays, and corner indices maintain the tomb aesthetic.

## Migration Plan

1. Update `SuitIcon` SVG definitions in `src/components/PlayingCard.tsx`.
2. Run visual/unit verification and build checks (`npm test`, `npm run build`).
