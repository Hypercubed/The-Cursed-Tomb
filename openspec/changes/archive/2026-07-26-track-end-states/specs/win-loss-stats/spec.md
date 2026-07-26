## MODIFIED Requirements

### Requirement: Accumulated Win Loss Statistics Tracking
The application SHALL maintain cumulative counts of complete victories, partial victories, pyramid collapses, current victory streak, and best victory streak across game sessions.

#### Scenario: Complete victory increments complete victory count and streak
- **WHEN** the current game status transitions to `complete-victory`
- **THEN** the total `completeVictories` count SHALL increment by 1, `currentStreak` SHALL increment by 1, and `bestStreak` SHALL update if `currentStreak` exceeds `bestStreak`

#### Scenario: Partial victory increments partial victory count and streak
- **WHEN** the current game status transitions to `partial-victory`
- **THEN** the total `partialVictories` count SHALL increment by 1, `currentStreak` SHALL increment by 1, and `bestStreak` SHALL update if `currentStreak` exceeds `bestStreak`

#### Scenario: Pyramid collapse or resignation increments collapse count and resets streak
- **WHEN** the current game status transitions to `pyramid-collapse` (via resignation or forced/detected loss)
- **THEN** the total `pyramidCollapses` count SHALL increment by 1 and the `currentStreak` SHALL reset to 0

#### Scenario: Single outcome recording per game session
- **WHEN** a game reaches `complete-victory`, `partial-victory`, or `pyramid-collapse` status
- **THEN** the game outcome SHALL be recorded exactly once for that game session without duplicate increments
