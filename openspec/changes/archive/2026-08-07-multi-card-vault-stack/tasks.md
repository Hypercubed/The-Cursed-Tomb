## 1. Game Rules Documentation

- [x] 1.1 Update Section 2 and Section 6.B in `docs/rules.md` to state that multiple Blessed Diamond cards can be vaulted in a FILO stack.

## 2. Core Game Engine (`src/game.ts`)

- [x] 2.1 Refactor `GameState` in `src/game.ts` from `vaultCard?: Card | null` to `vaultCards: Card[]`.
- [x] 2.2 Update vault push/pop functions, `canAnyMove`, `findAvailableMoves`, and auto-vaulting to work with FILO top of `vaultCards`.
- [x] 2.3 Update `src/game.test.ts` to test multi-card vault stacking, FILO pop, and move availability.

## 3. Python Simulator (`sim/cursed_tomb_sim.py`)

- [x] 3.1 Update solver candidate move generation in `sim/cursed_tomb_sim.py` to only allow matching with top of `self.vault` stack (`self.vault[-1]`).

## 4. Web UI Components & Storage

- [x] 4.1 Update `DrawZone.tsx` to display top card of `vaultCards` and total count badge.
- [x] 4.2 Update `App.tsx` and `RulesModal.tsx` for `vaultCards` state.
- [x] 4.3 Update `src/storage/persistence.ts` to handle migrating legacy `vaultCard` to `vaultCards`.

## 5. Verification

- [x] 5.1 Run full test suite (`npm test`) and Python solver test script to ensure all tests pass cleanly.
