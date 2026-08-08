## ADDED Requirements

### Requirement: Explicit Stock and Waste Vault Move Evaluation
The simulation engine and solver policies SHALL evaluate moving an exposed Blessed Diamond card from Stock or Waste into the Vault as explicit candidate move options (`vault_stock`, `vault_waste`) during turn selection, rather than automatically intercepting drawn Diamond cards during standard stock draw.

#### Scenario: Stock draw places card into Waste
- **WHEN** a Blessed Diamond card is drawn from the Stock pile during a standard `draw` move execution
- **THEN** the drawn card SHALL be moved to the Waste pile by default unless an explicit stock-to-vault move was selected as the chosen candidate move

#### Scenario: Candidate move generator exposes stock and waste vault options
- **WHEN** the top card of the Stock pile is a Blessed Diamond card, OR the top card of the Waste pile is a Blessed Diamond card
- **THEN** the simulation move generator SHALL generate explicit `vault_stock` and/or `vault_waste` candidate move options for evaluation by active solver policies (`GreedySolver`, `HeuristicSolver`, `BeamSearchSolver`, `DFSSolver`)
