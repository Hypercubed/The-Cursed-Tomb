# Pyramid Solitaire Game Delta

## ADDED Requirements

### Requirement: Starting a game resets move history
When a new game is started via `startGame`, the initial state SHALL contain an empty `history` array.

#### Scenario: New game initializes empty history
- **WHEN** `startGame` is called
- **THEN** the returned state's `history` SHALL be an empty array `[]`
