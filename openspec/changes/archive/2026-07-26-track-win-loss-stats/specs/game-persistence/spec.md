# Game Persistence

## ADDED Requirements

### Requirement: Persistent Statistics Storage
The application SHALL persist win/loss statistics to local storage and maintain them across application reloads until explicitly reset.

#### Scenario: Preserving stats across sessions
- **WHEN** wins, losses, or streak metrics update or the application reloads
- **THEN** the updated statistics SHALL be saved to storage and restored on subsequent application load

#### Scenario: Clearing statistics on reset confirmation
- **WHEN** the player confirms a reset action
- **THEN** stored win/loss statistics in storage SHALL be reset to default zero values

## MODIFIED Requirements

### Requirement: Graceful Fallback and Corruption Handling
The storage system SHALL fall back gracefully to in-memory state when local storage is unavailable, corrupted, or incompatible.

#### Scenario: Storage access blocked or unavailable
- **WHEN** access to `localStorage` throws an error or is unsupported by the browser
- **THEN** the application SHALL fall back to in-memory storage without throwing unhandled exceptions or disrupting gameplay

#### Scenario: Corrupted state recovery
- **WHEN** local storage contains malformed JSON or unparseable state data
- **THEN** the application SHALL discard the corrupted state, log a warning, and initialize with default ready state and zero statistics

#### Scenario: Incompatible schema version
- **WHEN** stored state contains an unrecognized or incompatible schema version
- **THEN** the application SHALL reset the stored game state and statistics to default safe values
