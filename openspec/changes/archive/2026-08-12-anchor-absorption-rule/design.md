## Context

See `proposal.md` for motivation. Currently, the TypeScript web engine (`src/game.ts`) tracks `rewardStage` (0, 1, 2) on `CursedCard`, but does not track `anchorAbsorption`. In the Python simulation suite (`sim/cursed_tomb_sim.py`), `anchor_absorption` logic exists on `CardState`, but defaults to `False`.

## Goals / Non-Goals

**Goals:**
- Add `anchorAbsorption` (0..4) to `CursedCard` in `src/game.ts` and persist it in `src/storage/persistence.ts`.
- Update `applyEndRoundAttrition()` in `src/game.ts` to process anchor absorption hits before incrementing `attritionStage`.
- Ensure anchor exhaustion (`anchorAbsorption >= 4`) resets `rewardStage` to 0 while preserving `attritionStage`.
- Update `docs/rules.md` and `src/components/RulesModal.tsx` to document the Anchor Absorption shield rule.
- Set `anchor_absorption = True` by default across the Python simulation suite (`sim/cursed_tomb_sim.py`, `sim/deck_evolution_core.py`, `sim/deck_evolution_analysis.py`).

**Non-Goals:**
- Modifying Fortifying (`rewardStage == 1`) mechanics or Hero Blessing rules.
- Modifying card rendering SVG badges (top-right `+` badge renders while `rewardStage == 2`).

## Decisions

- **Decision 1: Preserve Attrition Stage on Anchor Break**: When `anchorAbsorption` reaches 4, `rewardStage` drops to 0, but `attritionStage` is preserved (not reset to 0).
  - *Rationale*: Resetting `attritionStage` to 0 wiped out pre-existing scars/curses, creating an unwanted healing bug. Preserving `attritionStage` allows cards to resume taking scars towards entombment.
- **Decision 2: Re-anchoring Resets Absorption Count**: When a card reaches `rewardStage == 2` via survival rewards, its `anchorAbsorption` is reset to 0.
  - *Rationale*: A freshly earned anchor grants a brand new set of 4 absorption shield charges.
- **Decision 3: Schema Backward Compatibility**: Provide default `anchorAbsorption: 0` when loading legacy saved campaign states or creating fresh card instances.
  - *Rationale*: Prevents `undefined` NaN runtime errors during state persistence hydration.

## Risks / Trade-offs

- **[Risk]** Saved campaign state loading without `anchorAbsorption` field.
  - **Mitigation:** Fall back to `anchorAbsorption ?? 0` during deserialization in `src/storage/persistence.ts`.
- **[Risk]** Rules modal text desynchronization with physical `docs/rules.md`.
  - **Mitigation:** Update both `docs/rules.md` §5/§6 and `src/components/RulesModal.tsx` in lockstep.
