## Why

In `RoundSummaryModal.tsx`, the Attrition Summary section displays "Functional Value shifted +1/-1 (now acts as rank X)" for all cards in the `scarred` list, including Stage 1 (Vulnerable) and Stage 2 (Doubtful) cards. According to Section 5 of `docs/rules.md`, functional value shifts only take effect at Stage 3+ (The Scar). Displaying a value shift message for Stage 1 and 2 cards causes confusion and misinforms players about card rules.

## What Changes

- Update `RoundSummaryModal.tsx` to conditionally format the card description based on `card.attritionStage`:
  - **Stage 1**: "Stage 1 (Vulnerable |N): 1st attrition stroke (No functional value shift yet)"
  - **Stage 2**: "Stage 2 (Doubtful |N|): 2nd attrition stroke (No functional value shift yet)"
  - **Stage 3**: "Stage 3 (Scar |N\|): Functional Value shifted +1/-1 (now acts as rank X)"
- Update header text and labels in `RoundSummaryModal.tsx` to align with the specific attrition stages.

## Capabilities

### Modified Capabilities
- `card-rendering`: Ensure modal summaries accurately reflect attrition stage mechanical effects.

## Impact

- `src/components/RoundSummaryModal.tsx`: Updated attrition text logic.
- Tests in `src/components/RoundSummaryModal.test.ts` or component rendering tests.
