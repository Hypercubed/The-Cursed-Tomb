## Context

The persistence system (`PersistenceManager` in `src/storage/persistence.ts`) already maintains lifetime statistics (`StoredStats`) under the local storage key `cursed_tomb_stats`:
- `completeVictories`: number of games where both pyramid and deck were cleared.
- `partialVictories`: number of games where pyramid was cleared.
- `pyramidCollapses`: number of games resulting in defeat (no available moves remaining).
- `currentStreak`: current consecutive win count (complete or partial victory).
- `bestStreak`: highest consecutive win count achieved.

In `App.tsx`, `stats` state is continuously loaded from `defaultPersistenceManager.getStats()` and updated whenever a round ends via `defaultPersistenceManager.recordOutcome()`.

Currently, `GameSidebar.tsx`, `MatchedCardsModal.tsx`, and `RoundSummaryModal.tsx` receive `stats` or `gameMode`, but only display mode-specific UI when `gameMode === 'cursed-tomb'`.

## Goals / Non-Goals

**Goals:**
- Render Standard Solitaire career statistics (`StoredStats`) in `GameSidebar.tsx` when `gameMode === 'standard'`.
- Render a Standard Solitaire career metrics summary block in `MatchedCardsModal.tsx` when `mode === 'standard'`.
- Render Standard Solitaire summary and streak updates in `RoundSummaryModal.tsx` when a standard game finishes.

**Non-Goals:**
- Modifying storage structure or adding new fields to `StoredStats`.
- Adding move counters, timers, or classic score calculations (Option B/C).
- Altering Cursed Tomb Campaign stats or achievements UI.

## Decisions

### Decision 1: Dedicated Standard Solitaire Stats Panel in `GameSidebar`
- **Approach**: Inside `GameSidebar.tsx`, render a clean `<div className="border-t border-[#2d2319] pt-2.5 mt-1">` block when `gameMode === 'standard'`.
- **Layout**:
  - Header: `Standard Career` with badge indicator.
  - Grid metrics:
    - **Games Played**: `complete + partial + collapses`
    - **Clear Rate**: `Math.round((totalVictories / totalGames) * 100)%`
    - **Victories**: `complete + partial` (`${complete} Complete / ${partial} Partial`)
    - **Collapses**: `collapses`
    - **Win Streak**: `${currentStreak} 🔥 (Best: ${bestStreak})`
- **Rationale**: Uses existing tailwind classes and aligns visually with the Active Campaign section in Cursed Tomb mode.

### Decision 2: Standard Solitaire Summary Panel in `MatchedCardsModal`
- **Approach**: In `MatchedCardsModal.tsx`, render a Standard Solitaire Career Metrics summary panel above the 4×13 deck status matrix when `mode === 'standard'` and `stats` is provided.
- **Layout**: Similar to Expedition Metrics, render a 5-card grid displaying Games Played, Clear Rate %, Complete Victories, Collapses, and Current/Best Streaks.

### Decision 3: Standard Solitaire Round Summary Modal Section
- **Approach**: In `RoundSummaryModal.tsx`, update the header and body to show standard solitaire round results and career streak updates when `mode === 'standard'`.

## Risks / Trade-offs

- **[Risk]**: Initial load on fresh installs where `totalGames === 0`.
  - **Mitigation**: Handle `totalGames === 0` gracefully by displaying `0 Games Played`, `0% Clear Rate`, and `0` for streaks.

- **[Risk]**: Prop threading in `MatchedCardsModal`.
  - **Mitigation**: Ensure `stats` prop (`StoredStats`) is passed to `MatchedCardsModal` in `App.tsx`.
