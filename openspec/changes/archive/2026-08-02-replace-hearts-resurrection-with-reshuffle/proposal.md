## Why

The original Hearts suit blessing ("Hearts Resurrection") was intended as a helpful lifeline, but in practice it creates major gameplay and physical board-game problems. Physically, restoring a Stage 4 Cursed card to Stage 0 is impractical because pen marks drawn in permanent marker are additive and cannot be erased clean. Mechanically, resurrecting Stage 4 Cursed cards re-injects toxic face-down trap cards and pairing restrictions into the deck, prolonging campaigns into a 400+ round stale limbo without increasing win rates. Replacing Hearts Resurrection with a free immediate Waste+Stock reshuffle resolves the physical ink limitation, eliminates infinite campaign drag, and provides an immediate tactical power spike that directly assists in achieving 52-card Perfect Wins.

## What Changes

- **Hearts Suit Blessing Mechanic**: Replace card resurrection from the Graveyard Box with a free immediate reshuffle of the Waste pile back into the Stock draw pile when a Hearts Fallen Hero card (`[ (♥) ]`) is cleared.
- **Rule Documentation & Compendium Updates**: Update `docs/rules.md` and `expedition-rules-modal` to reflect the new Hearts blessing ("Second Wind / Stock Reshuffle") instead of Graveyard Resurrection.
- **Simulation Engine Updates**: Update `cursed_tomb_sim.py` and diagnostic scripts to execute the Waste+Stock reshuffle logic upon clearing a Hearts Hero card.
- **Web Application Engine**: Update game state engine in React/TSX components and hooks to perform an immediate free waste reshuffle when a Hearts Hero is cleared.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `cursed-tomb-campaign`: Update Hearts suit blessing requirement from Graveyard Box card resurrection to free immediate Waste+Stock reshuffle without consuming a redeal.

## Impact

- **Documentation**: `docs/rules.md` Section 6A (Hearts blessing description).
- **Simulation Scripts**: `sim/cursed_tomb_sim.py`, `sim/RESULTS.md`.
- **Game Engine & State**: React game logic components, custom hooks, solver, and test suites handling cleared card side-effects.
- **UI Components**: `ExpeditionRulesModal.tsx` and rule reference UI text.
