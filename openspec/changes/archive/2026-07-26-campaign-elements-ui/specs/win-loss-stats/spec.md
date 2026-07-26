## ADDED Requirements

### Requirement: Active Campaign Statistics Tracking
The application SHALL maintain tracking of active campaign statistics, including Pyramids Explored (partial victories in campaign), Pyramids Collapsed (losses/resignations in campaign), total attempts in campaign, and campaign victory status.

#### Scenario: Partial victory increments campaign pyramids explored
- **WHEN** the current game status transitions to `partial-victory`
- **THEN** the active campaign `pyramidsExplored` count SHALL increment by 1 and total campaign attempts SHALL increment by 1

#### Scenario: Pyramid collapse increments campaign pyramids collapsed
- **WHEN** the current game status transitions to `pyramid-collapse`
- **THEN** the active campaign `pyramidsCollapsed` count SHALL increment by 1 and total campaign attempts SHALL increment by 1

#### Scenario: Complete victory completes active campaign
- **WHEN** the current game status transitions to `complete-victory`
- **THEN** the active campaign SHALL mark victory as achieved (`isVictory = true`) and total campaign attempts SHALL increment by 1

## MODIFIED Requirements

### Requirement: Reset Confirmation Flow
Clicking the New Campaign button SHALL open a confirmation modal asking for explicit player confirmation before starting a new campaign and resetting active campaign statistics.

#### Scenario: Triggering reset opens confirmation modal
- **WHEN** the player clicks the New Campaign button in the sidebar
- **THEN** the application SHALL open a modal dialog asking "Are you sure you want to start a new campaign? This will reset your current campaign progress." with Confirm and Cancel buttons

#### Scenario: Cancelling reset maintains state and stats
- **WHEN** the player clicks Cancel in the reset confirmation modal
- **THEN** the confirmation modal SHALL close and the current campaign progress and statistics SHALL remain unchanged

#### Scenario: Confirming reset starts new campaign
- **WHEN** the player clicks Confirm in the reset confirmation modal
- **THEN** the active campaign metrics (Pyramids Explored, Pyramids Collapsed, Total Attempts, Campaign Victory) SHALL reset to 0 / false
