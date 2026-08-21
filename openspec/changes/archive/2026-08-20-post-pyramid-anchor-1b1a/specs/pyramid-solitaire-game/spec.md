## MODIFIED Requirements

### Requirement: End state determination based on tomb clearance
The game logic SHALL automatically evaluate and declare end states when card actions occur without requiring an upfront win condition selection:
- `complete-victory`: when all cards in the pyramid AND all cards in the draw pile/discard pile/vault are removed.
- `partial-victory`: when all cards in the pyramid are removed, but cards remain in the draw pile or discard pile or vault — **only after the post-pyramid Stock phase (draw/redeal pairing Stock+Waste+Vault) has been exhausted with no legal moves remaining**.
- `pyramid-collapse`: when no valid moves remain while cards are still present in the pyramid.

#### Scenario: Clearing pyramid and deck declares complete victory
- **WHEN** the last remaining pyramid card is removed AND the draw pile, discard pile, and vault are empty
- **THEN** the game status SHALL transition to `complete-victory`

#### Scenario: Clearing pyramid with Stock cards remaining continues then declares partial victory
- **WHEN** the last remaining pyramid card is removed AND cards remain in the draw pile, discard pile, or vault
- **THEN** the game SHALL NOT immediately transition to `partial-victory`; it SHALL continue Stock+Waste+Vault pairing (including redeals) until no Stock moves remain, then transition to `partial-victory` with the post-pyramid cards still in piles (or `complete-victory` if Stock was fully cleared)

#### Scenario: Running out of moves with pyramid cards remaining declares pyramid collapse
- **WHEN** no valid pairs or Kings can be matched AND no redraws remain AND cards remain in the pyramid
- **THEN** the game status SHALL transition to `pyramid-collapse`
