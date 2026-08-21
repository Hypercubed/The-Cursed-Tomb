## Context

See `proposal.md` — Why. Current `sim/cursed_tomb_sim.py:play_round` returns `pyramid_clear` immediately when `len(removed)==28`, leaving `Stock+Waste+Vault` untouched. `applyEndOfWeekLifecycle` in `src/game.ts` and `_apply_survival_reward` + `N=1–3` random from whole-deck in `run_campaign` then award. Vault at pyramid hit is `0%` with heuristic (`vault +2` vs `pp +15`), but table play vaults early, raising post average `0.27→0.6` after fixing redeal.

## Goals / Non-Goals

**Goals:**
- Replace `N=1–3` shuffle/fan with deterministic `1B+1A + all post-pyramid cards` — table time `~10s` (ink 0-2 in-hand).
- Keep Arch median `3`, surv `~230`, stretch `2.6×` (sim `8.1→7.7/3.0` Both, `0.6` pairs/win; `1B+1A` only `0.27` without redeal fix).
- Stock phase continues with redeals until dead — Explorer `76` wins accepted as easy.

**Non-Goals:**
- No cap on Explorer, no vault heuristic change, no scar-track changes.

## Decisions

- **1B+1A restored, lower always Anchored:** Keeps story (winner Blessed, loser Fortified). Lower `—→+` even when higher ineligible. Solo `K` `—→+`. Rejected: keep `N` tiers — awkward, survey says shuffle is worst.
- **Post-pyramid Anchors = all cards cleared after 28:** `both` cards of `stock_waste`/`stock_pyramid`/`pw` + solo `K`. Rejected: `lower only` — your idea `all cards` is clearer at table (`both ⊕`), and Arch `1.2` vs `0.6` still too few; vault `0%` makes `both` safe. Explorer `5.4` vs `2.7` but Explorer easy.
- **Sim: `continue_stock_phase(state, solver)` after pyramid hit** that forces `redeal` when `stock_waste==0` and `stock empty waste 12 redeals 1` (heuristic scores redeal `0`). Patched `eval_final.py` already does `stock_moves > redeal > draw` priority. `play_round(continue_after_pyramid=True)` loops stock phase inline, records `stock_phase_pairs`/`cleared` for `run_campaign` variant `opt2_post_both`.
- **Docs: remove `B. Anchors: Stock Bounty N` tiers** → new `B. Post-Pyramid Anchors`. `A.` Blessing fallback unchanged.

## Risks / Trade-offs

- [Stock sequential limits pairs] `n=6` brute `2.1` cards but sequential `Stock top+Waste top` + 1 redeal → `0.6` actual. Mitigation: `1B+1A` guarantees `1` even when post `0` (`83%`).
- [Explorer easy] `38→76` pyramids. Mitigation: accepted; add `max 1 post` later if needed.
- [Vault 0% sim] Heuristic under-vaults vs table early vault. Mitigation: post vault top participates like Waste; if you vault 2-3 early, post avg rises `0.6→1.2` but still capped by sequential pairing.

## Migration Plan

- Update `docs/rules.md §5B`, `docs/cheat-sheet.md §3`, `src/game.ts`, `src/components/RulesModal`, `sim/cursed_tomb_sim.py` + `sim/eval_final.py` variant, `sim/RESULTS.md`, `docs/BALANCE_SPEC.md`.
- Rollback: revert to `baseline` `1B+N random` (keep `N` specs, revert `1B+1A` one-liner).

## Open Questions

- None — vault `0%` measured, post `0.6` with redeal fix, Explorer tradeoff accepted.
