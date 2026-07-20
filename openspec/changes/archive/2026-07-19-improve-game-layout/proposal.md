## Why

The game has a working Tailwind design system but the layout is a plain vertical stack with no visual hierarchy — the pyramid (the centrepiece of the game) is buried inside a generic panel alongside a small draw/discard zone. The app looks like a form, not a game. This change redesigns the layout to put the pyramid front and centre, gives the draw/discard zone proper prominence, improves card rendering to resemble real playing cards, and applies thematic polish appropriate for a game called "The Cursed Tomb."

## What Changes

- Restructure the top-level layout: responsive two-column shell on desktop (sidebar for setup/stats, main area for the board)
- Promote the pyramid to a standalone hero section with visual depth (row spacing that emphasises the apex-to-base structure)
- Redesign the draw/discard zone as a dedicated horizontal strip with clear labelling and card slot placeholders
- Improve card rendering with a proper top-left rank/suit and bottom-right mirrored rank/suit layout
- Add thematic atmosphere: amber/gold accent replacing the generic blue, subtle texture on the game background, thematic heading typography
- Extend Tailwind config with new design tokens (amber accent family, texture utilities)
- Extract reusable layout components from the monolithic `App.tsx`: `GameShell`, `PyramidBoard`, `DrawZone`, `GameSidebar`

## Capabilities

### New Capabilities
- `game-layout`: Responsive two-column game shell with sidebar and centred pyramid hero area
- `card-rendering`: Enhanced playing-card visual with rank/suit corners and red-suit distinction
- `game-theme`: Amber/gold accent palette and tomb-atmosphere visual treatment

### Modified Capabilities
- `pyramid-solitaire-game`: The requirement for removed cards to collapse in layout applies to the new flex row rendering; red suit rendering moves to the new card component — both requirements remain but are now fulfilled in new component locations

## Impact

- **Code**: `App.tsx` will be split into focused components (`GameShell`, `PyramidBoard`, `DrawZone`, `GameSidebar`, `PlayingCard`)
- **Tailwind config**: New tokens added — amber accent scale, optional CSS background texture
- **CSS**: Minimal additions to `index.css` for any texture patterns that Tailwind utilities can't express
- **Dependencies**: No new runtime dependencies; may add a Google Font (`Cinzel` or similar) via `index.html`
- **Game logic**: Zero changes to `game.ts` — this is purely a presentation layer change
