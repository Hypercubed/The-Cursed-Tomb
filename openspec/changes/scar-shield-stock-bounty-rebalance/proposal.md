## Why

The current 3/4/5 attrition track (scars at 3, curses at 4, entombment at 5) makes curses rare (Blessed/Cursed ≈0.96) and entombment unreliable (28% of Archaeologist campaigns never starve by 300, 14% by 500). Pyramid rewards are unbalanced: a Perfect Win (52) gives no extra benefit despite being rare (0.5/campaign), the lower-card Anchor is wasted 10–29% of the time when already a Shield (+), and the 5-hit Anchor absorption is hard to track (four quadrants of a + cannot hold five marks). Marks are never removed in the physical game. The game needs an additive-only rebalance where Scars/Anchors are cleanly trackable, curses are common, Stock depletion is rewarded, and every campaign reliably collapses.

## What Changes

- **Scar track 2/3/5 (BREAKING)**: Redefine the Upper-Left Scar progression as 1 Scar `|7` Vulnerable → 2 Scars `|7\\|8` Scarred (value shift ±1) → 3 Scars `|7X|8` Cursed → 4 Scars `|7X|8` Imperiled (still Cursed) → 5 Scars `X` Entombed. Every hit adds one red stroke (`|→\\→/→|`); first diagonal *is* the Scar. Removes the `|7|` Doubtful frame and the "deface the card" language. A Perfect Win can return one Entombed `X` card as 4 Scars `|X|`.
- **Blessing fallback**: Pyramid Clear Blessing (1 per Win) offered to the higher-value card if eligible (<3 Scars, not already blessed); if ineligible, offer to the lower card; if both ineligible, no Blessing.
- **Anchors → Shield**: Each blue stroke `—` is one Anchor; two Anchors form a Shield `+` containing 4 Scar absorption blocks (quadrants around `+`). Absorption, exhaustion (4th block → 0 Anchors, scars preserved), and 180° symmetry unchanged except wording.
- **Stock Bounty replaces lower-card Anchor (BREAKING)**: Every Win grants `N=1–3` random Anchors drawn until `N` non-Shield cards are found (shuffle remaining active deck face-down, flip past existing Shields). `N=3` if `Stock+Waste+Vault` leftover `0` (Perfect) or ≤4, `N=2` if ≤8, else `N=1` mandatory. Solo K also grants this bounty (no Blessing). Covers the 10–29% no-op on `lower` and the 11% solo clears.
- **Perfect Graveyard Return**: On a Perfect Win only, after §6 Survival Rewards, shuffle the Graveyard Box face-down, draw one random Entombed `X` card, return it to the active deck as 4 Scars `|7X|` Imperiled (keeps prior ink, still Cursed), one Scar from death.
- **Classic Score**: Introduce `classic_base_score` / `classic_score` / `classic_bonus_stars` per https://www.semicolon.com/Solitaire/Rules/Pyramid.html (`50/35/20/10` by pass, `base - leftover`), and the `NoviceSolver` (miss_stock 0.3, random 0.2, vault 0.5) to measure Poor→Excellent stretch.

## Capabilities

### New Capabilities
- `classic-score`: Classic Pyramid pass-weighted scoring (Semicolon 50/35/20) adapted to Stock+Waste+Vault leftovers and its star mapping for Stock Bounty, per BALANCE_SPEC.md.
- `stock-bounty`: Random-draw Stock Bounty (1–3 Anchors drawn until N non-Shields, `≤4:3 ≤8:2 else 1`) replacing the deterministic lower-card Anchor.

### Modified Capabilities
- `cursed-tomb-campaign`: Scar track 2/3/5, Anchor→Shield 2=Shield/4 blocks, Blessing fallback higher→lower→none, removal of lower-card Anchor, Perfect Graveyard Return, and endless pile handling for remaining deck counts.
- `pyramid-solitaire-game`: Functional value shift now at 2 Scars (not 3), curse threshold at 3 Scars (not 4), and Entombed at 5 Scars with new `|7X|` Imperiled stage.
- `matched-cards-tracking`: Expedition Deck & Stats modal and card anatomy legend updated to Scar 1–5 / Anchor→Shield / Perfect return wording.

## Impact

- `docs/rules.md` v0.0.12→0.0.13 (§1/§2/§3/§5/§6/§7): Scar 2/3/5, Shield, blessing fallback, Stock Bounty, Graveyard Return. `docs/cheat-sheet.md` and `docs/BALANCE_SPEC.md` (new) updated to match.
- `src/game.ts` & UI (`PlayingCard.tsx`, `RulesModal.tsx`, `MatchedCardsModal.tsx`, `CampaignEndModal.tsx`): Thresholds `attritionStage` semantics (Scars count), Shield logic, blessing fallback, random-draw bounty, Graveyard return.
- `sim/` (`cursed_tomb_sim.py`, `deck_evolution_core.py`, `sweep_thresholds.py`, `test_solvers.py` + `sim/solvers/novice.py`, `classic_score` helpers): Enable endless scoring validation, Novice vs Heuristic stretch metric, and variant sweeps. `sim/RESULTS.md` Part 3 now endless and `classic_score` is tertiary.
