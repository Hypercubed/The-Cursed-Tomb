## 1. Rules Documentation & Simulation Engine Updates

- [x] 1.1 Update `docs/rules.md` to document Hearts Resurrection (random draw from Graveyard Box as Cursed Stage 4), Clubs Universal Wildcard, and Circular $A \leftrightarrow K$ Value Shifts.
- [x] 1.2 Update `sim/cursed_tomb_sim.py` to implement circular functional value shifts ($A \leftrightarrow K$ modulo wrapping).
- [x] 1.3 Update `sim/cursed_tomb_sim.py` blessing handlers for Hearts Resurrection (random Graveyard pull) and Clubs Universal Wildcard pairing.
- [x] 1.4 Update simulation documentation / `sim/RESULTS.md` with benchmark numbers.

## 2. Core Game Logic & Web UI Updates

- [x] 2.1 Update card functional value calculation in core game engine (`src/`) to use circular modulo wrapping ($1 \dots 13$).
- [x] 2.2 Update Hearts blessing trigger handler to perform a random draw from the Graveyard Box and add the card back to the active pool as Stage 4 (Cursed).
- [x] 2.3 Update Clubs blessing trigger/pairing logic to treat Clubs Hero cards as universal wildcards matching any exposed card to total 13.
- [x] 2.4 Update UI components to visually indicate circular rank shifts, Graveyard Resurrection draw animations, and Clubs Universal Wildcard pairing options.

## 3. Verification & Testing

- [x] 3.1 Run `sim/cursed_tomb_sim.py` across difficulties to verify simulation behavior and win rates.
- [x] 3.2 Add/update unit tests for circular value calculations and blessing handlers.
- [x] 3.3 Verify web app build and test gameplay interactions locally.
