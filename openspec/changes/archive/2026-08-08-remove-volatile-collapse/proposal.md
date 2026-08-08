## Why

Volatile Collapse — the instant defeat triggered when all 4 cards of a single printed rank are entombed — is dead weight. It is not exposed in the digital game's UI (the toggle was wired but never rendered), disabled by default in all simulators, and produces a 0.0% occurrence rate even when explicitly enabled across 4,000 simulated campaigns. The `volatilityWarning` advisory banner, which fires whenever the condition is detected regardless of whether the defeat variant is active, is also tied to this mechanic and should be removed with it. Both features add code complexity and spec surface area with no player-facing value.

## What Changes

- Remove the `volatileCollapse` boolean field from `CampaignState` and all campaign creation / lifecycle functions in `src/game.ts`
- Remove the `volatile-collapse` branch from the `defeatReason` type union and the `CampaignEndModal` defeat message
- Remove `volatilityWarning` from `CampaignState`, its computation in `createCampaign()` and `applyEndOfWeekLifecycle()`, and the advisory banner in `RoundSummaryModal`
- Remove all dead `volatileCollapse` state, handler, and props from `App.tsx` and `CampaignSetupModal`
- Remove the two volatile-collapse test cases from `src/game.test.ts`
- Remove the `--volatile-collapse` CLI flag and `volatile_collapse` field from `RuleFlags` in `sim/cursed_tomb_sim.py`, `sim/sweep_thresholds.py`, `sim/campaign_rounds_sim.py`, and `sim/three_outcomes_analysis.py`
- Update `sim/RESULTS.md` to remove the Volatile Collapse column from Part 3/4 tables and regenerate if needed
- Update the main specs and delta specs that reference this mechanic

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `cursed-tomb-campaign`: Remove the Volatile Collapse variant defeat condition and the volatilityWarning advisory state; starvation remains the sole mandatory defeat condition
- `deck-evolution-analysis`: Remove the `collapse_volatile` suppression scenario; the infinite runner only needs to suppress starvation and victory conditions

## Impact

- `src/game.ts`: `CampaignState` interface, `createCampaign()`, `applyEndOfWeekLifecycle()`
- `src/App.tsx`: state declaration, `handleStartCampaign`, props passed to `CampaignSetupModal`
- `src/components/CampaignSetupModal.tsx`: props interface, internal state, handler function (all dead code — no JSX currently renders the toggle)
- `src/components/CampaignEndModal.tsx`: `defeatReason` type union, defeat message branch
- `src/components/RoundSummaryModal.tsx`: `showVolatilityWarning` derived value, advisory banner JSX
- `src/game.test.ts`: two test cases targeting this mechanic
- `sim/cursed_tomb_sim.py`, `sim/sweep_thresholds.py`, `sim/campaign_rounds_sim.py`, `sim/three_outcomes_analysis.py`: `RuleFlags`, CLI flag, check logic
- `sim/RESULTS.md`: table columns referencing Volatile Collapse outcomes
- `openspec/specs/cursed-tomb-campaign/spec.md`: requirement and scenarios to be removed
- `openspec/specs/deck-evolution-analysis/spec.md`: scenario to be removed
