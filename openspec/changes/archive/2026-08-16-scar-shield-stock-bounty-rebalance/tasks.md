## 1. Docs & Spec Finalization (retro-docs)

- [x] 1.1 Verify `docs/rules.md` v0.0.13 §1/§2/§3/§5/§6/§7 match this change (Scar 2/3/5, Shield, blessing fallback, Stock Bounty 1–3 until, Graveyard Return) — already patched in working tree; re-read and fix drift if any
- [x] 1.2 Verify `docs/cheat-sheet.md` v0.0.13 matches: Scar Track 1–5, Shield, Curse Traps 3–4 Scars, Hero Blessings & Stock Bounty, Perfect Return
- [x] 1.3 Verify `docs/BALANCE_SPEC.md` (draft 2026-08-16) targets align: Heuristic median 140–180 surv / 3–8 wins @300, Novice vs Heuristic stretch 2–4× wins, Classic Score tertiary (`classic_score` helpers exist)
- [x] 1.4 Run `openspec validate --change scar-shield-stock-bounty-rebalance` and fix any delta mismatches before marking deltas `done`

## 2. Sim — Scar/Shield Thresholds (feature-flagged sweeps first)

- [x] 2.1 Confirm `sim/cursed_tomb_sim.py` helpers `classic_base_score`/`classic_score`/`classic_bonus_stars` and `NoviceSolver` are wired in all entrypoints (`base_game_sim.py`, `campaign_rounds_sim.py`, `sweep_thresholds.py`, `deck_evolution_core.py`, `test_solvers.py`, `get_solver/create_solver`) — already landed, verify with `py_compile`
- [x] 2.2 Add feature flag for `SCAR=2 CURSE=3 ENTOMB=5` sweeps (patch `CardState.functional_value`, `is_black/red_cursed`, `max_attrition_stage`) without breaking current `3/4/5` default; run `python sim/sweep_thresholds.py --campaigns 200 --max-rounds 300 --solver heuristic --seed 42` for both 2/3/5 and 3/4/5 to reproduce the 5.2 vs 17.4 wins gap
- [x] 2.3 Implement Stock Bounty in `cursed_tomb_sim.py:run_campaign` (`_apply_survival_reward` fallback + `N=1–3` random until non-Shield) and `deck_evolution_core:run_collapse_campaign` behind same flag; measure no-op rate (should be ~5% early, ~17% late at 3/4/5, ~1% at 2/3/4)
- [x] 2.4 Implement Perfect Graveyard Return (draw 1 random `X` 5-Scar card → 4 Scars `|X|` Imperiled) in `cursed_tomb_sim.py` and `game.ts` analog; verify at `0.26 perfects/camp @300` → `0.01` resurrections/camp, +1–3 rounds only on perfect runs
- [x] 2.5 Cut baseline `sim/RESULTS.md` for the flagged `2/3/5 + 1B + random 1–3 until` proposal: `python sim/run_simulations.py --full --workers 4 --update-results` (1000 camps / 10k games, seed 42), compare to BALANCE_SPEC PASS/FAIL

## 3. App — Game Logic & UI

- [x] 3.1 Update `src/game.ts`: `getFunctionalValue` shift at 2 Scars (≥2), `isCursed` at 3–4 Scars, 5-Scar Entombed; `determineHeroAndAnchor` fallback higher→lower→none (<3 Scars, not blessed); Stock Bounty `1–3` random draw-until-non-Shield (`rewardStage<2`) after any Win; Perfect Graveyard return (shuffle graveyard face-down, draw 1 random 5-Scar → 4 Scars); `CampaignState.graveyard` handling
- [x] 3.2 Update `src/components/PlayingCard.tsx`: Scar SVG progression `| → \ → X → | → X` (1: `|7`, 2: `|7\|8`, 3: `|7X|8`, 4: `|7X|8`, 5: `X` Graveyard); Shield `+` with 4 red blocks (quadrants), no defacement giant X; keep `Upper-Left` rank + `Upper-Right` Shield separation and `180°` symmetry
- [x] 3.3 Update `src/components/RulesModal.tsx`, `MatchedCardsModal.tsx`, `CampaignEndModal.tsx`, `GameSidebar.tsx`: Legends for Scar 1–5 / Shield / Blessing fallback / Stock Bounty `0/≤4→3 ≤8→2 else 1` / Graveyard Return, and Classic Score stars if adopted as tertiary tiebreaker

## 4. Tests & Validation

- [x] 4.1 Add unit tests for blessing fallback (higher already blessed → lower) and solo King Stock Bounty path
- [x] 4.2 Add sim regression: Heuristic vs Novice stretch at `2/3/5` should remain `2.0–4.0× wins` and `1.25–1.5× survived` (BALANCE_SPEC §4.2) after flag becomes default
- [x] 4.3 Manual playtest: 2+ physical games with `2/3/5` track and Stock Bounty shuffle-and-flip (verify `8`/`4` card fan heights and Shield quadrant drawing are comfortable)
