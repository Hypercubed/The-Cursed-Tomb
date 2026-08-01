# campaign-setup-modal

## MODIFIED Requirements

### Requirement: Rules overview displayed in setup modal
The Campaign Setup Modal SHALL present a clear overview of the core game rules, objectives, and pairing mechanics, and provide a direct trigger to open the full Expedition Rules & Compendium modal.

#### Scenario: Rules text is visible in setup modal
- **WHEN** the Campaign Setup Modal is open
- **THEN** it SHALL display the rules overview including target sum (13), card rank values, and redeal explanations

#### Scenario: Triggering full rules modal from setup modal
- **WHEN** the player clicks the "Read Full Expedition Rules" link in the setup modal rules overview
- **THEN** the Expedition Rules Compendium Modal SHALL open overlaying or replacing the setup modal
