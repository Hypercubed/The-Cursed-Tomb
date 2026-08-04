## Why

The current web engine and simulation solvers enforce a non-standard Pyramid Solitaire behavior: clicking the Stock immediately moves the top Stock card to the Waste pile, burying the previous Waste card and preventing the top Stock card from being matched directly with exposed Pyramid cards or the top Waste card *before* entering Waste.

This change aligns the game engine, UI, autoplay solvers, and simulation scripts with standard Pyramid Solitaire rules. Under standard rules, a drawn Stock card is exposed on top of the Stock pile and can be matched with exposed Pyramid cards or the top of Waste before being passed into the Waste pile.

## What Changes

- **Engine Logic (`src/game.ts`)**:
  - The top card of `drawPile` is exposed and selectable for pairing while still residing in the Stock pile.
  - The top Stock card can be paired with any exposed Pyramid card, the top card of the Waste pile (`discardPile[0]`), or cleared singly if it is a King.
  - A new state operation `discardStockCard(state)` (or explicit `[ Pass to Waste ]` action) is introduced to move the exposed Stock card to the top of the Waste pile when no match is made or when the player chooses to hold it.
- **UI & Controls (`src/components/`, `src/App.tsx`)**:
  - The top card of the Stock pile is rendered face-up/exposed.
  - Clicking the exposed Stock card selects it for pairing.
  - A dedicated `[ Pass to Waste ]` action button (and hotkey `Space`/`D`) is added to move the exposed Stock card onto the Waste pile.
- **Solvers & Simulations (`src/solver.ts`, `sim/cursed_tomb_sim.py`, `sim/base_game_sim.py`, `sim/solvers/*`)**:
  - Update move generation to include Stock-to-Pyramid and Stock-to-Waste legal pairings in addition to passing to Waste.
- **Documentation (`docs/rules.md`)**:
  - Update rules documentation to clarify in-flight Stock pairing mechanics.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `pyramid-solitaire-game`: Update Stock draw and pairing requirements to permit top-of-stock matching with exposed Pyramid cards and the top of Waste prior to discarding to Waste, and add explicit Stock-to-Waste pass action requirement.

## Impact

- `src/game.ts`: `cardIsVisible`, `canAnyMove`, `selectCard`, `removePair`, and draw state transition functions.
- `src/solver.ts` and `sim/`: Greedy move generator, solver state graph traversal, and Python simulations.
- `src/App.tsx` and UI components (`DrawZone.tsx` / control bar): Visual rendering and button handler for Stock management.
- `docs/rules.md`: Official rule text clarification.
