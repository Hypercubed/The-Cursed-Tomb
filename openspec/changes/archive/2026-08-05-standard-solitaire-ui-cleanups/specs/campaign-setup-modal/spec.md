## MODIFIED Requirements

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
