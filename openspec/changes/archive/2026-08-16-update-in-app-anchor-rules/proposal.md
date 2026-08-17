## Why

While the core game engine, card renderer, and round summary modal fully implement Anchor acquisition, defensive progression (`[—]` Fortifying vs `[+]` Anchored), and freeze hit absorption (up to 4 scarlet red quadrant marks), the in-app Expedition Rules Compendium modal (`src/components/RulesModal.tsx`) omits critical details of the Anchor system. Users relying on the in-app rules modal currently receive incomplete information about how cards become Anchored, how Anchors function during round freezes, and how Anchors behave in digital gameplay.

Updating the in-app rules compendium to accurately mirror the official physical ruleset (`docs/rules.md` §4.5, §5, §6) and web app implementation ensures player clarity and complete rule parity across all tabs of `RulesModal.tsx`.

## What Changes

- **Core Rules Tab (`core-rules`)**:
  - Add **Rule 5 (Retrospective Anchor Rules & Absorption Shield)** to Section 4 (Live-Play Architecture), detailing how the upper-right blue `[+]` Anchor acts as a defensive shield absorbing up to 4 round-freeze attrition hits, marked with scarlet red corner dots before exhausting.
  - Add the **Immunity Exception** callout to Section 5 (The Attrition Track), detailing how Anchored `[+]` cards absorb freeze hits instead of advancing Attrition stages.
  - Expand Section 6 (Survival Rewards) to explicitly detail Anchor acquisition and progression rules:
    - Lower-value card in a final pair clear receives the Anchor stroke (`[—]` Fortifying → `[+]` Anchored).
    - Solo 13 / King clears award an Anchor stroke (no Hero blessing).
    - Wildcard partner rule (Clubs Wildcard in final pair defaults to taking the Anchor stroke).
    - Anchor progression for active cards at any Attrition stage (including Scarred/Cursed).
- **Web Guide Tab (`web-guide`)**:
  - Add a dedicated interaction section for **Anchors & Defensive Immunity**, explaining how anchor upgrades appear in the Round Summary modal and how the digital UI displays corner absorption charges (`0/4` through `4/4`).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `expedition-rules-modal`: Update requirements for `RulesModal.tsx` to mandate full anchor system documentation across Core Physical Ruleset and Web Controls & Digital Guide tabs.

## Impact

- **Affected Code**: `src/components/RulesModal.tsx` (and component tests in `src/components/RulesModal.test.ts`).
- **APIs/Dependencies**: None. Pure UI and documentation synchronization with existing game logic.
