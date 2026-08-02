## Why

The Deck Codex header currently shows only how many cards have been removed ("X / 52 Removed"), but players have no quick way to see how many cards remain active in the deck or how many have been permanently entombed. In campaign mode, entombed cards are permanently out of the pool, so knowing both counts at a glance is essential for strategic planning.

## What Changes

- Add a "Remaining" count to the Deck Codex header showing how many cards are still in active play (i.e., not removed and not entombed)
- Add an "Entombed" count to the Deck Codex header showing how many cards have reached attrition stage 5 (permanently destroyed)
- The existing "Removed" badge is retained and all three counts are displayed together in the header summary area

## Capabilities

### New Capabilities

*(none — this change modifies an existing capability)*

### Modified Capabilities

- `matched-cards-tracking`: The Deck Codex modal header gains two new count badges — remaining active cards and entombed cards — extending the current single "Removed" summary display

## Impact

- `src/components/MatchedCardsModal.tsx`: Header section updated to show remaining and entombed counts alongside the existing removed count
- Campaign mode (`masterDeck`) data is already passed as a prop; entombed count is derived from cards with `attritionStage === 5`
- Standard mode (no `masterDeck`) shows entombed count as 0 or hides it; remaining count is `52 - removedCardIds.size`
