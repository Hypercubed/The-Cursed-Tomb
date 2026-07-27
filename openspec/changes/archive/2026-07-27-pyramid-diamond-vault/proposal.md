## Why

Currently, the Diamonds Vault blessing (`♦ [O]`) only allows moving a Blessed Diamond card to the Vault when it is exposed at the top of the Waste pile. In Pyramid Solitaire campaigns, overall victory rates are low due to high attrition collapse. Expanding the Diamond blessing to allow moving an exposed Blessed Diamond card directly from the Pyramid layout into the Vault (Self-Vaulting) opens up buried pyramid cards and improves tactical flexibility, boosting Explorer campaign win rates from ~3.9% to ~6.9% without compromising the core survival challenge.

## What Changes

- **Diamond Vault Pyramid Move**: Players can now move a Blessed Diamond Hero card (`♦ [O]`) directly from an exposed position in the Pyramid layout into the Diamond Vault slot for free.
- **Rulebook Update**: Update `docs/rules.md` to document that Diamond Hero self-vaulting applies from both the Waste pile and exposed Pyramid positions.
- **Autoplay Solver Update**: Update the autoplay solver in `src/solver.ts` to recognize exposed Blessed Diamond cards in the pyramid and execute free vault moves.
- **Simulation Suite Update**: Update `sim/cursed_tomb_sim.py` and `sim/RESULTS.md` with the new rule change and benchmark dataset.
- **UI Interaction**: Allow clicking an exposed Diamond Hero card in the Pyramid to move it to the Vault when the Vault slot is empty, or displaying a dedicated "Vault" button/action.
- **Game State Logic**: Update `src/game.ts` to allow `movePyramidToVault` (or expanding `moveWasteToVault` / action handling) when the target is an exposed Blessed Diamond hero in the Pyramid.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `cursed-tomb-campaign`: Expand Diamonds Vault blessing requirement to allow free vault movement when a Blessed Diamond card is exposed in either the Waste pile or the Pyramid layout.

## Impact

- `src/game.ts`: Game state transition functions, move validators, and available actions.
- `src/solver.ts`: Autoplay solver logic for evaluating free pyramid-to-vault moves.
- `sim/cursed_tomb_sim.py` & `sim/RESULTS.md`: Simulation script and benchmark findings.
- `src/components/PyramidBoard.tsx` / `src/components/PlayingCard.tsx`: UI interaction handlers to support moving exposed Diamond Heroes to the Vault.
- `docs/rules.md`: Rulebook documentation.
