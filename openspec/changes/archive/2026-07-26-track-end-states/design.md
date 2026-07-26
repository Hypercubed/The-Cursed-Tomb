## Context

Previously, `GameState` tracked a binary status (`'ready' | 'in-progress' | 'won' | 'lost'`) based on a pre-configured `winCondition` (`'pyramid-only' | 'complete-victory'`). Setup required choosing this condition before starting a game.

Under the new model, games no longer use a pre-selected `winCondition`. Every game evaluates end states dynamically as game actions occur, distinguishing between Complete Victory, Partial Victory, and Pyramid Collapse.

## Goals / Non-Goals

**Goals:**
- Simplify game setup by eliminating the `winCondition` dropdown.
- Update `GameState.status` type to `'ready' | 'in-progress' | 'complete-victory' | 'partial-victory' | 'pyramid-collapse'`.
- Implement Option A end-state evaluation logic in `checkForWin`:
  - When pyramid card count reaches 0:
    - If draw pile and discard pile are empty $\rightarrow$ `complete-victory`
    - Otherwise $\rightarrow$ `partial-victory` (ends game immediately upon pyramid clear).
  - When no valid moves remain and pyramid is non-empty $\rightarrow$ `pyramid-collapse`.
- Update statistics calculation and persistence to track `completeVictories`, `partialVictories`, and `pyramidCollapses`.
- Update Sidebar and Header UI elements to display the appropriate outcome names and badge colors.

**Non-Goals:**
- Post-pyramid-clear continuation mode (Option B is deferred).
- Changes to card matching math or solver logic outside of status checks.

## Decisions

### Decision 1: Game State Status Enum Definition
Replace `GameState.status` type `'ready' | 'in-progress' | 'won' | 'lost'` with:
```ts
export type GameStatus =
  | 'ready'
  | 'in-progress'
  | 'complete-victory'
  | 'partial-victory'
  | 'pyramid-collapse';
```
*Rationale:* Explicit string literals make status checks clear across `App.tsx`, `GameSidebar.tsx`, animations, and persistence without needing helper flags.

### Decision 2: Instant End State Check (Option A)
In `src/game.ts`:
```ts
export function checkForWin(state: GameState): GameStatus {
  const remainingPyramid = getRemainingPyramidCards(state).length;
  const hasPyramidCards = remainingPyramid > 0;

  if (!hasPyramidCards) {
    const discardEmpty = state.discardPile.length === 0;
    const drawEmpty = state.drawPile.length === 0;
    if (drawEmpty && discardEmpty) {
      return 'complete-victory';
    }
    return 'partial-victory';
  }

  const canMove = canAnyMove(state);
  if (!canMove && state.drawPile.length === 0 && state.redrawsRemaining === 0) {
    return 'pyramid-collapse';
  }

  if (state.redrawsRemaining === null && state.drawPile.length === 0) {
    const canMoveWithFullDiscard = canAnyMove(state, state.discardPile);
    if (!canMoveWithFullDiscard) {
      return 'pyramid-collapse';
    }
  }

  return 'in-progress';
}
```
*Rationale:* Cleanly enforces Option A rule. If the pyramid is empty, check deck state immediately. If non-empty pyramid has no moves left, trigger `pyramid-collapse`.

### Decision 3: Statistics Schema & Streak Logic
Update `StoredStats`:
```ts
export interface StoredStats {
  version: 1;
  completeVictories: number;
  partialVictories: number;
  pyramidCollapses: number;
  currentStreak: number;
  bestStreak: number;
}
```
Streak handling:
- Transitioning to `complete-victory` or `partial-victory` increments `currentStreak` by 1.
- Transitioning to `pyramid-collapse` (or resigning) resets `currentStreak` to 0.

### Decision 4: LocalStorage Backward Compatibility Migration
In `PersistenceManager`:
- When reading existing `cursed_tomb_stats`, if legacy fields `wins` and `losses` exist without `completeVictories`, map `wins` $\rightarrow$ `partialVictories` and `losses` $\rightarrow$ `pyramidCollapses`.
- Strip `selectedWinCondition` from settings when saving/loading.

## Risks / Trade-offs

- **[Risk]** Legacy saved game state in LocalStorage referencing old `winCondition` or `status: 'won' | 'lost'`.
  $\rightarrow$ **Mitigation:** In `getGameState()`, normalize legacy status string values (`'won'` $\rightarrow$ `'partial-victory'`, `'lost'` $\rightarrow$ `'pyramid-collapse'`) and safely delete `winCondition` if present.
