## Context

Previously, *The Cursed Tomb* treated campaigns as goal-oriented races to a victory screen (Perfect Win, Rank-Anchor Win) or instant failure on Volatile Collapse. Empirical deck solvability analysis revealed that campaigns on standard and novice difficulties naturally transition into an endless deck-evolution mode where players accumulate Anchors and Blessings, surviving for dozens or hundreds of rounds.

We are refactoring the campaign model across rules, web app frontend components, and Python simulation scripts so that Starvation (< 28 active cards) is the sole physical defeat condition, while Perfect Wins and Rank-Anchor achievements trigger accomplishments & rewards while allowing the campaign to continue indefinitely.

## Goals / Non-Goals

**Goals:**
- Update `src/game.ts` campaign state & lifecycle to continue campaigns past Perfect Wins and Rank-Anchor accomplishments.
- Establish `starvation` (< 28 cards) as the sole hard defeat condition in `src/game.ts` and `sim/cursed_tomb_sim.py`.
- Add an Achievement & Run Metrics tracking system in `src/game.ts` and update `RoundSummaryModal.tsx` / `CampaignEndModal.tsx` to display accomplishments, deck health %, and advisory volatility warnings.
- Update python campaign simulation scripts (`cursed_tomb_sim.py`, `sweep_thresholds.py`) to reflect endless survival metrics.

**Non-Goals:**
- Altering core Pyramid solitaire matching logic or card functional value calculations.
- Modifying backend server logic (app is client-side).

## Decisions

### Decision 1: Refactoring Campaign Termination & Accomplishments
- **Problem**: Previously, `checkCampaignEnd()` in `src/game.ts` triggered game-over modals on Perfect Win, Rank-Anchor Win, or Volatile Collapse.
- **Decision**: Update `checkCampaignEnd()`:
  - If active card count < 28: trigger `CampaignEndModal` with `defeatReason = 'starvation'`.
  - If Volatile Collapse occurs (4 of a rank entombed): set `volatilityWarning = true` in state and render an advisory HUD banner, but do NOT end the campaign.
  - If Perfect Win or Rank-Anchor accomplishment occurs: set achievement flags/counters in `state.campaign.achievements`, display accomplishment toast/modal, and allow "Next Round".

### Decision 2: Digital Achievement Metrics Structure
Define `CampaignAchievements` in `src/game.ts`:
```typescript
interface CampaignAchievements {
  roundsSurvived: number;
  pyramidsCleared: number;
  perfectWins: number;
  rankAnchorUnlocked: boolean;
  unlockedBadges: string[];
}
```

### Decision 3: Simulation Alignment
In `sim/cursed_tomb_sim.py`:
- Update `run_campaign()` to count total rounds played until starvation (< 28 cards) or optional max-round cap.
- Track `pyramids_cleared`, `perfect_wins`, and `rank_anchor_unlocked_round` in simulation output.

## Risks / Trade-offs

- **[Risk] Existing saved campaign state backward compatibility** → *Mitigation*: Fall back to default empty achievements object if loading an older saved campaign state without `achievements`.
- **[Risk] High round counts causing heavy deck degradation UI clutter** → *Mitigation*: Aggregate active vs entombed vs anchored cards cleanly in Deck Codex and Summary modals.

## Migration Plan

1. Update TypeScript interfaces & game logic in `src/game.ts`.
2. Update UI components (`RoundSummaryModal.tsx`, `CampaignEndModal.tsx`, `DeckCodexModal.tsx`).
3. Update Python simulation runner in `sim/cursed_tomb_sim.py` and `sim/sweep_thresholds.py`.
4. Run unit test suite (`npm test`).
