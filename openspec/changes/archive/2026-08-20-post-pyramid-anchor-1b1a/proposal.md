## Why

The current Stock Bounty (`N=1–3` Anchors via shuffle-and-draw-until-non-Shield from whole deck) is awkward at the table and under-rewards post-pyramid Stock play. With 1 redeal (Archaeologist) the post-pyramid Stock phase averages `0.6` pairs per Win (`83%` get 0), so rewarding `Stock cards cleared after the pyramid hits 0` directly ties future survival to actually finishing Stock, without a 52-card shuffle.

## What Changes

- **Remove Stock Bounty shuffle/fan `N=1–3`** and the `draw-until-non-Shield from active deck` rule.
- **Restore `1B+1A`:** Final pyramid pair gives Blessing to higher card (`<3 Scars`, fallback to lower if higher ineligible, none if both ineligible) **and** 1 Anchor to the lower card (`— → +`, 0 blocks). Solo `K/13` gives 1 Anchor.
- **Add post-pyramid anchors:** After the pyramid hits 28/28, the round continues pairing `Stock+Waste+Vault` (using remaining redeals) until stuck. **Every card cleared in this post-pyramid phase gets one Anchor** — both cards of a pair, or the solo `K`. No fan, no `N` tiers, no shuffle of deck.
- Vault participates post-pyramid (top of vault pairs with Stock/Waste) — currently `0%` at hit but early vault play raises post average `0.6→1.2`.

## Capabilities

### New Capabilities

- n/a — reuses existing campaign/bounty capabilities

### Modified Capabilities

- `cursed-tomb-campaign`: Survival Reward Phase changes from `1B + N random` to `1B+1A + all post-pyramid cards` — Anchors from `post-pyramid clears` not `leftover-count N`.
- `stock-bounty`: Remove `N=1–3` / `draw-until-non-Shield` / `replaces lower` semantics; replaced by `post-pyramid cards get Anchor`. Leftover counting removed.
- `pyramid-solitaire-game`: Stock phase continues after pyramid clear until no moves (already true per rules §5, but simulator `is_terminal` must not stop at `pyramid_clear` when stock piles remain and redeals left).

## Impact

- `docs/rules.md` §5B (Anchors: Stock Bounty) and `docs/cheat-sheet.md` §3, `src/game.ts` `applyEndOfWeekLifecycle`, `src/components/RulesModal.tsx`/`MatchedCardsModal.tsx` legends, `sim/cursed_tomb_sim.py` `play_round`/`run_campaign` variant, `sim/RESULTS.md` Parts 3-4, `docs/BALANCE_SPEC.md` targets.
- Explorer unchanged difficulty but becomes easier (`38→30` wins with Both, `76` with lower-only) — accepted. Survivalist unaffected (`0.1` wins). Heuristic sees `0.7` post future avg, greedy similar, novice `0.3`.
- No shuffle of deck required per Win — table time ~10s (ink 0-2 cards in-hand).
