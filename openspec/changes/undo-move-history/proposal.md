## Why

During Pyramid Solitaire gameplay, misclicks or tactical mistakes can lead to instant game-over or suboptimal states with no way to recover. Adding an Undo and Move History feature provides a forgiving, tactical experience where players can revert recent actions (card pairings, draws, pile recycles) without starting over, while ensuring move history is cleanly tracked and persisted.

## What Changes

- Add a move history stack (`history: GameState[]`) to track reversible actions in the active game.
- Expose an `undo(state)` reducer function in `game.ts` that reverts the game to its previous state.
- Add an **Undo button** to the UI (in the Game Shell / Sidebar controls) enabled only when an undoable move exists.
- Add **Keyboard Shortcut** support (`Ctrl+Z` / `U`) to trigger Undo.
- Update game persistence to store and restore move history alongside active game state.
- Reset move history when starting a new game or resetting.

## Capabilities

### New Capabilities
- `undo-move-history`: Reversible move history and Undo action support for Pyramid Solitaire, including UI buttons and keyboard shortcuts.

### Modified Capabilities
- `pyramid-solitaire-game`: State updates will record previous state snapshots to support reverting moves and updating win/loss statuses dynamically.

## Impact

- **Core Game Engine (`src/game.ts`)**: Addition of history tracking in `GameState` and `undo(state)` export.
- **UI Components (`src/components/GameSidebar.tsx` / `GameShell.tsx` / `App.tsx`)**: Undo button rendering and keyboard event listener (`Ctrl+Z` / `U`).
- **Persistence (`src/storage/persistence.ts`)**: Serializing and deserializing history snapshots safely.
