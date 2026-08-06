## Why

When playing Standard Solitaire mode, several Expedition-specific UI elements (such as the Diamond Vault slot in the Draw Zone, campaign progress metrics in the sidebar, and campaign-focused modal/button labels) are currently rendered. This creates visual clutter and confusion for players expecting a clean, classic Pyramid Solitaire experience. Removing or adapting these Expedition-only elements ensures a polished, mode-appropriate user interface for both game modes.

## What Changes

- **Draw Zone Layout**: Hide/remove the `♦ Vault` slot in `DrawZone` when running in Standard Solitaire mode, leaving a classic 2-slot Stock and Waste pile layout.
- **Sidebar Progress & Stats**: Replace or hide the "Active Campaign" stats section in `GameSidebar` when in Standard mode, presenting relevant standard solitaire statistics instead.
- **UI Labels & Headers**: Update header subtitles, modal titles, and button labels across the main layout, setup modal, and deck matrix modal to reflect standard solitaire context (e.g. "Classic Pyramid Solitaire", "Start Game", "Deck Matrix & Strategic Pair Odds").
- **Setup & Rules Overview**: Clarify rules overview headers and button text in `CampaignSetupModal` to distinguish Standard Solitaire from Expedition rules.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `game-layout`: Adapt DrawZone to hide the Diamond Vault slot when in Standard Solitaire mode.
- `campaign-setup-modal`: Update modal titles, button text, and rules section headers based on selected game mode.
- `matched-cards-tracking`: Adjust deck matrix modal header and sidebar button labels to reflect standard solitaire context.
- `pyramid-solitaire-game`: Ensure standard solitaire mode UI cleanly isolates standard solitaire from campaign/expedition-only elements.

## Impact

- Affected frontend components: `App.tsx`, `DrawZone.tsx`, `GameSidebar.tsx`, `MatchedCardsModal.tsx`, `CampaignSetupModal.tsx`.
- No breaking changes or changes to game logic algorithms.
