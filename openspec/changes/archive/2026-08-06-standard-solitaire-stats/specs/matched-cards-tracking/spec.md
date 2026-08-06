## MODIFIED Requirements

### Requirement: Expedition Deck & Stats Modal
The system SHALL provide an interactive modal view for viewing deck matrix and pair statistics. In Cursed Tomb mode (`cursed-tomb`), the trigger button in the status sidebar SHALL be labeled "📊 Expedition Deck & Stats" and the modal title SHALL be "Expedition Deck & Stats". In Standard Solitaire mode (`standard`), the trigger button in the status sidebar SHALL be labeled "📊 Deck Matrix & Pair Odds" and the modal title SHALL be "Deck Matrix & Strategic Pair Odds". When open in Standard Solitaire mode, the modal SHALL display standard solitaire career metrics (Total Games, Win Rate %, Complete Victories, Partial Victories, Collapses, Current Streak, and Best Streak) above the 4×13 deck status matrix.

#### Scenario: Opening the Deck Matrix modal in Standard Solitaire mode
- **WHEN** the player clicks the "Deck Matrix & Pair Odds" button in the status sidebar during Standard Solitaire
- **THEN** an overlay modal opens titled "Deck Matrix & Strategic Pair Odds" displaying standard solitaire career statistics, current win streak, best win streak, the 4×13 suit/rank deck matrix, remaining pair statistics, and remaining card count badges

#### Scenario: Opening the Expedition Deck & Stats modal in Cursed Tomb mode
- **WHEN** the player clicks the "Expedition Deck & Stats" button in the status sidebar during Cursed Tomb mode
- **THEN** an overlay modal opens titled "Expedition Deck & Stats" displaying expedition run metrics, achievement accomplishments, the 4×13 deck matrix, campaign card mutations, and entombed count badges

#### Scenario: Closing the Expedition Deck & Stats modal
- **WHEN** the player clicks the close button or clicks outside the modal overlay
- **THEN** the modal closes and returns focus to the game board

### Requirement: Expedition Metrics & Accomplishments Summary
The Expedition Deck & Stats modal SHALL display a summary panel when open. In campaign mode, it SHALL present run progress metrics (Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health percentage) and unlocked achievement accomplishments. In standard mode, it SHALL present standard solitaire career metrics (Games Played, Clear/Win Rate %, Complete Victories, Partial Victories, Pyramids Collapsed, Current Streak, and Best Streak).

#### Scenario: Rendering expedition metrics in campaign mode
- **WHEN** the Expedition Deck & Stats modal is opened during an active campaign
- **THEN** the modal body displays summary cards for Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health %, and unlocked achievement badges above the deck matrix

#### Scenario: Rendering standard solitaire metrics in standard mode
- **WHEN** the Expedition Deck & Stats modal is opened in standard mode with standard stats provided
- **THEN** the summary panel renders standard solitaire metrics (Games Played, Win Rate %, Complete Victories, Partial Victories, Collapses, Current Streak, Best Streak) above the 4×13 deck matrix
