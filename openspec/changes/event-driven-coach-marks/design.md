## Context

See `proposal.md` for background and motivation. *The Cursed Tomb* currently manages state via React hooks, `GameState`/`CampaignState` objects, and `StoredSettings` in `src/storage/persistence.ts`.

## Goals / Non-Goals

**Goals:**
- Implement a reusable, event-driven `CoachMarkBanner` component rendered at the viewport bottom.
- Add element spotlighting via fixed overlay backdrop + CSS pulse glow around target selectors/elements.
- Intercept and pause card interactions when a coach mark is active.
- Extend `StoredSettings` with `enableCoachMarks` and `seenCoachMarkIds`.
- Add a toggle setting to `RulesModal` and the bottom banner ("Don't show hints again").

**Non-Goals:**
- Move recommendations or AI solver hints.
- Full interactive step-by-step forced scenario tutorials.
- Modifying core PyramidSolitaire win/loss logic.

## Decisions

### 1. Dedicated CoachMark Context / State Machine vs Inline State
- **Decision**: Manage active coach mark state within a dedicated custom hook (`useCoachMarks`) integrated into `App.tsx` layout level.
- **Rationale**: Isolates hint evaluation from `game.ts` pure rule engine. React checks game state mutations (e.g. initial round ready, card with attrition rendered) and determines if a coach mark should pause gameplay.
- **Alternatives Considered**: Putting UI overlay logic directly into `game.ts` (rejected: violates separation of pure game engine and React view).

### 2. Element Highlighting Mechanism
- **Decision**: Use a dimming backdrop overlay (`fixed inset-0 bg-black/50 z-40`) combined with `data-coachmark` DOM attributes on target elements (e.g., `data-coachmark="pyramid-cards"`, `data-coachmark="attrition-card"`, `data-coachmark="draw-zone"`, `data-coachmark="vault-zone"`). When an active coach mark matches an element target, apply a glowing CSS class (`ring-4 ring-amber-400 ring-offset-2 ring-offset-black animate-pulse z-50 relative`).
- **Rationale**: Clean, CSS-driven highlight requiring minimal DOM refactoring and excellent performance on desktop & mobile.

### 3. Gameplay Pause Implementation
- **Decision**: Pass `isPausedByCoachMark` prop to `PyramidBoard`, `DrawZone`, `GameSidebar`, and card click handlers, blocking selection events when true.
- **Rationale**: Prevents accidental moves while reading hints.

## Risks / Trade-offs

- **[Risk] Mobile Viewport Blocking**: Bottom banner might overlap UI elements on small screens.
  - *Mitigation*: Ensure banner uses compact styling with high z-index and appropriate padding bottom to prevent clipping.
- **[Risk] Stale DOM Selectors**: Dynamic board re-renders losing highlighted DOM reference.
  - *Mitigation*: Attribute-driven matching (`data-coachmark`) ensures live re-renders immediately maintain highlight classes.
