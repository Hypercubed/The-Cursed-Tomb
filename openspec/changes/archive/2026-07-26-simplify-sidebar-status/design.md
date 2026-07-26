## Context

The application sidebar currently displays a "Status" panel with 7 rows: Status, Redraws, Draw pile, Discard top, Selected, Cards Removed, and Lifetime Record. The top header displays game status, while the DrawZone displays draw pile counts, cycle counts, card images, and selection highlights. This results in 5 redundant text fields in the sidebar panel.

## Goals / Non-Goals

**Goals:**
- Remove redundant status indicators (`statusLabel`, `redrawsRemaining`, `drawPileCount`, `topDiscardLabel`, `selectedCardLabel`) from the sidebar component.
- Re-label the section to "Progress & Stats" to accurately reflect its content.
- Clean up `GameSidebarProps` and `App.tsx` prop-passing to eliminate unused data calculations.

**Non-Goals:**
- Modify header status formatting or DrawZone display.
- Change the calculation or persistence of win/loss statistics or matched cards tracking.

## Decisions

- **Decision 1: Rename Section Header**: Change the sidebar panel title from `☥ Status` to `📊 Progress & Stats` (or `𓋹 Progress & Stats`).
  - *Rationale*: With single-round state duplicates removed, the panel exclusively presents match progress metrics (`Cards Removed`, `View Removed Cards`) and overall lifetime stats (`Win Rate`, `Wins/Losses`, `Streaks`).
- **Decision 2: Retain `Cards Removed` and `View Removed Cards`**: Keep cards removed count and the modal trigger button in this section as they provide unique progress feedback during a match.
- **Decision 3: Simplify `GameSidebar` Interface**: Remove props `statusLabel`, `redrawsRemaining`, `drawPileCount`, `topDiscardLabel`, and `selectedCardLabel` from `GameSidebarProps`.

## Risks / Trade-offs

- **Risk**: Player looks for game status or redraw cycles exclusively in the sidebar.
  - *Mitigation*: Header clearly shows `Status: [State]` and DrawZone displays `Cycles: [Count]` directly beneath the Draw button.
