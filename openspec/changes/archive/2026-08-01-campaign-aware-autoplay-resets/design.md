## Context

In standard Pyramid Solitaire, games start with a clean 52-card deck. In Cursed Tomb Campaign Mode, cards accumulate permanent ink markings (Attrition Scars, Anchor Badges, Blessed Hero status) stored in `CampaignState.masterDeck`.

Currently, `App.tsx` defines a generic `handleStart()` callback that initializes games via `startGame(selectedRedraw, selectedMode)`. Because `startGame` calls `initializeGame` without `masterDeck` or `graveyard`, any invocation of `handleStart()` drops campaign state and deals a fresh standard deck.

When the Debug Panel's Autoplay controller (`useAutoplay.ts`) starts a new round or completes/collapses a round, it triggers `onStartNewGame()` (bound to `handleStart()`), causing all active card markings on the board to disappear. Additionally, when solver moves clear a Spades or Hearts Hero card, `handleHeroBlessings` activates `interactionMode = 'targeting-spades'` or `'targeting-hearts'`, which the solver engines (`solver.ts`) cannot handle, leading to premature round resignations and unwanted board resets.

## Goals / Non-Goals

**Goals:**
- Preserve campaign deck mutations (`attritionStage`, `rewardStage`, `blessed`) whenever game resets or auto-starts are executed while a campaign is active.
- Enable solver functions (`findNextGreedyMove`, `findNextSmartMove`, `findNextPerfectMove`) to automatically resolve hero power targeting modes (`targeting-spades` and `targeting-hearts`) without stalling or resigning.
- Ensure smooth continuous autoplay progression during campaign play without silently wiping out campaign state.

**Non-Goals:**
- Modifying the underlying campaign lifecycle rules or end-of-week attrition calculations.
- Altering visual card rendering styles for ink markings in `PlayingCard.tsx`.

## Decisions

### Decision 1: Campaign-Aware Game Initialization in `App.tsx`
Update `handleStart` in `App.tsx` to inspect `campaign`:
- If `campaign` is present and active, initialize the round using `initializeGame(selectedRedraw, selectedMode, campaign.masterDeck, campaign.graveyard)`.
- If `campaign` is `null`, initialize using standard `startGame(selectedRedraw, selectedMode)`.

*Alternatives Considered*:
- *Passing campaign deck directly into `useAutoplay`*: Rejected because `App.tsx` is the central owner of state persistence and campaign lifecycle management.

### Decision 2: Solver Hero Power Target Resolution in `solver.ts`
Extend solver engines (`findNextGreedyMove`, `findNextSmartMove`, `findNextPerfectMove`, `getLegalNextStates`) to check for `interactionMode`:
- If `interactionMode === 'targeting-spades'`: Automatically select the first eligible face-down card in the pyramid to reveal.
- If `interactionMode === 'targeting-hearts'`: Automatically select an exposed card in the pyramid to grant temporary immunity.
- Both actions update state via `playCard(state, targetCardId)` which resets `interactionMode` to `normal`.

*Alternatives Considered*:
- *Bypassing hero power targeting during solver execution*: Rejected because hero power targeting is a required game rule in Cursed Tomb mode.

## Risks / Trade-offs

- **[Risk]** Unintended campaign state overwrite if a user wants to start a fresh non-campaign deal while a campaign is active.  
  → **Mitigation**: Standard game resets within active campaigns continue the campaign round using the current master deck; starting a completely new campaign or changing modes explicitly resets the campaign via `handleStartCampaign`.
