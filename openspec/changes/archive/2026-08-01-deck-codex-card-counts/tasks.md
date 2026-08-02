## 1. Verify Data Assumptions

- [x] 1.1 Check whether entombed cards (attritionStage === 5) are also present in `removedCardIds` — confirm if remaining = `52 - removed` or `52 - removed - entombed`
- [x] 1.2 Confirm the computation approach in `design.md` based on the finding above, updating the open question

## 2. Update MatchedCardsModal Component

- [x] 2.1 In `MatchedCardsModal.tsx`, compute `entombedCount` from `masterDeck` (filter `attritionStage === 5`, default to 0 when masterDeck is absent)
- [x] 2.2 Compute `remainingCount` using the verified formula from task 1.1, clamping to `Math.max(0, ...)`
- [x] 2.3 Add the "Remaining" badge to the header, styled to match the existing removed badge, positioned before the removed badge
- [x] 2.4 Add the "Entombed" badge to the header, rendered only when `mode === 'cursed-tomb'`, positioned after the removed badge

## 3. Verify Rendering

- [x] 3.1 Test in standard mode: only "Remaining" and "Removed" badges appear; "Entombed" is absent
- [x] 3.2 Test in campaign mode with no entombed cards: all three badges show, Entombed reads 0
- [x] 3.3 Test in campaign mode with one or more entombed cards: Entombed count reflects actual entombed cards; Remaining is reduced accordingly
- [x] 3.4 Verify counts sum correctly: Remaining + Removed + Entombed = 52 (in campaign mode)
