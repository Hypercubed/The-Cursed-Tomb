## 1. Corner Index Reorganization & Scars on Rank Pip

- [x] 1.1 Refactor `PlayingCard.tsx` corner index logic to render light slash marks across the rank number for attrition stages 1 and 2.
- [x] 1.2 Implement heavy diagonal slash styling across the rank number for attrition stage 3+ with effective modified functional value displayed to the right.
- [x] 1.3 Add inline curse icon (`⚡`) formatting adjacent to slashed rank and modified value for stage 4 curses.

## 2. Anchors & Blessings on Suit Pip

- [x] 2.1 Implement bold anchor stroke overlays (`—` and `+`) rendered inside the suit symbol.
- [x] 2.2 Implement circular ring / halo enclosure around the suit symbol for Blessed Hero status.

## 3. Rotational Symmetry & Documentation

- [x] 3.1 Unify corner index rendering into a shared sub-component or function duplicated in bottom-right corner rotated 180°.
- [x] 3.2 Update `docs/rules.md` (Sections 4, 5, and 6) to detail manual physical pen marking rules over the rank number pip and suit pip symmetrically in both card corners.
- [x] 3.3 Verify visual layout and responsiveness across mobile, tablet, and desktop card component rendering tests.

## 4. Matched Cards Tomb Vault Overview Alignment

- [x] 4.1 Update `MatchedCardsModal.tsx` legend, cell status marks, and tooltips to align with the new rank/suit pip scar, curse, anchor, and blessing blue pen ink design.
- [x] 4.2 Verify Matched Cards Tomb Vault matrix rendering tests and build.
