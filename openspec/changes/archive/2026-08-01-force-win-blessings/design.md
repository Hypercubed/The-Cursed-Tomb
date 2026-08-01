## Context

In *The Cursed Tomb*, clearing a round in campaign mode evaluates the `lastClearedPair` on the game state during `applyEndOfWeekLifecycle` ([src/game.ts](file:///home/jmh/workspace/projects/the-cursed-tomb/src/game.ts)). The card with the higher functional value in the `lastClearedPair` is granted a **Hero Blessing** (`blessed = true`), while the card with the lower functional value receives a **Reward** (`rewardStage` incremented).

When the developer or tester clicks **⚡ Force Win** in the Debug panel ([src/components/DebugPanel.tsx](file:///home/jmh/workspace/projects/the-cursed-tomb/src/components/DebugPanel.tsx)), `forceWin(state)` in `src/solver.ts` sets all unremoved pyramid cards to `removed: true` without populating `lastClearedPair`. As a result, no blessings or rewards are awarded when force-winning rounds in campaign mode.

## Goals / Non-Goals

**Goals:**
- Update `forceWin(state)` in `src/solver.ts` to inspect remaining unremoved cards in the pyramid before clearing them.
- Identify candidate card(s) to populate `lastClearedPair` so `applyEndOfWeekLifecycle` can process Hero Blessings and Anchor Rewards upon Force Win.
- Ensure 0-move Force Wins (straight from deal) as well as partial-play Force Wins produce valid blessings and rewards.

**Non-Goals:**
- Changing the rule logic of `applyEndOfWeekLifecycle` itself or how blessings/rewards are awarded during natural gameplay.
- Adding complex UI modal pickers for debug blessings (Option A was selected: zero-friction auto-selection from remaining pyramid cards).

## Decisions

### 1. Synthetic Last Cleared Pair Selection Strategy in `forceWin`

When `forceWin(state, complete)` is invoked:

1. **Extract Unremoved Pyramid Cards**:
   Collect all cards in `state.pyramid` where `!card.removed`.

2. **Determine Synthetic `lastClearedPair`**:
   - **Case 1: No remaining cards in pyramid** (Pyramid was already cleared prior to Force Win call):
     Keep `state.lastClearedPair` as-is.
   - **Case 2: Exactly 1 remaining card in pyramid** (e.g. a King or single unremoved card):
     Set `lastClearedPair = [singleCard]`.
   - **Case 3: $\ge 2$ remaining cards in pyramid**:
     - *Step 3a*: Check if any two unremoved pyramid cards sum to 13 (using `getFunctionalValue(c, mode)`). If a valid 13-pair exists, set `lastClearedPair = [cardA, cardB]`.
     - *Step 3b*: If no 13-pair exists, sort unremoved pyramid cards by modified functional value descending. Pick the top 2 highest-value cards as `lastClearedPair = [card1, card2]`.

3. **Apply Cleared State**:
   Return the state with cleared pyramid cards, status updated via `checkForWin`, and `lastClearedPair` set to the synthetic pair.

*Rationale*:
- Attempting to find a valid 13-pair first mimics natural Pyramid solitaire mechanics.
- Falling back to the 2 highest-value cards ensures that even when no exact 13-pair remains on the board, a valid 2-card `lastClearedPair` is supplied so `applyEndOfWeekLifecycle` awards 1 Hero Blessing (to the highest value card) and 1 Anchor Reward (to the second highest value card).

## Risks / Trade-offs

- **[Risk] High-value card gets blessed consistently on 0-move Force Win** → *Mitigation*: This is expected and desirable for developer testing, as high-value cards naturally form the Hero of synthetic clearing pairs.
