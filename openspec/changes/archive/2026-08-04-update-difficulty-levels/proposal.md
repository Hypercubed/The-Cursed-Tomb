## Why

The current Novice (Unlimited) and Explorer (2 redeals) difficulty settings make the early difficulties too easy for meaningful campaign play, resulting in a poor difficulty curve. Replacing Unlimited with 5 redeals and 2 with 3 redeals provides a more structured and balanced progression while still keeping the lower tiers accessible.

## What Changes

- **Novice** redeal limit changes from `null` (Unlimited) to `5` (finite value)
- **Explorer** redeal limit changes from `2` to `3`
- **Archaeologist** remains `1` redeal — no change
- **Survivalist** remains `0` redeals — no change
- All UI text, descriptions, and win-rate stats referencing "Unlimited" for Novice are updated to "5 Redeals (6 Passes)"
- All UI text referencing "2 Redeals (3 Passes)" for Explorer is updated to "3 Redeals (4 Passes)"
- Loss detection logic for infinite-redraw games no longer applies to Novice (previously `null`, now a finite `5`)
- The `GameSidebar` redraw options list is updated to reflect the new values
- The `rules.md` documentation is updated to reflect the new redeal counts

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `campaign-setup-modal`: Redeal limits for Novice (5) and Explorer (3) are changing; the displayed text and values in the difficulty selection UI must be updated.
- `pyramid-solitaire-game`: Novice mode switches from infinite-redraw (`null`) to finite (`5`); the loss detection path for infinite-redraw games no longer applies to Novice.

## Impact

- `src/components/CampaignSetupModal.tsx`: `DIFFICULTY_OPTIONS` array — update `value`, `redealsText`, and `description` for Novice and Explorer entries
- `src/components/GameSidebar.tsx`: `redrawOptions` array and `getDifficultyLabel` helper — update labels and values for Novice and Explorer
- `src/components/RulesModal.tsx`: Novice description text references "Unlimited Redeals" — update to "5 Redeals"
- `docs/rules.md`: Section 3 (Preparation & Difficulty) — update redeal counts for Novice and Explorer
- Win-rate percentages in `DIFFICULTY_OPTIONS` should be reviewed/updated if simulation data is available for the new counts (noted as a task item; existing values are placeholders until re-simulated)
