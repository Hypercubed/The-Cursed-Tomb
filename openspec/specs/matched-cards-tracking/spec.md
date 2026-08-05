# Matched Cards Tracking Capability

## Purpose

Tracks removed/matched cards and provides strategic statistics for Pyramid Solitaire.

## Requirements

### Requirement: Removed Cards Counter in Sidebar
The game status panel SHALL display the current number of removed/matched cards out of the total deck size of 52, alongside the percentage of cleared cards.

#### Scenario: Displaying initial removed card count
- **WHEN** a new game is started
- **THEN** the status sidebar displays "Cards Removed: 0 / 52 (0%)"

#### Scenario: Updating removed card count after match
- **WHEN** a pair summing to 13 (or a single King) is matched and removed
- **THEN** the status sidebar updates the removed card count and percentage accordingly

### Requirement: Expedition Deck & Stats Modal
The system SHALL provide an interactive modal view ("Expedition Deck & Stats") accessible via a trigger button labeled "Expedition Deck & Stats" in the status sidebar. The modal header SHALL display summary badges for remaining active cards, removed cards, and entombed cards.

#### Scenario: Opening the Expedition Deck & Stats modal
- **WHEN** the player clicks the "Expedition Deck & Stats" button in the status sidebar
- **THEN** an overlay modal opens displaying expedition run metrics, achievement accomplishments, the 4×13 suit/rank deck matrix, campaign card state/mutations, remaining pair statistics, and header summary badges

#### Scenario: Closing the Expedition Deck & Stats modal
- **WHEN** the player clicks the close button or clicks outside the modal overlay
- **THEN** the modal closes and returns focus to the game board

### Requirement: Expedition Metrics & Accomplishments Summary
The Expedition Deck & Stats modal SHALL display an expedition summary panel when open in campaign mode, presenting run progress metrics (Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health percentage) and unlocked achievement accomplishments (Perfect Wins count, Rank-Anchor status, and unlocked badge chips).

#### Scenario: Rendering expedition metrics in campaign mode
- **WHEN** the Expedition Deck & Stats modal is opened during an active campaign
- **THEN** the modal body displays summary cards for Pyramids Explored, Conquered, Collapsed, Total Attempts, Deck Health %, and unlocked achievement badges above the deck matrix

#### Scenario: Omitting expedition metrics in standard mode
- **WHEN** the Expedition Deck & Stats modal is opened in standard mode (no campaign stats provided)
- **THEN** the expedition metrics and achievement summary panel is omitted and the modal opens directly into the 4×13 deck matrix


### Requirement: Suit and Rank Grid Visualization
The Deck Codex SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix, visually distinguishing removed cards from active cards, as well as displaying card campaign state (Scars, Curses, Blessings, Anchors, Entombed status, and Functional Values).

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid is highlighted with a checked/dimmed removed indicator

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid displays as active/unmatched

### Requirement: Remaining Complement Pair Statistics
The Deck Codex SHALL display a summary of remaining complement pairs summing to 13 (Kings, Q+A, J+2, 10+3, 9+4, 8+5, 7+6) to assist strategic decision making.

#### Scenario: Displaying remaining pair counts
- **WHEN** the Deck Codex modal is open
- **THEN** it displays the count of remaining active cards for each rank and pair combination

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

