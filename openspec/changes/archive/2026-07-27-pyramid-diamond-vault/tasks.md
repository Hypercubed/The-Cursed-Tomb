## 1. Game Logic & State Updates

- [x] 1.1 Implement `movePyramidToVault` in `src/game.ts` to allow moving an exposed, unremoved Blessed Diamond card from the pyramid layout into the Vault slot when empty.
- [x] 1.2 Add unit tests in `src/game.test.ts` for Pyramid self-vaulting logic.

## 2. Autoplay Solver Integration

- [x] 2.1 Update `findNextGreedyMove` and `isGamePlayable` in `src/solver.ts` to detect and execute free Pyramid-to-Vault moves for exposed Diamond Heroes when the Vault is empty.
- [x] 2.2 Add unit tests in `src/solver.test.ts` or `src/hooks/useAutoplay.test.ts` verifying autoplay handling of Pyramid Diamond self-vaulting.

## 3. UI Integration

- [x] 3.1 Update `PyramidBoard` / `PlayingCard` to render an actionable Vault trigger when an exposed Pyramid card is a Blessed Diamond (`♦ [O]`) and the Vault is empty.
- [x] 3.2 Wire up the move handler in `App.tsx` to dispatch `movePyramidToVault`.

## 4. Documentation & Simulations

- [x] 4.1 Update `docs/rules.md` (Section 6.A Diamonds Vault description) to document that Diamond Heroes can self-vault from both Waste pile and exposed Pyramid positions.
- [x] 4.2 Update `sim/cursed_tomb_sim.py` to enable Pyramid Diamond self-vaulting in campaign simulations.
- [x] 4.3 Update `sim/RESULTS.md` with updated campaign victory and collapse benchmarks.
- [x] 4.4 Run `npm test` and verify that unit tests pass cleanly.
