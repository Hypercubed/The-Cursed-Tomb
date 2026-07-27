## MODIFIED Requirements

### Requirement: End state determination based on tomb clearance
The game logic SHALL automatically evaluate and declare end states when card actions occur without requiring an upfront win condition selection:
- `complete-victory`: when all cards in the pyramid AND all cards in the draw pile/discard pile are removed.
- `partial-victory`: when all cards in the pyramid are removed, but cards remain in the draw pile or discard pile (game finishes immediately upon pyramid clearance).
- `pyramid-collapse`: when no valid moves remain while cards are still present in the pyramid.
If the game mode is set to 'cursed-tomb', these end states SHALL trigger the Campaign Orchestrator to execute the Attrition Phase (on collapse) or the Survival Reward Phase (on victory).

#### Scenario: Clearing pyramid and deck declares complete victory
- **WHEN** the last remaining pyramid card is removed AND the draw pile and discard pile are empty
- **THEN** the game status SHALL transition to `complete-victory`

#### Scenario: Clearing pyramid with deck cards remaining declares partial victory
- **WHEN** the last remaining pyramid card is removed AND cards remain in the draw pile or discard pile
- **THEN** the game status SHALL transition to `partial-victory`

#### Scenario: Running out of moves with pyramid cards remaining declares pyramid collapse
- **WHEN** no valid pairs or Kings can be matched AND no redraws remain AND cards remain in the pyramid
- **THEN** the game status SHALL transition to `pyramid-collapse`
