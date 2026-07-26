## Why

The top header bar now displays the active game status, and the DrawZone directly displays draw pile count, cycles remaining, top discard card, and selected card highlight. Having these same 5 values in the sidebar's Status panel creates visual clutter and redundancy. Eliminating the duplicate fields allows us to reframe the sidebar panel cleanly around match progress and accumulated player statistics.

## What Changes

- **Streamline Sidebar Status Panel**: Remove duplicate status fields from the sidebar (`Status`, `Redraws`, `Draw pile`, `Discard top`, `Selected`).
- **Reframe Panel as Progress & Stats**: Re-label the section to "Progress & Stats" (or "Statistics"), focusing on current game progress (`Cards Removed`, `View Removed Cards`) and accumulated lifetime statistics (`Win Rate`, `Wins / Losses`, `Streak`).
- **Simplify Sidebar Interface Props**: Remove unused/redundant props passed down to `GameSidebar` from `App.tsx`.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `game-layout`: Update the sidebar status panel requirements so it focuses on game progress and lifetime statistics, omitting duplicate status indicators already present in the header and draw zone.

## Impact

- `src/components/GameSidebar.tsx`: Update sidebar layout to remove redundant fields and focus on progress/stats summary.
- `src/App.tsx`: Remove redundant prop computations and props passed to `GameSidebar`.
- `openspec/specs/game-layout/spec.md`: Update delta spec to align requirements with the streamlined panel.
