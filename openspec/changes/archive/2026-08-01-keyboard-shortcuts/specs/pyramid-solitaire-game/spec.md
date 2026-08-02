# Pyramid Solitaire Game Delta

## ADDED Requirements

### Requirement: Selection clearing via state handler
The game engine SHALL expose a function to deselect the currently active card explicitly.

#### Scenario: Deselecting card resets selection
- **WHEN** `deselectCard` is called
- **THEN** `selectedCardId` SHALL become `null`
