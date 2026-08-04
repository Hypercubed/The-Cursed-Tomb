## Context

In standard Pyramid Solitaire, drawing from the stock exposes the top stock card *before* it touches the waste pile. The exposed stock card can be paired with an exposed pyramid card or the top card of the waste pile. If no match is made (or if the player chooses to hold it), the card is discarded onto the waste pile.

In our current codebase (`src/game.ts` and `sim/`), drawing automatically pushes the top stock card directly into the waste pile (`discardPile`), burying the previous top waste card and preventing stock-to-waste and stock-to-pyramid in-flight pairing.

## Goals / Non-Goals

**Goals:**
- Expose the top card of `drawPile` as an active, selectable card for pairing with exposed pyramid cards or `discardPile[0]`.
- Provide a dedicated `[ Pass to Waste ]` action button and hotkey (`Space`/`D`) to discard the top stock card to the waste pile.
- Update `src/solver.ts` and Python simulation solvers (`sim/cursed_tomb_sim.py`, `sim/base_game_sim.py`, `sim/solvers/*`) so autoplay and heuristics evaluate in-flight stock matches.
- Update rules documentation in `docs/rules.md`.

**Non-Goals:**
- Changing overall card counting or redeal limit rules.
- Modifying how cards behave once inside the waste pile (`discardPile`).

## Decisions

### Decision 1: Exposed Top Stock Card Visibility & Selection
- **Rationale**: `cardIsVisible` in `src/game.ts` currently restricts `drawPile` visibility to `canRemoveSingle` (solo Kings). We will update `cardIsVisible` so that `drawPile[0]` is always visible and selectable when `drawPile` is non-empty.
- **Alternatives Considered**: Creating a third explicit array zone in `GameState` (e.g., `inFlightCard: Card | null`). We rejected this because using `drawPile[0]` directly avoids schema migration overhead and preserves backward compatibility with save states in `storage/persistence.ts`.

### Decision 2: Dedicated "Pass to Waste" Control Action
- **Rationale**: Combining "pair with waste" and "move to waste" into a single click target creates ambiguity if math is miscalculated. A dedicated `[ Pass to Waste ]` button (and `Space`/`D` shortcut) makes discarding unambiguous.
- **Alternatives Considered**: Double-clicking Stock or clicking Waste pile to discard. Rejected due to misclick risks during rapid gameplay.

### Decision 3: Solver & Simulation Synchronization
- **Rationale**: If solver/simulation engines do not mirror web engine rules, autoplay moves will fail or miss high-value legal moves, breaking simulation benchmark comparisons.
- **Implementation**:
  - In `src/solver.ts`, update `findNextGreedyMove` and `getLegalNextStates` to evaluate pairings involving `drawPile[0]` prior to advancing the stock.
  - In `sim/cursed_tomb_sim.py`, expand `get_legal_moves()` to generate `Move('ps', ...)` (Pyramid + Stock) and `Move('sw', ...)` (Stock + Waste) moves.

## Risks / Trade-offs

- **[Risk] State Persistence Compatibility**: Existing saved games in `localStorage` contain `drawPile` arrays.
  - *Mitigation*: Keeping `drawPile[0]` inside `drawPile` guarantees existing save files parse without schema migration errors.
- **[Risk] Keyboard Shortcut Collision**: `D` / `Space` currently triggers `drawCard`.
  - *Mitigation*: Re-bind `D` / `Space` to `discardStockCard` (Pass to Waste), keeping keyboard controls fluid.

## Migration Plan

1. Update `src/game.ts` functions (`cardIsVisible`, `canAnyMove`, `discardStockCard`).
2. Update UI rendering in `src/components/DrawZone.tsx` and `App.tsx`.
3. Update `src/solver.ts` autoplay and solver logic.
4. Update `sim/cursed_tomb_sim.py`, `sim/base_game_sim.py`, and `sim/solvers/`.
5. Update `docs/rules.md`.
6. Run unit tests (`npm test`) and simulation sanity checks.
