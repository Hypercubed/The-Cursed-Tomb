## Why

Currently, the game rules, web app, and simulation treat the Diamond Vault as a single-card slot (`vaultCard?: Card | null`), limiting strategic options. Expanding the Vault to hold multiple cards in a FILO (First-In, Last-Out) stack allows players to store multiple Blessed Diamond cards over time, unblocking layout cards and retrieving vaulted cards from the top of the stack when needed.

## What Changes

- **Game Rules (`docs/rules.md`)**: Update Diamond Vault rules to specify that multiple Blessed Diamond cards can be placed in the Vault, stacking in FILO order (only the top card is playable).
- **TypeScript Game State (`src/game.ts`)**:
  - Refactor `vaultCard?: Card | null` in `GameState` to `vaultCards: Card[]`.
  - Update vault actions (`vaultCard`, pairing from vault, auto-vaulting) to operate on the top card of `vaultCards` stack (`vaultCards[vaultCards.length - 1]`).
- **Python Simulator (`sim/cursed_tomb_sim.py`)**: Update solver logic so vault play options only consider the top of `self.vault` (`self.vault[-1]`) in FILO stack order.
- **UI & Layout (`src/components/DrawZone.tsx`)**:
  - Render the top card of `vaultCards`.
  - Update Vault counter badge to display the total count of cards in the vault (e.g., `0`, `1`, `2`, ...).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `game-layout`: Update Draw & Vault zone slot requirements to mandate displaying the top card of a multi-card Vault stack and rendering the total vaulted card count.
- `expedition-rules-modal`: Update rules documentation to detail multi-card FILO Vault stacking mechanics.

## Impact

- `docs/rules.md`: Updated Section 2 and Section 6.B rules text.
- `src/game.ts` & `src/game.test.ts`: Replaced `vaultCard` state with `vaultCards: Card[]`.
- `sim/cursed_tomb_sim.py`: Updated solver move generation for FILO vault top card access.
- `src/components/DrawZone.tsx`, `App.tsx`, `RulesModal.tsx`: Updated Vault card rendering and rules modal display.
