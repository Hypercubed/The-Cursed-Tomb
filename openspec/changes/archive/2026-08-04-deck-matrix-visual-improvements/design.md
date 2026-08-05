## Context

In `MatchedCardsModal.tsx`, the 4×13 Deck Status Matrix renders 52 card cells. Lifecycle styling must remain independent from card statuses: active cards use the dark brown surface and gold outline, removed cards use the near-black surface and neutral outline, and entombed cards use the stone surface and neutral outline. Blessed, Cursed, and Scarred states are communicated by icons and overlays.

Additionally, Cursed cards use blue theme colors (`bg-blue-950/40`, `border-blue-600/80`) instead of scarlet red gel ink (`bg-red-950/40`, `border-red-600/80`), and the suit-specific SVG illustrations introduced in `CardFaceIllustration.tsx` are missing from matrix cell pips and header legends.

## Goals / Non-Goals

**Goals:**
- Decouple lifecycle styling from interior card status styling (`isBlessed`, `isCursed`, `isScarred`) so active, removed, and entombed states remain visually distinct regardless of status.
- Update Cursed card matrix cells and header legend labels to use scarlet red gel ink colors (`bg-red-950/40`, `border-red-600/80`, `text-red-200`, `ring-red-500/60`).
- Embed `CardFaceIllustration` (or compact suit-specific SVG icons) directly into matrix cell pips and update the modal header legend to show authentic Blessed (∩, □, Shovel, ⊕) and Cursed (▼, ⏍) symbols.

**Non-Goals:**
- Modifying underlying game logic or card status calculation in `game.ts`.
- Changing layout structure or dimensions of the 4×13 grid columns and rows beyond styling and icon rendering.

## Decisions

### Decision 1: Two-Layer Styling Strategy for Matrix Cells
Instead of a single `if/else if` chain:
- **Base / Interior Status Layer**: Governs cell background fill, text color, and interior icon (`CardFaceIllustration` / slashes).
  - Entombed (`attritionStage === 5`): `bg-stone-950 text-game-muted/60 opacity-60`
  - Active: `bg-[#2a2016] text-game-muted/60`
  - Removed: `bg-[#18130e] text-game-muted/60`
  - Blessed, Cursed, and Scarred: status icons/overlays only
- **Border / Removal Layer**: Governs cell outline border and ring shadows.
  - If `isRemoved`: Neutral outline `border-[#251e16]` (with `bg-[#18130e]`).
  - If active: Gold accent outline `border-game-accent shadow-[0_0_6px_rgba(212,175,55,0.25)]` (with `bg-[#2a2016]`).
  - If entombed: Neutral outline `border-[#251e16]`.

*Alternative Considered*: Putting removed styling behind a separate overlay div.
*Rationale*: Using decoupled utility class compositions in React avoids extra DOM elements while ensuring `isRemoved` borders always take precedence.

### Decision 2: Reuse CardFaceIllustration for Matrix Pips & Legend
- Import `CardFaceIllustration` inside `MatchedCardsModal.tsx` and render it at a compact scale (e.g. `w-5 h-5` or `w-6 h-6`) inside matrix cell suit pips when `isBlessed` or `isCursed` is true.
- Update header legend items:
  - **Blessed Hero**: Display `(∩/□/⊕/Shovel)` in `text-blue-400`
  - **Cursed**: Display `(▼/⏍)` in `text-red-400`
  - **Removed**: Near-black surface with neutral outline swatch `bg-[#18130e] border-[#251e16]`
  - **Active**: Dark brown surface with gold outline swatch `bg-[#2a2016] border-game-accent`
  - **Entombed**: Stone surface with neutral outline swatch `bg-stone-950 border-[#251e16]`

## Risks / Trade-offs

- **[Risk]**: SVG icon clipping in small 48px `h-12` matrix cells.
  → **Mitigation**: Adjust container flex layout and SVG scaling (`w-5 h-5` / `w-6 h-6`) to keep suit symbols and rank labels sharp and unclipped.
