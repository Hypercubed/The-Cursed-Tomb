## Why

Explorer (3 redeals) is numerically indistinguishable from Novice (∞). Single-game sims show 34.75% (3) vs 34.90% (∞) pyramid clear — two buttons for one experience. Lowering Explorer to 2 redeals gives 31.55% (3.3pp gap) creating a visible ladder. Novice returns to true infinite for tutorial/sandbox.

## What Changes

- Change `docs/rules.md` §3: Novice `5 Redeals (6 Passes) → ∞ Redeals (Unlimited Passes)`, Explorer `3 → 2 Redeals (3 Passes)`; tracking note updated (Novice ∞, Explorer 2).
- Change `src/components/CampaignSetupModal.tsx` `DIFFICULTY_OPTIONS`: Novice `value: 5 → null`, `redealsText: '5 Redeals (6 Passes)' → '∞ Redeals (Unlimited Passes)'`, Explorer `value: 3 → 2`, `redealsText: '3 Redeals (4 Passes)' → '2 Redeals (3 Passes)'`, descriptions updated.
- Update `src/components/CampaignSetupModal.test.ts` expectations: `novice.value` `5 → null`, `explorer.value` `3 → 2`.
- Update `src/components/GameSidebar.tsx` `redrawOptions` and `getDifficultyLabel` to match (Novice null/∞, Explorer 2).
- **No sim change** in this change: `sim/cursed_tomb_sim.py`, `sim/campaign_rounds_sim.py`, `sim/base_game_sim.py` keep `DIFFICULTIES["novice"]=5` as simulation cap (prevents infinite play in batch runs). Sim `RESULTS.md` stays at 5.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `campaign-setup-modal`: Difficulty labels, redeal values and descriptions must match physical ruleset `docs/rules.md` §3

## Impact

- Affected code: `docs/rules.md`, `src/components/CampaignSetupModal.tsx`, `src/components/CampaignSetupModal.test.ts`, `src/components/GameSidebar.tsx`
- `GameState.redrawsRemaining: number | null` — Novice now correctly uses `null` (infinite), Explorer uses `2`
- Sims unaffected in this change (cap stays 5); later sync can align if needed
