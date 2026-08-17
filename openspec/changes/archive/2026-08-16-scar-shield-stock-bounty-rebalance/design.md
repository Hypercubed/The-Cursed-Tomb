## Context

See `proposal.md` — Why. Current codebase has additive scar/anchor tracking in `src/game.ts` and Python `sim/cursed_tomb_sim.py` (`attritionStage` 0–5, `rewardStage` 0–2, `blessed`), but thresholds are `scar ≥3, curse ≥4` and Anchor is `— → +` with 4 blocks. Endless campaign already merged (starvation sole defeat). Docs are at `v0.0.13` draft with new Scar/Shield language already applied to `docs/rules.md` and `cheat-sheet.md` in this working tree before this spec was opened.

## Goals / Non-Goals

**Goals:**
- Make curses reliably observable (Blessed/Cursed `0.29–0.39` not `0.96`) while keeping 4 red `+` quadrants (no 5th dot).
- Replace deterministic lower-card Anchor with stock-efficient Stock Bounty so Stock depth matters and solo K is covered, without erasing ink.
- Add Classic pass-weighted score and NoviceSolver for BALANCE_SPEC stretch metric.
- Keep all marks additive/persistent (never removed) per physical constraint.

**Non-Goals:**
- Redesigning ink colors or 180° symmetry.
- Changing Vault / Blessing powers (Hearts/Diamonds/Spades/Clubs effects unchanged except thresholds).
- Handling Novice infinite-redeal entombment exemption (deferred per §3 of prior discussion).
- Changing UI layout beyond card anatomy legends.

## Decisions

**D1 — Scar 2/3/5 (not 2/3/4, not 2/4/5)**
Why 2/3/5: Scar at 2 (first diagonal *is* shift), Curse at 3, Imperiled `|7X|` at 4 still cursed, Entombed 5. Each hit adds one red stroke (`|→\\→/→|→X`), so `X` always = cursed, right bar = death warning. `2/3/4` would be shorter (156 vs 231 rounds) and flatter (`2.0×` vs `2.6×` stretch) — we keep 2 hits of curse dwell (`cursed @end 12.8` at `2/3/5` vs `8.7` at `2/3/4`). Alternative `2/3/4` (4-stage) was simulated and rejected for session-length control and solo need.
*Alternatives:* `2/3/4` (reliable death but harsh), `2/4/5` (needs `X•` dot for linger stage, high physical cost).

**D2 — Shield 2 Anchors = 4 blocks (not 5)**
Why 4: `+` has 4 quadrants — natural physical. 5 would need center dot `⊕` which collides with Clubs wildcard `⊕` and is hard to see. Extra anchoring is provided by more *Anchors* (Stock Bounty `0–2` extra) rather than deeper Shield. 1→Fortified `—`, 2→Shield `+` with 0 blocks, 4 absorbed then `rewardStage→0`.

**D3 — Stock Bounty: 1–3 random until N non-Shields**
Why `N=1–3` via `0/≤4→3, ≤8→2, else 1` (absolute leftover): Simple fan count (`8` and `4` card heights), covers solo K, no wasted bounty on `+` (draw-until-non-Shield, `95%` effective early). Random draw from *active* remaining deck (not vulnerable-targeted) because vulnerable-targeted is headless (deterministic choice) vs physical shuffle-and-flip. At `2/3/5` single `lower` vs `random1` is identical (`4.7 vs 4.8 wins`), but `random until` fixes the `29%` no-op on `lower` when already `+` at `3/4/5` (`17.7` vs `15.0` wins). `1B+1A + 0–2 vulnerable` would be `2.8×` stretch but is deterministic and less fun than roulette.
*Alternatives:* `vulnerable-targeted 0–2` (higher stretch `2.8×` but deterministic), `cleared-count` based (inflates `r=+0.43` with deck size, stronger rubberband but needs division).

**D4 — Blessing fallback higher→lower→none**
Why: Lower is effectively random (`87%` pair / `13%` solo at `2/3/4`, lower already `+` `10%` at `2/3/4` `29%` at `3/4/5`). Trying lower when higher is ineligible (already blessed or 3+ Scars) recovers ~5% of blessings without extra complexity. Wildcard (`♣`) ineligible as primary, only as fallback.

**D5 — Perfect Graveyard Return as 4-Scar Imperiled**
Why 4 not 5/3: Keeps dying state (`|X|` still cursed & shifted, one hit from `X`), all prior ink retained, never erased. At `0.26 perfects / camp @300` → `0.01` resurrections / camp (`+1–3 rounds` on perfect runs), negligible balance impact, nice flavor. If Graveyard empty (early perfects 96%), no effect.

**D6 — Classic Score helpers, not leaderboard**
Why tertiary: Classic `Best` is similar for Poor vs Excellent at `2/3/4` (`32.5 vs 26.4`, both hit `≤4`), while `wins` separates `4.5 vs 2.0 = 2.3×`. Classic is already priced for difficulty (`50/35/20/10` ladder = `Survivalist 0→50` vs `Archaeologist 1→35`), so it compares difficulties on one scale, but `wins+rounds` stays primary.

## Risks / Trade-offs

- **2/3/5 still leaves 24% timeout @300** (vs `98%` starve at `2/3/4`) → Mitigation: Stock Bounty absorbs ~10% extra wins without snowballing to `76%` starve; session stays 3–5 hrs (acceptable for Archaeologist).
- **Random Anchors add variance** (draw 55 cards / campaign at `2/3/4`) → Mitigation: "until non-Shield" guarantees `N` effective, cap `N=3` keeps flips low (~6 per Win).
- **Doc drift**: `docs/rules.md v0.0.13` already patched before this spec → Mitigation: This spec retro-documents the working tree; validation re-reads `rules.md` and `sim/` source.
- **NoviceSolver tuning**: `miss_stock 0.3` chosen to give `12.0% vs 15.7%` base gap (`-20%`); higher values tested (`0.5 → 13.0%`) are close — may need playtest adjustment.

## Migration Plan

Phase 1 (this change): Land spec deltas and `BALANCE_SPEC.md` targets; keep `sim/` thresholds behind feature-flagged `SCAR=2 CURSE=3 ENTOMB=5` for sweeps. Docs at `v0.0.13` are canonical.
Phase 2 (next change): Wire `src/game.ts` `getFunctionalValue`/`isCursed` thresholds `≥2/≥3`, Blessing fallback, Stock Bounty draw-until, Graveyard return; update `PlayingCard.tsx` Scar SVG (`| → \\ → X → |`) and Shield quadrants.
Rollback: Revert thresholds to `≥3/≥4` and `lower → Anchor` by toggling one function; Graveyard return is no-op when graveyard empty.
