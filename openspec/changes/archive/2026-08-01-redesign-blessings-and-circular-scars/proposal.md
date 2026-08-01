## Why

The current legacy rules for *The Cursed Tomb* feature several underpowered or inconvenient mechanics. Specifically:
- **♥ Hearts (The Martyr):** Grants temporary round-only immunity, which is awkward to track in physical play (requires loose tokens) and underpowered since failure penalties are only applied when a round freezes.
- **♣ Clubs (The Equalizer):** Offers no benefit in early campaign rounds before any cards acquire scars.
- **Value Shift Clamping:** Clamping modified card values between 1 and 13 creates dead ends for Ace (-1 shift) and King (+1 shift).

Redesigning these mechanics improves tabletop and web ergonomics, creates higher-impact tactical decisions, and brings campaign victory rates to ~20-37% across standard difficulties while keeping campaign length at ~250-320 rounds.

## What Changes

- **♥ Hearts Blessing (Resurrection):** **BREAKING**. When a cleared card unlocks a Hearts blessing, clearing that Hearts Hero allows the player to draw 1 **random card** from the Graveyard Box (Stage 5 Entombed) and shuffle it back into the active deck pool. Revived cards return as **Cursed (Stage 4)**, preserving all ink marks. If the Graveyard Box is empty, no action is taken.
- **♣ Clubs Blessing (Universal Wildcard):** **BREAKING**. When pairing exposed cards, a Clubs Hero card can pair with **ANY exposed card** to form the target value sum of 13.
- **🌀 Circular Value Shifts ($A \leftrightarrow K$ Wrapping):** **BREAKING**. Functional value shifts wrap around modulo 13 ($1 \dots 13$). A Red Scar (+1) on a King (13) wraps to Ace (1). A Black Scar (-1) on an Ace (1) wraps to King (13), allowing a Black-Scarred Ace to act as a solo-clearing King.
- **♦ Diamonds (The Vault) & ♠ Spades (The Tunnel):** Reaffirmed as optional player choice (Diamonds) and unblocking 1 face-down card (Spades).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cursed-tomb-campaign`: Modifies the legacy ruleset mechanics for Hearts blessings (Resurrection), Clubs blessings (Universal Wildcard), and Scar functional value calculation (Circular $A \leftrightarrow K$ wrapping).

## Impact

- `docs/rules.md`: Update official ruleset documentation to reflect Hearts Resurrection, Clubs Universal Wildcard, and Circular Value Shifts.
- `sim/cursed_tomb_sim.py`: Update simulation rules engine and CLI flags.
- Web Application & Core Game Logic (`src/`): Update card state calculations, blessing handlers, and Graveyard Box interactions.
