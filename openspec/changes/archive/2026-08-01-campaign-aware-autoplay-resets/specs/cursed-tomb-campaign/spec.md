## MODIFIED Requirements

### Requirement: Persistent 52-card deck with mutation tracking
The campaign SHALL maintain a persistent master deck of 52 cards across multiple rounds, tracking their Attrition Stage (0-5: None, Vulnerable, Doubtful, Scar, Curse, Entombed), Reward Stage (0-2: None, Fortifying `[—]`, Anchored `[+]`), Blessed status (`[O]`), and Graveyard status.

#### Scenario: Card mutations persist into new rounds
- **WHEN** a round ends and a new round begins
- **THEN** cards dealt into the new pyramid SHALL retain all ink marks (Scars, Curses, Blessings, Anchors) earned in previous rounds

#### Scenario: Card mutations persist across debug autoplay resets
- **WHEN** a game reset or autoplay auto-start occurs during an active campaign
- **THEN** cards dealt into the active pyramid SHALL maintain all ink marks (Scars, Curses, Blessings, Anchors) from the campaign's master deck rather than resetting to a default 52-card deck
