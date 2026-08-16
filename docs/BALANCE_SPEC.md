# Balanced Archaeologist — Specification

**Status:** draft
**Date:** 2026-08-16
**Rules reference:** `docs/rules.md` (v0.0.12+ endless paradigm), `sim/RESULTS.md`
**Solvers:** `HeuristicSolver` = *Excellent* (optimal play), `NoviceSolver` = *Poor* (stochastic novice: `miss_stock=0.3, random=0.2, ignore_vault=0.5, miss_king=0.3`), `GreedySolver` retained for regression (not Poor).

---

## 1. The Cursed Tomb is cursed to fail

Campaign ends only on **Starvation** (<28 active cards). Every **Pyramid Clear** (28) and **Perfect Win** (52) scores a **Win** (§1/§6/§7). The primary metrics are **Rounds Survived** (endurance), **Pyramids Cleared** (score), and a **Stock-aware Score** for the best round.

---

## 2. How we measure Poor vs Excellent (skill stretch)

> **Poor play should lead to quick collapse. Excellent play should extend the game much longer.**

We measure this as a **ratio**, not an absolute.

| Comparison | Primary signal | Why this pair |
|---|---|---|
| **Heuristic vs Novice** | `wins Heuristic / wins Novice` and `survived Heuristic / survived Novice` | Greedy is indistinguishable from Heuristic (base win 15.0% vs 15.7% @1 redeal, endless 5.6 vs 5.8 wins @2/3/4) — it is *not* Poor. Novice is true Poor: base 12.0% (-3pp), endless 1.6 vs 5.6 wins (-3.5×) at 2/3/4 tight clock. |

**Secondary:** `P10 → P90` spread *within* a solver (luck/variance). `P90/P10` for rounds should be **2.5–3.0×** for Heuristic (long tail for epics), **~1.8×** for Novice (flat).

---

## 3. Classic Pyramid Score — stock-aware variant

Classic Pyramid counts **cards remaining in the pyramid** (lower is better; 0 = clear). It ignores Stock. For The Cursed Tomb we extend it, and we normalize for stock passes as in the classic Semicolon scoring (`50/35/20`).

### 3.1 Stock-aware Score (proposed)

* **Per-round leftover** = `remaining pyramid cards + remaining Stock+Waste+Vault cards` at round end (freeze or win). Lower is better. `0` = Perfect Win (all 52 to Foundation).
* **Campaign Best Score** = *minimum* leftover achieved across any round in the campaign (the best you ever did). Lower is better.
  * `0` — you achieved a Perfect somewhere (rare: 21% @2/3/4, 45% @3/4/5 for Heuristic, 300 cap)
  * `1–4` — excellent Stock depletion (72% of Heuristic campaigns hit ≤4 at 2/3/4)
  * `5–8` — good (100% hit ≤8 at 2/3/4)
  * `9+` — no efficient win
* **Campaign Avg Leftover** = mean leftover across all rounds (freeze + wins). Around `24–25` at 2/3/4 (pyramid 28 dominates), `23` at 3/4/5. Less discriminating than Best — kept as secondary.

### 3.2 Classic Score (pass-weighted)

Per https://www.semicolon.com/Solitaire/Rules/Pyramid.html: count not-discarded cards and subtract from a base that rewards early clears. We adapt it with `leftover` (pyramid + stock):

* **Per-round Classic Score** = `base(pass) - leftover`, where `base = 50` if pyramid cleared on pass 1, `35` on pass 2, `20` on pass 3, `10` beyond 3 (Novice infinite), `0` if pyramid not cleared. Higher is better. `50` = Perfect on pass 1; freezes are negative (`0 - ~30 = -30`).
* **Campaign Best Classic Score** = *maximum* classic score across rounds (best round, higher better). For Archaeologist (max 2 passes), `35 - leftover` caps pyramid wins at 35 (plus Perfect bonus to 50 only on pass 1).
* **Why it matters for difficulty:** The `50/35/20/10` ladder already prices `Survivalist 0→50` vs `Archaeologist 1→35` vs `Explorer 3→20` on one scale. A 35-point win on Archaeologist equals a 20-point win on Explorer in classic terms — useful when comparing chosen difficulty.
* **Python:** `sim/cursed_tomb_sim.py:classic_base_score(pass, cleared)`, `classic_score(pass, cleared, leftover)`, `classic_bonus_stars(leftover, pass, cleared)` (≥40→3★, ≥25→2★, ≥12→1★) for Stock Bounty mapping.

### 3.3 What the sim shows (Archaeologist, 300 cap)

| Track | Solver | Wins `mean med` | Rounds `mean` | Best remaining `mean med` | `Best ≤4` | `Best =0` (Perfect) | Best Classic `mean med P10→P90` |
|---|---|---|---|---|---|---|---|
| `2/3/4` | Heuristic | 4.5 med3 | 146 | 3.2 med3 | 72% | 21% | 32.5 med35 -2→46 |
| `2/3/4` | Novice | 2.0 med2 | 114 | 3.3 med3 | 71% | 24% | 26.4 med31 -5→43 |
| `3/4/5` | Heuristic | 16.2 med7 | 214 | 1.5 med1 | 96% | 45% | 40.5 med43 31→49 |
| `3/4/5` | Novice | 7.2 med5 | 160 | 1.9 med2 | 91% | 36% | 35.4 med35 27→47 |

