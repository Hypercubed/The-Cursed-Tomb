## Why

Players currently have no visibility into their performance over time across multiple games of *The Cursed Tomb*. Tracking wins, losses, win rate percentage, and game streaks provides engaging progression feedback and replay motivation. Furthermore, reset functionality needs to reliably reset lifetime stats, protected by a confirmation dialog so players do not accidentally erase their hard-earned statistics.

## What Changes

- Track accumulated wins, losses, and current win streak across game sessions.
- Persist game statistics in local storage alongside existing game settings and state.
- Display win/loss counts and win rate percentage in the game sidebar status panel.
- Update the **Reset** button behavior to open a confirmation dialog ("Are you sure you want to reset all game progress and stats?").
- Confirming the reset clears the active game state and resets all accumulated win/loss statistics to zero.

## Capabilities

### New Capabilities
- `win-loss-stats`: Track cumulative wins, losses, win rate %, and win streak, persisting stats across sessions and offering a confirmed reset flow.

### Modified Capabilities
- `game-persistence`: Extend storage schemas to support persisting and resetting win/loss stats structure.
- `game-layout`: Update the sidebar status section to display win/loss statistics and integrate a confirmation dialog when triggering Reset.

## Impact

- **Frontend Components**: `GameSidebar.tsx`, `App.tsx`, and a new or integrated confirmation modal component (`ResetConfirmationModal.tsx` or similar).
- **Storage / Persistence**: `src/storage/persistence.ts` updated with `StoredStats` interface and methods (`getStats`, `saveStats`, `recordWin`, `recordLoss`, `resetStats`).
- **Game Engine / Hooks**: `App.tsx` state management for stats updates on win/loss events.
