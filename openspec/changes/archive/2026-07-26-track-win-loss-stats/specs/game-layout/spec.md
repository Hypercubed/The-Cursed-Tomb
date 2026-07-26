# Game Layout

## ADDED Requirements

### Requirement: Reset Confirmation Dialog Interface
The application SHALL present a themed modal dialog when Reset is clicked to confirm resetting board state and accumulated statistics.

#### Scenario: Modal displays tomb aesthetic and confirmation options
- **WHEN** the reset confirmation dialog is active
- **THEN** it SHALL be rendered in a modal overlay formatted with dark tomb styling, displaying a warning message, a Confirm button, and a Cancel button

## MODIFIED Requirements

### Requirement: Game status panel is always visible in the sidebar
The game status summary (status, win/loss stats, redraws remaining, pile counts, selected card) SHALL be displayed in the sidebar below the setup controls, updating reactively as game state changes.

#### Scenario: Status updates while game is in progress
- **WHEN** the player draws a card or removes a pair
- **THEN** the sidebar status panel SHALL immediately reflect the updated draw pile count and redraws remaining

#### Scenario: Sidebar displays accumulated win loss statistics
- **WHEN** the sidebar status panel renders
- **THEN** it SHALL display the player's total Wins, Losses, Win Rate percentage, and Current Streak
