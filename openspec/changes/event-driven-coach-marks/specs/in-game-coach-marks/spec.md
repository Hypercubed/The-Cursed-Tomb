## Purpose

Provides contextual, event-driven coach mark banners that pause gameplay and highlight relevant UI elements as players encounter game mechanics for the first time.

## ADDED Requirements

### Requirement: Event-Driven Coach Mark Triggering
The application SHALL evaluate game events and board state changes to trigger contextual coach mark banners when a specific mechanic is encountered for the first time.

#### Scenario: First game start triggers basic rule coach mark
- **WHEN** a player starts their first game and coach marks are enabled and the `rule-13` hint has not been seen
- **THEN** the application SHALL pause gameplay interactions and display the Rule of Thirteen coach mark banner highlighting the exposed pyramid cards

#### Scenario: First encounter of Attrition card triggers Attrition coach mark
- **WHEN** a card with an Attrition stage greater than 0 appears exposed or drawn for the first time and the `attrition-mark` hint has not been seen
- **THEN** the application SHALL pause gameplay interactions and display the Attrition Mark coach mark banner highlighting the affected card

#### Scenario: First encounter of Sun Cross blessing triggers Sun Cross coach mark
- **WHEN** a card with a Sun Cross reward stage greater than 0 or blessing appears exposed or drawn for the first time and the `sun-cross` hint has not been seen
- **THEN** the application SHALL pause gameplay interactions and display the Sun Cross coach mark banner highlighting the affected card

#### Scenario: First Entombed card triggers Entombed coach mark
- **WHEN** a card reaches Stage 5 Attrition (Entombed) for the first time and the `entombed` hint has not been seen
- **THEN** the application SHALL pause gameplay interactions and display the Entombed Card coach mark banner highlighting the entombed card

### Requirement: Pause Gameplay and Element Highlighting
The application SHALL pause board interaction and render an animated spotlight highlight over the target UI element while a coach mark banner is active.

#### Scenario: Active coach mark disables card clicks and board mutations
- **WHEN** a coach mark banner is actively displayed
- **THEN** clicking on pyramid cards, draw pile, or vault SHALL NOT trigger game actions or card selections until the coach mark is dismissed

#### Scenario: Spotlight highlight surrounds target element
- **WHEN** a coach mark banner is active for a target element or group
- **THEN** the system SHALL render a glowing pulse spotlight overlay around the target DOM element

### Requirement: Coach Mark Dismissal and Persistence Opt-Out
The application SHALL allow players to dismiss coach mark banners to unpause gameplay, record seen hints, and opt out of future hints entirely.

#### Scenario: Dismissing coach mark resumes gameplay
- **WHEN** the player clicks the "Next / Got It" button on an active coach mark banner
- **THEN** the active coach mark banner SHALL close, gameplay interactions SHALL unpause, and the coach mark ID SHALL be marked as seen

#### Scenario: Opting out of coach mark hints
- **WHEN** the player checks "Don't show hints again" or disables coach marks in settings
- **THEN** coach mark banners SHALL be disabled for all subsequent game events and sessions until re-enabled
