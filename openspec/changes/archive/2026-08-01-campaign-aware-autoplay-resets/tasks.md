## 1. Solver Hero Power Target Resolution

- [x] 1.1 Add targeting mode handling (`interactionMode === 'targeting-spades'` and `'targeting-hearts'`) to `findNextGreedyMove`, `findNextSmartMove`, and `findNextPerfectMove` in `src/solver.ts`
- [x] 1.2 Support targeting mode candidates in `getLegalNextStates` in `src/solver.ts`
- [x] 1.3 Add unit tests in `src/solver.test.ts` to verify solver auto-resolves targeting modes without resigning

## 2. Campaign-Aware Game Initialization in App

- [x] 2.1 Update `handleStart` in `src/App.tsx` to check for active `campaign` and reuse `campaign.masterDeck` and `campaign.graveyard` when initializing a new game deal
- [x] 2.2 Ensure `useAutoplay` round continuation re-uses campaign deck state during continuous autoplay

## 3. Verification & Testing

- [x] 3.1 Add unit tests in `src/hooks/useAutoplay.test.ts` verifying campaign deck mutations are preserved when autoplay starts or restarts games
- [x] 3.2 Run full test suite (`npm test`) to confirm all tests pass cleanly
