# Design: Fix Scar Legend and Tooltip Formatting

## Overview

The attrition scar UI components rely on pen stroke representations (`|`, `||`, `|\`). In early versions, literal `'N'` was used as a generic stand-in for "Number" / "Rank". To fix player confusion, we will:
1. Use `#` in generic legends where no single card rank exists.
2. Dynamically interpolate the card's formatted rank label (`rLabel`, e.g., `A`, `7`, `K`) in specific card tooltips and modal summaries.

## Detailed Tooltip Mapping

### `MatchedCardsModal.tsx`
- **Header Legend:** `<span className="font-mono font-bold">|#\|</span> Scarred`
- **Card Matrix Tooltips (`statusParts`):**
  - Attrition Stage 1: `Scar 1 (|${rLabel})`
  - Attrition Stage 2: `Scar 2 (|${rLabel}|)`
  - Attrition Stage 3: `Scar 3 (|${rLabel}\|)`

### `PlayingCard.tsx`
- **Upper Right Tooltips (`getUpperRightTooltip`):**
  - Attrition Stage 1: `Vulnerable (|${rLabel}): 1st Attrition line to the left of rank`
  - Attrition Stage 2: `Doubtful (|${rLabel}|): 2nd Attrition line to the right of rank`
  - Attrition Stage 3: `Red Scar (|${rLabel}\|): Functional value shifted (+1). Effective value: ${rankLabel(fVal)}` / `Black Scar (|${rLabel}\|): Functional value shifted (-1)...`

### `RoundSummaryModal.tsx`
- **Section Title:** `🩸 New Attrition Marks (|# / |#| / |#\|)`
- **Per Card Stage Title:**
  - Stage 1: `Vulnerable (|${fValStr})`
  - Stage 2: `Doubtful (|${fValStr}|)`
  - Stage 3: `Red Scar (|${fValStr}\|)` / `Black Scar (|${fValStr}\|)`

## Verification

Run all unit and component tests (`npm test`).
