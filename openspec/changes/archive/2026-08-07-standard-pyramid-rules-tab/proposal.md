## Why

Players looking for a quick reference on standard Pyramid Solitaire rules currently have to infer them from the campaign ruleset or external documentation. Adding a dedicated "Standard Pyramid" tab to the Expedition Rules & Compendium modal provides a clear, accessible guide to classic Pyramid Solitaire rules and highlights how *The Cursed Tomb* campaign mechanics build upon them.

## What Changes

- Add a new "Standard Pyramid" tab (`standard-pyramid`) to the Expedition Rules & Compendium modal (`RulesModal.tsx`).
- Update `RulesTab` union type and tab validation logic to support four tabs (`core-rules`, `standard-pyramid`, `web-guide`, `card-anatomy`).
- Display classic Pyramid Solitaire objective, 28-card pyramid layout structure, card values & target sum 13 pairing rules, stock/waste/redeal mechanics, and a side-by-side comparison table between Standard Pyramid Solitaire and *The Cursed Tomb* campaign.
- Update tests in `RulesModal.test.ts` to cover the new tab and type definition.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `expedition-rules-modal`: Update multi-section tabbed rules navigation requirement to include the new "Standard Pyramid" rules tab alongside the existing campaign rules, web controls, and card anatomy tabs.

## Impact

- `src/components/RulesModal.tsx`: Updated tab navigation, type definition, and section content rendering.
- `src/components/RulesModal.test.ts`: Updated unit tests for `RulesTab` and `RulesModal`.
