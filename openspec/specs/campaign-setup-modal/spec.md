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

#### Scenario: Starting campaign initializes game with selected difficulty
- **WHEN** the player clicks "Start Campaign" in the setup modal
- **THEN** the modal SHALL close AND a new game SHALL be started with the selected difficulty's redeal limit (Novice: unlimited, Explorer: 2, Archaeologist: 1, Survivalist: 0)

### Requirement: Rules overview displayed in setup modal
The Campaign Setup Modal SHALL present a clear overview of the core game rules, objectives, and pairing mechanics.

#### Scenario: Rules text is visible in setup modal
- **WHEN** the Campaign Setup Modal is open
- **THEN** it SHALL display the rules overview including target sum (13), card rank values, and redeal explanations
