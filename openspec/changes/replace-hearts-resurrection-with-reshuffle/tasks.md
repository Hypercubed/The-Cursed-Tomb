## 1. Documentation & Ruleset Updates

- [ ] 1.1 Update `docs/rules.md` (Section 6A) to document Hearts suit blessing as "Stock Reshuffle" (immediate free Waste pile reshuffle into Stock).
- [ ] 1.2 Update `ExpeditionRulesModal.tsx` and UI compendium documentation to reflect the new Hearts blessing logic and digital controls.

## 2. Simulation Engine & Data Updates

- [ ] 2.1 Update `sim/cursed_tomb_sim.py` so clearing a Hearts Fallen Hero executes a free Waste+Stock reshuffle instead of Graveyard resurrection.
- [ ] 2.2 Re-run simulation scripts (`base_game_sim.py`, `cursed_tomb_sim.py`) and update `sim/RESULTS.md` with baseline metrics.

## 3. Web Application Logic & Tests

- [ ] 3.1 Update game state logic / hooks in web application to execute an immediate Waste-to-Stock reshuffle when a Hearts Hero is cleared.
- [ ] 3.2 Update solver and unit test suites (`solver.test.ts`, `useAutoplay.test.ts`) to account for Hearts Waste reshuffle behavior.
- [ ] 3.3 Verify full test suite passes with `npm test` and validate UI interaction.
