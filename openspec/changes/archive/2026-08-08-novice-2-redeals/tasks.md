## 1. Docs & Spec Alignment

- [x] 1.1 Update `docs/rules.md` §3: Novice `5 → ∞ Redeals (Unlimited Passes)` and Explorer `3 → 2 Redeals (3 Passes)` + tracking note (Novice ∞, Explorer 2)
- [x] 1.2 Verify `openspec/specs/campaign-setup-modal/spec.md` delta reflects Novice ∞ / Explorer 2

## 2. Digital Game Implementation

- [x] 2.1 Update `src/components/CampaignSetupModal.tsx`: Novice `value: 5 → null`, `redealsText: '5 Redeals (6 Passes)' → '∞ Redeals (Unlimited Passes)'`, Explorer `value: 3 → 2`, `redealsText: '3 Redeals (4 Passes)' → '2 Redeals (3 Passes)'`
- [x] 2.2 Update `src/components/CampaignSetupModal.test.ts` expectations: `novice.value` `5 → null`, `explorer.value` `3 → 2`
- [x] 2.3 Update `src/components/GameSidebar.tsx` `redrawOptions` and `getDifficultyLabel` (Novice ∞/null, Explorer 2)
- [x] 2.4 Run `npm test -- src/components/CampaignSetupModal.test.ts` and `npm run build` ✓ 3/3, build ✓

## 3. Simulations (Intentionally Deferred)

- [x] 3.1 Confirm `sim/cursed_tomb_sim.py:654` and `sim/campaign_rounds_sim.py:22` stay at `5` for this change (no edit)
- [x] 3.2 No `sim/RESULTS.md` update this change; note divergence digital (∞/2) vs sim cap (5/3) in validation

## 4. Validation & Follow-up Flag

- [x] 4.1 Run `openspec validate --changes novice-2-redeals --strict` ✓
- [ ] 4.2 Manual playtest explorer-2-redeals (replaces 4.2 manual playtest Novice 2 vs Explorer 3)
- [ ] 4.2 Manual playtest Novice 2 vs Explorer 3 to confirm inverted ladder is understood (explorer easier) and decide follow-up rebalance
