## Why

The Cursed Tomb's persistent ink-marking mechanic gradually degrades cards across rounds, but we don't know how quickly this degradation produces a deck configuration where clearing the pyramid is **structurally impossible** — i.e., the card values and pairing rules make a full pyramid clear unachievable regardless of ordering or luck. This analysis is critical for understanding campaign balance: if "unwinnable" states arise early and frequently, the campaign experience is unsatisfying and the rules may need tuning.

## What Changes

- **New script**: `sim/deck_evolution_analysis.py` — a purpose-built analysis script that runs campaigns with **all end-game conditions disabled** (no starvation collapse, no volatile collapse, no victory conditions), evolving the deck indefinitely while sampling at each round whether the deck is in an unwinnable state.
- **Unwinnable detection**: A deterministic exhaustive or oracle check that determines, given a deck's current ink state, whether any shuffle/arrangement of 28 pyramid cards + 24 stock cards can yield at least one legal pyramid clear.
- **Output**: Per-round statistics showing the **win rate vs. round number** — how quickly the deck degrades and how often it degrades to an impossible state — reported as both a data table and ASCII chart.
- **CLI flags**: Configurable difficulty, number of campaigns, solver strategy, and sample interval.

## Capabilities

### New Capabilities

- `deck-evolution-analysis`: Campaign simulator with all terminal conditions disabled; tracks per-round pyramid-clear solvability to answer "how quickly and how often does the deck become impossible to clear?"

### Modified Capabilities

<!-- No existing spec-level requirement changes needed -->

## Impact

- **New file only**: `sim/deck_evolution_analysis.py` — no changes to `cursed_tomb_sim.py`, existing sims, or any frontend code.
- **Depends on**: `cursed_tomb_sim.py` (imports `play_round`, `CardState`, `RuleFlags`, `run_campaign` infrastructure); solvers package.
- **No API or UI changes**.
