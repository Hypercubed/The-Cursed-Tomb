## MODIFIED Requirements

### Requirement: Interactive difficulty selection within setup modal
The Campaign Setup Modal SHALL allow the user to select one of four global campaign difficulty levels (Novice, Explorer, Archaeologist, Survivalist) and display the corresponding redeal constraints for each setting.

#### Scenario: Selecting difficulty updates selected campaign mode
- **WHEN** the player selects a difficulty option in the Campaign Setup Modal (e.g., Archaeologist)
- **THEN** that difficulty setting SHALL be highlighted AND used when initializing the new campaign

#### Scenario: Starting campaign initializes game with selected difficulty
- **WHEN** the player clicks "Start Campaign" in the setup modal
- **THEN** the modal SHALL close AND a new game SHALL be started with the selected difficulty's redeal limit (Novice: 5, Explorer: 3, Archaeologist: 1, Survivalist: 0)
