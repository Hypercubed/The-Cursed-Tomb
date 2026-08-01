## 1. Ink Bleed Filter & Cardstock Texture Setup

- [x] 1.1 Add shared SVG `<filter id="ink-bleed">` definition in global layout or `PlayingCard.tsx`
- [x] 1.2 Update card background styles in `index.css` / `PlayingCard.tsx` with tactile paper cardstock texture overlay

## 2. Hand-Drawn Organic SVG Path Components

- [x] 2.1 Refactor `SlashedRank` in `PlayingCard.tsx` to replace straight `<line>` primitives with organic `<path>` elements featuring stroke wobble and overshoots for Stages 1–4
- [x] 2.2 Refactor `SuitPip` blessing halo ring to use an organic hand-drawn `<path>` loop instead of a geometric `<circle>`
- [x] 2.3 Refactor `AnchorBadge` top-right immunity marks (`—` and `+`) to use hand-drawn SVG paths with organic stroke caps and subtle tilt
- [x] 2.4 Apply `filter="url(#ink-bleed)"` to all card pen ink mark SVGs (scars, curses, blessings, top-right anchor badges) and handwritten modified rank text

## 3. Tabletop Natural Card Deal Rotation

- [x] 3.1 Implement deterministic rotational tilt helper for cards dealt into `PyramidBoard.tsx` and layout zones
- [x] 3.2 Add CSS transition for leveling card rotation to 0° on hover, focus, and selection states

## 4. Verification & Testing

- [x] 4.1 Run unit test suite (`npm test`) to ensure card interactions, props, and accessibility titles remain fully functional
- [x] 4.2 Validate responsive scaling and visual rendering across mobile and desktop breakpoints
