## Why

During Pyramid Solitaire development and testing, stepping back and forward through moves is essential for evaluating game mechanics, solver paths, and edge cases. Scoping Undo and Redo functionality to the Debug Panel provides developer time-travel debugging without changing the main player-facing interface or balance.

## What Changes

- Add move history tracking (`history: GameState[]`) and redo tracking (`future: GameState[]`) to `GameState`.
- Expose pure `undo(state)` and `redo(state)` reducer functions in `src/game.ts`.
- Add **Undo** and **Redo** action buttons to `DebugPanel.tsx` in a dedicated Debug Time-Travel section.
- Clear `history` and `future` when starting a new game or when making a new move (clearing the redo stack on new branch).
- Update persistence layer if needed to handle `history` / `future` properties smoothly.

## Capabilities

### New Capabilities
- `undo-move-history`: Reversible move history and time-travel controls (Undo and Redo) scoped to the Debug Panel.

### Modified Capabilities
- `pyramid-solitaire-game`: Game state actions push snapshots to `history` and reset `future` to support debug step-back and step-forward.

## Impact

- **Core Game Engine (`src/game.ts`)**: Addition of `history` and `future` snapshot stacks in `GameState`, plus `undo(state)` and `redo(state)` reducer exports.
- **Debug UI (`src/components/DebugPanel.tsx`)**: Render Undo and Redo debug action buttons with disabled states based on history/future availability.
- **App Integration (`src/App.tsx`)**: Wire Undo and Redo callbacks into `DebugPanel`.
