## 1. Rules Documentation & UI In-App Rules

- [x] 1.1 Update `docs/rules.md` §3.3 to specify that when two Black Cursed cards pair, the higher functional value card moves to Foundation and the lower functional value partner card is reshuffled to Stock.
- [x] 1.2 Update `docs/cheat-sheet.md` with the dual Black Curse resolution rule.
- [x] 1.3 Update `src/components/RulesModal.tsx` to document dual Black Curse pairing behavior in both the Core Rules and Web Guide tabs.

## 2. TypeScript Game Engine & Test Suite

- [x] 2.1 Update `removePair` in `src/game.ts` to implement dual Black Curse resolution (higher functional value to Foundation, lower to Stock).
- [x] 2.2 Update existing tests and add new test cases in `src/game.test.ts` verifying dual Black Curse pairing across Pyramid and Stock/Waste.

## 3. Python Simulation Solvers

- [x] 3.1 Update `apply_move` in `sim/cursed_tomb_sim.py` for `pp`, `pw`, `stock_pyramid`, and `stock_waste` moves when both cards are Black Cursed.
- [x] 3.2 Run simulation tests (`python -m unittest discover -s sim` or `pytest`) to verify simulation integrity.

## 4. Verification & Validation

- [x] 4.1 Run full TypeScript test suite (`npm test`).
- [x] 4.2 Run `openspec validate dual-black-curse-resolution --strict`.
