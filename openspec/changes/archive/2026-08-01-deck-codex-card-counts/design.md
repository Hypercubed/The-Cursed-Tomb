## Context

The Deck Codex modal (`MatchedCardsModal.tsx`) currently shows a single summary badge in its header: "X / 52 Removed (Y%)". The modal already receives `masterDeck` (the full campaign `CursedCard[]`) and `removedCardIds` (a `Set<string>`) as props. The data needed to compute remaining and entombed counts is already available — this change is purely a UI addition with derived computations.

The component lives at `src/components/MatchedCardsModal.tsx`. The header area is the `flex items-center justify-between` div that holds the title and the existing removed badge.

## Goals / Non-Goals

**Goals:**
- Derive and display a "Remaining" count in the Deck Codex header for both standard and campaign modes
- Derive and display an "Entombed" count in the Deck Codex header in campaign mode only
- Keep the existing "Removed" badge unchanged in position and appearance
- Match the existing badge visual style (pill shape, `bg-[#251c14] border border-game-border rounded-full text-xs font-mono`)

**Non-Goals:**
- Changing the card grid or pair stats sections
- Adding tooltips or drill-down behavior to the new badges
- Surfacing these counts anywhere outside the Deck Codex header (e.g., in the sidebar)

## Decisions

### Derived computation in the component, not in the caller
The counts are computed directly inside `MatchedCardsModal` from the props it already receives, rather than being passed as additional props. This avoids prop-drilling changes across `GameSidebar` and any other callers.

- `entombedCount`: `masterDeck ? masterDeck.filter(c => c.attritionStage === 5).length : 0`
- `remainingCount`: `52 - removedCardIds.size` (entombed cards are already filtered from the round's active locations, so they are already counted inside `removedCardIds`; no double-subtraction needed)

### Entombed badge is hidden in standard mode
When `mode !== 'cursed-tomb'` or `masterDeck` is undefined, the entombed badge is not rendered. Entombment is a campaign-only concept and showing it in standard mode would be confusing.

### Badge ordering: Remaining → Removed → Entombed
Left-to-right order reflects the most actionable information first. Remaining is the primary strategic number; Removed is already familiar to players; Entombed is a long-term campaign concern.

## Risks / Trade-offs

- **Remaining count could go negative** if `removedCardIds` were to somehow exceed 52. Mitigation: clamp `remainingCount` to `Math.max(0, ...)` as a defensive guard. Since entombed cards are already baked into `removedCardIds`, no double-counting occurs.
- **Header crowding on small screens**: Three badges may overflow on narrow viewports. Mitigation: the existing `max-w-4xl w-full` container is wide enough for desktop; on very narrow screens the badges wrap naturally inside the flex container.

## Open Questions

~~Should entombed cards also be counted in the "Removed" total, or are they counted separately in `removedCardIds` already?~~

**Resolved**: Entombed cards (attritionStage === 5) are filtered out of the round's active deck in `initializeGame`, so they never appear in pyramid/drawPile/discardPile. This means `getRemovedCardIds` already includes them — entombed cards show up as "not in any active location" and are thus counted as removed. Therefore `remainingCount = 52 - removedCardIds.size` correctly reflects cards currently in active play, and `entombedCount` is purely an informational breakdown of what portion of removed cards are permanently gone vs matched this round.
