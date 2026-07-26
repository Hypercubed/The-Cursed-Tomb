## Why

The current visual presentation of The Cursed Tomb suffers from excessive darkness, low contrast, and obscure card iconography. Cards use a dark basalt background (`#2d241d`), small 10px corner suit symbols, and abstract ancient glyphs without familiar suit cues, making cards difficult to scan and read during gameplay. This change improves visual accessibility and card readability while preserving the atmospheric tomb aesthetic.

## What Changes

- **Light Parchment Card Faces**: Replace dark basalt card backgrounds with warm, high-contrast aged parchment (`#f5f0e6`) and dark crisp rank numbers/suit markings (`#1c1710` for black suits, `#dc2626` for red suits).
- **Dual-Badge Suit Iconography**: Render classic, instantly recognizable suit symbols (`♥`, `♦`, `♠`, `♣`) in card corner indices alongside larger central thematic Egyptian icons (Ankh, Scarab, Khopesh, Was Scepter) in the center zone.
- **Enhanced Typography & Mirrored Corners**: Scale up rank labels and suit icons in card corners, and mirror the bottom-right corner rank/suit index (rotated 180 degrees) for standard card layout conventions.
- **Improved Blocked & Panel Contrast**: Lighten panel backgrounds (`#282119`) and apply clear stone-texture / translucent overlays to blocked cards rather than darkening them into unreadable pitch-black shapes.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `card-rendering`: Requirements for card face background color, corner indices typography, suit iconography (dual-badge system), and blocked card visibility/contrast.
- `game-theme`: Requirements for color palette tokens (card background, panel background, red suit colors, and dark text tokens) to support light parchment cards and high-contrast UI elements.

## Impact

- **Frontend Components**: `PlayingCard.tsx`, `DrawZone.tsx`, `PyramidBoard.tsx`, `GameSidebar.tsx`, `App.tsx`.
- **CSS / Theme Tokens**: `tailwind.config.js` color definitions and `src/index.css` global styles/overlay rules.
