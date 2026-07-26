## Context

The current game layout uses fixed pixel widths (`72px` for playing cards, `1200px` for the container max-width). On large monitors (1440p, 4K), the game board appears visually diminished, while on mobile screens (< 600px width), the pyramid base overflows horizontally.

## Goals / Non-Goals

**Goals:**
- Provide fluid and scaled card dimensions across mobile, desktop, and ultra-wide screens.
- Expand shell container limits to `1600px` on ultra-wide screens.
- Keep card aspect ratio and row overlap visually balanced across all scale breakpoints.
- Ensure draw pile and discard pile slots match the scaled card dimensions.

**Non-Goals:**
- Changing game rules, card logic, or game state code (`src/game.ts`).
- Rewriting the theme or color palette.

## Decisions

### Decision 1: Tailwind Breakpoint-Driven Card Sizing
**Approach:** Use Tailwind responsive width and height classes on `PlayingCard` and `DrawZone` buttons:
- **Mobile (< 640px):** `w-12 min-h-[64px]` (48px width) with compact corner rank text and smaller suit icons.
- **Tablet / Laptop (640px - 1280px):** `w-[72px] min-h-[96px]` (72px width - baseline standard).
- **Desktop / Ultra-wide (≥ 1280px):** `w-[88px] min-h-[116px] xl:w-[96px] xl:min-h-[128px] 2xl:w-[108px] 2xl:min-h-[144px]` (up to 108px width on 4K).

**Rationale:** Breakpoint-driven utility classes maintain precise typographic hierarchy, padding, and border radius at each tier without requiring complex JavaScript resize observers or transform scaling.

### Decision 2: Responsive Negative Top-Margin Overlap
**Approach:** Set `PyramidBoard` row overlap using responsive negative margin classes (`-mt-8 sm:-mt-12 lg:-mt-14 xl:-mt-16 2xl:-mt-18`).

**Rationale:** Row overlap must remain approximately 50% of card height. Scaling `-mt` alongside card height ensures upper card faces are consistently exposed across all viewports.

### Decision 3: Expanded Game Shell Container Width
**Approach:** Update `GameShell` container from `max-w-[1200px]` to `max-w-screen-2xl 2xl:max-w-[1600px]`.

**Rationale:** Allows the board container to utilize available screen real estate on large desktop monitors while keeping centered alignment and high readability.

## Risks / Trade-offs

- **[Risk] Mobile Viewport Height**: On small phones, a stacked layout might require vertical scrolling.
  - *Mitigation*: Ensure top margin, header padding, and spacing are compact on mobile screens (`p-3 sm:p-6`).
- **[Risk] Suit SVG Icon Distortion**: Scaled cards might distort fixed-size suit icons.
  - *Mitigation*: Apply responsive width/height classes to the suit SVGs (`w-5 h-5 sm:w-[30px] sm:h-[30px] xl:w-9 xl:h-9`).
