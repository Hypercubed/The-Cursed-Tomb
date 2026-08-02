## Context

The original Black Curse rule ("The Weight") restricted Stage 4 Black Cursed cards to pyramid-only pairing, causing rigid layout deadlocks whenever the matching functional value resided in the Stock or Waste pile. Replacing this restriction with a rule that allows Black Cursed cards to pair normally but shuffles their partner card back into the Stock pile replaces artificial layout lockouts with a manageable card-count penalty.

## Goals / Non-Goals

**Goals:**
- Update `docs/rules.md` (Section 4) to document the updated Black Curse rule ("The Recycled Weight: partner card shuffles into Stock").
- Update the simulation engine (`sim/cursed_tomb_sim.py`) to execute partner recycling into the Stock when clearing a Black Cursed card.
- Update `sim/RESULTS.md` with baseline metrics for the revised ruleset.
- Update web application game logic, React state handlers, and `ExpeditionRulesModal.tsx` to handle partner card reshuffling into the Stock when a Black Cursed card is cleared.

**Non-Goals:**
- Modifying Red Curses or Attrition stage advancement.
- Modifying suit blessings.

## Decisions

### Decision 1: Immediate Partner Card Reshuffle into Stock
- **Choice:** When a Stage 4 Black Cursed card is paired with any partner card (whether exposed in the pyramid, waste, or vault), the Black Cursed card moves to the Foundation stack, while the partner card is inserted back into the face-down Stock pile and shuffled.
- **Rationale:** This removes rigid pyramid-only deadlocks while imposing a fair penalty (the player must draw and re-pair the recycled partner card later in the round).
- **Alternatives Considered:** 
  1. *Placing partner on top of Stock un-shuffled*: Rejected because shuffling introduces healthy tactical uncertainty.
  2. *Placing partner on top of Waste*: Rejected because placing on Waste would allow immediate re-pairing on the next move, rendering the curse meaningless.

## Risks / Trade-offs

- **[Risk]** Stock shuffling during active play alters drawn card order. → **Mitigation:** Mid-pass shuffling is an explicit penalty mechanism designed to increase stock pass complexity.

## Migration Plan

1. Update `docs/rules.md` documentation.
2. Update simulation engine (`cursed_tomb_sim.py`) and re-run simulations to update `sim/RESULTS.md`.
3. Update web game logic and UI components.
4. Run automated unit tests (`npm test` / `vitest`).
