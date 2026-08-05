## Why

The legend in the Deck Codex matrix used the literal `|#\|` text as a generic placeholder symbol for a Scarred card. The intended notation is visual: an `N` rank with blue marks on each side and a diagonal slash, matching the SVG ink overlay rendered on matrix rank cells. The legend should make that relationship obvious at a glance.

## What Changes

- Replace the literal `|#\|` placeholder text in the Deck Codex header legend with a visual `N` rank mark carrying the same stage-3 scar treatment as matrix cells: blue vertical strokes on both sides and a diagonal slash.
- Update `openspec/specs/card-rendering/spec.md` to describe the visual marked-N legend, so the spec and UI communicate the same generic scarred-rank symbol.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `card-rendering`: Use a marked `N` (side strokes plus diagonal slash) as the canonical generic placeholder for the Scar (Stage 3) attrition notation in legends and spec language.

## Impact

- `src/components/MatchedCardsModal.tsx` — the header legend's visual Scarred rank mark.
- `openspec/specs/card-rendering/spec.md` — the requirement and scenario describing the visual marked-N legend.
