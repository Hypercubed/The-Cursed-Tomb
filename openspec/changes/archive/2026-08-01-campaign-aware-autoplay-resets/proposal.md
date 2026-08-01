## Why

When playing in Campaign Mode (`cursed-tomb`), cards accumulate persistent hand-drawn markings across rounds (attrition scars, anchor badges, hero blessing rings). However, starting or auto-continuing autoplay in the Debug Panel calls the standard non-campaign `handleStart()` reset, which re-initializes the game using a generic 52-card deck and wipes all card markings from the playing field. Furthermore, when solver operations encounter special hero targeting modes (`targeting-spades` or `targeting-hearts`), the autoplay engine fails to resolve target selection, causing premature round collapses and unintended generic deck resets.

## What Changes

- **Campaign-Aware Autoplay Resets**: Update game restart handlers (`onStartNewGame` / `handleStart`) so that if an active campaign exists, resetting or starting a round preserves the campaign's `masterDeck` and `graveyard` instead of instantiating a clean non-campaign deck.
- **Autoplay Campaign Continuation**: Modify `useAutoplay` so that when a campaign round concludes or collapses, autoplay either cleanly pauses or advances via campaign round mechanics rather than wiping the active campaign.
- **Solver Hero Power Target Resolution**: Enhance `findNextMove` in the solver to handle `interactionMode === 'targeting-spades'` (auto-selecting a face-down card to reveal) and `'targeting-hearts'` (auto-selecting an exposed card for temporary anchor immunity), preventing solver stalls and accidental forced collapses.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `debug-autoplay-panel`: Requirements for autoplay execution loop, step/reset behavior in campaign context, and solver strategy handling during hero power targeting modes.
- `cursed-tomb-campaign`: Requirements ensuring card markings and persistent master deck state are preserved during debug autoplay steps and auto-restarts.

## Impact

- `src/App.tsx`: Update `handleStart` / `onStartNewGame` logic to check for active campaign state and reuse `campaign.masterDeck` and `campaign.graveyard`.
- `src/hooks/useAutoplay.ts`: Update round auto-continuation logic to prevent silent wiping of active campaign state.
- `src/solver.ts`: Add resolution for `interactionMode !== 'normal'` in `findNextGreedyMove`, `findNextSmartMove`, and `findNextPerfectMove`.
- Tests: Update `useAutoplay.test.ts`, `solver.test.ts`, and `game.test.ts` to verify campaign deck preservation during autoplay.
