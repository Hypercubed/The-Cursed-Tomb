## MODIFIED Requirements

### Requirement: Deck Codex Modal
The system SHALL provide an interactive modal view ("Deck Codex") accessible via a trigger button labeled "View Deck Codex" in the status sidebar. The modal header SHALL display three summary counts: removed cards, remaining active cards, and entombed cards.

#### Scenario: Opening the Deck Codex modal
- **WHEN** the player clicks the "View Deck Codex" button in the status sidebar
- **THEN** an overlay modal opens displaying the 4×13 suit/rank deck matrix, campaign card state/mutations, remaining pair statistics, and a header summary showing removed, remaining, and entombed card counts

#### Scenario: Closing the Deck Codex modal
- **WHEN** the player clicks the close button or clicks outside the modal overlay
- **THEN** the modal closes and returns focus to the game board

## ADDED Requirements

### Requirement: Remaining Active Cards Count in Deck Codex Header
The Deck Codex modal header SHALL display a count of cards that are currently active (neither removed from play nor entombed), calculated as 52 minus removed minus entombed.

#### Scenario: Remaining count in standard mode
- **WHEN** the Deck Codex modal is open in standard mode
- **THEN** the header displays a "Remaining" badge showing the count of cards not yet removed (52 minus removedCardIds.size)

#### Scenario: Remaining count in campaign mode
- **WHEN** the Deck Codex modal is open in campaign (cursed-tomb) mode
- **THEN** the header displays a "Remaining" badge showing cards that are neither removed nor entombed (attritionStage !== 5 and not in removedCardIds)

#### Scenario: Remaining count updates after a card is matched
- **WHEN** a card is matched and removed during the current round
- **THEN** the Deck Codex "Remaining" count decreases by the number of cards removed

### Requirement: Entombed Cards Count in Deck Codex Header
The Deck Codex modal header SHALL display a count of entombed cards (attritionStage === 5) in campaign mode. In standard mode the entombed count SHALL be omitted or shown as zero.

#### Scenario: Entombed count in campaign mode with entombed cards
- **WHEN** the Deck Codex modal is open in campaign mode and one or more cards have attritionStage 5
- **THEN** the header displays an "Entombed" badge showing the count of those cards

#### Scenario: Entombed count in campaign mode with no entombed cards
- **WHEN** the Deck Codex modal is open in campaign mode and no cards have attritionStage 5
- **THEN** the header displays an "Entombed" badge showing 0

#### Scenario: Entombed count in standard mode
- **WHEN** the Deck Codex modal is open in standard mode (no masterDeck provided)
- **THEN** no "Entombed" badge is shown in the header
