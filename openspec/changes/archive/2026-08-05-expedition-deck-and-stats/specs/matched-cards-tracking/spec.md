## MODIFIED Requirements

### Requirement: Expedition Deck & Stats Modal
The system SHALL provide an interactive modal view ("Expedition Deck & Stats") accessible via a trigger button labeled "Expedition Deck & Stats" in the status sidebar. The modal header SHALL display summary badges for remaining active cards, removed cards, and entombed cards.

#### Scenario: Opening the Expedition Deck & Stats modal
- **WHEN** the player clicks the "Expedition Deck & Stats" button in the status sidebar
- **THEN** an overlay modal opens displaying expedition run metrics, achievement accomplishments, the 4×13 suit/rank deck matrix, campaign card state/mutations, remaining pair statistics, and header summary badges

#### Scenario: Closing the Expedition Deck & Stats modal
- **WHEN** the player clicks the close button or clicks outside the modal overlay
- **THEN** the modal closes and returns focus to the game board

## ADDED Requirements

### Requirement: Expedition Metrics & Accomplishments Summary
The Expedition Deck & Stats modal SHALL display an expedition summary panel when open in campaign mode, presenting run progress metrics (Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health percentage) and unlocked achievement accomplishments (Perfect Wins count, Rank-Anchor status, and unlocked badge chips).

#### Scenario: Rendering expedition metrics in campaign mode
- **WHEN** the Expedition Deck & Stats modal is opened during an active campaign
- **THEN** the modal body displays summary cards for Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health %, and unlocked achievement badges above the deck matrix

#### Scenario: Omitting expedition metrics in standard mode
- **WHEN** the Expedition Deck & Stats modal is opened in standard mode (no campaign stats provided)
- **THEN** the expedition metrics and achievement summary panel is omitted and the modal opens directly into the 4×13 deck matrix
