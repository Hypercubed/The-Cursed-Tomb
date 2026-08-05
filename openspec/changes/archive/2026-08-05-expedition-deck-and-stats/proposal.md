## Why

The current status sidebar button `View Deck Codex` and modal title `Deck Codex` use thematic jargon that players find abstract when looking for their deck state, run metrics, and campaign progress. Furthermore, while the application tracks rich campaign progress (Pyramids Explored, Conquered, Collapsed, Total Attempts) and achievements (Perfect Wins, Rank-Anchor Unlocked, Rounds Survived, Unlocked Badges), these metrics are fragmented across the sidebar and round summary screens rather than integrated into a single comprehensive inspection view. Renaming the interface to **Expedition Deck & Stats** and expanding the modal to present expedition metrics, achievement badges, and deck health percentages alongside the 52-card matrix provides a complete, thematic command center for players.

## What Changes

- Update the status sidebar trigger button text from `📜 View Deck Codex` to `📊 Expedition Deck & Stats`.
- Rename the inspection modal header title from `Deck Codex` to `Expedition Deck & Stats` with subtitle *"Expedition run progress, achievements, master deck state & strategic pair odds"*.
- Add a new **Expedition Metrics & Accomplishments** section to the top of the modal body displaying:
  - Run metrics summary cards: Pyramids Explored, Pyramids Conquered, Pyramids Collapsed, Total Attempts / Rounds Survived, and Deck Health % (active non-entombed cards remaining).
  - Achievement badges display: Perfect Wins count, Rank-Anchor Master status, and unlocked achievement badge chips.
- Retain the full 4×13 Deck Status Matrix and Strategic Pair Odds (sum-to-13 complement pairs) sections beneath the new metrics header.
- Update ARIA labels, close button text (`Close Expedition Deck & Stats`), tooltips, and specification requirements to reflect the new `Expedition Deck & Stats` naming and capabilities.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `matched-cards-tracking`: Update requirements and scenarios to specify the **Expedition Deck & Stats Modal** and trigger button label, and add requirements for surfacing expedition run metrics and achievement accomplishments within the modal header/body.
- `win-loss-stats`: Update requirements to specify that persistent campaign stats and achievements are displayed in the Expedition Deck & Stats modal as well as the sidebar and end screen.

## Impact

- **UI Components**:
  - `src/components/GameSidebar.tsx`: Update trigger button label to `📊 Expedition Deck & Stats`.
  - `src/components/MatchedCardsModal.tsx`: Update header title, subtitle, close button text/label, and add top section rendering `campaignStats` and `achievements`.
  - `src/App.tsx`: Pass `campaignStats` and `campaign.achievements` props to `<MatchedCardsModal />`.
- **Specs**: Delta specs for `matched-cards-tracking` and `win-loss-stats`.
