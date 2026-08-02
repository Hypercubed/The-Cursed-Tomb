## Why

The original Spades Tunnel suit blessing ("flip one face-down card face-up") is highly conditional and becomes a dead, 0-value blessing whenever there are no face-down Red Curse cards in the layout. Replacing the Spades Tunnel blessing with an immediate action to **move one exposed pyramid card into the Waste pile** transforms Spades into an always-active, high-leverage pathfinding tool. Physically, it requires zero marker alterations (simply moving a card from the layout onto the Waste stack). Mechanically, it unblocks covered pyramid cards behind it and creates immediate pairing bridges with the Waste pile, significantly improving layout clear rates and campaign victory rates.

## What Changes

- **Spades Suit Blessing Mechanic**: Replace flipping face-down cards with an action allowing the player to select any exposed card in the pyramid layout and move it directly into the Waste pile when a Spades Fallen Hero card (`[ (♠) ]`) is cleared.
- **Rule Documentation & Compendium Updates**: Update `docs/rules.md` Section 6A and `expedition-rules-modal` to document the new Spades Tunnel effect ("Move one exposed pyramid card to the Waste").
- **Simulation Engine Updates**: Update `cursed_tomb_sim.py` and diagnostic simulation scripts to select and move the highest-leverage exposed pyramid card into the Waste upon clearing a Spades Hero card.
- **Web Application Engine**: Update game state logic, React components, and custom hooks to enable Spades targeting of any exposed pyramid card to move it to the Waste.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `cursed-tomb-campaign`: Update Spades suit blessing requirement from flipping a face-down card to moving one exposed pyramid card into the Waste pile.

## Impact

- **Documentation**: `docs/rules.md` Section 6A (Spades blessing description).
- **Simulation Scripts**: `sim/cursed_tomb_sim.py`, `sim/RESULTS.md`.
- **Game Engine & State**: React components (`PyramidBoard.tsx`, game controls), hooks, solver logic, and test suites handling Spades blessing selection.
- **UI Components**: `ExpeditionRulesModal.tsx` and rule reference UI text.
