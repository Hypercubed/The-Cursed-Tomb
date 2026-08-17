## Why

When two Black Cursed cards (3–4 Scars on ♠/♣) are paired together in gameplay, the previous symmetric rule reshuffled both cards back into the Stock draw pile. In digital gameplay—particularly during the post-pyramid clearing phase or autoplay—this creates a perpetual recirculation loop where neither card is ever removed from the deck pool, causing infinite loops in the UI game engine and state space explosion in the solver.

## What Changes

- **Dual Black Curse Resolution**: When both cards in a cleared pair are Black Cursed, the card with the higher functional value moves to the Foundation, and only the partner card with the lower functional value is reshuffled back into the face-down Stock draw pile.
- **Rulebook & Compendium Alignment**: Update `docs/rules.md`, `docs/cheat-sheet.md`, and `src/components/RulesModal.tsx` to document this dual Black Curse pairing rule.
- **Simulation Alignment**: Update `sim/cursed_tomb_sim.py` to match the new higher-to-foundation, lower-to-stock dual Black Curse resolution logic.
- **Game Engine & Tests**: Update `src/game.ts:removePair` and test cases in `src/game.test.ts`.

## Capabilities

### Modified Capabilities
- `cursed-tomb-campaign`: Update requirement for Black Curse trap mechanics when both paired cards are Black Cursed (higher functional value to Foundation, lower functional value reshuffled to Stock).
- `expedition-rules-modal`: Update in-app digital rule descriptions to detail dual Black Curse resolution.

## Impact
- **Rules Documentation**: `docs/rules.md`, `docs/cheat-sheet.md`.
- **UI Components**: `src/components/RulesModal.tsx`.
- **Game Engine**: `src/game.ts` (`removePair`), `src/solver.ts`.
- **Simulation**: `sim/cursed_tomb_sim.py` (`apply_move` for `pp`, `pw`, `stock_pyramid`, `stock_waste`).
- **Tests**: `src/game.test.ts`.
