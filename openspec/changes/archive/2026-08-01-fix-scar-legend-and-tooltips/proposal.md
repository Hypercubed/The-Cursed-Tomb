# Proposal: Fix Scar Legend and Tooltip Formatting

## Why

In `MatchedCardsModal.tsx`, `PlayingCard.tsx`, and `RoundSummaryModal.tsx`, attrition scar stages and tooltips present the raw rulebook variable placeholder `|N` or `|N\|` (where `N` stood for "Number") directly to players. For example, the Tomb Vault header legend displays `|N\| Scarred` and specific card tooltips display `Scar 1 (|N)`. This confuses players because literal `N` looks like un-interpolated template code or cryptic syntax rather than human-readable information with actual card ranks.

## What Changes

- Update `MatchedCardsModal.tsx`:
  - Change top legend text from `|N\| Scarred` to `|#\| Scarred`.
  - Update card tooltip string generation to interpolate actual card rank labels instead of hardcoding literal `'N'`:
    - Stage 1: `Scar 1 (|7)`
    - Stage 2: `Scar 2 (|7|)`
    - Stage 3: `Scar 3 (|7\|)`
- Update `PlayingCard.tsx`:
  - Replace hardcoded `|N`, `|N|`, `|N̸|` in upper-right tooltips with interpolated card rank labels like `|7`, `|7|`, `|7\|`.
- Update `RoundSummaryModal.tsx`:
  - Change section header text `New Attrition Marks (|N / |N| / |N\|)` to `New Attrition Marks (|# / |#| / |#\|)`.
  - Replace per-card stage titles `Vulnerable (|N)` and `Doubtful (|N|)` with interpolated card rank labels like `Vulnerable (|7)` and `Doubtful (|7|)`.

## Capabilities

### Modified Capabilities
- `card-rendering`: Display clear, rank-interpolated scar stage tooltips and header legends without literal raw variable placeholders (`|N`).

## Impact

- `src/components/MatchedCardsModal.tsx`
- `src/components/PlayingCard.tsx`
- `src/components/RoundSummaryModal.tsx`
