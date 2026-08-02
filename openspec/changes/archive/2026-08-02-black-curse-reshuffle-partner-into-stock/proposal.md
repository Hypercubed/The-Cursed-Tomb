## Why

The original Black Curse rule ("The Weight": pyramid-only pairing) creates rigid, non-interactive deadlocks when a Black-Cursed card's functional matching partner is located in the Stock or Waste pile. Replacing the pyramid-only pairing restriction with a rule where **pairing a Black-Cursed card causes its partner card to be shuffled back into the Stock** replaces rigid layout deadlocks with a card-count penalty. Black-Cursed cards can now pair with any exposed card (including Stock/Waste), but clearing one recycles its partner back into the Stock pile, forcing the player to draw and pair the partner card a second time to complete a 52-card Perfect Win.

## What Changes

- **Black Curse Mechanic**: Replace the pyramid-only pairing restriction for Stage 4 Black Curse cards (`[ |X| ]` on Spades/Clubs). A Black Cursed card can now pair with any legally exposed card (in pyramid, waste, or vault), but upon pairing, the partner card is shuffled back into the Stock draw pile instead of going to the Foundation stack.
- **Rule Documentation & Compendium Updates**: Update `docs/rules.md` Section 4 and `expedition-rules-modal` to document the updated Black Curse rule ("The Recycled Weight: partner card shuffles into Stock").
- **Simulation Engine Updates**: Update `cursed_tomb_sim.py` and diagnostic scripts to execute partner-to-stock recycling when clearing a Stage 4 Black Cursed card.
- **Web Application Engine**: Update game state engine, React components, custom hooks, and solver logic to perform partner reshuffling into the Stock when a Black Cursed card is cleared.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `cursed-tomb-campaign`: Update Stage 4 Black Curse rule requirement from restricting pairing to the pyramid structure to shuffling the paired partner card into the Stock pile.

## Impact

- **Documentation**: `docs/rules.md` Section 4 (Black Curses description).
- **Simulation Scripts**: `sim/cursed_tomb_sim.py`, `sim/RESULTS.md`.
- **Game Engine & State**: React game logic components (`PyramidBoard.tsx`, game state hooks), solver logic, and test suites.
- **UI Components**: `ExpeditionRulesModal.tsx` and digital rules reference UI.
