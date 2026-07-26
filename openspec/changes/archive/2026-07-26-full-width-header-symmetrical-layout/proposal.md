## Why

Currently, the page layout suffers from alignment and border inconsistencies:
1. The game title (`The Cursed Tomb`) is positioned inside the right main column above the board, pushing the game play area down by ~64px relative to the top of the left setup panel.
2. The left setup panel (`GameSidebar`) uses asymmetrical border widths (`border-l-[14px] border-y-[6px] border-r-[6px]`), creating an uneven "book spine" effect that distorts panel proportions.
3. The floating debug panel (`DebugPanel`) is positioned with an unanchored pixel offset (`top-24`) that visually conflicts with header alignment.

Introducing a full-width header bar and symmetrical column alignment establishes a clean, unified layout baseline where both the setup sidebar and game play area start at the exact same horizontal top edge, while removing uneven borders in favor of consistent tomb-themed card framing.

## What Changes

- **Full-Width Tomb Header**: Create a new top header bar spanning full width across the application, housing the main title ("The Cursed Tomb"), an ancient Egyptian motif icon (`𓋹`), game status pill, and debug panel drawer trigger button.
- **Symmetrical Column Baseline**: Align the top edge of the setup sidebar panel and the main game board card at the exact same vertical plane underneath the top header bar.
- **Uniform Panel Framing**: Remove asymmetrical borders (`border-l-[14px]`) from `GameSidebar`, replacing them with uniform borders (`border border-[#3d3124]` / `border-game-border`), rounded corners (`rounded-2xl`), and subtle inner shadow highlights.
- **Header-Anchored Debug Drawer**: Anchor the floating DebugPanel trigger to the top header line so it expands seamlessly without floating arbitrarily over page elements.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `game-layout`: Modify top app shell hierarchy to include a full-width top header bar, adjust column baseline alignment to start evenly underneath the header bar, and specify uniform border styling for the setup/status sidebar.

## Impact

- `src/components/GameShell.tsx`: Update top-level grid layout to render a full-width top header above the 2-column main grid.
- `src/components/GameSidebar.tsx`: Update container border and shadow styles for symmetrical uniform framing.
- `src/components/DebugPanel.tsx`: Re-anchor trigger button position relative to top header bar.
- `src/App.tsx`: Move the `<h1>` title from the right column into the full-width header within `GameShell`.
