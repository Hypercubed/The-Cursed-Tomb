## 1. Simulation Engine Updates (`sim/cursed_tomb_sim.py`)

- [x] 1.1 Remove automatic vaulting logic from the `draw` action in `cursed_tomb_sim.py` so drawn cards go to `waste` by default
- [x] 1.2 Implement `vault_stock` and `vault_waste` move types in `get_legal_moves()` when the top Stock or top Waste card is a Blessed Diamond
- [x] 1.3 Update `apply_move()` to process `vault_stock` (Stock to Vault) and `vault_waste` (Waste to Vault)

## 2. Solver Policies & Scoring Updates

- [x] 2.1 Update `GreedySolver` and `HeuristicSolver` in `sim/cursed_tomb_sim.py` (and `sim/solvers/*`) to evaluate `vault_stock` and `vault_waste` candidate moves
- [x] 2.2 Update `BeamSearchSolver` and `DFSSolver` lookahead trees to include `vault_stock` and `vault_waste` branch expansions

## 3. Comparison & Verification

- [x] 3.1 Update `sim/compare_vault_sim.py` to use explicit stock and waste vaulting candidate moves
- [x] 3.2 Run simulation sanity checks and verify win rate consistency
