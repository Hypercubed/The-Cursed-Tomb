## Why

Currently, card modification marks (scars, curses, anchors, blessings, and functional values) are stacked vertically under the top-left rank label and top-right corner. This layout makes modified card values hard to read during gameplay, especially when cards overlap in the pyramid stack. Additionally, bottom-right corners currently only render plain rank and suit labels, breaking 180° rotational symmetry.

Furthermore, `docs/rules.md` describes manual physical pen marking rules that need to be updated to match the new corner index placement (scars over rank number pip, anchors inside suit pip, blessings encircling suit pip, mirrored 180°).

## What Changes

- Move Scars (`|`, `||`, `|||`) and Curses (`⚡`) directly onto/over the **Rank Number Pip** in top-left and bottom-right corner indices.
- Render the 3rd scar as a heavy diagonal slash across the rank number with the effective modified functional value written immediately to its right.
- Move Anchors (`—`, `+`) directly inside the **Suit Pip** as bold overlay lines/crosses.
- Move Blessings (`[O]`) to surround the **Suit Pip** as a circular halo/ring.
- Apply full **180° rotational symmetry** so both top-left and bottom-right card corners display identical rank, suit, scar, curse, anchor, blessing, and modified value information.
- Update `docs/rules.md` manual play rules to describe marking pen strokes over the rank number pip and suit pip symmetrically in both card corners.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Requirements updated for card corner indices layout, rank scar/curse overlays with inset modified values, suit anchor/blessing inline marks, and 180° rotational symmetry across both corner indices.

## Impact

- `PlayingCard.tsx`: Major update to internal JSX layout and styling for corner indices (top-left and bottom-right).
- `docs/rules.md`: Update physical manual-play pen stroke instructions for Section 5 (Attrition Track) and Section 6 (Survival Rewards).
- CSS / SVG styling for slashed rank text, bold suit anchor lines, and blessing halos.
- Visual clarity and gameplay scanability improved across all viewport tiers.
