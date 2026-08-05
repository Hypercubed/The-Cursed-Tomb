## MODIFIED Requirements

### Requirement: Expedition Deck & Stats Modal
The system SHALL provide an interactive modal view for viewing deck matrix and pair statistics. In Cursed Tomb mode (`cursed-tomb`), the trigger button in the status sidebar SHALL be labeled "📊 Expedition Deck & Stats" and the modal title SHALL be "Expedition Deck & Stats". In Standard Solitaire mode (`standard`), the trigger button in the status sidebar SHALL be labeled "📊 Deck Matrix & Pair Odds" and the modal title SHALL be "Deck Matrix & Strategic Pair Odds".

#### Scenario: Opening the Deck Matrix modal in Standard Solitaire mode
- **WHEN** the player clicks the "Deck Matrix & Pair Odds" button in the status sidebar during Standard Solitaire
- **THEN** an overlay modal opens titled "Deck Matrix & Strategic Pair Odds" displaying the 4×13 suit/rank deck matrix, remaining pair statistics, and remaining card count badges

#### Scenario: Opening the Expedition Deck & Stats modal in Cursed Tomb mode
- **WHEN** the player clicks the "Expedition Deck & Stats" button in the status sidebar during Cursed Tomb mode
- **THEN** an overlay modal opens titled "Expedition Deck & Stats" displaying expedition run metrics, achievement accomplishments, the 4×13 deck matrix, campaign card mutations, and entombed count badges
