## Context

The web application's in-app rules compendium (`src/components/RulesModal.tsx`) renders rules across 4 tabs (`core-rules`, `standard-pyramid`, `web-guide`, and `card-anatomy`). While `docs/rules.md` and `src/game.ts` fully detail the Anchor system (defensive progression, solo King clears, wildcard partner rules, and red corner quadrant absorption marks), `RulesModal.tsx` currently omits these mechanics from the `core-rules` and `web-guide` tabs.

## Goals / Non-Goals

**Goals:**
- Update `RulesModal.tsx` (`core-rules` tab) to render Rule 5 (Retrospective Anchor Shield & Red Quadrant Absorption), Attrition Immunity Exception, and expanded Survival Rewards Anchor progression rules.
- Update `RulesModal.tsx` (`web-guide` tab) to render digital interaction guidance for Anchors (round summary upgrades and corner absorption charge indicators).
- Update unit tests in `src/components/RulesModal.test.ts` to assert that anchor documentation rules and tabs are present and properly rendered.

**Non-Goals:**
- Modifying underlying game logic (`src/game.ts`), state management, or card rendering components (`PlayingCard.tsx`).
- Changing the layout or tab structure of `RulesModal.tsx`.

## Decisions

### Decision 1: Structure of Section 4 Rule 5 in `core-rules` Tab
- Add a new block under Section 4 ("Live-Play Architecture & Traps") for **Rule 5: Retrospective Anchor Rules & Absorption Shield**.
- Match the visual styling of existing rule blocks (dark rounded container with `text-blue-300` / `text-amber-200` highlight badges).
- *Rationale*: Maintains visual consistency with Red Curses and Black Curses callout boxes.

### Decision 2: Structure of Section 6 Anchor Progression in `core-rules` Tab
- Split or expand Section 6 ("Survival Rewards") into distinct subsections:
  - Hero Blessings (♥, ♦, ♠, ♣)
  - Defensive Anchors (`[—]` Fortifying vs `[+]` Anchored): lower-value card in final pair, solo clears (King / Standalone 13), and ♣ Clubs Wildcard partner rules.
- *Rationale*: Section 6 is currently header-titled "Suit Pip Blessings & Anchors" but previously only listed suit blessings. Adding the Anchor progression subsection aligns content with the section title.

### Decision 3: Addition of Interaction #6 in `web-guide` Tab
- Add a 6th interaction box under `web-guide` titled **"Anchored Defense & Absorption UI"**.
- Describe how the digital app displays Anchor upgrades in `RoundSummaryModal.tsx` and corner absorption status (`0/4` to `4/4` red dots).
- *Rationale*: Completes the digital mapping guide for all core card mechanics.

## Risks / Trade-offs

- **[Risk]** Rules modal scrollable body becoming too long on mobile viewports.
  → *Mitigation*: Use responsive padding, compact grid/flex layouts, and scrollable container styled consistent with existing modal UI.
