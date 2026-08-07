## Context

See `proposal.md`. The game layout currently renders Stock, Waste, and Vault card slots in `DrawZone.tsx`, but lacks visual card count indicators for Waste and Vault, and lacks a dedicated header badge for Stock.

## Goals / Non-Goals

**Goals:**
- Provide clear visual indicators for card counts in Stock, Waste, and Vault slots within `DrawZone.tsx`.
- Maintain visual harmony with the tabletop/tomb theme (`bg-[#18120c] border border-amber-900/40 text-amber-300 font-mono text-xs`).
- Pass necessary state (`discardPileCount`) from `App.tsx` down to `DrawZone.tsx`.

**Non-Goals:**
- Modifying game state calculation or deck rules.
- Changing mobile layout structure or board container sizing.

## Decisions

### 1. Count Indicator Placement and Theme
- **Decision**: Render styled badge counters directly within each pile's header in `DrawZone.tsx`.
- **Format**:
  - Stock: `Stock [18]` (or header badge showing `18`)
  - Waste: `Waste [7]` (or header badge showing `7`)
  - Vault: `♦ Vault [1/1]` or `[0/1]`
- **Rationale**: Headers provide standard vertical baseline alignment across all slots regardless of screen size without obscuring card visuals.

### 2. Component Props Update
- **Decision**: Extend `DrawZoneProps` to accept `discardPileCount: number`.
- **Rationale**: `App.tsx` already has access to `game.discardPile.length`. Passing this value to `DrawZone` is non-breaking and lightweight.

## Risks / Trade-offs

- [Header text wrapping on small viewports] → Mitigation: Use concise flex spacing, small `text-[0.65rem]` / `text-xs` badge sizes, and `font-mono` styling.
