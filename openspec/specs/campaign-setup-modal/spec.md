# campaign-setup-modal

## Purpose

Modal UI and flow for viewing game rules, selecting campaign difficulty, and initiating a campaign session.
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
The Campaign Setup Modal SHALL allow the user to select one of four global campaign difficulty levels (Novice, Explorer, Archaeologist, Survivalist) and display the corresponding redeal constraints for each setting.

#### Scenario: Selecting difficulty updates selected campaign mode
- **WHEN** the player selects a difficulty option in the Campaign Setup Modal (e.g., Archaeologist)
- **THEN** that difficulty setting SHALL be highlighted AND used when initializing the new campaign

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

