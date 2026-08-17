## Context

See `proposal.md` for motivation. Currently, `src/game.ts` and `sim/cursed_tomb_sim.py` both push both cards back into the draw pile when two Black Cursed cards match.

## Goals / Non-Goals

**Goals:**
- Eliminate infinite loops during post-pyramid clearing and autoplay in the web UI.
- Maintain the Black Curse penalty (1 card recycled to Stock) while guaranteeing deck reduction (-1 card to Foundation).
- Keep physical rules, in-app rules compendium, Python simulation, and web engine fully aligned.

**Non-Goals:**
- Changing Red Curse mechanics or Hero Blessing power activations.
- Altering the Perfect Win simultaneous resolution priority (where all penalties are bypassed upon achieving a Perfect Win).

## Decisions

### 1. Dual Black Curse Resolution (Higher Founded, Lower Reshuffled)
When `card1` and `card2` are both Black Cursed (3–4 Scars on ♠/♣, not blessed):
- Compare functional values: `v1 = getFunctionalValue(card1, mode)`, `v2 = getFunctionalValue(card2, mode)`.
- The higher functional value card moves to Foundation.
- The lower functional value partner card is reshuffled into the Stock draw pile.
*(Note: Because pairs summing to 13 always have unequal integer values $x \neq 13-x$, one card is strictly higher).*

### 2. Consistency across Python Sim and TypeScript Engine
- **TypeScript (`src/game.ts:removePair`)**:
  ```typescript
  if (c1Bc && c2Bc) {
    const v1 = getFunctionalValue(card1, state.mode);
    const v2 = getFunctionalValue(card2, state.mode);
    const toStock = v1 < v2 ? card1 : card2;
    toReshuffle.push({ ...toStock, removed: false, faceDown: false, selected: false });
  }
  ```
- **Python (`sim/cursed_tomb_sim.py`)**:
  Mirror the same functional value comparison across all move execution handlers (`pp`, `pw`, `stock_pyramid`, `stock_waste`).

## Risks / Trade-offs

- **[Risk] Test breakage on existing assertions expecting dual reshuffle** → *Mitigation*: Update `src/game.test.ts` test cases to verify the new higher-to-foundation / lower-to-stock behavior.
