## MODIFIED Requirements

### Requirement: Campaign End & Audit Conditions (Starvation and Volatile Collapse)
The campaign engine SHALL audit active deck pool size between rounds. Starvation (fewer than 28 active cards remaining) SHALL be the sole physical defeat condition that terminates a campaign. Other status metrics (such as Volatile Collapse when 4 of a rank are entombed) SHALL serve as advisory Deck Health Warnings in the UI and SHALL NOT forcibly terminate the campaign.

#### Scenario: Starvation condition triggers campaign defeat
- **WHEN** fewer than 28 active cards remain in the campaign pool at the start of a new round
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse) with `defeatReason === 'starvation'`
- **AND** the `CampaignEndModal` SHALL open displaying the starvation defeat reason

#### Scenario: Volatile Collapse advisory warning
- **WHEN** all 4 cards of any printed rank reside in the Graveyard Box
- **THEN** the campaign SHALL display an advisory "High Volatility Warning" banner in the UI
- **AND** the campaign SHALL continue to allow the player to play subsequent rounds until starvation occurs or the player chooses to retire

## ADDED Requirements

### Requirement: Endless Campaign Continuation Past Accomplishments
The campaign engine SHALL allow players to continue playing new rounds indefinitely after achieving Perfect Wins or Rank-Anchor accomplishments.

#### Scenario: Campaign continues after Perfect Win
- **WHEN** a round ends in a Perfect Win (all 52 cards cleared)
- **THEN** the game SHALL record a Perfect Win accomplishment badge
- **AND** the campaign SHALL prompt the player to continue to the next round with their persistent master deck

#### Scenario: Campaign continues after Rank-Anchor Accomplishment
- **WHEN** at least 1 card of each printed rank (13 total) becomes Anchored
- **THEN** the game SHALL record a Rank-Anchor accomplishment badge
- **AND** the campaign SHALL prompt the player to continue playing subsequent rounds
