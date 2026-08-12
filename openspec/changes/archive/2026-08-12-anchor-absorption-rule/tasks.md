## 1. Web Engine & Persistence

- [x] 1.1 Add `anchorAbsorption` property to `CursedCard` interface in `src/game.ts`
- [x] 1.2 Update card creation and state initialization in `src/game.ts` to set `anchorAbsorption: 0`
- [x] 1.3 Update freeze attrition logic in `src/game.ts` to absorb up to 4 hits on anchored cards (`rewardStage === 2`), resetting `rewardStage` to 0 on 4th hit while preserving `attritionStage`
- [x] 1.4 Update survival reward handling in `src/game.ts` to reset `anchorAbsorption = 0` whenever a card reaches `rewardStage === 2`
- [x] 1.5 Update game persistence schema and hydration in `src/storage/persistence.ts` to deserialize `anchorAbsorption` with fallback default `0`
- [x] 1.6 Add unit test coverage in `src/game.test.ts` verifying web engine anchor absorption and shield exhaustion behavior

## 2. Rules Documentation & UI

- [x] 2.1 Update physical rules text in `docs/rules.md` §5 and §6 to document the Anchor Absorption rule
- [x] 2.2 Update `src/components/RulesModal.tsx` to render Anchor Absorption details in the Rules Compendium modal

## 3. Python Simulation Suite

- [x] 3.1 Update `RuleFlags` in `sim/cursed_tomb_sim.py` to set `anchor_absorption: bool = True` by default
- [x] 3.2 Ensure `sim/deck_evolution_core.py` and `sim/deck_evolution_analysis.py` run with `anchor_absorption = True` by default
- [x] 3.3 Execute simulation tests `python sim/test_solvers.py` and verify all tests pass
