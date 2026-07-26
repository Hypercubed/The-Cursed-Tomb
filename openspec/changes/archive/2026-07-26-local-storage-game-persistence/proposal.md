## Why

Players currently lose their game state, win condition configuration, and redraw settings whenever the page is refreshed or accidentally closed. Persisting both settings and active game state in browser storage ensures seamless game resumption while maintaining full functionality via graceful in-memory fallbacks when local storage is unavailable or corrupted.

## What Changes

- Introduce a game persistence service layer (`PersistenceManager`) with schema versioning (`version: 1`), safe parsing, and fallback handling.
- Automatically save and resume active game state (`in-progress`, `won`, or `lost`) across page reloads.
- Automatically persist user preferences (redraw cycles & win condition selection).
- Disable game setup options (win condition, redraw cycles) in `GameSidebar` while a game is actively `in-progress`.
- Gracefully fall back to in-memory state management when `localStorage` is unavailable, restricted, or full.

## Capabilities

### New Capabilities

- `game-persistence`: Defines requirements for local storage saving, restoring, schema validation, graceful fallbacks, and settings locking during active gameplay.

### Modified Capabilities

(None - existing game rules and rendering specs remain intact.)

## Impact

- **Affected Code**: `src/App.tsx`, `src/components/GameSidebar.tsx`, new persistence utility modules (`src/storage/`).
- **Dependencies**: No external npm packages required (uses native Web Storage API / in-memory adapter).
- **APIs**: Standard browser `localStorage` with fallback handling.
