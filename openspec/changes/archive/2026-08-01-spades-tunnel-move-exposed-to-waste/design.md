## Context

The Spades suit blessing ("Tunnel") was previously defined as flipping one face-down card face-up. Empirical playtesting and simulations revealed that this ability is conditional (worthless when no Red Curses exist on the board), resulting in a dead blessing in many rounds. Changing Spades Tunnel to "Move one exposed pyramid card into the Waste pile" provides an always-active, high-leverage pathfinding tool that unblocks pyramid cards and establishes immediate pairing targets on top of the Waste stack.

## Goals / Non-Goals

**Goals:**
- Update `docs/rules.md` (Section 6A) to document the new Spades suit blessing ("Tunnel / Move to Waste").
- Update the simulation engine (`sim/cursed_tomb_sim.py`) to select and move the highest-unblocking exposed pyramid card into the Waste when a Spades Hero is cleared.
- Update `sim/RESULTS.md` with baseline simulation metrics.
- Update web application components (`PyramidBoard.tsx`, game controls, state hooks) and `ExpeditionRulesModal.tsx` to handle Spades targeting of exposed pyramid cards to move them to the Waste.

**Non-Goals:**
- Modifying other suit blessings (♥ Hearts Reshuffle, ♦ Diamonds Vault, ♣ Clubs Wildcard).
- Modifying attrition tracks or anchor rules.

## Decisions

### Decision 1: Allow Selecting Any Exposed Pyramid Card for Waste Transfer
- **Choice:** Upon clearing a Spades Fallen Hero card (`[ (♠) ]`), the player is prompted to click any currently exposed card in the pyramid layout. The chosen card is removed from the pyramid and placed on top of the Waste pile.
- **Rationale:** This directly exposes covered cards in upper rows while making the moved card available on top of the Waste for immediate pairing or future Hearts reshuffles.
- **Alternatives Considered:** 
  1. *Automatically moving a random exposed card*: Rejected because manual selection provides high tactical satisfaction and strategic agency.
  2. *Moving card to Stock instead of Waste*: Rejected because placing on top of Waste makes it immediately playable.

### Decision 2: Heuristic Solver Selection in Simulation
- **Choice:** In `cursed_tomb_sim.py`, the solver picks the exposed pyramid slot that maximizes `newly_exposed_after` (unblocks the most new cards behind it).

## Risks / Trade-offs

- **[Risk]** Spades mode prompt state UI handling in web application. → **Mitigation:** Leverage existing Spades targeting prompt modal/mode in React state, updating the action handler to transfer the card from Pyramid to Waste instead of setting `locks`.

## Migration Plan

1. Update `docs/rules.md` documentation.
2. Update simulation engine (`cursed_tomb_sim.py`) and re-run simulations to update `sim/RESULTS.md`.
3. Update web game logic and UI components.
4. Run automated unit tests (`npm test` / `vitest`).
