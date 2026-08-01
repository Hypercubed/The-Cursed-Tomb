# Pyramid Solitaire Game Delta

## ADDED Requirements

### Requirement: Starting a game resets move history and redo stacks
When a new game is started via `startGame` or `initializeGame`, the initial state SHALL contain empty `history` and `future` arrays.

#### Scenario: New game initializes empty history and future
- **WHEN** `startGame` or `initializeGame` is called
- **THEN** the returned state's `history` SHALL be `[]` AND `future` SHALL be `[]`
