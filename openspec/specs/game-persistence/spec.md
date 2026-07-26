# Game Persistence

## Purpose

Provides local storage persistence for game state and player preferences with robust schema versioning, graceful fallbacks for unavailable storage, and UI controls locking during active play.

## Requirements

### Requirement: Automatic Game State Persistence and Restoration
The application SHALL automatically persist the current game state to storage on every state mutation and restore it upon application load.

#### Scenario: Page load with active in-progress game
- **WHEN** the application loads and local storage contains a valid saved game with status `in-progress`
- **THEN** the application SHALL immediately restore and render the active board state

#### Scenario: Page load with completed game
- **WHEN** the application loads and local storage contains a saved game with status `won` or `lost`
- **THEN** the application SHALL restore and display the final board state and outcome banner

#### Scenario: Starting a new game overwrites saved state
- **WHEN** the player clicks the start or restart button
- **THEN** the previous saved game state SHALL be replaced with the newly initialized game state

### Requirement: Persistent Game Settings
The application SHALL persist user preferences for redraw limits across sessions without requiring win condition configuration.

#### Scenario: Changing setup settings
- **WHEN** the player modifies the redraw limit setting
- **THEN** the updated preference SHALL be persisted to storage immediately

#### Scenario: Application initialization with saved settings
- **WHEN** the application initializes
- **THEN** the setup controls SHALL be populated with the saved redraw limit, or standard defaults if no settings exist

### Requirement: Game Settings Controls Locking
The application SHALL disable setup options in the sidebar while a game is actively in progress.

#### Scenario: Active game disables setup inputs
- **WHEN** the current game status is `in-progress`
- **THEN** the redraw limit select control in the sidebar SHALL be disabled

#### Scenario: Inactive or finished game enables setup inputs
- **WHEN** the current game status is `ready`, `complete-victory`, `partial-victory`, or `pyramid-collapse`
- **THEN** the redraw limit select control in the sidebar SHALL be enabled

### Requirement: Persistent Statistics Storage
The application SHALL persist complete victory, partial victory, and pyramid collapse statistics to local storage and maintain them across application reloads until explicitly reset.

#### Scenario: Preserving stats across sessions
- **WHEN** victory counts, collapses, or streak metrics update or the application reloads
- **THEN** the updated statistics SHALL be saved to storage and restored on subsequent application load

#### Scenario: Clearing statistics on reset confirmation
- **WHEN** the player confirms a reset action
- **THEN** stored statistics in storage SHALL be reset to default zero values

### Requirement: Graceful Fallback and Corruption Handling
The storage system SHALL fall back gracefully to in-memory state when local storage is unavailable, corrupted, or incompatible.


#### Scenario: Storage access blocked or unavailable
- **WHEN** access to `localStorage` throws an error or is unsupported by the browser
- **THEN** the application SHALL fall back to in-memory storage without throwing unhandled exceptions or disrupting gameplay

#### Scenario: Corrupted state recovery
- **WHEN** local storage contains malformed JSON or unparseable state data
- **THEN** the application SHALL discard the corrupted state, log a warning, and initialize with default ready state

#### Scenario: Incompatible schema version
- **WHEN** stored state contains an unrecognized or incompatible schema version
- **THEN** the application SHALL reset the stored game state to default safe values
