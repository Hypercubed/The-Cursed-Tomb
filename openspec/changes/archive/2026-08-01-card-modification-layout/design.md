## Context

Currently, `PlayingCard.tsx` renders card marks in two separated areas: top-left (stacked rank, suit, functional value, reward ink) and top-right (attrition ink). The bottom-right index only includes rank and suit text, breaking 180° rotational symmetry. 

In addition, `docs/rules.md` specifies manual physical tabletop solitaire play guidelines. Pen-marking instructions for physical cards need to align with the visual UI design (slashing rank numbers, writing inset modified values, drawing anchors inside suit symbols, and encircling suit symbols for blessings).

## Goals / Non-Goals

**Goals:**
- Reorganize corner indices in `PlayingCard.tsx` so Scars/Curses overlay/adjoin the rank number and Anchors/Blessings overlay/adjoin the suit symbol.
- Display the 3rd scar as a heavy diagonal slash across the rank number with the effective modified value written directly to its right (`7̶  8`).
- Render bold anchor strokes inside/across the suit icon and a circular halo ring around blessed suit icons.
- Ensure exact 180° rotational symmetry between top-left and bottom-right corner indices.
- Update `docs/rules.md` manual play instructions so physical pen marking matches the updated card layout.
- Preserve responsive layout and high readability across mobile, tablet, and desktop viewports.

**Non-Goals:**
- Modifying underlying game logic (`game.ts`), failure tracks, or campaign rules.
- Modifying central suit iconography (Ankh, Scarab, Khopesh, Was Scepter).

## Decisions

### Decision 1: Rank Pip Composite Component / Inline Layout
Rather than rendering separate disconnected elements, combine Rank Number, Scar Overlays, Curse Indicator, and Inset Modified Value into a unified `RankPip` layout.
- *Rationale*: Guarantees that scars and modified values stay attached to the rank number regardless of card scaling.
- *Alternatives Considered*: Floating absolute position elements (prone to misalignment on small mobile breakpoint cards).

### Decision 2: Suit Pip Composite with CSS/SVG Enclosures
Render suit anchor lines (`—`, `+`) directly inside/over the suit symbol and blessing halos (`◯`) as a surrounding ring container or SVG overlay around the suit symbol.
- *Rationale*: Visually anchors reward progress to the suit identity.
- *Alternatives Considered*: Bracket text tags like `[O]` or `[+]` (took up too much vertical space).

### Decision 3: Mirrored Corner Index Wrapper
Extract corner index rendering into a reusable function or component `<CornerIndex rank={...} suit={...} scars={...} blessings={...} />` rendered once in the top-left and once in the bottom-right (with `rotate-180`).
- *Rationale*: Eliminates code duplication and guarantees 100% 180° rotational symmetry.

### Decision 4: Manual Play Rules Alignment (`docs/rules.md`)
Revise Section 5 (Attrition Track) and Section 6 (Survival Rewards) in `docs/rules.md` so physical card ink stroke instructions describe marking directly on the rank number pip (slashes and inset values) and suit pip (bold inside strokes, enclosing circles) in both corner indices.

## Risks / Trade-offs

- **[Risk]** Mobile card width (~48px) might become crowded if text font sizes are too large.
  - *Mitigation*: Use responsive font sizes (`text-[0.6rem]`, `sm:text-xs`) and compact flex layout with `whitespace-nowrap`.
- **[Risk]** CSS strike-through or diagonal line overlay alignment across different browsers.
  - *Mitigation*: Use CSS `line-through` / SVG diagonal line overlays with explicit line heights.
