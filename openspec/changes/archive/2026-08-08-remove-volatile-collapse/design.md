## Context

See proposal.md — Why. The volatile collapse mechanic exists across three layers: the TypeScript game engine, the React UI, and the Python simulators. In all three layers it is either disabled by default or never surfaced to the user. The `volatilityWarning` state — an advisory that fires when any rank is fully entombed — is the only visible artifact of the mechanic and is being removed along with it.

## Goals / Non-Goals

**Goals:**
- Delete all code paths, types, state, and tests associated with `volatileCollapse` and `volatilityWarning`
- Narrow the `defeatReason` type union to `'starvation'` only
- Remove the `--volatile-collapse` flag and `RuleFlags.volatile_collapse` from all sim scripts
- Update RESULTS.md to reflect that the Volatile Collapse column no longer exists
- Update the two delta specs in this change to reflect the removed requirements

**Non-Goals:**
- Any new defeat or warning mechanic to replace volatile collapse
- Changes to starvation logic or any other campaign end condition
- Sim re-runs — existing RESULTS.md tables simply have the Volatile Collapse column removed; no new data generation is required

## Decisions

**Decision: Remove `volatilityWarning` entirely, not repurpose it**

The advisory warning was born from the volatile collapse mechanic — it fires on the same condition (all 4 of a rank entombed). Without volatile collapse as context, the warning has no meaningful frame of reference for the player. It is not a general deck-health indicator; it is a narrow structural signal that tracks a condition the game no longer treats as significant. Removing it keeps the UI surface clean and eliminates a computed field that has no current effect.

Alternative considered: Keep the warning as a neutral deck-health indicator. Rejected — the condition it reports (a rank fully entombed) is an ordinary outcome of normal play and does not warrant a `⚠️` UI interruption.

**Decision: Narrow `defeatReason` to `'starvation'` only (remove `'volatile-collapse'` branch)**

The union type `'starvation' | 'volatile-collapse'` can simply become `'starvation'`. The `CampaignEndModal` has a dead branch for volatile collapse that was never reachable; removing it simplifies the component. If new defeat conditions are added later, the type can be widened at that time.

**Decision: Remove the `--volatile-collapse` CLI flag rather than deprecating it**

The sim scripts are internal tooling, not a public API. There are no external consumers to protect. A clean removal is preferable to a deprecated no-op flag that persists in RESULTS.md command examples.

**Decision: Do not regenerate RESULTS.md sim tables**

The existing sim data is still valid — the Volatile Collapse column is `0.0%` everywhere. Removing the column from the Markdown table conveys the same truth without the cost of re-running campaigns. Add a note in RESULTS.md explaining the column was removed.

## Risks / Trade-offs

- `defeatReason` narrowing is a TypeScript interface change — any downstream code that matches on `'volatile-collapse'` will surface a type error at compile time, which is the desired behavior (exhaustive checks catch dead branches). This is low risk since the type was internal.
- `CampaignEndModal` has a fallback `"The tomb's ancient curse has claimed all remaining cards"` for the `else` branch — once `'volatile-collapse'` is removed, that fallback is unreachable dead code. Remove it along with the branch.
- Sim RESULTS.md is checked into the repo. Removing a column from a Markdown table is a minor doc change but should be done carefully to keep the table valid Markdown.
