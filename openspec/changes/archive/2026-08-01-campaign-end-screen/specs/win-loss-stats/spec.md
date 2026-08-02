## MODIFIED Requirements

### Requirement: Active Campaign Statistics Tracking
The application SHALL maintain tracking of active campaign statistics, including Pyramids Explored (partial victories in campaign), Pyramids Collapsed (losses/resignations in campaign), total attempts in campaign, and campaign victory status. These statistics SHALL be read and displayed in the `CampaignEndModal` when the campaign ends.

#### Scenario: Partial victory increments campaign pyramids explored
- **WHEN** the current game status transitions to `partial-victory`
- **THEN** the active campaign `pyramidsExplored` count SHALL increment by 1 and total campaign attempts SHALL increment by 1

#### Scenario: Pyramid collapse increments campaign pyramids collapsed
- **WHEN** the current game status transitions to `pyramid-collapse`
- **THEN** the active campaign `pyramidsCollapsed` count SHALL increment by 1 and total campaign attempts SHALL increment by 1

#### Scenario: Complete victory completes active campaign
- **WHEN** the current game status transitions to `complete-victory`
- **THEN** the active campaign SHALL mark victory as achieved (`isVictory = true`) and total campaign attempts SHALL increment by 1

#### Scenario: Campaign end screen reads stats for display
- **WHEN** the `CampaignEndModal` opens at campaign end
- **THEN** it SHALL read `campaignStats` (pyramidsExplored, pyramidsCollapsed, totalAttempts, isVictory) and display them alongside `campaign.roundNumber` and counts derived from `campaign.masterDeck`
