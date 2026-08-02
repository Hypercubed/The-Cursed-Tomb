## 1. Documentation & Ruleset Updates

- [x] 1.1 Update `docs/rules.md` (Section 4) to document Black Curses as "The Recycled Weight" (shuffling the paired partner card into the Stock pile).
- [x] 1.2 Update `ExpeditionRulesModal.tsx` and UI compendium text to reflect the updated Black Curse rule.

## 2. Simulation Engine & Data Updates

- [x] 2.1 Update `sim/cursed_tomb_sim.py` so clearing a Stage 4 Black Cursed card shuffles its partner card into the Stock pile instead of moving it to Foundation.
- [-] 2.2 Re-run simulation scripts and update `sim/RESULTS.md` with baseline metrics.

## 3. Web Application Logic & Tests

- [x] 3.1 Update game state engine and hooks to handle partner card reshuffling into the Stock when a Black Cursed card is cleared.
- [x] 3.2 Update solver logic and unit test suites (`solver.test.ts`, `useAutoplay.test.ts`) for Black Curse partner reshuffling behavior.
- [x] 3.3 Verify full test suite passes with `npm test` and validate UI interaction.
