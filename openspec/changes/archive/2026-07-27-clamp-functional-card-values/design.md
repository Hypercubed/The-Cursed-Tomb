# Design: Clamp Functional Card Values

## Architecture Decisions

### 1. Functional Value Clamping Math
The core functional value function in `src/game.ts`:
```ts
export function getFunctionalValue(card: Card, mode: GameMode = 'standard'): number {
  if (mode !== 'cursed-tomb') return card.rank;
  if (card.attritionStage < 3) return card.rank;
  const shift = (card.suit === '♥' || card.suit === '♦') ? 1 : -1;
  return Math.max(1, Math.min(13, card.rank + shift));
}
```

This guarantees:
- Minimum card value is 1 (Ace)
- Maximum card value is 13 (King)
- Black Ace (1) with -1 scar $\rightarrow$ 1 (pairs with Queen=12 to sum to 13)
- Red King (13) with +1 scar $\rightarrow$ 13 (clears solo as 13)

### 2. Python Simulation Alignment
In `sim/cursed_tomb_sim.py` and `sim/compare_vault_sim.py`:
```python
def functional_value(self, flags):
    v = RANK_VALUES[self.rank]
    if flags.scars and self.attrition_stage >= 3:
        v += 1 if self.suit in RED else -1
    return max(1, min(13, v))
```

### 3. Rules Specification Alignment
In `docs/rules.md` (Section 4.1):
Clarify that modified values are bounded between 1 (Ace) and 13 (King) so that scars do not produce unpairable values (0 or 14).
