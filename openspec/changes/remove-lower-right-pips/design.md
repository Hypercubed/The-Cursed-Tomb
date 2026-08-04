## Context

Playing cards in *The Cursed Tomb* currently render dual corner indices (top-left index & bottom-right index rotated 180°) as well as dual immunity anchor badges (top-right & bottom-left rotated 180°). In digital screen layouts, cards are strictly upright. Dual indices consume vertical space and introduce unnecessary visual noise in overlapping pyramid card layouts and on mobile devices.

## Goals / Non-Goals

**Goals:**
- Eliminate the bottom-right corner index pip (rank, suit symbol, scars, curses, blessings) and bottom-left rotated anchor badge from card rendering.
- Maintain top-left corner index for rank, suit, scars, curses, and blessings, and top-right corner for anchor immunity badges.
- Simplify card flex/grid layout in `PlayingCard.tsx` while preserving standard suit icon placement in the central zone.
- Ensure all relevant component tests pass after updating rendering expectations.

**Non-Goals:**
- Altering the top-left index layout, scar/curse SVG rendering logic, or blessing ring appearance.
- Changing physical card print assets (this change applies strictly to the digital game client).

## Decisions

### Decision 1: Remove lower index elements from `PlayingCard` component
- **Rationale**: Removing the bottom row container `<div className="flex justify-between items-end">...</div>` directly eliminates both the rotated bottom-right `CornerIndex` and rotated bottom-left `AnchorBadge`.
- **Alternatives Considered**:
  - *Hiding via CSS (`hidden` / `display: none`)*: Retains unneeded DOM nodes and react prop passes. Removing from JSX directly is cleaner and improves rendering efficiency.

### Decision 2: Update Card Layout Grid Structure
- **Rationale**: Update `grid-rows-[auto_1fr_auto]` in `PlayingCard.tsx` to `flex flex-col justify-between` or `grid grid-rows-[auto_1fr]`. A top bar row (`flex justify-between items-start`) containing top-left index and top-right anchor badge followed by a flex-1 central suit zone optimizes vertical room for center suit graphics and scar value callouts.

## Risks / Trade-offs

- **[Risk]** Unit tests or snapshot tests expecting bottom-right index elements may fail.
  → **Mitigation**: Update unit test queries and assertions in `src/components/__tests__/` or `src/App.test.tsx` to align with the single top-left index layout.
