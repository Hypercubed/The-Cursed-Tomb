## MODIFIED Requirements

### Requirement: Interactive difficulty selection within setup modal
The Campaign Setup Modal SHALL allow the user to select one of the campaign difficulty levels defined in `docs/rules.md` §3 and display the corresponding redeal constraints for each setting. The physical ruleset defines three levels: Novice (∞ Redeals / Unlimited Passes), Explorer (2 Redeals / 3 Passes), and Archaeologist (1 Redeal / 2 Passes). The digital implementation MAY additionally offer a fourth level Survivalist (0 Redeals / 1 Pass) as a hard-mode extension; if offered, it SHALL be listed alongside the three physical levels. This is a change from the prior spec which defined Explorer as 3 Redeals (4 Passes) to 2 Redeals (3 Passes), and Novice returns to ∞.

#### Scenario: Selecting difficulty updates selected campaign mode
- **WHEN** the player selects a difficulty option in the Campaign Setup Modal (e.g., Archaeologist)
- **THEN** that difficulty setting SHALL be highlighted AND used when initializing the new campaign

#### Scenario: Difficulty labels match physical ruleset
- **WHEN** the difficulty options are rendered
- **THEN** Novice SHALL display "∞ Redeals (Unlimited Passes)", Explorer SHALL display "2 Redeals (3 Passes)", and Archaeologist SHALL display "1 Redeal (2 Passes)" as defined in this change's `docs/rules.md` §3

#### Scenario: Novice uses infinite redeals
- **WHEN** the player selects Novice and starts a campaign
- **THEN** the initialized `GameState.redrawsRemaining` SHALL be `null` (∞) and `CampaignSetupModal` SHALL pass `null` to `initializeGame`/`createCampaign`

#### Scenario: Explorer uses two redeals
- **WHEN** the player selects Explorer and starts a campaign
- **THEN** `CampaignSetupModal` SHALL pass `2` to `initializeGame`/`createCampaign`

#### Scenario: Simulation cap unchanged
- **WHEN** simulations run via `sim/cursed_tomb_sim.py`
- **THEN** `DIFFICULTIES["novice"]` SHALL remain `5` as simulation cap in this change (digital game diverges intentionally)

