## MODIFIED Requirements

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
