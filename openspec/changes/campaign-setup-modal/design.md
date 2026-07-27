## Context

Currently, `App.tsx` handles game setup by rendering a header dropdown for selecting difficulty (Novice, Explorer, Archaeologist, Survivalist) and directly initializing a game state. When starting a campaign or fresh page load, there is no intro or modal presenting the game rules or campaign context.

We need a dedicated `CampaignSetupModal` component that introduces the game, lists the rules (core pyramid solitaire rules), and allows selecting difficulty settings before starting a campaign.

## Goals / Non-Goals

**Goals:**
- Present a modal dialog (`CampaignSetupModal`) on initial load and whenever a new campaign is initiated.
- Display core rules (Pyramid Solitaire rules, pair matching to 13, solo King clears, redeal constraints per difficulty).
- Allow user to choose a difficulty setting: Novice (unlimited redeals), Explorer (2 redeals), Archaeologist (1 redeal), Survivalist (0 redeals).
- Remove direct difficulty dropdown from header controls and integrate difficulty selection cleanly into the campaign setup modal.
- Ensure clicking "New Campaign" presents the reset confirmation modal first ("Are you sure?"), and confirming then launches the Campaign Setup Modal.

**Non-Goals:**
- Full implementation of persistent campaign mutation tracks (scars/curses/blessings) - covered in follow-up change `cursed-tomb-rules`.

## Decisions

### Decision 1: Modal Sequencing Flow
When starting a new campaign from an ongoing game:
1. User clicks "New Campaign" button.
2. `ResetConfirmationModal` opens: "Are you sure you want to start a new campaign? Current progress will be lost."
3. User confirms.
4. `ResetConfirmationModal` closes and `CampaignSetupModal` opens.
5. User selects difficulty (defaulting to current or Explorer) and clicks "Start Campaign".
6. Game initializes with the selected difficulty.

On fresh app load:
- If no active game state is stored (or on initial launch), show `CampaignSetupModal` automatically before starting game, or initialize with standard setup modal open.

### Decision 2: CampaignSetupModal Layout & Design
- Clean overlay matching project design system (`bg-stone-900/90`, border accents, subtle animations).
- Rule summary cards outlining:
  - Objective: Clear the pyramid layout by pairing exposed cards that sum to 13 (A=1, J=11, Q=12, K=13 solo).
  - Deck & Waste rules.
  - Attrition & Campaign overview.
- Difficulty selector cards:
  - **Novice**: Sandbox mode (Unlimited redeals).
  - **Explorer**: Easy (2 redeals / 3 passes).
  - **Archaeologist**: Normal (1 redeal / 2 passes).
  - **Survivalist**: Hard (0 redeals / 1 pass).
- "Start Campaign" CTA button.

## Risks / Trade-offs

- **[UX Friction on App Load]** → Show a default difficulty pre-selected in the modal with a quick "Start" button so returning players can launch with one click.
