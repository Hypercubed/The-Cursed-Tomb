## Context

The application currently has a trigger button in `GameSidebar.tsx` labeled `📜 View Deck Codex` that opens `MatchedCardsModal.tsx` titled `Deck Codex`. The modal renders a 4×13 deck grid (displaying active, removed, and mutated cards like Blessed Heroes, Scars, Curses, Anchors, and Entombed cards) as well as strategic complement pair odds summing to 13.

However:
1. The term "Deck Codex" is obscure jargon; players expect a clearer, theme-consistent label like **Expedition Deck & Stats**.
2. Run statistics (`campaignStats`: Pyramids Explored, Conquered, Collapsed, Total Attempts) and achievements (`achievements`: Perfect Wins, Rank-Anchor Unlocked, Unlocked Badges) currently exist in persistent storage and application state, but are not displayed in the inspection modal.

By renaming the trigger button and modal title to **Expedition Deck & Stats**, and augmenting `MatchedCardsModal` with a dedicated top section for Expedition Run Progress & Achievements, players gain a single comprehensive dashboard for all campaign deck state and overall campaign progress.

## Goals / Non-Goals

**Goals:**
- Rename trigger button in `GameSidebar.tsx` from `📜 View Deck Codex` to `📊 Expedition Deck & Stats`.
- Rename modal header title in `MatchedCardsModal.tsx` to `Expedition Deck & Stats` with subtitle *"Expedition run progress, achievements, master deck state & strategic pair odds"*.
- Extend `MatchedCardsModalProps` to accept optional `campaignStats` (`StoredCampaignStats`) and `achievements` (`CampaignAchievements`).
- Pass `campaignStats` and `campaign.achievements` from `App.tsx` into `<MatchedCardsModal />`.
- Render a new **Expedition Metrics & Achievements** section at the top of the modal body featuring:
  - Metric summary cards: Pyramids Explored, Pyramids Conquered, Pyramids Collapsed, Total Attempts, and Deck Health % (active non-entombed cards / 52).
  - Achievement badges: Perfect Wins count, Rank-Anchor status, and unlocked badge chips.
- Retain existing 4×13 Deck Status Matrix and Strategic Pair Odds displays unchanged beneath the new metrics section.
- Update ARIA labels, close button text (`Close Expedition Deck & Stats`), tooltips, and tests.

**Non-Goals:**
- Modifying the underlying persistence model (`persistence.ts`) or achievement calculation algorithms (`game.ts`).
- Removing the inline summary stats from `GameSidebar.tsx` (the inline sidebar overview remains active for quick reference).

## Decisions

### 1. Unified Naming: "Expedition Deck & Stats"
- **Choice**: Rename both the trigger button and modal title to `Expedition Deck & Stats`.
- **Rationale**: Uses "Expedition" to match `Expedition Rules & Guide` and the tomb exploration theme, while explicitly indicating that both the 52-card deck status and campaign progress metrics live in this view.
- **Alternatives Considered**:
  - `Campaign Stats`: Descriptive, but omits the deck matrix focus.
  - `Campaign Deck`: Omits the run metrics and achievements focus.
  - `Deck Codex`: Retaining existing name kept jargon that felt detached from run statistics.

### 2. Component Interface & Prop Flow in `MatchedCardsModal.tsx`
- **Choice**: Add optional props `campaignStats?: StoredCampaignStats` and `achievements?: CampaignAchievements` to `MatchedCardsModalProps`.
- **Rationale**: Keeps `MatchedCardsModal` backward-compatible for standard mode (where campaign stats/achievements are omitted) while making campaign mode rich in details.
- **Alternatives Considered**:
  - Passing full `CampaignState` object: Passing specific `campaignStats` and `achievements` interfaces is cleaner and isolates UI rendering dependencies.

### 3. Visual Layout of the New Header Section inside Modal
- **Choice**: Place the **Expedition Metrics & Achievements** section directly above the **Deck Status Matrix (4 × 13)** inside the modal body.
- **Rationale**: Users opening "Expedition Deck & Stats" see high-level run progress and badges first before scrolling to deep card-by-card deck inspection and pair odds.

## Risks / Trade-offs

- **Modal Vertical Height**: Adding a metrics and achievements block increases modal height on smaller screens.
  - *Mitigation*: The modal already uses `max-h-[90vh]` with `overflow-y-auto` flex layout, ensuring smooth scrolling on mobile/smaller screens.
- **Standard Mode vs. Campaign Mode**: Standard mode solitaire does not have campaign stats or achievements.
  - *Mitigation*: Conditionally render the Expedition Metrics section only when `mode === 'cursed-tomb'` or when `campaignStats` / `achievements` are present.

## Migration Plan

1. Update `src/components/MatchedCardsModal.tsx` component props, title, subtitle, close button aria-labels, and render the new metrics & achievements header section.
2. Update `src/components/GameSidebar.tsx` trigger button label and icon to `<span>📊</span> Expedition Deck & Stats`.
3. Update `src/App.tsx` JSX to pass `campaignStats={campaignStats}` and `achievements={campaign.achievements}` to `<MatchedCardsModal />`.
4. Update unit tests in `MatchedCardsModal.test.tsx` and `GameSidebar.test.tsx` (if any).
5. Update OpenSpec delta specs for `matched-cards-tracking` and `win-loss-stats`.
