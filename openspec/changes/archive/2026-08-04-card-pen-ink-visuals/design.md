## Context

Currently, `PlayingCard.tsx` and `CardFaceIllustration.tsx` render all modifier ink paths (scars, curses, blessings, anchors) with a unified royal blue color (`#1d4ed8`) and blue drop-shadow filter (`drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]`). Base card colors use flat Tailwind classes (`text-game-red`, `text-game-card-text`). 

To make card modifications intuitive at a glance and improve tabletop realism, we need to separate pen ink colors by polarity and refine base card ink tones.

## Goals / Non-Goals

**Goals:**
- Differentiate positive annotations (Cobalt Blue Pen Ink) from negative annotations (Scarlet Red Gel Pen Ink).
- Apply Scarlet Red Pen styling (`#dc2626` / `#e11d48`) to all Attrition stage slashes (1–4), Curse marks/traps, center Curse illustrations, and handwritten shifted functional rank numbers.
- Preserve Cobalt Blue Pen styling (`#1d4ed8`) for Fortifying/Anchored badges, Blessed Hero suit circles, and center Blessing illustrations.
- Refine base red suit color token (`game-red`) to deep Bicycle Crimson (`#991b1b`) and base black suit token to Carbon Black (`#1c1917`).
- Ensure red gel pen strokes remain distinctly brighter and wetter than underlying deep crimson suit text on Heart and Diamond cards.

**Non-Goals:**
- Changing card layout grid, corner index positions, or functional value shift rules.
- Modifying non-card UI components (such as buttons, modals, or sidebars).

## Decisions

1. **Color Token & Styling Strategy for Negative Pen Ink**:
   - Primary stroke color: `#dc2626` (Scarlet Red Gel Ink).
   - Text stroke & shadow: `WebkitTextStroke: '0.6px #dc2626'`, `textShadow: '0 0 1px #dc2626, 0 0 2px rgba(220,38,38,0.8)'`.
   - SVG Drop Shadow: `drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]`.
   - *Rationale*: Scarlet red (`#dc2626`) with a subtle rose-scarlet halo creates contrast against both carbon black suits (♠/♣) and deep Bicycle crimson suits (`#991b1b`).

2. **Color Token Strategy for Positive Pen Ink**:
   - Retain `#1d4ed8` (Cobalt Blue Pen Ink) and `drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]` for Anchors, Blessings, and suit blessing center illustrations.

3. **Natural Base Card Suit Tone Adjustments**:
   - Update `index.css` or Tailwind config for `text-game-red` to deep Bicycle Crimson (`#991b1b` / `#a21c1c`).
   - Update `text-game-card-text` to rich Carbon Black (`#1c1917` / `#27272a`).

## Risks / Trade-offs

- **[Risk]** Red pen ink overlaying red Heart/Diamond suits might blend in if contrast is insufficient.
  - → **Mitigation**: Base red suits use dark Bicycle Crimson (`#991b1b`), whereas Red Pen Ink uses bright Scarlet (`#dc2626`) with an ink-bleed drop shadow and organic stroke wobble, creating clear depth separation.
