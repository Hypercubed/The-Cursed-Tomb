## Why

Currently, game stats track generic wins, losses, partial clears, and streak counts, and the Reset button simply wipes all recorded statistics. Re-framing the game session into an ancient Egyptian **Campaign** gives the player a cohesive objective: achieve a **Complete Clear** (clearing all 28 cards from the pyramid). Players can attempt as many pyramids as needed within a campaign, while the UI tracks their progress (Pyramids Explored, Pyramids Collapsed). A Complete Clear finishes the Campaign with a victory, while initiating a "New Campaign" resets the active campaign metrics.

## What Changes

- **Campaign Lifecycle & Goal**: Re-frame game sessions into an active Campaign whose goal is to achieve a Complete Clear.
- **Campaign UI Panel**: Display Campaign status, Pyramids Explored (Partial Clears in current campaign), Pyramids Collapsed (Losses / Resignations in current campaign), and Total Attempts made within the active campaign.
- **Campaign Victory Banner**: Celebrate Campaign Victory when a Complete Clear occurs, locking the campaign summary until a new campaign is started.
- **New Campaign Button**: Re-frame the "Reset" action to "New Campaign", which prompts for confirmation and starts a fresh campaign session.
- **Thematic Terminology Updates**: Update sidebar labels, tooltips, and status descriptions to align with the Campaign & Archeological Tomb theme.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `win-loss-stats`: Track active campaign state (Pyramids Explored, Pyramids Collapsed, Total Attempts) alongside cumulative records, update reset confirmation flow for "New Campaign", and handle Campaign Victory state.
- `game-layout`: Reframe sidebar status and actions to display Campaign progress and a "New Campaign" action button.

## Impact

- `src/game.ts`: Add campaign tracking state (active campaign attempt counts and campaign status).
- `src/components/GameSidebar.tsx`: Update UI layout to show Campaign stats and "New Campaign" button.
- `src/components/ResetConfirmationModal.tsx`: Update text to reflect starting a New Campaign.
- `src/storage/statsStorage.ts` / `src/App.tsx`: Persist campaign state and update event handlers.
