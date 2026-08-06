# Campaign Achievements

## Purpose

TBD ... Update Purpose after archive

## Requirements
### Requirement: Campaign Run Metrics & Achievement Tracking
The application SHALL track persistent campaign run metrics and achievement accomplishments across all rounds of an active campaign run.

#### Scenario: Track rounds survived and pyramids cleared
- **WHEN** a round is completed during an active campaign
- **THEN** the system SHALL increment `rounds_survived` AND increment `pyramids_cleared` if the round ended in a pyramid clear or perfect win

#### Scenario: Award accomplishment badges
- **WHEN** a player completes a Perfect Win or achieves Anchored status on all 13 ranks
- **THEN** the system SHALL unlock the corresponding accomplishment badge in the UI and retain it on the campaign summary and stats screens

#### Scenario: Display Deck Health Percentage
- **WHEN** the campaign summary or status HUD is rendered
- **THEN** the UI SHALL display the current Deck Health Percentage calculated as `(active_cards_count / 52) * 100`
