# Card Match Animations

## Purpose

Defines visual animation behaviors for card selection, card matching/pairing, invalid pair attempts, and game victory celebrations.

## ADDED Requirements

### Requirement: Card selection and pairing animations
The UI SHALL apply visual animations when cards are selected, paired, or invalidated.

#### Scenario: Card selection pulse animation
- **WHEN** an unselected card is clicked
- **THEN** it SHALL render with a golden selection glow and gentle scale pulse

#### Scenario: Card match dissolve animation
- **WHEN** two cards forming a sum of 13 are paired
- **THEN** both cards SHALL play a brief gold dissolve animation before disappearing from the active board layout

#### Scenario: Invalid pair error shake animation
- **WHEN** two cards not summing to 13 are selected sequentially
- **THEN** the selection SHALL play a subtle red shake animation before clearing selection

### Requirement: Victory celebration visual flourish
The UI SHALL trigger a victory visual animation when game status becomes `won`.

#### Scenario: Tomb clear victory flourish
- **WHEN** `game.status` transitions to `won`
- **THEN** the game shell SHALL render a celebratory ancient tomb golden particle/light effect

### Requirement: Pyramid collapse animation on game loss
The UI SHALL trigger a pyramid collapse visual animation when game status becomes `lost`.

#### Scenario: Pyramid collapses when game is lost
- **WHEN** `game.status` transitions to `lost`
- **THEN** the remaining cards in the pyramid SHALL play a staggered crumbling/falling animation representing the tomb collapsing
