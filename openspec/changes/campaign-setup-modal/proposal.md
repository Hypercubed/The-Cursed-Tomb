## Why

Currently, starting a game or selecting a difficulty setting relies on a basic header dropdown and immediate game start. To prepare for the full campaign mode and give players a proper introduction to the game, rules, and difficulty constraints, we need a dedicated Campaign Setup Modal. This modal presents the core rules, allows difficulty selection upon fresh load or when initiating a "New Campaign" (following confirmation), and establishes a clean onboarding experience.

## What Changes

- **Campaign Start Modal**: Introduce a modal dialog on initial application load and when starting a new campaign.
- **Rules Presentation**: Display core game rules and objective directly in the setup modal.
- **Difficulty Selection**: Provide interactive difficulty options (Novice, Explorer, Archaeologist, Survivalist) with clear explanations of redeal limits and rules for each mode.
- **Flow Integration**: Move difficulty selection out of the current header dropdown into the modal flow. When clicking "New Campaign", trigger the reset confirmation modal first ("Are you sure?"), and upon confirmation, launch the Campaign Start Modal to configure the new campaign.

## Capabilities

### New Capabilities
- `campaign-setup-modal`: Modal UI and flow for viewing game rules, selecting campaign difficulty, and initiating a campaign session.

### Modified Capabilities
- `pyramid-solitaire-game`: Update game initialization flow so starting a new game transitions through difficulty selection via the setup modal rather than direct dropdown changes.

## Impact

- **UI Components**: Adds a new `CampaignSetupModal` component; updates `GameShell.tsx`, `GameSidebar.tsx`, and `ResetConfirmationModal.tsx` to handle the modal sequencing.
- **Game State**: Integrates difficulty selection cleanly into game state initialization.
- **User Experience**: Ensures players are presented with rules and difficulty settings prior to starting a campaign.
