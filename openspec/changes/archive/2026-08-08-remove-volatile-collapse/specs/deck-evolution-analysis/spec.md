## MODIFIED Requirements

### Requirement: Infinite campaign runner with disabled end-game conditions
The script SHALL run campaigns where all terminal victory and collapse conditions are suppressed: no starvation collapse (fewer than 28 active cards), no perfect-win, no soft-win (rank-anchor victory), and no sealed-tomb victory. The deck SHALL still evolve: freeze attrition applies on frozen rounds, and survival rewards (blessings/anchors) apply on pyramid clears.

#### Scenario: Campaign continues past starvation threshold
- **WHEN** the number of active (non-entombed) cards drops below 28
- **THEN** the campaign SHALL continue running rather than reporting `collapse_starvation`

#### Scenario: Campaign continues after victory condition
- **WHEN** a pyramid clear or perfect win is achieved
- **THEN** the campaign SHALL continue to the next round rather than reporting a victory

#### Scenario: Deck still evolves across rounds
- **WHEN** a round ends in freeze (no legal moves)
- **THEN** exposed pyramid cards SHALL advance one attrition stage (scars, curses, entombment)

## REMOVED Requirements

### Requirement: Volatile Collapse suppression scenario
**Reason**: The volatile collapse condition (all 4 cards of a rank entombed) has been removed from the game rules entirely. The infinite runner no longer needs to suppress it.
**Migration**: Remove the `collapse_volatile` suppression path from the campaign runner script. The `volatile_collapse` field is removed from `RuleFlags`; the `--volatile-collapse` CLI flag is removed from `cursed_tomb_sim.py`.
