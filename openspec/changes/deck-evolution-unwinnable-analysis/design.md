## Context

The Cursed Tomb simulator (`cursed_tomb_sim.py`) already supports full campaign simulation with persistent deck state (ink marks: attrition stages 0–5, reward stages 0–2). As rounds progress, cards accumulate scars (stage 3, value shift ±1), curses (stage 4, trap/restriction effects), and eventually become entombed (stage 5, removed from active play). These changes alter card functional values and pairing legality.

The core research question is: **as ink accumulates, how quickly does the deck reach a state where no arrangement of 28 pyramid cards can produce a legal pyramid clear?** The existing simulator has no mechanism to answer this — it only tells us the campaign ended, not whether each individual round was theoretically winnable.

The current simulator's end-game conditions (starvation collapse, volatile collapse, victory) make campaigns terminate well before the natural decay progression can be observed in full. We need a version with **all terminal conditions suppressed**, running campaigns indefinitely (or to a high round cap) and sampling solvability at each round.

## Goals / Non-Goals

**Goals:**
- Determine, per round number, the **fraction of campaigns where the deck state is unwinnable** (no possible pyramid clear exists)
- Determine **how quickly** the deck first becomes unwinnable (round of first unwinnable state per campaign)
- Support multiple difficulty levels and solvers to understand how mechanics interact with solvability
- Produce clear tabular and ASCII-chart output for immediate readability
- Keep the script self-contained in `sim/` with no changes to core simulation code

**Non-Goals:**
- Exhaustive/provably-correct solvability oracle (too expensive for large batch runs; use Monte Carlo sampling or heuristic detection instead)
- UI or frontend changes
- Modifying `cursed_tomb_sim.py` or any existing script
- Producing a perfect game solver; approximate detection is acceptable if clearly labeled

## Decisions

### Decision 1: How to detect "unwinnable" states

**Problem**: True mathematical proof of an unwinnable state requires exploring all possible shuffles and move sequences — NP-complete in the general case.

**Chosen approach**: **Multi-probe sampling oracle** — for each round's deck state, run `N_probes` (default 200) independent random shuffles of the active cards and attempt to clear the pyramid with the best available solver. If **zero** probes succeed in clearing the pyramid (outcome is `pyramid_clear` or `perfect_win`), the state is declared "empirically unwinnable" for that round.

**Rationale**: 
- True unwinnable states (due to curse/scar constraints) are structurally blocked regardless of shuffle; 200 probes will reliably find zero successes when genuinely blocked.
- A winnable deck with normal difficulty will succeed in several probes; false negatives (declaring winnable as unwinnable) are extremely unlikely with 200 probes.
- This keeps runtime tractable: O(campaigns × rounds × N_probes × play_round) rather than full exhaustive search.

**Alternatives considered**:
- *Static analysis of value pairings*: Build the pairing graph and check for perfect matching. Rejected: doesn't account for curse restrictions, stock ordering, or partial-clears that expose new cards.
- *Single probe*: Too noisy — one failed shuffle doesn't prove impossibility.
- *DFS solver*: More accurate but 10–100× slower; defeats the purpose of batch analysis.

### Decision 2: Campaign structure with disabled end-game conditions

**Approach**: Create a `run_infinite_campaign()` function that:
1. Disables all termination checks (starvation, volatile collapse, soft/sealed victories)
2. Still applies attrition on freeze (so the deck evolves)
3. Still awards survival rewards on pyramid clears (so blessings/anchors accumulate)
4. Runs for `--max-rounds` rounds, collecting per-round solvability data
5. After each round, calls the solvability oracle (multi-probe) **without mutating** the deck state

**Key flag configuration**: `RuleFlags` with `volatile_collapse=False`, `sealed_tomb_victory=False`, `rank_anchor_victory=False` — victory/collapse checks manually bypassed in the new runner.

### Decision 3: Output format

**Chosen approach**: 
1. **Per-round aggregate table**: For each round, report: `%_unwinnable`, `%_first_unwinnable_this_round`, `mean_probe_successes`
2. **Cumulative unwinnable curve**: By round R, what % of campaigns have ever seen an unwinnable state?
3. **ASCII bar chart**: Win-rate (probe successes ÷ N_probes) vs. round, plotted inline
4. **Summary stats**: Median round of first unwinnable state, fraction of campaigns that never become unwinnable within the cap

**Rationale**: Answers both sub-questions from the brief — "how quickly" (first-unwinnable distribution) and "how often" (cumulative curve + per-round rate).

### Decision 4: Sampling interval

For long campaigns (hundreds of rounds), running 200 probes every round is expensive. Add `--sample-interval K` (default 1) so the oracle runs every K rounds. Between samples, solvability is interpolated as "unknown" in the table but not in statistics.

## Risks / Trade-offs

- **False negatives in oracle**: A deck with very low win probability (e.g., 0.5%) may falsely appear "unwinnable" with 200 probes. → Mitigation: Report `mean_probe_wins` alongside binary classification; users can see the gradient.
- **Runtime**: 1000 campaigns × 200 rounds × 200 probes × ~50ms/play_round = potentially hours. → Mitigation: Default to 100 campaigns, 100 rounds, 50 probes; document how to scale up. Use the `greedy` solver (fastest) for probes.
- **Curse interactions**: Black-cursed cards that re-enter stock complicate "is this winnable" semantics. The multi-probe approach naturally handles this since we actually play the game.
- **All-anchored stall**: If all active cards become anchored, attrition stops evolving. The new runner should detect this and report it, then stop (true equilibrium reached, not unwinnable in the traditional sense).

## Open Questions

- Should the oracle use a fixed random seed per round (reproducible but may always find/miss the same arrangements) or fresh randomness (noisier but more representative)? → Recommend fresh randomness per probe, fixed seed per campaign start.
- How many probes N is "enough"? 200 is a reasonable default; the script should expose `--probes` so users can tune.
