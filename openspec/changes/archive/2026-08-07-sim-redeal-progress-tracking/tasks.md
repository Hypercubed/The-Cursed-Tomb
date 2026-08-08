## 1. Simulation Engine Updates

- [x] 1.1 Update `GameState` in `sim/cursed_tomb_sim.py` to replace `clears_this_pass` with `progress_this_pass` flag (including state initialization, cloning, and state reset on redeal)
- [x] 1.2 Update `get_legal_moves` and `apply_move` in `sim/cursed_tomb_sim.py` so that card clears, pyramid vaulting (`vault_p`), and stock auto-vaulting (`draw` of blessed Diamonds) set `progress_this_pass = True`
- [x] 1.3 Update `redeal` legal move condition to check `self.progress_this_pass` instead of `self.clears_this_pass > 0`

## 2. Test Verification

- [x] 2.1 Add a unit test in `sim/test_solvers.py` verifying that drawing a blessed Diamond from stock into the Vault sets pass progress and enables redealing when stock is empty
- [x] 2.2 Run python simulation test suite to ensure all solvers pass without regressions

