## Context

Currently, `PlayingCard.tsx` renders scars and curses as straight 18px SVG lines (`<line>`), blessings as rigid 360° SVG circles (`<circle>`), and top-right anchor immunity badges (`AnchorBadge`) as clean geometric lines. Furthermore, cards are displayed as flat, perfectly squared slates on the screen. To fulfill the tabletop lore of playing with physical cards marked with a fine-tip permanent marker, we need to implement organic SVG path stroke rendering, paper cardstock texture overlays, SVG ink turbulence filters, and subtle natural dealing rotation offsets.

## Goals / Non-Goals

**Goals:**
- Replace rigid SVG `<line>` and `<circle>` primitives in `PlayingCard.tsx` (across `SlashedRank`, `SuitPip`, and `AnchorBadge`) with organic hand-drawn SVG `<path>` elements (wobbly vertical walls, organic slashes, un-closed blessing loops, and organic top-right anchor strokes).
- Create a global SVG filter component (`<InkBleedFilter />` or inline `<svg>` definition) supplying `feTurbulence` and `feDisplacementMap` to simulate permanent marker ink soaking into card stock paper.
- Add a tactile cardstock paper texture overlay (via CSS gradient noise / SVG background filter) to `PlayingCard.tsx`.
- Apply deterministic, subtle rotation offsets (e.g. ±1° to ±1.8°) to cards in `PyramidBoard.tsx` based on row and column index, resetting to 0° on hover/focus/selection for clean interactions.
- Maintain high contrast, performance, and responsive scaling across viewports.

**Non-Goals:**
- Changing underlying game state logic (`game.ts`), failure tracks, or campaign mechanics.
- Replacing central Egyptian suit icons (Ankh, Scarab, Khopesh, Was Scepter).
- Relocating anchor immunity badges (they remain in the top-right corner zone as specified in recent layout changes).

## Decisions

### 1. Organic SVG Path Geometry Generator / Utility
- **Decision:** Define hand-drawn SVG path definitions for Scars (Stages 1–4), Anchors (`AnchorBadge`), and Blessings (`SuitPip`). Use control points that introduce subtle curves and line overshoots.
- **Rationale:** Standard SVG `<line>` looks computer-generated. Curved `<path>` strings create authentic pen strokes while staying ultra-lightweight and resolution-independent.
- **Alternatives Considered:** Canvas drawing (unnecessary DOM complexity for static card overlays) or raster PNG overlays (scaling artifacts across responsive card sizes).

### 2. Global SVG Ink Bleed Filter (`feTurbulence`)
- **Decision:** Render a shared `<svg className="sr-only">` filter definition containing:
  ```xml
  <filter id="ink-bleed">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
  </filter>
  ```
  Apply `filter="url(#ink-bleed)"` to scar, curse, anchor (`AnchorBadge`), and blessing SVG elements.
- **Rationale:** Introduces micro-roughness along pen stroke edges, making vector lines look like ink bleeding into paper fiber.

### 3. Tactile Cardstock Texture
- **Decision:** Enhance card CSS (`index.css` or Tailwind classes) with a subtle parchment paper texture overlay using CSS multi-layered gradients and subtle radial shadows.
- **Rationale:** Adds tactile depth without loading external heavy texture image assets.

### 4. Deterministic Card Rotation Offsets
- **Decision:** In `PyramidBoard.tsx` and `DrawZone.tsx`, compute a deterministic rotation value per card position:
  ```typescript
  const rotationDeg = ((row * 7 + col * 3) % 5 - 2) * 0.7; // Yields ~ -1.4° to +1.4°
  ```
  Apply via inline `style={{ transform: `rotate(${rotationDeg}deg)` }}`.
  Smooth transition to `rotate(0deg)` when hovered, selected, or focused.
- **Rationale:** Creates a natural hand-dealt layout feel without disrupting gameplay or click target alignment.

## Risks / Trade-offs

- **[Risk]** SVG filters can cause rendering lag if over-used on low-end mobile devices.
  - *Mitigation:* Keep `feTurbulence` octaves low (`numOctaves="2"`, `scale="1.5"`). Shared filter ID keeps memory footprint negligible.
- **[Risk]** Card rotation tilt could break overlap alignment or text readability.
  - *Mitigation:* Keep rotation angle strictly under ±1.8° and level to 0° on hover/active states.
