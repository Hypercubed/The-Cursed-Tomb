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
The system SHALL provide an interactive modal view for viewing deck matrix and pair statistics. In Cursed Tomb mode (`cursed-tomb`), the trigger button in the status sidebar SHALL be labeled "📊 Expedition Deck & Stats" and the modal title SHALL be "Expedition Deck & Stats". In Standard Solitaire mode (`standard`), the trigger button in the status sidebar SHALL be labeled "📊 Deck Matrix & Pair Odds" and the modal title SHALL be "Deck Matrix & Strategic Pair Odds".

#### Scenario: Opening the Deck Matrix modal in Standard Solitaire mode
- **WHEN** the player clicks the "Deck Matrix & Pair Odds" button in the status sidebar during Standard Solitaire
- **THEN** an overlay modal opens titled "Deck Matrix & Strategic Pair Odds" displaying the 4×13 suit/rank deck matrix, remaining pair statistics, and remaining card count badges

#### Scenario: Opening the Expedition Deck & Stats modal in Cursed Tomb mode
- **WHEN** the player clicks the "Expedition Deck & Stats" button in the status sidebar during Cursed Tomb mode
- **THEN** an overlay modal opens titled "Expedition Deck & Stats" displaying expedition run metrics, achievement accomplishments, the 4×13 deck matrix, campaign card mutations, and entombed count badges

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
The Deck Codex SHALL display all 52 cards organized in a 4-row (Spades, Hearts, Diamonds, Clubs) by 13-column (Ace through King) matrix. Cell backgrounds SHALL communicate lifecycle state only: active cards use the active surface (`bg-[#2a2016]`), removed cards use the removed surface (`bg-[#18130e]`), and entombed cards use the entombed surface (`bg-stone-950`). Active cards SHALL use the gold accent outline, while removed and entombed cards SHALL use the neutral outline. Blessed, Cursed, Scarred, Anchored, and related statuses SHALL be communicated by their interior icons/overlays rather than changing the lifecycle background or outline. Matrix cells and header legends SHALL render suit-specific Blessed Hero SVG illustrations (∩ Archway, □ Vault Box, Tunnel Shovel, ⊕ Sun Cross) and Cursed SVG icons (▼ Downward Triangle for Red suits, ⏍ Trapezoid Weight for Black suits).

#### Scenario: Visual state of removed cards
- **WHEN** a card has been matched and removed from play
- **THEN** its cell in the 4×13 grid uses the removed background (`bg-[#18130e]`) with a neutral outline (`border-[#251e16]`), preserving any Blessed or Cursed icons

#### Scenario: Visual state of active cards
- **WHEN** a card remains in the pyramid, draw pile, or discard pile
- **THEN** its cell in the 4×13 grid uses the active background (`bg-[#2a2016]`) with the gold accent outline (`border-game-accent`), while status icons remain visible

#### Scenario: Visual state of entombed cards
- **WHEN** a card reaches Attrition Stage 5
- **THEN** its cell uses the entombed background (`bg-stone-950`) and neutral outline (`border-[#251e16]`), with the entombed icon visible

#### Scenario: Visual state of Cursed cards and legend
- **WHEN** a card has Attrition Stage 4 (Red or Black Curse)
- **THEN** its cell in the matrix grid and the modal header legend render with scarlet red gel ink styling and suit-appropriate Curse SVG illustrations (▼ for Red suits, ⏍ for Black suits)

#### Scenario: Visual state of Blessed cards and legend
- **WHEN** a card is a Blessed Hero
- **THEN** its cell in the matrix grid and the modal header legend render with organic blue ink styling and suit-appropriate Blessing SVG illustrations (∩ Archway for Hearts, □ Vault Box for Diamonds, Tunnel Shovel for Spades, ⊕ Sun Cross for Clubs)

### Requirement: Remaining Complement Pair Statistics
The Deck Codex SHALL display a summary of remaining complement pairs summing to 13 (Kings, Q+A, J+2, 10+3, 9+4, 8+5, 7+6) to assist strategic decision making. In standard mode, pair counts SHALL be calculated based on standard base card ranks. In Expedition mode (`cursed-tomb`), pair counts SHALL be calculated based on each active card's functional value (`getFunctionalValue`), and pair cards SHALL visually annotate active cards that have modified functional values or active wildcard blessings.

#### Scenario: Displaying remaining pair counts in standard mode
- **WHEN** the Deck Codex modal is open in standard mode
- **THEN** it displays the count of remaining active cards and pairs for each rank and pair combination using standard printed base ranks

#### Scenario: Displaying remaining pair counts in expedition mode with modified functional values
- **WHEN** the Deck Codex modal is open in Expedition mode (`cursed-tomb`) and active cards have modified functional values (e.g. Scars or Curses)
- **THEN** pair counts for each complement combination are calculated using functional rank values, and pair cards display modification chips annotating shifted cards (e.g. Red Q functioning as K)

#### Scenario: Displaying wildcard blessing callout in expedition mode
- **WHEN** the Deck Codex modal is open in Expedition mode and the Clubs Blessed card is active
- **THEN** the Remaining Complement Pairs section displays a wildcard indicator badge calling out active flexible pair blessings

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

