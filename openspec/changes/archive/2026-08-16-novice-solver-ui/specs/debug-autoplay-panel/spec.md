## MODIFIED Requirements

### Requirement: Multi-strategy solver engine
The system SHALL provide a unified solver engine supporting four distinct strategy modes: Greedy, Smart (heuristic lookahead), Perfect (DFS/A* graph search oracle), and Novice (stochastic beginner simulation).

#### Scenario: Greedy strategy execution
- **WHEN** solver strategy is set to `greedy`
- **THEN** solver executes moves using rigid priority ordering (King > Pyramid pair > Pyramid/Discard pair > Draw/Cycle)

#### Scenario: Smart heuristic strategy execution
- **WHEN** solver strategy is set to `smart`
- **THEN** solver evaluates candidate moves using an unblock depth heuristic, rank bottleneck protection, and deck cycle economy before picking the highest scoring move

#### Scenario: Perfect solver strategy execution
- **WHEN** solver strategy is set to `perfect`
- **THEN** solver performs a graph search with state hashing across the complete game state (pyramid + remaining stock) to select the next step along a guaranteed winning solution path if one exists

#### Scenario: Novice solver strategy execution
- **WHEN** solver strategy is set to `novice`
- **THEN** solver identifies all legal candidate moves and applies stochastic filters representing beginner human mistakes (tunnel-vision missing Stock-to-Pyramid pairs, overlooking King removals, and ignoring Diamond Vault placements), selecting among remaining visible moves with score noise or random fallback before drawing/cycling if no visible move is chosen

#### Scenario: Deal winnability determination
- **WHEN** the game state updates or a new deal is initialized
- **THEN** the perfect solver evaluates whether the current board is winnable and returns a winnability status (`complete-victory`, `partial-victory`, `unwinnable`, or `deadlocked`)
