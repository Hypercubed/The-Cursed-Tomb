## Why

In Expedition Mode (`cursed-tomb`), cards mutate via Scars (+1 Red / -1 Black rank shift), Curses, Entombed status, and Wildcard Blessings (e.g., Clubs Rally). However, the "Remaining Complement Pairs (Sums to 13)" section of the Expedition Deck & Stats modal currently calculates pair statistics purely using standard printed base ranks. This provides inaccurate strategic odds and fails to inform the player when active cards function as different ranks (such as a Red Queen functioning as a solo-clearing King).

## What Changes

- **Functional Pair Odds in Expedition Mode**: When viewing the Remaining Complement Pairs matrix in Expedition Mode, pair statistics (`active1`, `active2`, and `remainingPairs`) are computed using each active card's actual functional value (`getFunctionalValue(card, mode)`) instead of its printed base rank.
- **Modified Rank Annotations**: Annotate pair cards in the matrix to visually indicate active cards with modified functional values (e.g. `+1 Red Q ➔ K` or `-1 Black 10 ➔ 9`).
- **Wildcard Blessing Callouts**: Display a visual wildcard status chip when the Clubs Blessed card is active, indicating that flexible wildcard pairs are available.
- **Preserved Standard Mode Behavior**: Standard mode complement pair calculations and display remain unchanged.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `matched-cards-tracking`: Update requirements for the Remaining Complement Pair Statistics section to require functional value calculation and visual modification annotations when running in Expedition Mode.

## Impact

- `src/game.ts`: Enhance `getRemainingPairStats` (or introduce Expedition-aware pair stats calculation) to accept game mode and master deck state, returning functional rank counts, shifted card details, and wildcard counts.
- `src/components/MatchedCardsModal.tsx`: Update the Remaining Complement Pairs UI to render functional counts, modified card chips/annotations, and wildcard blessing callouts when in `cursed-tomb` mode.
- `src/App.tsx`: Pass required Expedition state to pair stat calculations and modal components.
