## Why

In continuous campaigns, decks with 28 or more Anchored cards can reach a state of 0% solvability yet never collapse because standard Anchors grant permanent attrition immunity. The Anchor Absorption rule allows Anchors to act as defensive shields that absorb up to 4 freeze hits before exhausting (returning to un-anchored status), guaranteeing eventual collapse for unwinnable decks while preserving pre-existing attrition marks.

## What Changes

- **Core Rule & Engine Update**: Anchored cards (`reward_stage == 2`) now absorb up to 4 freeze attrition marks (`anchorAbsorption` count 0..4).
- **Shield Exhaustion**: On absorbing the 4th freeze hit, the card's `reward_stage` drops to 0 (anchor breaks), while its `attrition_stage` is preserved so it resumes taking standard attrition on subsequent freezes.
- **Web App Game Engine**: Update `CursedCard` state in `src/game.ts` to persist `anchorAbsorption` and apply absorption during freeze processing.
- **Rules Documentation & UI**: Update `docs/rules.md` and `src/components/RulesModal.tsx` to describe the Anchor Absorption shield rule.
- **Simulation Engine & Analysis**: Enable `anchor_absorption` by default in `sim/cursed_tomb_sim.py`, `sim/deck_evolution_core.py`, and `sim/deck_evolution_analysis.py`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `cursed-tomb-campaign`: Add requirement and scenarios for Anchor Absorption shield tracking and exhaustion during freeze processing.
- `expedition-rules-modal`: Document Anchor Absorption shield mechanics in expedition rules documentation.
- `python-simulation-solvers`: Update simulation flags and execution behavior to enable Anchor Absorption by default.
- `deck-evolution-analysis`: Reflect Anchor Absorption defaults and state preservation in deck evolution analysis specifications.

## Impact

- **TypeScript Engine (`src/game.ts`)**: Add `anchorAbsorption` to `CursedCard` interface, persistence schema, and freeze processing.
- **UI (`src/components/RulesModal.tsx`, `src/components/PlayingCard.tsx`)**: Reflect anchor absorption shield status / rules.
- **Documentation (`docs/rules.md`)**: Document the Anchor Absorption rule.
- **Python Simulations (`sim/cursed_tomb_sim.py`, `sim/deck_evolution_core.py`, `sim/deck_evolution_analysis.py`)**: Enable `anchor_absorption = True` by default.
