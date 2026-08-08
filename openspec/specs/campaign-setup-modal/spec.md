# campaign-setup-modal

## Purpose

Modal UI and flow for viewing game rules, selecting campaign difficulty, and initiating a campaign session. Difficulty tiers SHALL match the physical ruleset in `docs/rules.md` §3.
## Requirements
### Requirement: Campaign setup modal presentation on initial load and reset
The application SHALL display a Campaign Setup Modal when initialized without an active campaign state, and when a player confirms starting a new campaign via the reset confirmation dialog.

#### Scenario: Campaign setup modal shown on fresh load
- **WHEN** the application loads without an active saved game
- **THEN** the Campaign Setup Modal SHALL be visible on screen before game play begins

#### Scenario: Campaign setup modal shown after reset confirmation
- **WHEN** a player clicks "New Campaign" AND confirms the action in the reset confirmation modal
- **THEN** the reset confirmation modal SHALL close AND the Campaign Setup Modal SHALL open

### Requirement: Interactive difficulty selection within setup modal
The Campaign Setup Modal SHALL allow the user to select one of the campaign difficulty levels defined in `docs/rules.md` §3 and display the corresponding redeal constraints for each setting. The physical ruleset defines three levels: Novice (∞ Redeals / Unlimited Passes), Explorer (2 Redeals / 3 Passes), and Archaeologist (1 Redeal / 2 Passes). The digital implementation MAY additionally offer a fourth level Survivalist (0 Redeals / 1 Pass) as a hard-mode extension; if offered, it SHALL be listed alongside the three physical levels.

#### Scenario: Selecting difficulty updates selected campaign mode
- **WHEN** the player selects a difficulty option in the Campaign Setup Modal (e.g., Archaeologist)
- **THEN** that difficulty setting SHALL be highlighted AND used when initializing the new campaign

#### Scenario: Difficulty labels match physical ruleset
- **WHEN** the difficulty options are rendered
- **THEN** Novice SHALL display "∞ Redeals (Unlimited Passes)", Explorer SHALL display "2 Redeals (3 Passes)", and Archaeologist SHALL display "1 Redeal (2 Passes)" as defined in `docs/rules.md` §3

#### Scenario: Novice uses infinite redeals
- **WHEN** the player selects Novice and starts a campaign
- **THEN** the initialized `GameState.redrawsRemaining` SHALL be `null` (∞) and `CampaignSetupModal` SHALL pass `null` to `initializeGame`/`createCampaign`

#### Scenario: Explorer uses two redeals
- **WHEN** the player selects Explorer and starts a campaign
- **THEN** `CampaignSetupModal` SHALL pass `2` to `initializeGame`/`createCampaign`

#### Scenario: Simulation cap unchanged
- **WHEN** simulations run via `sim/cursed_tomb_sim.py`
- **THEN** `DIFFICULTIES["novice"]` SHALL remain `5` as simulation cap in this change (digital game diverges intentionally)

### Requirement: Starting campaign initializes game with selected difficulty
The Campaign Setup Modal SHALL allow starting either a Cursed Tomb Campaign or a Standard Solitaire game. The primary action button SHALL dynamically reflect the selected mode (e.g. "Start Campaign" for `cursed-tomb` vs "Start Standard Game" or "Start Game" for `standard`).

#### Scenario: Starting campaign initializes game with selected difficulty
- **WHEN** the player clicks "Start Campaign" in the setup modal while `cursed-tomb` mode is selected
- **THEN** the modal SHALL close AND a new campaign game SHALL be started with the selected difficulty's redeal limit

#### Scenario: Starting standard game initializes standard solitaire session
- **WHEN** the player clicks "Start Game" or "Start Standard Game" in the setup modal while `standard` mode is selected
- **THEN** the modal SHALL close AND a standalone Standard Solitaire game SHALL be started with the selected difficulty's redeal limit

### Requirement: Rules overview displayed in setup modal
The Campaign Setup Modal SHALL present a clear overview of the core game rules, objectives, and pairing mechanics, labeled appropriately for the selected game mode ("Expedition Rules Overview" for Cursed Tomb vs "Rules Overview" or "Standard Solitaire Rules" for Standard).

#### Scenario: Rules text is visible in setup modal
- **WHEN** the Campaign Setup Modal is open
- **THEN** it SHALL display the rules overview adapted to the selected game mode (highlighting scars/curses in Cursed Tomb vs standard rank values in Standard Solitaire)

#### Scenario: Triggering full rules modal from setup modal
- **WHEN** the player clicks the "Read Full Expedition Rules" link in the setup modal rules overview
- **THEN** the Expedition Rules Compendium Modal SHALL open overlaying or replacing the setup modal
