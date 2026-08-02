## Context

The Deck Codex header legend uses `|#\|` as a stand-in for "a card at Scar stage 3". The rest of the codebase — card tooltips in `PlayingCard.tsx`, the Round Summary modal, and the Rules modal — all use `|N\|` (where `N` represents the card's rank) as the generic placeholder when the actual rank is unknown. The `#` character is a poor choice here because it collides with the common shorthand for "number" or markdown headings, whereas `N` is a transparent algebraic placeholder that matches the existing pattern.

The change is purely cosmetic: two string edits in source code, two string edits in a spec file.

## Goals / Non-Goals

**Goals:**
- Replace `|#\|` with `|N\|` in the Deck Codex legend text in `MatchedCardsModal.tsx`.
- Replace `|#\|` with `|N\|` in `openspec/specs/card-rendering/spec.md` (requirement text and scenario text).

**Non-Goals:**
- Changing any SVG rendering logic or card component behavior.
- Updating tooltip interpolation (tooltips already use rank-specific labels, not the `#` placeholder).
- Modifying `RoundSummaryModal.tsx` (it already uses `|N\|` correctly).

## Decisions

### Decision: Use `|N\|` not `|*\|` or `|?\|`
- **Choice**: `|N\|` as the placeholder.
- **Rationale**: `N` is already used in every other place in the codebase that needs a generic rank stand-in (tooltip strings, spec scenarios, rules documentation). Consistency wins over novelty.

### Decision: No component rename or prop changes
- **Choice**: Edit the inline string literal in the JSX legend span only.
- **Rationale**: This is a display-text fix, not a structural change. Zero risk of breaking imports or prop interfaces.

## Risks / Trade-offs

- **[Risk]**: The existing spec language in `card-rendering/spec.md` also references `|#\|`. If only the UI is updated and the spec is not, they diverge.
  - **Mitigation**: Both edits are in scope. The delta spec under `card-rendering` ensures the main spec is updated at archive time.
