# Proposal: Clamp Functional Card Values between 1 and 13

## Why
Card functional value shifts (+1 for Red scars, -1 for Black scars) are currently unclamped in `src/game.ts` and python simulations (`sim/cursed_tomb_sim.py`). 
This causes boundary anomalies:
- A Black Ace (rank 1) with a -1 scar evaluates to `0`, making it impossible to pair with a Queen (12) because $0 + 12 = 12 \neq 13$.
- A Red King (rank 13) with a +1 scar evaluates to `14`, preventing it from clearing solo because $14 \neq 13$.

`PlayingCard.tsx` already caps visual rendering at `[1, 13]`. Aligning the core game engine logic, documentation, and simulation models to cap functional card values between 1 (Ace) and 13 (King) ensures boundary modifications do not break standard pairability or solo King removals.

## What Changes
- **Rules Documentation**: Update `docs/rules.md` (Section 4.1) to state that Functional Values are bounded between 1 (Ace) and 13 (King).
- **Core Game Engine**: Update `getFunctionalValue` in `src/game.ts` to clamp calculated values with `Math.max(1, Math.min(13, val))`.
- **Unit Tests**: Add test cases to `src/game.test.ts` verifying Black Ace-1 pairs with Queen (12) and Red King+1 clears solo (13).
- **Python Simulations**: Update `functional_value()` in `sim/cursed_tomb_sim.py` and `sim/compare_vault_sim.py` to clamp values between 1 and 13.

## Capabilities Affected
- `cursed-tomb-campaign`: Functional value scaling and scar modifier evaluation.
