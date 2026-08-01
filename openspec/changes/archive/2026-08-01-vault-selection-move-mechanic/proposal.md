## Why

Currently, vaulting a Blessed Diamond card relies on a special "Vault ♦" floating badge button rendered directly over cards in the Pyramid or top of Discard. This creates visual clutter and breaks away from the game's core card selection and click mechanics. Standardizing vaulting into a normal move mechanic—where selecting an eligible card and clicking the empty Vault slot moves it—makes the interaction unified, intuitive, and consistent.

## What Changes

- **Remove Floating "Vault ♦" Buttons**: Eliminate the special badge button overlays from `PyramidBoard` cards and the `DrawZone` discard pile header.
- **Selection-Based Vault Move**: Allow players to move an exposed, unblocked Blessed Diamond card into the Vault by clicking the card to select it, then clicking the Empty Vault Slot.
- **Interactive Empty Vault Slot**: Enable the Empty Vault Slot in `DrawZone` as a target for selected cards when empty, providing visual feedback when a vaultable card is selected.
- **Preserve Combining Mechanics**: Retain normal two-way card pairing/combining when the Vault slot is occupied (clicking Vault Card then Outside Card, or Outside Card then Vault Card).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `cursed-tomb-campaign`: Update the Diamonds Vault blessing interaction behavior to specify moving an eligible card into the Diamond Vault slot via selecting the card and clicking the empty Vault slot.

## Impact

- **UI Components**: `DrawZone.tsx` and `PyramidBoard.tsx` (button removal, vault slot click handler, selection visual feedback).
- **Game Controller / State**: `App.tsx` (card click and vault slot click routing).
- **Core Game Mechanics**: `game.ts` (existing `moveWasteToVault` and `movePyramidToVault` functions remain unchanged, but execution is triggered by selection + slot click).
