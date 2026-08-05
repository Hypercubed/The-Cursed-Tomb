# Win Loss Stats

## Purpose

Track cumulative wins, losses, win rate percentage, and win streaks across game sessions, updating statistics upon game outcomes and supporting confirmed stat resets.

## Requirements

### Requirement: Accumulated Win Loss Statistics Tracking
The application SHALL maintain cumulative counts of complete victories, partial victories, pyramid collapses, current victory streak, and best victory streak across game sessions.

#### Scenario: Complete victory increments complete victory count and streak
- **WHEN** the current game status transitions to `complete-victory`
- **THEN** the total `completeVictories` count SHALL increment by 1, `currentStreak` SHALL increment by 1, and `bestStreak` SHALL update if `currentStreak` exceeds `bestStreak`

#### Scenario: Partial victory increments partial victory count and streak
- **WHEN** the current game status transitions to `partial-victory`
- **THEN** the total `partialVictories` count SHALL increment by 1, `currentStreak` SHALL increment by 1, and `bestStreak` SHALL update if `currentStreak` exceeds `bestStreak`

#### Scenario: Pyramid collapse or resignation increments collapse count and resets streak
- **WHEN** the current game status transitions to `pyramid-collapse` (via resignation or forced/detected loss)
- **THEN** the total `pyramidCollapses` count SHALL increment by 1 and the `currentStreak` SHALL reset to 0

#### Scenario: Single outcome recording per game session
- **WHEN** a game reaches `complete-victory`, `partial-victory`, or `pyramid-collapse` status
- **THEN** the game outcome SHALL be recorded exactly once for that game session without duplicate increments

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

#### Scenario: Campaign end screen reads stats for display
- **WHEN** the `CampaignEndModal` opens at campaign end
- **THEN** it SHALL read `campaignStats` (pyramidsExplored, pyramidsCollapsed, totalAttempts, isVictory) and display them alongside `campaign.roundNumber` and counts derived from `campaign.masterDeck`

### Requirement: Active Campaign Stats Surfaced in Expedition Deck & Stats Modal
The Expedition Deck & Stats modal SHALL surface active campaign metrics (Pyramids Explored, Pyramids Conquered, Pyramids Collapsed, Total Attempts, Deck Health %) when opened in campaign mode.

#### Scenario: Displaying active campaign metrics in inspection modal
- **WHEN** the player opens the Expedition Deck & Stats modal during an active campaign
- **THEN** the modal displays the current active campaign metrics (Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health %) at the top of the modal body


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
