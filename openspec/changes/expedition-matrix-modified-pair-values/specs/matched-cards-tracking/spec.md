## MODIFIED Requirements

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
