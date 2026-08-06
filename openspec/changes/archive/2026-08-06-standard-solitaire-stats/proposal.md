## Why

Recent UI updates introduced standard solitaire mode but restricted career statistics (complete victories, partial victories, pyramid collapses, win rates, and win streaks) exclusively to Cursed Tomb Campaign mode. Although the underlying persistence layer (`PersistenceManager`) continuously records standard solitaire game outcomes, standard solitaire players currently have no visual visibility into their career stats or performance streaks in the sidebar, deck matrix modal, or end-of-game round summary. Reintroducing these stats for Standard Solitaire restores player motivation and tracking parity across all game modes.

## What Changes

- **Game Sidebar (`GameSidebar.tsx`)**: Reintroduce a "Standard Solitaire Stats" panel in the sidebar when `gameMode === 'standard'`, displaying career statistics: Total Games Played, Clear Rate %, Complete Victories, Partial Victories, Pyramid Collapses, Current Win Streak, and Best Win Streak.
- **Deck Matrix & Pair Odds Modal (`MatchedCardsModal.tsx`)**: Render a dedicated "Standard Solitaire Career Stats" summary section when open in standard mode, presenting career metrics and streak counters alongside the 4×13 deck status matrix.
- **Round Summary Modal (`RoundSummaryModal.tsx`)**: Display standard solitaire summary statistics and streak updates upon round completion (Complete Victory, Partial Victory, or Pyramid Collapse) for standard mode runs.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `matched-cards-tracking`: Update requirements to specify standard solitaire career stats rendering in the Deck Matrix modal and round completion summary.
- `game-layout`: Update game sidebar layout requirements to mandate standard solitaire stats display when in standard mode.

## Impact

- **Frontend Components**: `GameSidebar.tsx`, `MatchedCardsModal.tsx`, `RoundSummaryModal.tsx`, and `App.tsx`.
- **Persistence Layer**: Reads existing `StoredStats` from `defaultPersistenceManager`. No schema migration required as standard stats are already saved under `cursed_tomb_stats`.
- **Breaking Changes**: None.
