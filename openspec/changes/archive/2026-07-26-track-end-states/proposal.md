## Why

Currently, players must configure a "Win condition" (Pyramid-only vs Complete victory) in the setup sidebar before starting a game. This forces an upfront choice and limits outcome tracking to a binary won/lost state. 

Replacing this pre-game choice with 3 distinct end states (Complete Victory, Partial Victory, Pyramid Collapse) simplifies game setup while providing more granular feedback and stats based on how far the player cleared the tomb. Per Option A, games immediately conclude with Partial Victory as soon as the pyramid is cleared if cards remain in the deck/discard pile.

## What Changes

- **Setup Simplification**: Remove the "Win condition" selector from the setup sidebar. Every game now operates under unified Pyramid Solitaire rules.
- **End State System**: Replace binary `won` | `lost` status with explicit end states:
  - `complete-victory`: Both pyramid cards and draw deck / discard pile are completely cleared.
  - `partial-victory`: Pyramid is cleared, but cards remain in the draw deck or discard pile (game ends immediately upon pyramid clearance per Option A).
  - `pyramid-collapse`: No valid moves remain while pyramid cards are still on the board (loss/resignation).
- **Stat Tracking Updates**: Track Complete Victories, Partial Victories, and Pyramid Collapses separately in stats, while maintaining win streak logic for any victory (complete or partial).
- **Persistence Migration**: Remove `selectedWinCondition` from stored settings and update stored statistics schema to track separate outcome counters.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `pyramid-solitaire-game`: Update status transitions to replace binary won/lost with `complete-victory`, `partial-victory`, and `pyramid-collapse`, removing `winCondition` configuration.
- `win-loss-stats`: Track complete victories, partial victories, and pyramid collapses as distinct outcome counters while preserving streak mechanics.
- `game-persistence`: Remove `selectedWinCondition` from saved settings and expand `StoredStats` schema for the new end states.

## Impact

- `src/game.ts`: Remove `WinCondition` type; update `GameState.status` enum (`'ready' | 'in-progress' | 'complete-victory' | 'partial-victory' | 'pyramid-collapse'`); refactor `checkForWin` logic.
- `src/components/GameSidebar.tsx`: Remove Win Condition select dropdown; update statistics UI display to show Complete Victories, Partial Victories, and Pyramid Collapses.
- `src/storage/persistence.ts`: Remove `selectedWinCondition` from `StoredSettings`; update `StoredStats` interface and default values.
- `src/App.tsx`: Remove win condition state passing and update status badge rendering.
