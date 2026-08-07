## ADDED Requirements

### Requirement: Card count indicators for Stock, Waste, and Vault piles
The draw and discard zone SHALL display prominent card count indicators for the Stock pile, Waste pile, and Vault slot during gameplay. The Stock pile SHALL display the total number of remaining stock cards. The Waste pile SHALL display the total number of cards currently in the waste pile. In Cursed Tomb mode, the Vault slot SHALL display an indicator of its stored card count capacity (0/1 or 1/1).

#### Scenario: Stock pile renders remaining card count
- **WHEN** a game is in progress
- **THEN** the Stock pile slot SHALL render a visible count indicator displaying the number of remaining stock cards

#### Scenario: Waste pile renders active waste card count
- **WHEN** a game is in progress
- **THEN** the Waste pile slot SHALL render a visible count indicator displaying the total count of cards currently in the waste pile

#### Scenario: Vault slot renders card capacity indicator in Cursed Tomb mode
- **WHEN** the game mode is `cursed-tomb`
- **THEN** the Vault slot SHALL render a count indicator displaying whether 0 or 1 card is currently vaulted
