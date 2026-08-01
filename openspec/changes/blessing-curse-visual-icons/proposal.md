## Why

Blessings and curses are difficult to quickly identify in both the physical tabletop game and the web UI. All ink marks currently use the same blue color, making blessings, curses, scars, and anchors visually similar at a glance. Players frequently miss important marks like the Clubs Universal Wildcard blessing or the Black Weight curse, leading to missed tactical opportunities and rule violations during live play.

## What Changes

- Add optional hand-drawable icons for all 4 suit blessings to improve visual recognition
- Add optional hand-drawable icons for Red and Black curses to distinguish trap vs weight effects
- Update physical rules documentation to include icon drawing instructions and placement guidelines
- Update web UI card rendering to display blessing and curse icons alongside existing ink marks
- Icons must be simple (2-4 strokes max) for quick hand-drawing with a single pen
- Icons must translate cleanly to SVG for digital implementation

**Blessing Icons:**
- ♥ Hearts: Upward arrow (↑) above suit pip - represents resurrection/rising from grave
- ♦ Diamonds: Square/box (□) around suit pip - represents vault/storage container
- ♠ Spades: Downward arrow (↓) below suit pip - represents tunneling/digging down
- ♣ Clubs: Question mark (?) over rank number - represents wildcard/any value, covers the functional value to communicate it doesn't matter

**Curse Icons:**
- Red Curse: Downward triangle (▼) below the X mark - represents cards falling/trapping below
- Black Curse: Three horizontal lines (≡) below the X mark - represents heavy burden/restriction

## Capabilities

### New Capabilities
- `blessing-curse-icons`: Visual icon system for blessings and curses in both physical and digital play

### Modified Capabilities
- `card-rendering`: Add icon rendering to PlayingCard component for blessings and curses
- `tabletop-aesthetics`: Update physical game visual guidelines to include optional icon system
- `cursed-tomb-campaign`: Update rules documentation with icon drawing instructions and placement

## Impact

- **Physical Game**: Players can optionally draw icons to make blessings/curses more scannable during live play. No rule changes, only visual enhancement.
- **Web UI**: PlayingCard.tsx component will render SVG icons alongside existing ink marks. Tooltip text will reference icon meanings.
- **Documentation**: docs/rules.md will include optional icon drawing instructions in the appropriate sections (blessings and curses).
- **No Breaking Changes**: Icons are optional additions to existing marks. Players who prefer minimal marks can continue without icons.
