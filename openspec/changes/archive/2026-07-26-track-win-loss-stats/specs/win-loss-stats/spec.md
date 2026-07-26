# Win Loss Stats

## Purpose

Track cumulative wins, losses, win rate percentage, and win streaks across game sessions, updating statistics upon game outcomes and supporting confirmed stat resets.

## ADDED Requirements

### Requirement: Accumulated Win Loss Statistics Tracking
The application SHALL maintain cumulative counts of wins, losses, current win streak, and best win streak across game sessions.

#### Scenario: Winning a game increments win count and win streak
- **WHEN** the current game status transitions to `won`
- **THEN** the total win count SHALL increment by 1, the current win streak SHALL increment by 1, and best win streak SHALL update if current win streak exceeds best win streak

#### Scenario: Losing or resigning a game increments loss count and resets streak
- **WHEN** the current game status transitions to `lost` (via resignation or forced/detected loss)
- **THEN** the total loss count SHALL increment by 1 and the current win streak SHALL reset to 0

#### Scenario: Single outcome recording per game session
- **WHEN** a game reaches `won` or `lost` status
- **THEN** the game outcome SHALL be recorded exactly once for that game session without duplicate increments

### Requirement: Reset Confirmation Flow
Clicking the Reset button SHALL open a confirmation modal asking for explicit player confirmation before wiping game state and statistics.

#### Scenario: Triggering reset opens confirmation modal
- **WHEN** the player clicks the Reset button in the sidebar
- **THEN** the application SHALL open a modal dialog asking "Are you sure you want to reset your game board and all tracked stats?" with Confirm and Cancel buttons

#### Scenario: Cancelling reset maintains state and stats
- **WHEN** the player clicks Cancel in the reset confirmation modal
- **THEN** the confirmation modal SHALL close and the current board state and statistics SHALL remain unchanged

#### Scenario: Confirming reset clears board and statistics
- **WHEN** the player clicks Confirm in the reset confirmation modal
- **THEN** the active game board state SHALL return to `ready` and all accumulated win, loss, and streak statistics SHALL reset to 0
