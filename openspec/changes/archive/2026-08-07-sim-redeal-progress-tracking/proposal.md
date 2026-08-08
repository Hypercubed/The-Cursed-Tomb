## Why

The Python simulator (`cursed_tomb_sim.py`) currently restricts redealing by requiring `self.clears_this_pass > 0`. While this acts as a loop-prevention heuristic, it currently tracks only card pair clears. When the Diamond Blessing is active, drawing a blessed Diamond automatically moves it from the Stock pile into the Vault, mutating game state without clearing a card pair. Because `clears_this_pass` is not updated during stock vaulting, the simulator falsely treats state progress as zero, blocks redealing, and prematurely marks winnable games as frozen/deadlocked.

## What Changes

- **Refactor Pass Progress Tracking**: Replace single-purpose `clears_this_pass` with comprehensive `progress_this_pass` (or update progress incrementing) in `cursed_tomb_sim.py`.
- **Include Stock Auto-Vaulting as Progress**: Ensure that drawing a blessed Diamond from stock into the Vault is marked as valid state progress during the stock pass.
- **Maintain Redeal Pruning Efficiency**: Continue pruning useless redeals when zero state changes occur during a pass, avoiding infinite solver loops while eliminating false deadlock classifications.
- **Add Verification Tests**: Add unit tests in `sim/test_solvers.py` ensuring that stock-to-vault movements permit redealing when stock is depleted.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `python-simulation-solvers`: Update simulation pass progress rules so stock-to-vault state mutations enable redeal availability.

## Impact

- `sim/cursed_tomb_sim.py`: Update `GameState` pass progress tracking and legal move generation for `redeal`.
- `sim/test_solvers.py`: Add unit test for stock-to-vault redeal progress semantics.
- Simulation win rate metrics: Fixes false-negative winnability drops in campaign simulations using Diamond blessings.
