## Why

The legend in the Deck Codex matrix uses `|#\|` as the generic placeholder symbol for a Scarred card, but `#` is ambiguous — it reads as a hash/number sign rather than a stand-in for "any rank". The attrition notation system uses vertical pipes and a backslash stroke (`|7\|`) that directly maps to the SVG ink overlays rendered on cards; the legend placeholder should make that relationship obvious at a glance.

## What Changes

- Replace the `|#\|` placeholder text in the Deck Codex header legend with `|N\|`, which mirrors the established stage-3 notation pattern used in tooltips, the Round Summary modal, and the rules modal.
- Update `openspec/specs/card-rendering/spec.md` to replace the `|#\|` placeholder language with `|N\|` throughout, so the spec, the UI, and the in-game tooltips all use the same generic rank symbol.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `card-rendering`: Replace `|#\|` with `|N\|` as the canonical generic placeholder for the Scar (Stage 3) attrition notation in legends and spec language.

## Impact

- `src/components/MatchedCardsModal.tsx` — one string literal in the header legend.
- `openspec/specs/card-rendering/spec.md` — two occurrences of `|#\|` in requirement and scenario text.
