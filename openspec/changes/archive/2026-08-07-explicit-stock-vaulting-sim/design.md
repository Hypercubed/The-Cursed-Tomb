## Context

See `proposal.md` and `specs/python-simulation-solvers/spec.md`.
Currently, `sim/cursed_tomb_sim.py` automatically vaults Blessed Diamond cards drawn from `stock` inside the `draw` execution branch, but has no explicit candidate move for `vault_waste` (vaulting from Waste) or `vault_stock` (vaulting from Stock).

## Goals / Non-Goals

**Goals:**
- Decouple `draw` execution from stock-to-vault transfer in `sim/cursed_tomb_sim.py`.
- Add `vault_stock` and `vault_waste` as explicit candidate moves produced by candidate move generators in `sim/cursed_tomb_sim.py`.
- Update solver move selection (`GreedySolver`, `HeuristicSolver`, `BeamSearchSolver`, `DFSSolver`) to score and execute `vault_stock` and `vault_waste` moves alongside `vault_p` (Pyramid to Vault), standard pairs, and solo clears.
- Synchronize comparison and analysis scripts (`sim/compare_vault_sim.py`) with explicit stock and waste vaulting.

**Non-Goals:**
- Changing the TypeScript web engine (`src/game.ts`), which already relies on manual user choice for vaulting.
- Modifying standard solitaire draw/waste mechanics.

## Decisions

### 1. Separate `draw` from `vault_stock` in Game State Engine
- **Decision**: In `GameState.apply_move()`, `draw` will strictly pop the top card from `self.stock` and append it to `self.waste`.
- **New Move Types**:
  - `vault_stock`: Pops top card from `self.stock` and appends to `self.vault`.
  - `vault_waste`: Pops top card from `self.waste` and appends to `self.vault`.
  - `vault_p`: (Existing) Pops exposed card from pyramid slot and appends to `self.vault`.
- **Rationale**: Keeps transition execution clean and guarantees that every state transition in solver trees corresponds to an explicit move choice from any of the three valid locations (Stock, Waste, Pyramid).

### 2. Move Generation for Stock and Waste Vaulting
- **Decision**: `get_legal_moves()` generates `Move('vault_stock', tuple())` whenever `self.stock[0]` is a Blessed Diamond card, and `Move('vault_waste', tuple())` whenever `self.waste[-1]` is a Blessed Diamond card.
- **Alternatives Considered**:
  - *Auto-vaulting in Greedy solver only*: Rejected because all solvers should evaluate candidate moves through a single consistent legal move generator.

### 3. Heuristic Scoring for `vault_stock` and `vault_waste`
- **Decision**: In `HeuristicSolver`, assign `vault_stock` and `vault_waste` positive heuristic scores, while taking into account whether vaulting would bury an exposed playable card on top of the FILO Vault stack.
- **Rationale**: Ensures solvers do not needlessly flood the Vault stack when the current top Vault card is actively needed for pairing.

## Risks / Trade-offs

- [Simulation benchmark regression] → Mitigation: Run baseline simulations before and after the change to compare win rates and verify solver behavior.
