## Context

The Cursed Tomb is a persistent tactical solitaire game available as both a web application and an official physical card game ruleset (`docs/rules.md`). Previously, clearing a Hearts Fallen Hero card triggered "Hearts Resurrection", which drew a random card from the Graveyard Box and returned it to the active pool as a Stage 4 (Cursed) card. 

Empirical game simulations revealed that Resurrection pollutes the active deck with toxic Cursed cards, inflates campaign lengths into a 400+ round stale limbo, and creates physical play issues (permanent marker marks cannot be erased). Replacing Resurrection with an immediate free Waste+Stock reshuffle provides a clean, physical-friendly, in-game tactical boost that directly aids single-round 52-card Perfect Wins.

## Goals / Non-Goals

**Goals:**
- Update `docs/rules.md` (Section 6A) to document the new Hearts suit blessing ("Second Wind / Stock Reshuffle").
- Update the simulation engine (`sim/cursed_tomb_sim.py`) to execute a free Waste+Stock reshuffle whenever a Hearts Fallen Hero is cleared.
- Update `sim/RESULTS.md` with baseline simulation metrics for the updated ruleset.
- Update web application components, state hooks, and UI compendium modals (`ExpeditionRulesModal.tsx`) to trigger and display the new Hearts blessing.

**Non-Goals:**
- Modifying other suit blessings (♠ Tunnel, ♦ Vault, ♣ Wildcard).
- Modifying the 5-stage attrition failure track or anchor rules.

## Decisions

### Decision 1: Immediate Free Waste Reshuffle upon Hearts Hero Clear
- **Choice:** When a Hearts Fallen Hero card is cleared during gameplay, any cards currently in the Waste pile are immediately combined into the Stock pile and shuffled, without consuming any remaining redeals.
- **Rationale:** This is intuitive, physically seamless (requires no marker modification), and directly assists layout clearing by providing fresh stock draws.
- **Alternatives Considered:** 
  1. *Resurrect as Stage 0 (Clean)*: Rejected because pen marks on physical cards drawn with permanent markers cannot be cleanly erased.
  2. *Grant +1 persistent Redeal for future rounds*: Rejected because it doesn't help the active round's layout clear immediately.

### Decision 2: Empty Waste Handling
- **Choice:** If the Waste pile is empty when a Hearts Hero is cleared, no action is taken (the blessing is spent without effect for that clear).
- **Rationale:** Prevents unnecessary shuffling operations and maintains simplicity.

## Risks / Trade-offs

- **[Risk]** Shuffling the Waste mid-pass alters stock card order for memory players. → **Mitigation:** Standard Pyramids solitaire deck resets reshuffle cards; shuffling stock is an intentional tactical reset.
- **[Risk]** Solver / Autoplay test suite assumptions about Hearts side-effects breaking. → **Mitigation:** Update solver simulation logic and test specs in `solver.test.ts` and `useAutoplay.test.ts`.

## Migration Plan

1. Update `docs/rules.md` documentation.
2. Update simulation engine (`cursed_tomb_sim.py`) and re-run simulations to update `sim/RESULTS.md`.
3. Update web game logic and UI components.
4. Run automated unit tests (`npm test` / `vitest`).
