## Context

Currently, all game state and setup preferences in *The Cursed Tomb* are stored in React component state (`App.tsx`), which resets on page reload. Players lose mid-game progress or configured game rules if they refresh the browser.

## Goals / Non-Goals

**Goals:**
- Provide reliable Web Storage persistence for settings and active game state.
- Automatically resume active in-progress games and display completed game states on page reloads.
- Provide a robust storage abstraction with in-memory fallback for environments where local storage is blocked or quota-exceeded.
- Disable setup settings in `GameSidebar` during `in-progress` games to prevent rule mutations mid-play.

**Non-Goals:**
- Multi-slot save/load files (only single active game state is required).
- Server/cloud sync or user authentication.

## Decisions

### 1. Storage Partitioning
- Key 1: `cursed_tomb_settings` -> Stores `selectedWinCondition` and `selectedRedraw`.
- Key 2: `cursed_tomb_game_state` -> Stores full `GameState` snapshot (`deck`, `pyramid`, `drawPile`, `discardPile`, `selectedCardId`, `redrawsRemaining`, `winCondition`, `status`).

*Rationale:* Separating settings from game state ensures that clearing or corrupting an active game state does not reset user preferences.

### 2. Adapter Pattern (`StorageAdapter`)
Define a unified `StorageAdapter` interface:
```ts
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```
`LocalStorageAdapter` wraps `window.localStorage` inside `try/catch` blocks. If initialization or writes fail, `PersistenceManager` dynamically falls back to an `InMemoryAdapter`.

### 3. Schema Versioning & Sanitization
All stored objects include a `version: 1` property. When reading stored state:
1. Parse JSON inside a `try/catch`.
2. Check schema `version`.
3. Validate required structural fields (e.g. array types, valid suit/rank values).
4. If validation fails, safely log a warning and fall back to defaults.

### 4. UI Settings Control Locking
Update `GameSidebar.tsx` select elements for redraw cycle and win condition with `disabled={gameStatus === 'in-progress'}`.

## Risks / Trade-offs

- **[Risk] State corruption due to stale application code updates** → **Mitigation**: Schema versioning (`version: 1`) and structural validation check state integrity before restoring.
- **[Risk] Private Browsing / Restricted Storage Error** → **Mitigation**: `LocalStorageAdapter` tests write availability on startup and falls back to `InMemoryAdapter`.
- **[Risk] Quota Exceeded Exception** → **Mitigation**: All `setItem` operations are wrapped in `try/catch` to log errors silently without crashing UI interactions.
