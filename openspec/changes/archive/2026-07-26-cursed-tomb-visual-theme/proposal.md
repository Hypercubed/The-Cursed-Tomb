## Why

To deliver on the promise of "The Cursed Tomb" identity, the game needs a deeply immersive, high-quality visual atmosphere. While standard Pyramid Solitaire mechanics are functional, the current interface feels like a generic card game rather than an ancient tomb raid. Upgrading the color palette, ambient lighting, layout textures, and card aesthetics will elevate the gameplay experience to feel premium, mysterious, and cohesive.

## What Changes

- **Thematic Color Palette**: Extend the current color scheme to a complete HSL-tailored palette representing deep obsidian, sandstone panels, and basalt stone card bases.
- **Ambient Torchlight Vignette**: Introduce a CSS radial gradient overlay that subtly flickers to simulate torchlight illumination in a dark chamber.
- **Sacred Pedestal Layout**: Redesign the draw and discard pile zones to look like chiseled sandstone altars/pedestals instead of flat interactive boxes.
- **Explorer's Journal Sidebar**: Style the control sidebar container to look like a weathered, leather-bound researcher's logbook.
- **Basalt Card Faces**: Polish card layout styling with chiseled basalt slate visuals and thematic suit iconography matching the Egyptian tomb aesthetic.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `game-theme`: Adding requirement for ambient flickering torchlight vignette overlay and fine-tuning the obsidian/sandstone dark color scheme.
- `game-layout`: Styling the game sidebar as a leather-bound journal and card pile zones as stone pedestals.
- `card-rendering`: Enhancing card face design to simulate chiseled stone basalt tablets with thematic suit iconography.

## Impact

- React components: `src/App.tsx`, `src/components/GameSidebar.tsx`, `src/components/DrawZone.tsx`, `src/components/PlayingCard.tsx`, `src/components/GameShell.tsx`.
- Styling: `src/index.css` and `tailwind.config.js`.
- Dependencies: None.
