## 1. UI Component Updates

- [x] 1.1 Remove floating `Vault ♦` badge button overlay from `src/components/PyramidBoard.tsx`.
- [x] 1.2 Remove top discard `Vault ♦` header button from `src/components/DrawZone.tsx`.
- [x] 1.3 Update `src/components/DrawZone.tsx` to add `onVaultSlotClick` handler on the Empty Vault container, and apply glowing amber highlight (`ring-2 ring-amber-400/80 animate-pulse`) when `vaultCard` is empty and selected card is a vaultable Blessed Diamond.

## 2. Selection & Move Handling

- [x] 2.1 Update `src/App.tsx` to handle `onVaultSlotClick`: execute `moveWasteToVault` or `movePyramidToVault` when a selected card is eligible, or trigger error animation/clear selection if ineligible.

## 3. Verification & Testing

- [x] 3.1 Verify selecting a Blessed Diamond card in Pyramid or Discard and clicking empty Vault slot moves it to the Vault.
- [x] 3.2 Verify clicking an occupied Vault card or outside card retains normal pair/combine mechanics.
- [x] 3.3 Run test suite and build verification (`npm test`, `npm run build`).
