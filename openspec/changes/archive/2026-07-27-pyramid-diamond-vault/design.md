## Context

In *The Cursed Tomb*, card blessings provide powerful persistent effects across rounds. Currently, the Diamond Vault blessing (`♦ [O]`) allows moving a Blessed Diamond card to the Vault only when it appears at the top of the Waste pile.

Empirical simulations showed that campaign collapse rates are very high (~96% in Explorer mode), while allowing exposed Diamond Hero cards in the Pyramid to be vaulted increases Explorer victory rates from 3.9% to 6.9% without over-powering the game.

## Goals / Non-Goals

**Goals:**
- Enable players to move a Blessed Diamond card (`♦ [O]`) directly from an exposed Pyramid position into the Diamond Vault slot for free.
- Enforce that the Vault slot must be empty (`vaultCard == null`) and the Pyramid card must be exposed and un-removed.
- Update `docs/rules.md` to reflect the expanded Diamond Vault blessing rules.
- Update `src/solver.ts` autoplay logic to consider free pyramid-to-vault moves.
- Update `sim/cursed_tomb_sim.py` and `sim/RESULTS.md` with official benchmark results.
- Maintain existing pairing and Vault clearing logic.

**Non-Goals:**
- Allowing non-Diamond or non-Blessed Pyramid cards to be vaulted.
- Expanding Vault capacity beyond 1 card.
- Allowing vaulting of unexposed / face-down pyramid cards.

## Decisions

1. **Game State API Extension (`src/game.ts`)**:
   - Introduce `movePyramidToVault(state: GameState, cardId: string): GameState` (or parameterize `moveCardToVault`).
   - Validate that target card is in `pyramid`, exposed, un-removed, has `blessed === true`, `suit === '♦'`, and `state.vaultCard == null`.
   - On execution, set `vaultCard = card`, remove card from pyramid (`pyramid[row][col] = null` or mark removed), and log move history.

2. **Autoplay Solver (`src/solver.ts`)**:
   - Update `findNextGreedyMove` and `isGamePlayable` to check if an exposed pyramid card is a Blessed Diamond card when `vaultCard` is null.
   - Autoplay solver prioritizes vaulting an exposed Diamond Hero from the pyramid as a free action to unblock parent cards.

3. **UI Action Trigger (`PyramidBoard` & `PlayingCard`)**:
   - When a card in the Pyramid is exposed, is a Blessed Diamond (`♦ [O]`), and `vaultCard` is empty, present an intuitive action (e.g. an overlay button or dedicated Vault icon action on the card) so the player can explicitly choose to move it to the Vault or select it for pairing.

4. **Rulebook Update (`docs/rules.md`)**:
   - Update section 6.A Diamond Vault description to state: "When exposed on the Waste pile OR on the Pyramid layout, you may instantly place this card face-up into the Diamond Vault slot."

5. **Python Simulations (`sim/cursed_tomb_sim.py` & `sim/RESULTS.md`)**:
   - Update `sim/cursed_tomb_sim.py` engine so Diamond Hero self-vaulting triggers from pyramid exposed slots.
   - Update `sim/RESULTS.md` documenting campaign victory and collapse rates under the updated ruleset.

## Risks / Trade-offs

- **Accidental Vault vs Pair Selection**: Clicking a card might be intended for pairing rather than vaulting.
  - *Mitigation*: Provide a distinct "Vault ♦" button/badge on the exposed Diamond Hero card or in the draw/vault zone when selected, ensuring standard clicks still initiate regular card pairing selection unless the explicit Vault action is triggered.
