## Context

`docs/rules.md:48` currently defines Novice as 5 (6 passes) in HEAD; target is Novice ∞, Explorer 2. Sims intentionally remain at 5 to avoid infinite loops. Single-game sims: 2 redeals = 31.55% pyramid clear vs 3 = 34.75% vs ∞/5 = 34.90%; campaigns: 2 = vic 54.2% vs 3 = 55.2% vs ∞ = 55.3%.

## Goals / Non-Goals

**Goals:**
- Set Novice to infinite (null) and Explorer to 2 redeals (3 passes) to create visible ladder: Novice ∞ > Explorer 2 > Archaeologist 1 > Survivalist 0
- Keep change isolated to digital game + docs; sims unchanged this change

**Non-Goals:**
- Changing sim `DIFFICULTIES` or `RESULTS.md`
- Rebalancing Archaeologist/Survivalist

## Decisions

- **Explorer 2 not 3:** 3 is indistinguishable from ∞ (34.75% vs 34.90%). 2 gives 31.55%, a 3.3pp gap, enough to be noticeable.
- **Novice = infinite (null):** Tutorial/sandbox should be unlimited. Alternative 5 considered but not meaningfully different from ∞.
- **Keep sim cap at 5:** Prevents infinite loops in `run_campaign` batch runs. Alternative ∞ in sims would require `None` handling in `cursed_tomb_sim.py:290,450` and revalidation of `RESULTS.md` — deferred.
- **Label '∞ Redeals (Unlimited Passes)' / '2 Redeals (3 Passes)':** Matches physical counting (redeals = passes-1).
- **No winRate change:** Keep display rates for now; Explorer actual at 2 is 31.55% — update in follow-up after validation.

## Risks / Trade-offs

- **Digital/sim divergence (game ∞/2 vs sim 5/3)→** → Mitigation: Spec scenario explicitly calls out sim cap unchanged; validation will catch drift
- **Small campaign delta (54.2% vs 55.3%) may not feel different** → Mitigation: Single-game gap is visible; campaign difference is minor by design due to progress gate
