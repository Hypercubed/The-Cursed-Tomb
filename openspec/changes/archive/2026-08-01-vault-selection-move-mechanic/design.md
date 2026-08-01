## Context

Currently, moving a card into the Diamond Vault uses dedicated floating `"Vault ♦"` badge buttons rendered above eligible cards in `PyramidBoard` and `DrawZone`. This creates visual noise and diverges from the rest of the game's interaction model where actions are performed by selecting cards.

## Goals / Non-Goals

**Goals:**
- Eliminate custom floating `"Vault ♦"` buttons from card overlays and headers.
- Implement selection-based vaulting: selecting an exposed Blessed Diamond card (Pyramid or Discard) and clicking the Empty Vault Slot moves the card into the Vault.
- Provide visual feedback on the Empty Vault slot when an eligible vaultable card is selected.
- Maintain existing pairing/combining behavior when the Vault slot is occupied (`vaultCard !== null`).

**Non-Goals:**
- Modifying underlying solver logic or core game state vault storage primitives (`moveWasteToVault`, `movePyramidToVault`).
- Changing how cards inside an occupied Vault behave when clicked.

## Decisions

### Decision 1: Route Vault Slot Clicks via `App.tsx` Handler
**Choice**: Pass a click handler `onVaultSlotClick` to `DrawZone`. When the Vault slot is empty (`!vaultCard`) and clicked:
1. Check `selectedCardId`.
2. If `selectedCardId` matches top of `discardPile` and is a Blessed Diamond card, invoke `moveWasteToVault(state)`.
3. If `selectedCardId` matches an exposed, unblocked card in `pyramid` and is a Blessed Diamond card, invoke `movePyramidToVault(state, selectedCardId)`.
4. If no card is selected or `selectedCardId` is not vaultable, trigger a brief error animation (`animatingErrorIds`) or clear selection.

*Alternative Considered*: Putting selection resolution inside `DrawZone`. Rejected because game state mutations and selection state live at the `App` / `game` level.

### Decision 2: Remove Overlay Badge Buttons
**Choice**: Strip `canVaultPyramidCard` / `canVaultTopDiscard` button markup from `PyramidBoard.tsx` and `DrawZone.tsx`. Cards will display identically to standard playing cards.

### Decision 3: Visual Affordance for Vault Target
**Choice**: When `vaultCard` is null and `selectedCardId` corresponds to a vaultable card, apply a subtle amber pulsing/glowing border class (`ring-2 ring-amber-400/80 animate-pulse`) to the Empty Vault container in `DrawZone.tsx`. This clearly signals to the user that clicking the empty slot will complete the vault move.

## Risks / Trade-offs

- **[Risk] Player Unawareness**: Players accustomed to the floating "Vault ♦" button might not realize how to vault a card initially.
  → **Mitigation**: Highlight the empty Vault slot with a subtle amber glow whenever an eligible vaultable card is selected, and update the empty slot tooltip to say "Select a Blessed Diamond card, then click here to Vault".
