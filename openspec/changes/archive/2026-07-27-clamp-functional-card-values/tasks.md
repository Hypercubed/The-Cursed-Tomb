# Tasks: Clamp Functional Card Values

- [x] 1. Update `docs/rules.md`
  - [x] 1.1 Update Section 4.1 in `docs/rules.md` to note that Functional Values are bounded between 1 (Ace) and 13 (King).

- [x] 2. Update Core Game Engine Logic
  - [x] 2.1 Update `getFunctionalValue` in `src/game.ts` to clamp computed values to `[1, 13]` range using `Math.max(1, Math.min(13, ...))`.
  - [x] 2.2 Add unit tests in `src/game.test.ts` to verify Black Ace -1 pairs with Queen (12) and Red King +1 clears solo.

- [x] 3. Update Simulation Scripts
  - [x] 3.1 Update `functional_value()` in `sim/cursed_tomb_sim.py` and `sim/compare_vault_sim.py` to clamp values to `[1, 13]`.
