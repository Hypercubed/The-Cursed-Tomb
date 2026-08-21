## 1. Docs — rules & cheat sheet

- [x] 1.1 Update `docs/rules.md` §5B: replace Stock Bounty `N=1–3` tiers / `fan→count→shuffle until N non-Shield` with `B. Post-Pyramid Anchors: 1B+1A (lower `—→+`) + every card cleared after pyramid 28 gives one Anchor (both cards of pair, solo K). Note Stock phase continues with redeals until dead. Keep `A.` Blessing fallback + Vault + Solo text.
- [x] 1.2 Update `docs/cheat-sheet.md` §3: mirror §5B (1B+1A + post-both), remove `N=3/≤4/≤8/1` table.
- [x] 1.3 Update `docs/BALANCE_SPEC.md` §3/§4 with post-pyramid averages (`0.6` pairs/win Arch, `83%` 0) and remove `N` tiers.

## 2. Sim — post-pyramid + 1B+1A

- [x] 2.1 Patch `sim/cursed_tomb_sim.py` `play_round(continue_after_pyramid=True)` to continue `Stock+Waste+Vault` after `len(removed)==28` (reuse `state` + `continue_stock_phase` loop with `redeal` priority as in `sim/eval_final.py` fix) and retain `stock_phase_pairs`/`cleared` on `RoundOutcome`.
- [x] 2.2 Patch `sim/cursed_tomb_sim.py` `run_campaign` variant `post-pyramid-both` (default): `1B fallbk + lower Anchor + both cards per post pair/solo`; remove `N=1–3` / `draw-until non-Shield from active deck`. Wire `--reward-variant` or make default.
- [x] 2.3 Patch `sim/eval_final.py` `continue_stock_phase` `stock_moves > redeal > draw` fix and verify `arch heur 500×300` `7.7/3.0` Both, `0.6` pairs/win.
- [x] 2.4 Regenerate `sim/RESULTS.md` Parts 3-4 with `post-both` baseline (500 camps `arch heur/nov`, `surv`, `explorer` note easy).

## 3. App — lifecycle + legends

- [x] 3.1 Update `src/game.ts` `applyEndOfWeekLifecycle`: restore lower Anchor (`lower.rewardStage+1`) + loop post-pyramid `Stock+Waste+Vault` continuation (reuse solver or greedy) and anchor `both` cards per post pair/solo; remove `N` / `shuffle active deck` draw.
- [x] 3.2 Update `src/components/RulesModal.tsx` + `MatchedCardsModal.tsx` + `GameSidebar` legends: `B. Post-Pyramid Anchors (all cards)` instead of `Stock Bounty 1-3`.

## 4. Validation

- [x] 4.1 `python -m py_compile sim/cursed_tomb_sim.py && npx tsc --noEmit --skipLibCheck (ok) && npm test -- --run (193/193) & sim/eval_final.py archived into sim/cursed_tomb_sim.py` + `openspec validate post-pyramid-anchor-1b1a --strict` (valid) + `Explorer 3 redeals` smoke (arch 7.9/3.0 heur 93% coll 4% to, surv 0.1, expl 33.4 heur 80% coll — easy accepted).
