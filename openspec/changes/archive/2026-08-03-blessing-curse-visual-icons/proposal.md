## Why

Blessings and curses are difficult to quickly identify in both the physical tabletop game and the web UI. All ink marks currently use the same blue color, making blessings, curses, scars, and anchors visually similar at a glance. Players frequently miss important marks like the Clubs Universal Wildcard blessing or the Black Weight curse, leading to missed tactical opportunities and rule violations during live play.

## Why

Blessings and curses are difficult to quickly identify in both the physical tabletop game and the web UI. All ink marks currently use the same blue color, making blessings, curses, scars, and anchors visually similar at a glance. Furthermore, cards could previously accumulate both a Blessing and a Curse simultaneously, creating visual clutter and confusing hybrid card states.

## What Changes

- **Mutual Exclusivity Rule**: Cards can only possess EITHER a Blessing OR a Curse, never both.
  - If a Blessed card reaches Stage 4 Attrition, it receives the Stage 4 rank marking (slash over rank) and can proceed to Entombed later, but the **Curse trap effect and Curse icon drawing are skipped**. The card retains its Blessing.
  - If a Cursed card (Stage 4) is selected as the Fallen Hero in a victory round, the **Blessing award is skipped**.
- **Single-Identity Center Face Drawings**: The center face of each mutated card displays a prominent hand-drawn illustration (single pen, 2–4 simple strokes) representing either a Blessing OR a Curse:
  - **Blessing Drawings**:
    - ♥ **Hearts (Resurrection)**: Tomb archway with upward rising arrow (`∩` + `↑`) - represents rising from the graveyard
    - ♦ **Diamonds (Vault)**: Vault safe box (`□` with center keyhole circle `o`) - represents vault storage container
    - ♠ **Spades (Tunneling)**: Left-facing rounded capsule (`[ ⊃ ]`, rectangle with rounded left cap and flat right edge) - represents tunnel passageway through pyramid tiers
    - ♣ **Clubs (Wildcard)**: Infinity symbol (`∞`) - represents infinite / any value wildcard pairing
  - **Curse Drawings**:
    - **Red Curse (Trap)**: Downward-pointing triangle (`▼`) - represents trap door dealing next row face-down
    - **Black Curse (Weight)**: Unicode trapezoid weight (`⏍`, trapezoid body with handle loop) - represents heavy weight pinning card to pyramid
- Update physical rules documentation and web UI card rendering (`PlayingCard.tsx`) to render these center face drawings alongside slashed rank ink marks.
- Icons must be simple (2-4 strokes max) for quick hand-drawing with a single pen.

## Capabilities

### New Capabilities
- `blessing-curse-icons`: Visual icon system for blessings and curses in both physical and digital play

### Modified Capabilities
- `card-rendering`: Add icon rendering to PlayingCard component and enforce single-identity (Blessing OR Curse) rendering
- `tabletop-aesthetics`: Update physical game visual guidelines to include optional icon system and single-identity drawing rules
- `cursed-tomb-campaign`: Update campaign lifecycle rules and documentation for Blessing/Curse mutual exclusivity (skipping Curse trap on Blessed cards and skipping Blessing awards on Cursed cards)

## Impact

- **Physical Tabletop & Web UI**: Cards have clear, single-identity visual drawings on their face (Blessing or Curse, never both).
- **Game Engine**: `applyEndOfWeekLifecycle` suppresses Curse trap mechanics on Blessed cards reaching Stage 4, and skips Blessing awards on Cursed Hero cards.
- **Documentation**: `docs/rules.md` updated with mutual exclusivity rules and icon drawing instructions.
