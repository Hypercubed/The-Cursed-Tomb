## Context

The Pyramid Solitaire game engine uses pure functional state transitions (`playCard`, `drawCard`, `cyclePile`). To support developer testing and solver verification, we are introducing state history snapshots and Undo/Redo capabilities scoped exclusively to the `DebugPanel`.

## Goals / Non-Goals

**Goals:**
- Implement pure `undo(state)` and `redo(state)` reducer functions in `src/game.ts`.
- Store `history: GameState[]` and `future: GameState[]` arrays inside `GameState`.
- Render Undo and Redo trigger buttons in `DebugPanel.tsx`.
- Automatically prune nested history/future arrays from saved snapshots to keep memory usage minimal.
- Clear `future` stack whenever a new player action is taken.

**Non-Goals:**
- Exposing Undo/Redo in the main player interface (e.g. `GameSidebar.tsx` or `GameShell.tsx`).
- Listening to global keyboard shortcuts (`Ctrl+Z` / `Cmd+Z` / `U`).
- Custom move diffing/replaying engine (full state snapshots are fast and deterministic).

## Decisions

### 1. Snapshot Stacks (`history` & `future`)
- **Decision**: Save complete `GameState` snapshots into `history` on state-modifying actions. Save undone states into `future` when `undo` is called.
- **Rationale**: Direct snapshot assignment gives instant $O(1)$ state restoration, guarantees exact state reconstruction across random seed or solver evaluation, and requires zero complex diffing logic.
- **Implementation Detail**: Before pushing a state to `history` or `future`, strip its `history` and `future` fields (`...snapshot, history: [], future: []`) to avoid exponential memory growth.

### 2. Debug Panel UI Integration
- **Decision**: Place Undo (`↩ Undo`) and Redo (`↪ Redo`) buttons inside `DebugPanel.tsx` in a dedicated "Time Travel / History" section.
- **Rationale**: Keeps player-facing HUD clean while empowering developers and QA to step backward and forward through game moves during testing.

### 3. Redo Stack Clearing on New Move
- **Decision**: Taking any new state-modifying action (`playCard`, `drawCard`, `cyclePile`) resets `future` to `[]`.
- **Rationale**: Standard time-travel mechanics invalidate alternative future timelines once a new move is made.

## Risks / Trade-offs

- **[Risk]**: Object allocation during long game sessions.
- **Mitigation**: History size is bounded by round move counts (~40 moves max). Pruning `history`/`future` on snapshots keeps total memory overhead under 100KB per session.
