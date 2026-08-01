## Why

The Cursed Tomb rules are designed to be played physically using real cards and a permanent fine-tip marker. Currently, the web application renders pen markings (scars, curses, blessings, anchors) using rigid computer-drawn SVG vector lines and perfect geometric circles, which feels artificial and disconnects the digital experience from the physical tabletop game lore. Additionally, cards sit perfectly straight and flat on the screen without paper texture or natural physical dealing variations.

Adding organic hand-drawn SVG stroke paths, paper ink bleed filters, physical card stock paper texture, and subtle natural dealing tilt/rotation offsets will create an immersive, tactile tabletop experience that feels like playing with real mutated cards on an expedition table.

## What Changes

- **Organic Hand-Drawn Stroke Paths**: Replace rigid SVG `<line>` and `<circle>` vector primitives with organic `<path>` definitions featuring natural stroke wobble, subtle width variation, slight line overshoots, and un-closed hand-drawn blessing loops.
- **Ink Texture & Bleed SVG Filters**: Apply lightweight inline SVG filters (`feTurbulence` / `feDisplacementMap`) to give vector ink lines and handwritten modified values a subtle, authentic paper-ink soaking micro-roughness.
- **Card Stock Texture**: Update card styling with a subtle tactile cardstock paper texture / linen grain background while maintaining high contrast and accessibility.
- **Natural Tabletop Card Dealing Tilt**: Introduce deterministic, subtle rotation offsets (e.g. ±1° to ±2°) when cards are dealt into the pyramid layout so cards look naturally placed on a physical surface by hand.
- **Procedural Ink Stroke Seed Variation**: Use card identity (`suit + rank`) to seed tiny variations in ink stroke wobble and angle so ink marks look uniquely hand-drawn on each card rather than copy-pasted.

## Capabilities

### New Capabilities
- `tabletop-aesthetics`: Visual styling, cardstock texture, ink bleed filters, organic hand-drawn SVG paths, and natural card rotation offsets for physical tabletop realism.

### Modified Capabilities
- `card-rendering`: Requirements updated to specify organic hand-drawn stroke geometry, ink bleed filters, cardstock textures, and rotation offsets.

## Impact

- **UI Components**: `PlayingCard.tsx`, `PyramidBoard.tsx`, `DrawZone.tsx`, `index.css`, `PlayingCard.css` (or utility CSS/SVG definitions).
- **Assets / SVG Utilities**: SVG filter definitions for ink turbulence and paper texture.
- **Game Engine & Rules**: Zero impact on game logic, failure tracks, or campaign mechanics (`game.ts` remains untouched).
