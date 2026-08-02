## 1. Documentation & Ruleset Updates

- [ ] 1.1 Update `docs/rules.md` (Section 6A) to document Spades suit blessing as "Tunnel" (moving one exposed pyramid card directly into the Waste pile).
- [ ] 1.2 Update `ExpeditionRulesModal.tsx` and UI compendium documentation to reflect the updated Spades blessing logic and controls.

## 2. Simulation Engine & Data Updates

- [ ] 2.1 Update `sim/cursed_tomb_sim.py` so clearing a Spades Fallen Hero selects and transfers the highest-leverage exposed pyramid card to the Waste pile.
- [ ] 2.2 Re-run simulation scripts and update `sim/RESULTS.md` with baseline metrics.

## 3. Web Application Logic & Tests

- [ ] 3.1 Update game state logic, React components (`PyramidBoard.tsx`), and hooks to prompt for an exposed pyramid card and transfer it to the Waste upon clearing a Spades Hero.
- [ ] 3.2 Update solver and unit test suites (`solver.test.ts`, `useAutoplay.test.ts`) for Spades Tunnel Waste transfer behavior.
- [ ] 3.3 Verify full test suite passes with `npm test` and validate UI interaction.
