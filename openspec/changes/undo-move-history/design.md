## Context

The Pyramid Solitaire game engine operates on pure functional state transformations (`playCard`, `drawCard`, `cyclePile`). Currently, state modifications overwrite the active state without preserving previous snapshots, giving players no way to undo accidental or tactical mistakes.

## Goals / Non-Goals

**Goals:**
- Add an `undo(state)` reducer function to revert to the previous board snapshot.
- Store a snapshot stack (`history`) inside `GameState` without recursive snapshot overhead.
- Render an Undo button in the game sidebar/controls toolbar and bind `Ctrl+Z` / `U` keyboard shortcuts.
- Persist `history` in `LocalStorage` alongside active game state.

**Non-Goals:**
- Redo capability (forward step history).
- Infinite undo limit constraints (we preserve full history for the active round).

## Decisions

### 1. Snapshot Stack (`history: GameState[]`) vs Action Replay
- **Decision**: Store snapshots of prior `GameState` objects in an array.
- **Rationale**: Since `GameState` is small and lightweight, snapshot-based undo is immediate ($O(1)$ stack pop), 100% deterministic, and eliminates complex action replaying logic across seed/randomness boundaries.
- **Implementation Detail**: Snapshots pushed into `history` will have their own `history` property pruned to empty `[]` to prevent memory multiplication.

### 2. UI & Keyboard Bindings
- **Decision**: Provide both a visual Undo button in `GameSidebar` and global keyboard listeners (`Ctrl+Z`, `Cmd+Z`, and `u` / `U`).
- **Rationale**: Meets expectations for both desktop power users and touch/mouse players.

## Risks / Trade-offs

- **[Risk]**: `LocalStorage` payload size growing large with long move histories.
- **Mitigation**: A full game history contains at most ~40 moves, which serializes to < 50KB JSON—well within `LocalStorage`'s 5MB quota.

## Open Questions

None. The pure function reducer architecture makes implementation straightforward.
