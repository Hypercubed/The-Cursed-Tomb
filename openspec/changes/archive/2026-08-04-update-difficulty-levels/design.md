## Context

The game currently defines four difficulty levels via the `DIFFICULTY_OPTIONS` array in `CampaignSetupModal.tsx` and a parallel `redrawOptions` list in `GameSidebar.tsx`. The Novice level uses `null` to signal infinite redeals to the game engine; Explorer uses the integer `2`. The game engine's loss-detection codepath has a separate branch for `null` (infinite) vs. finite redraws.

The change replaces the "unlimited" semantic of Novice with a finite ceiling of `5` redeals, and raises Explorer from `2` to `3`.

## Goals / Non-Goals

**Goals:**
- Update the `value` fields for Novice (`null → 5`) and Explorer (`2 → 3`) in `DIFFICULTY_OPTIONS`
- Update all display text (`redealsText`, `description`, sidebar labels) to match new numbers
- Update `getDifficultyLabel` in `GameSidebar.tsx` to recognize the new values
- Update `docs/rules.md` Section 3 to match the new redeal counts
- Note win-rate stats as stale pending re-simulation

**Non-Goals:**
- Changing the game engine's redraw/cycling logic (it already handles any finite integer correctly)
- Re-running simulations (tracked separately as a follow-up task)
- Changing Archaeologist (1) or Survivalist (0)

## Decisions

### Novice uses finite `5` instead of `null`

**Decision**: Change Novice `value` from `null` to `5`.

**Rationale**: The game engine already handles finite integers correctly via `cyclePile`; `null` was special-cased for "unlimited." Moving to `5` eliminates the infinite-redraw branch for Novice, making its loss detection identical to other finite difficulties. `5` is generous enough (6 total passes through the deck) to serve as a tutorial mode while still being a bounded game.

**Alternative considered**: Keep `null` and only update UI text to say "5 Redeals." Rejected — this would be a lie; the underlying behavior would remain unlimited, causing a mismatch between displayed difficulty and actual gameplay.

### Single source of truth for difficulty options

**Decision**: `DIFFICULTY_OPTIONS` in `CampaignSetupModal.tsx` remains the authoritative definition. `GameSidebar.tsx`'s `redrawOptions` and `getDifficultyLabel` are updated to match.

**Rationale**: The options are duplicated today; aligning both files in one change avoids divergence. A future refactor could centralize to a shared module, but that is out of scope here.

## Risks / Trade-offs

- **Stale win-rate stats** → The `winRate`, `standardWinRate`, and `campaignWinRate` fields in `DIFFICULTY_OPTIONS` were computed for the old values. They will be inaccurate after this change. Mitigation: mark them as placeholder values in a comment and track re-simulation as a follow-up task.
- **Saved game state** → Any in-progress campaign saved with Novice (`null`) will have `redrawsRemaining: null` in localStorage. After the change, the app will still display "Novice (Sandbox)" for `null` via the fallback in `getDifficultyLabel`. Active saves are unaffected; only new campaigns pick up the new `5` value. No migration is required.
