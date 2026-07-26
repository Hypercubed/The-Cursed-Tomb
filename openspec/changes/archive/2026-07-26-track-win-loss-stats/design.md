## Context

Currently, *The Cursed Tomb* stores individual game state and player preferences in local storage, but does not track game outcome history across games. Players have no visibility into how many games they have won or lost, their win rate percentage, or their current win streak.

In addition, clicking the **Reset** button immediately wipes the board state without confirmation. Under the new behavior, **Reset** will be the master reset action for both the active board and all accumulated win/loss statistics, protected by a modal confirmation dialog to prevent accidental data loss.

## Goals / Non-Goals

**Goals:**
- Maintain persistent win/loss statistics (`wins`, `losses`, `currentStreak`, `bestStreak`) in `localStorage` under `cursed_tomb_stats`.
- Automatically update statistics when a game concludes in a `'won'` or `'lost'` state (avoiding duplicate increments for the same game session).
- Render cumulative stats (Wins, Losses, Win Rate %, Current Streak) clearly in the sidebar Status panel.
- Intercept **Reset** button clicks with an "Are you sure?" confirmation dialog.
- Confirming **Reset** wipes both active game board state and all accumulated stats.

**Non-Goals:**
- Detailed per-game breakdown log or history timeline.
- Server-side stats sync or user accounts.
- Separate "Reset Board" vs "Reset Stats" buttons (the unified Reset button resets both, protected by the confirmation dialog).

## Decisions

### 1. Stats Persistence Schema
*Decision:* Add `StoredStats` interface and `cursed_tomb_stats` key to `src/storage/persistence.ts`.

```typescript
export interface StoredStats {
  version: 1;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
}
```

*Rationale:* Keeping stats in a separate key (`cursed_tomb_stats`) decoupled from `cursed_tomb_game_state` ensures stats remain intact even if active game state is cleared on game start or completion.

### 2. Result Recording Guard
*Decision:* Track whether the current game session's result has already been recorded (e.g. `hasRecordedResult` boolean ref or state flag in `App.tsx`) to prevent multiple state re-renders or status re-evaluations from double-counting a single win or loss.

*Alternatives Considered:*
- *Relying solely on `useEffect([game.status])`:* Risk of duplicate calls if state updates occur while `game.status` remains `'won'` or `'lost'`.
- *Guard flag in `App.tsx` state:* Setting `recordedGameId` or `hasRecordedResult` ensures each unique game session is counted exactly once when moving to `'won'` or `'lost'`.

### 3. Reset Confirmation Modal
*Decision:* Create a reusable modal `ResetConfirmationModal.tsx` styled consistently with the ancient tomb aesthetic (`bg-[#18130e] border-[#3d3124]` with amber accents).

*Rationale:* A custom theme-aligned dialog maintains visual immersion compared to generic browser `window.confirm()`.

## Risks / Trade-offs

- [Accidental stat resets] → Mitigated by requiring explicit confirmation in `ResetConfirmationModal`.
- [Abandoning mid-game without resigning] → If a player clicks "Start game" during an active game without resigning, it can either be counted as a loss or ignored. Decision: starting a new game while in-progress counts as a loss to preserve win-rate integrity.
