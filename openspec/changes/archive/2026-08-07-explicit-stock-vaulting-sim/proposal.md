## Why

Currently, the Python simulation engine (`sim/cursed_tomb_sim.py`) automatically intercepts any drawn Blessed Diamond card during the `draw` move and appends it to the Vault stack immediately. However, it lacks an explicit candidate move for vaulting a Blessed Diamond card from the Waste pile (`waste_vault`), and does not generate an explicit candidate move for vaulting from Stock (`stock_vault`). 

In physical play and in the web application, vaulting a card from Stock, Waste, or Pyramid is an optional player choice (a free action). Automatic vaulting during draw prevents the simulation solvers from deciding *when* or *if* to vault a Diamond card, occasionally cluttering the top of the FILO Vault stack and burying better playable cards. Furthermore, lacking a `waste_vault` candidate move means any Blessed Diamond sitting in Waste cannot be moved into the Vault later.

Adding explicit `stock_vault` and `waste_vault` candidate moves evaluated by solver policies aligns the simulator with the official game rules and allows solvers to make tactical decisions about when to vault from any exposed location.

## What Changes

- Remove automatic interception of drawn Blessed Diamond cards during the `draw` action in `cursed_tomb_sim.py`. Drawn Diamond cards now go to the Waste pile by default during `draw`.
- Add explicit `vault_stock` and `vault_waste` candidate moves generated in candidate move selection when the top Stock or top Waste card is a Blessed Diamond.
- Integrate `vault_stock` and `vault_waste` candidate move evaluation across simulation solvers (`GreedySolver`, `HeuristicSolver`, `BeamSearchSolver`, `DFSSolver`) and candidate move generators.
- Update `compare_vault_sim.py` and benchmark scripts to support explicit stock and waste vaulting choices.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `python-simulation-solvers`: Move generation and solver evaluation for Blessed Diamond vaulting from Stock and Waste, replacing automatic interception during draw with explicit candidate move evaluation.

## Impact

- Affected files: `sim/cursed_tomb_sim.py`, `sim/solvers/*`, `sim/compare_vault_sim.py`.
- No impact on Web UI or TypeScript game engine (`src/game.ts`), which already enforce manual player choice for vaulting.
