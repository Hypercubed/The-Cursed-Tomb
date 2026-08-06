## 1. Game Mechanics & Statistics Layer

- [x] 1.1 Update `PairStat` interface in `src/game.ts` to include optional fields for functional modification summaries (`functionalModifications1`, `functionalModifications2`) and wildcard availability (`hasWildcard`).
- [x] 1.2 Update `getRemainingPairStats` in `src/game.ts` to accept game `mode` and `masterDeck` parameters, calculating rank counts using `getFunctionalValue(card, mode)` when in `cursed-tomb` mode and collecting rank shift annotations.
- [x] 1.3 Add unit tests in `src/game.test.ts` verifying functional pair statistics calculations in Expedition Mode for Red (+1) and Black (-1) scars/curses, as well as Clubs Rally blessing.

## 2. Expedition Deck & Stats UI Component

- [x] 2.1 Update `MatchedCardsModal.tsx` to pass `mode` and `masterDeck` to `getRemainingPairStats` (or receive enhanced pair stats from `App.tsx`).
- [x] 2.2 Add an Expedition header badge (`⚡ Functional Pair Odds`) and wildcard indicator pill (`♣ Wildcard Active`) in the Remaining Complement Pairs section header when in `cursed-tomb` mode.
- [x] 2.3 Render functional shift annotation chips (e.g. `⚡ 1 Red Q ➔ K`) inside pair cards when active cards have modified values.
- [x] 2.4 Add component tests in `src/components/MatchedCardsModal.test.tsx` verifying that modified rank annotations and wildcard pills render correctly in Expedition Mode.