Best remaining is *similar* for Poor vs Excellent at 2/3/4 (both hit ≤4) — it does **not** separate skill well on its own. Classic Best adds a small skill gap (`32.5→26.4` at 2/3/4, `40.5→35.4` at 3/4/5) because it rewards pass-1 clears, but still far weaker than `wins`/`rounds` (wins `4.5→2.0` = 2.3×). That's why we keep **Poor→Excellent stretch as `wins` + `survived`**, with Best/Classic as supplementary bounty/tiebreaker.

### 3.4 Why Classic is tertiary, not primary

* **Pyramids Cleared + Rounds Survived remain primary** — endurance + tally. Classic measures *peak pass-weighted efficiency* (one lucky early deal), not consistency.
* Best/Classic is a **tiebreaker / bounty trigger**: e.g. Stock Bounty (§6) can grant `≤4 → 2 Anchors, ≤8 → 1 Anchor` (or `≥40→3★, ≥25→2★` via classic stars), targeting Best intervals. Using it as the main leaderboard would reward one early Perfect over 15 consistent wins.
* **Avg/Total Classic go negative** (`-20 to -23` per round, `-3000` total) — demoralizing as a headline metric.
* Alternative **Total Foundation Cards** (`∑ (initial active - leftover per round)`) was considered but is collinear with `wins × 28 + stock cleared` — pyramids already captures it.

---

## 4. Balanced Archaeologist targets

> **Endless, 300 cap (primary) and 500 cap (timeout check), seed 42, Archaeologist 1 redeal.**

### 4.1 Absolute baseline (Heuristic median player)

| Metric | 300 cap target | 500 cap target | How to read |
|---|---|---|---|
| **Median survived** | **140–180** | 150–220 | 2–3 hrs physical; P10 ~105, P90 ~250 |
| **Mean survived** | 150–220 | 180–260 | Handles tail |
| **Median pyramids** | **3–8 wins** | 4–10 | Score |
| **Mean pyramids** | 5–15 | 8–25 | Mean > median = skewed, okay if max ≤200 |
| **>95% starve by cap** | Starvation ≥95% @300 | ≥90% @500 | Reliable death (curse) |
| **Best remaining** | med 2–4, mean ≤4 | med 1–3 | Shows stock-aware peak |
| **Timeout** | <25% @300 | <15% @500 | Not endless limbo |
| **Entombed @cap** | 20–25/52 | — | Death pressure visible |
| **B/C ratio** | 0.3–1.0 | — | Curses common |

Current `3/4/5` @300: Heuristic 218 survived (high but okay), 18.2 wins (high), 24.5% timeout (borderline). Current `2/3/4` @300: Heuristic 147 survived, 4.5 wins, 0.8% timeout — **too short/flat without bounty**.

### 4.2 Skill stretch — the Poor → Excellent gauge

| Comparison | Target ratio |
|---|---|
| **Heuristic vs Novice** `wins` | **2–4×** (e.g. Novice 5.1 → Heuristic 15.7 at 3/4/5, or 1.6→5.6 at 2/3/4) |
| **Heuristic vs Novice** `survived` | **1.25–1.5×** (Novice 155 → Heuristic 210 at 3/4/5) |
| **Heuristic** `P90/P10 survived` | **2.5–3.0×** (144→400 at 3/4/5) |
| **Novice** `P90/P10 survived` | ~1.8× (flat) |
| **Excellent extends but doesn't break**: P90 Heuristic hits cap, P10 Heuristic still >100 | Poor collapses ~115, Excellent ~210 median |

### 4.3 Play-feel (secondary, for 2/3/4 choice)

* `Blessed vs Cursed @end` `0.3–1.0`
* `Entombed 20–25/52` at 300 cap
* `Stock Bounty` triggers on ~40% of Wins (`≤8`), ~20% (`≤4`) — rubberband is helpful catch-up but capped (bonus vs init `r≈-0.12` for absolute, not runaway).

---

## 5. How to test a rule variant

1. Run `python sim/sweep_thresholds.py --campaigns 200 --max-rounds 300 --solver heuristic --seed 42 --workers 4` **and** `--solver novice` (same seed/rounds). Record `mean/med survived`, `mean/med pyramids`, `P10/P90`, `Best remaining`.
2. Run `python sim/test_solvers.py --games 200 --redraws 1 --seed 42 --workers 4` for base gap (Heuristic vs Novice base `15.7% vs 12.0%` is the floor).
3. Score PASS/FAIL vs §§4.1–4.2. Both **Absolute** and **Stretch** must pass.

---

## 6. Notes

* Greedy is *not* Poor; retained only for regression. Delete it from future balance dashboards or keep as “near-expert.”
* Stock-aware Best Score is **not** used in `sim/RESULTS.md` yet — add as Part 6 if adopted.
* Marks are never removed (physical ink additive). Any bonus must be additive Anchors/Blessings only.

