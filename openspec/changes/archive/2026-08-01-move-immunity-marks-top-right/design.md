## Context

In `src/components/PlayingCard.tsx`, `SuitPip` currently renders both Fallen Hero blessing circles (`[O]`) and Fortifying/Anchored lines (`—` and `+`).
Because Fortifying and Anchored status represent card-wide defensive immunity against Attrition Track degradation rather than suit-specific powers, placing them inside `SuitPip` creates visual clutter and is conceptually misleading.

In physical tabletop play (`docs/rules.md`), physical playing cards have open white margins in the top-right and bottom-left corners. Moving Anchors to these corners eliminates ink collision on the suit pip.

## Goals / Non-Goals

**Goals:**
- Separate immunity marks (`—` and `+`) from suit pips in `PlayingCard.tsx`.
- Create top-right and bottom-left (180° rotated) corner badge containers for `rewardStage`.
- Keep suit pips focused solely on suit iconography and Fallen Hero blessing halos (`(O)`).
- Update rulebook spatial layout documentation in `docs/rules.md`.
- Ensure tooltips, legend displays (such as `MatchedCardsModal.tsx`), and visual tests reflect the top-right position.

**Non-Goals:**
- Changing mechanical Attrition Track behavior or campaign freeze rules.
- Altering the shape of Scars/Curses on rank number pips.

## Decisions

### Decision 1: Create a dedicated `AnchorBadge` component rendered in Top-Right and Bottom-Left corners

- **Rationale:** Rather than cluttering `CornerIndex` (which contains rank and suit), we render `AnchorBadge` in the top-right corner of the card container, and a 180°-rotated copy in the bottom-left corner.
- **Alternatives Considered:**
  - *Inline with Rank in Top-Left Index:* Makes index text excessively wide and creates awkward spacing when modified values (e.g. `8`) are present.
  - *Top-Center Header Shield:* Harder for physical tabletop players to locate accurately when marking cards by hand.

### Decision 2: Styling and SVG overlays for `AnchorBadge`

- **Stage 1 (Fortifying `—`):** SVG horizontal line in `#2563eb` (blue ink) with rounded caps (`strokeLinecap="round"`), giving a handwritten blue stroke aesthetic.
- **Stage 2 (Anchored `+`):** SVG cross (`+`) combining horizontal and vertical `#2563eb` strokes.

### Decision 3: Rulebook Spatial Layout Realignment

- Update `docs/rules.md`:
  - **Upper-Left Zone:** Exclusively for Rank modifiers (Scars/Curses) and Suit Blessings (`[O]`).
  - **Upper-Right Zone:** Exclusively for Defensive Immunity Anchors (`—`, `+`).

## Risks / Trade-offs

- **[Risk] Layout Overflow on Mobile Cards:** Mobile cards are compact ($\approx 48\text{px}$). Top-right badge could collide with long rank modifications if margins are small.
- **Mitigation:** Use absolute positioning pinned to `top-1 right-1` with small SVG dimensions ($12\text{px} \times 12\text{px}$), maintaining ample clearance.
