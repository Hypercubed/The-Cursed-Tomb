## Context

The Deck Codex header legend formerly used literal `|#\|` text as a stand-in for "a card at Scar stage 3". The intended representation is visual: an `N` rank with blue marks on each side and a diagonal slash, matching the stage-3 overlay used on matrix rank cells.

The change is purely cosmetic: replace the legend's literal placeholder with a compact inline SVG mark in source code, and update the corresponding spec wording.

## Goals / Non-Goals

**Goals:**
- Replace the literal `|#\|` placeholder in the Deck Codex legend with a visual `N` plus the stage-3 scar marks used in matrix cells: two blue vertical strokes and one diagonal slash.
- Update `openspec/specs/card-rendering/spec.md` (requirement text and scenario text) to describe the marked-N visual.

**Non-Goals:**
- Changing any SVG rendering logic or card component behavior.
- Updating tooltip interpolation (tooltips already use rank-specific labels).
- Modifying `RoundSummaryModal.tsx` (its rank-specific notation is unrelated to this static matrix legend).

## Decisions

### Decision: Use a marked `N` rather than literal pipe characters
- **Choice**: Render `N` with two blue side strokes and one diagonal slash in an inline SVG.
- **Rationale**: This mirrors the existing matrix rank overlay and makes the visual meaning of the Scarred status immediately recognizable.

### Decision: Keep the legend mark local to the matrix legend
- **Choice**: Use a compact inline SVG in the JSX legend span rather than introducing a shared component.
- **Rationale**: The static legend mark has no dynamic stage or rank behavior, so a local representation keeps the change focused while reusing the matrix geometry.

## Risks / Trade-offs

- **[Risk]**: The existing spec language in `card-rendering/spec.md` could continue describing literal placeholder text if only the UI is updated.
  - **Mitigation**: The requirement and scenario are updated to describe the visual marked-N legend.
