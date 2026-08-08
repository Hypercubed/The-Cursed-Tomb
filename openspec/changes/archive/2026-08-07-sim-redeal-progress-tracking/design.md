## Context

See `proposal.md`. The Python simulator (`cursed_tomb_sim.py`) currently tracks pass progress via `self.clears_this_pass`, which is only incremented on card pair clears and pyramid vaulting (`vault_p`). When drawing cards from stock under Diamond Blessing, blessed Diamonds move automatically into the Vault (`self.vault.append(drawn)`), which alters playable board state without incrementing `self.clears_this_pass`.

## Goals / Non-Goals

**Goals:**
- Replace or expand `clears_this_pass` with `progress_this_pass` to accurately track all state-mutating actions occurring during a stock pass.
- Ensure stock auto-vaulting (`draw` action of blessed Diamonds) sets `progress_this_pass = True`.
- Preserve redeal pruning efficiency (preventing infinite loops when 0 progress occurs during a pass).
- Verify behavior with unit tests in `sim/test_solvers.py`.

**Non-Goals:**
- Changing human-facing TS engine (`src/game.ts`) redeal mechanics.
- Altering base Pyramid Solitaire rules when blessings are disabled.

## Decisions

### Decision 1: Rename `clears_this_pass` (int count) to `progress_this_pass` (boolean flag)
- **Rationale**: The simulator only cares whether *any* progress occurred during the current pass to determine if redealing can yield new legal moves. Tracking boolean `progress_this_pass` simplifies state reset and evaluation logic.
- **Alternatives Considered**: Keeping `clears_this_pass` as an integer and incrementing it on stock vaulting. A boolean `progress_this_pass` flag is clearer in intent because vaulting a card is progress, not a "clear".

### Decision 2: Set `progress_this_pass = True` on stock auto-vaulting
- **Rationale**: In `apply_move` under `kind == 'draw'`, if `drawn.blessed and drawn.suit == 'D'`, appending `drawn` to `self.vault` mutates the playable Vault state. Setting `self.progress_this_pass = True` ensures this state change marks the pass as productive, allowing a redeal when stock is depleted.
- **Alternatives Considered**: Checking `len(self.vault)` at the start vs. end of stock pass. Explicitly setting `progress_this_pass = True` at action execution time is cleaner and avoids state diffing overhead.

## Risks / Trade-offs

- **[Risk]** Missing other subtle state changes during stock pass → **Mitigation**: Audit all move types (`pair`, `vault_p`, `draw`, `blessings`) in `cursed_tomb_sim.py` to guarantee `progress_this_pass` is set whenever state mutates.
