## Context

The `RulesModal` component in `src/components/RulesModal.tsx` currently renders a 3-tab navigation bar (`core-rules`, `web-guide`, `card-anatomy`). Adding a fourth tab for standard Pyramid Solitaire rules requires extending the `RulesTab` union type, updating `VALID_TABS` validation, adding a new navigation tab button, and creating a structured section for standard Pyramid Solitaire documentation and comparison.

## Goals / Non-Goals

**Goals:**
- Extend `RulesTab` type to include `'standard-pyramid'`.
- Implement responsive tab navigation supporting 4 tabs with horizontal scroll on mobile devices.
- Render clear, well-structured documentation covering standard Pyramid Solitaire layout (28-card pyramid), rank values & sum 13 pairing rules, stock/waste/redeal mechanics, and a side-by-side comparison grid vs *The Cursed Tomb* campaign.
- Maintain existing dark tomb design system aesthetics (`bg-[#120e0a]`, `border-[#2d2319]`, amber/cyan accents).

**Non-Goals:**
- Changing game engine logic or game rules in `src/game.ts`.
- Adding interactive simulation components within the modal tab.

## Decisions

1. **Tab ID & Placement**:
   - Tab ID: `'standard-pyramid'`
   - Order: Placed second in the tab sequence (`core-rules` → `standard-pyramid` → `web-guide` → `card-anatomy`) so physical/campaign rules and classic rules are presented prior to digital web controls and card ink anatomy.

2. **UI & Layout Structure**:
   - **Header Card**: Introductory banner highlighting standard Pyramid Solitaire as the base game.
   - **2x2 Grid of Feature Cards**:
     1. Objective & Layout (28 cards face-up in 7 rows).
     2. Card Ranks & Pairing Sum (K=13 solo, Q=12+A=1, J=11+2=13, 10–3 pairs).
     3. Stock, Waste & Redeals (24 stock cards, 2 redeals standard).
     4. Comparative Matrix (Standard vs The Cursed Tomb campaign).

3. **Type Safety & Test Coverage**:
   - Update `RulesTab` in `RulesModal.tsx`.
   - Update `sanitizeTab` and `VALID_TABS` in `RulesModal.tsx`.
   - Update `RulesModal.test.ts` to assert that 4 tabs are supported.

## Risks / Trade-offs

- **Mobile Overflow**: Adding a 4th tab might cause tab wrapping or overflow on narrow screens.
  - *Mitigation*: The tab bar container already uses `overflow-x-auto whitespace-nowrap gap-2`, enabling smooth touch scrolling across all 4 tab buttons.
