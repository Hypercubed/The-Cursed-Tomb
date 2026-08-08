## MODIFIED Requirements

### Requirement: Persistent Game Settings
The application SHALL persist user preferences for redraw limits, coach mark enablement, and seen coach mark history across sessions.

#### Scenario: Changing setup settings
- **WHEN** the player modifies the redraw limit setting or coach mark preferences
- **THEN** the updated preference SHALL be persisted to storage immediately

#### Scenario: Application initialization with saved settings
- **WHEN** the application initializes
- **THEN** the setup controls SHALL be populated with the saved redraw limit, coach mark enabled status, and seen coach mark history, or standard defaults if no settings exist
