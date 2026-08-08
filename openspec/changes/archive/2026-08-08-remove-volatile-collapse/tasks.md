## 1. TypeScript Game Engine (`src/game.ts`)

- [x] 1.1 Remove `volatileCollapse: boolean` and `volatilityWarning?: boolean` from the `CampaignState` interface
- [x] 1.2 Remove the `volatileCollapse` parameter from `createCampaign()` and delete the volatile collapse check block (the loop that sets `volatilityWarning` and `defeatReason = 'volatile-collapse'`)
- [x] 1.3 Remove the volatile collapse check block from `applyEndOfWeekLifecycle()` (the loop that reads `campaign.volatileCollapse` and sets `volatilityWarning`)
- [x] 1.4 Narrow the `defeatReason` type union from `'starvation' | 'volatile-collapse'` to `'starvation'` only

## 2. React UI Components

- [x] 2.1 Remove the `volatileCollapse`, `onToggleVolatileCollapse` props from `CampaignSetupModal` props interface; remove `internalVolatile` state, `handleVolatileChange` handler, and the `volatile` derived value; update `onStartCampaign` call to drop the third argument
- [x] 2.2 Remove `volatileCollapse` state, `setVolatileCollapse` handler, and the `volatileCollapse`/`onToggleVolatileCollapse` props passed to `CampaignSetupModal` in `App.tsx`; update `handleStartCampaign` to drop the `volatile` parameter
- [x] 2.3 Remove the `defeatReason === 'volatile-collapse'` branch and the dead `else` fallback from `CampaignEndModal`; narrow the `defeatReason` prop type to `'starvation'` only
- [x] 2.4 Remove `showVolatilityWarning` derived value and the advisory volatility warning banner JSX block from `RoundSummaryModal`

## 3. Tests (`src/game.test.ts`)

- [x] 3.1 Remove the test `'sets volatilityWarning advisory flag when 4 of a rank are entombed without triggering defeat if volatileCollapse is false'`
- [x] 3.2 Remove the test `'triggers Volatile Collapse defeat when 4 of a rank are entombed and volatileCollapse is enabled'`

## 4. Python Simulators

- [x] 4.1 Remove `volatile_collapse: bool` from `RuleFlags` in `sim/cursed_tomb_sim.py`; remove the `--volatile-collapse` CLI flag; remove the volatile collapse rank check in `run_campaign()`; update the printed settings summary
- [x] 4.2 Remove `volatile_collapse` from `BASE_FLAGS` in `sim/campaign_rounds_sim.py`
- [x] 4.3 Remove `volatile_collapse=False` from the `RuleFlags` instantiation in `sim/three_outcomes_analysis.py`
- [x] 4.4 Remove the `volatile_collapse` field from the `RuleFlags` usage in `sim/sweep_thresholds.py`; remove any mention of volatile collapse in comments or output

## 5. Documentation (`sim/RESULTS.md`)

- [x] 5.1 Remove the `Volatile Collapse` column from the Part 3 Table 1 outcomes table and update the surrounding prose to remove references to volatile collapse as a collapse type
- [x] 5.2 Remove the `Volatile Collapse` column from the Part 4 Table 2 end-type rates table; remove the note that "Volatile Collapse is enabled by default in this sweep"
- [x] 5.3 Update the reproducible command examples in the Part 3 and Part 4 headers to remove the `--volatile-collapse` flag
