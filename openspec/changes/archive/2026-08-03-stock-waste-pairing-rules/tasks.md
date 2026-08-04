## 1. Core Engine Logic (`src/game.ts`)

- [x] 1.1 Update `cardIsVisible` so the top Stock card (`drawPile[0]`) is exposed and selectable for pairing when `drawPile` is non-empty
- [x] 1.2 Update `canAnyMove` and `canRemovePair` to recognize legal pairings between Stock top + Pyramid exposed cards and Stock top + Waste top card
- [x] 1.3 Implement `discardStockCard` state transition function to move the top exposed Stock card onto the top of `discardPile` (Waste)
- [x] 1.4 Update `src/game.test.ts` unit test suite to test Stock-to-Pyramid pairing, Stock-to-Waste pairing, and discarding

## 2. UI Components & Layout (`src/components/`, `src/App.tsx`)

- [x] 2.1 Update `DrawZone.tsx` to render the top Stock card face-up and highlighted when selected
- [x] 2.2 Add a dedicated `[ Pass to Waste ]` action button in the Draw zone control bar
- [x] 2.3 Update keyboard shortcut handlers (`Space` / `D`) to trigger `discardStockCard`

## 3. Solvers & Simulations (`src/solver.ts` & `sim/`)

- [x] 3.1 Update `src/solver.ts` (`findNextGreedyMove`, `getLegalNextStates`) to evaluate in-flight Stock pairings before passing to Waste
- [x] 3.2 Update Python simulation engines (`sim/cursed_tomb_sim.py`, `sim/base_game_sim.py`, `sim/solvers/*`) to include `stock_pyramid` and `stock_waste` move types
- [x] 3.3 Update `src/solver.test.ts` to verify solver handling of Stock pairings

## 4. Documentation & Final Verification

- [x] 4.1 Update `docs/rules.md` to explicitly describe in-flight Stock card pairing rules
- [x] 4.2 Run full test suite (`npm test`) and build check (`npm run build`)
