# Design: Fix Attrition Stage Descriptions in Round Summary Modal

## Problem

Currently in `RoundSummaryModal.tsx`:
```tsx
<span className="text-[11px] text-amber-300/80 leading-tight">
  {isRed
    ? `Functional Value shifted +1 (now acts as rank ${fVal})`
    : `Functional Value shifted -1 (now acts as rank ${fVal})`}
</span>
```
This hardcodes "Functional Value shifted..." for any card in `effects.scarred`, regardless of whether `card.attritionStage` is 1, 2, or 3.

## Solution

Branch on `card.attritionStage`:
- `attritionStage === 1`: "Stage 1 (Vulnerable |N): 1st attrition stroke (No functional value shift yet)"
- `attritionStage === 2`: "Stage 2 (Doubtful |N|): 2nd attrition stroke (No functional value shift yet)"
- `attritionStage >= 3`: "Stage 3 (Scar |N\|): Functional Value shifted ${isRed ? '+1' : '-1'} (now acts as rank ${fValLabel})"

Also update the title label in `RoundSummaryModal.tsx`:
- `{card.suit}{card.rank} — ${stageLabel}`
  Where `stageLabel` is:
  - Stage 1: "Vulnerable (|N)"
  - Stage 2: "Doubtful (|N|)"
  - Stage 3: "Red Scar" / "Black Scar"
