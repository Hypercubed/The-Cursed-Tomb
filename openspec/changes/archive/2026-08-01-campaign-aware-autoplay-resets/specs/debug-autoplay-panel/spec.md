## MODIFIED Requirements

### Requirement: Autoplay controller
The system SHALL provide an autoplay controller that automatically executes solver moves using the active strategy mode on a configurable timer interval while the game is in progress, preserving campaign state and resolving hero targeting modes.

#### Scenario: Autoplay progression
- **WHEN** autoplay is activated during an active game
- **THEN** solver moves execute automatically using the configured strategy mode at the timer interval until the game is won, lost, deadlocked, or paused

#### Scenario: Autoplay continuation past end game
- **WHEN** autoplay is running and the game status transitions to won or lost (or any end state)
- **THEN** autoplay automatically starts a new game and continues solver execution using the configured strategy mode until explicitly paused
- **AND IF** an active campaign is present, starting a new game SHALL reuse the campaign's master deck and graveyard rather than resetting to an unmarked default deck

#### Scenario: Solver hero power targeting resolution
- **WHEN** solver execution encounters an active hero power targeting mode (`targeting-spades` or `targeting-hearts`)
- **THEN** the solver SHALL automatically select a valid target card (revealing a face-down card for Spades or granting temporary immunity to an exposed card for Hearts) and reset `interactionMode` to `normal` without stalling or force-resigning

## ADDED Requirements

### Requirement: Campaign-aware board restarts
When starting or restarting a game from the Debug & Autoplay panel while a campaign is active, the system SHALL initialize the new game using the active campaign's persistent master deck and graveyard to preserve all card markings (attrition scars, anchor badges, hero blessing rings).

#### Scenario: Manual or automatic restart during campaign autoplay
- **WHEN** a game start or restart is triggered from the Debug panel while a campaign is active
- **THEN** cards dealt to the pyramid, draw pile, and discard pile retain all accumulated attrition stages, reward stages, and blessing statuses from the campaign's master deck
