## Why

The game board currently uses hardcoded pixel card sizes (72px × 96px) and a restricted container max-width (1200px). On high-resolution desktop and 4K displays, the card pyramid appears visually tiny with excessive surrounding space, while on mobile displays (< 600px width), 7-card pyramid rows exceed viewport width and cause horizontal overflow or clipping. Making the layout responsive ensures optimal visual scale and playability across all screen sizes from mobile devices to ultra-wide desktop monitors.

## What Changes

- Expand the main application shell container from fixed 1200px max width to a fluid/expanded responsive container (up to 1600px / 2xl breakpoint).
- Replace hardcoded pixel card dimensions (72px × 96px) with responsive card sizing tiers (`w-12 h-16` / `48px×64px` on mobile, `w-18 h-24` / `72px×96px` on tablet/laptop, `w-22 h-28` / `88px×112px` on desktop, `w-26 h-34` / `104px×136px` on 2xl/4K screens).
- Update `PyramidBoard` row overlap calculation from fixed `-mt-12` to scalable responsive margin utility classes (`-mt-8 sm:-mt-10 md:-mt-12 lg:-mt-14 xl:-mt-16`) so pyramid proportions remain consistent at all card scales.
- Update `DrawZone` empty slot and card container sizing to stay synchronized with the responsive card dimensions.
- Enhance mobile layout responsiveness so setup/status panel does not dominate vertical space above the board on small viewports.

## Capabilities

### Modified Capabilities

- `game-layout`: Update app shell max-width rules and mobile layout stacking to support responsive high-resolution displays and mobile viewports.
- `card-rendering`: Update card dimension requirements to mandate responsive breakpoint-driven sizing instead of static 72px width.

## Impact

- `src/components/GameShell.tsx`: Updates container max-width classes.
- `src/components/PlayingCard.tsx`: Updates card base dimensions and internal layout spacing to scale cleanly.
- `src/components/PyramidBoard.tsx`: Updates row gap and negative top-margin overlap styling.
- `src/components/DrawZone.tsx`: Updates draw/discard slot dimensions to match responsive card sizes.
