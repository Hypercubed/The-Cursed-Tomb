## Why

Currently, all card modifications (negative scars/curses and positive anchors/blessings) use a single unified royal blue ink color (`#1d4ed8`), making positive and negative effects indistinguishable by color alone. Furthermore, base cards use flat digital red and black colors that lack the authentic richness of real printed playing cards. 

Color-coding handwritten pen annotations (Blue for positive, Scarlet Red Gel for negative) and refining base suit ink tones to natural offset printing colors (Bicycle Crimson and Carbon Black) will significantly improve visual contrast, player intuition, and tabletop realism.

## What Changes

- **Positive Effect Color Coding**: Positive card modifications (Fortifying/Anchored badges, Blessed Hero suit circles, and suit blessing center illustrations) retain vivid Cobalt Blue Pen Ink styling (`#1d4ed8` with blue ink halo).
- **Negative Effect Color Coding**: Negative card modifications (Attrition scars 1–4, active Curse marks/icons, and handwritten shifted functional rank values) transition to wet Scarlet Red Gel Pen Ink styling (`#dc2626` / `#e11d48` with a scarlet ink-bleed halo).
- **Natural Base Card Inks**: Update default base card colors from flat RGB values to authentic printed playing card ink tones: deep Bicycle Crimson (`#991b1b`) for Hearts/Diamonds, and soft Carbon Black (`#1c1917` / `#27272a`) for Spades/Clubs.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Differentiate positive (Blue Pen) and negative (Scarlet Red Pen) modifier overlay colors, and update base red and black suit ink tokens to natural offset playing card tones.

## Impact

- **Frontend Components**: Updates `/home/jmh/workspace/projects/the-cursed-tomb/src/components/PlayingCard.tsx` and `/home/jmh/workspace/projects/the-cursed-tomb/src/components/CardFaceIllustration.tsx`.
- **CSS / Styling**: Updates color variables or utility classes for playing card text, SVG stroke colors, drop shadows, and ink bleed filters.
