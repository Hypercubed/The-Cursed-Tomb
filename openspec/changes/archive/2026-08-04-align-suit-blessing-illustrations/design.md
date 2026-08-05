## Context

The `CardFaceIllustration` component renders SVG ink drawings centered over the base suit icon in `PlayingCard.tsx`. While the Diamond Vault box (`□`) and Curse drawings (`▼`, `⏍`) frame the base suits nicely, the Spades, Hearts, and Clubs illustrations lacked visual alignment with their underlying suit shapes:
- Spades shovel blade pointed downwards (away from the upward-pointing Spade tip `♠`).
- Hearts archway contained an upward arrow (`↑`) inside it rather than neatly surrounding the Heart pip `♥`.
- Clubs blessing used an infinity symbol (`∞`) rather than a tomb-themed glyph.

## Goals / Non-Goals

**Goals:**
- Re-orient the Spades shovel blade upwards so it wraps around the Spade tip `♠`, with the handle shaft extending downwards along the Spade stem.
- Remove the interior arrow from the Hearts tomb archway (`∩`) so it cleanly frames the Heart pip `♥` as an ancient shrine.
- Replace the Clubs blessing infinity symbol (`∞`) with a **Circled Sun Cross (`⊕`)**, framing the 3 leaves of the Club pip `♣`.
- Update all tooltips, modal legends, unit tests, and rulebook documentation to stay consistent with the updated icon set.

**Non-Goals:**
- Changing suit blessing mechanics (Hearts stock reshuffle, Diamonds vault, Spades tunnel, Clubs wildcard remain functionally identical).
- Modifying Diamond Vault box (`□`), Red Curse (`▼`), or Black Curse (`⏍`) illustrations.

## Decisions

1. **Spades Flipped Shovel**:
   - *Rationale*: A Spade pip `♠` has an upward point and a downward stem. Flipping the shovel blade upwards (`M 22 56 Q 21 40 24 34 C 28 18, 40 9, 50 9 C 60 9, 72 18, 76 34 Q 79 40 78 56 H 22 Z`) wraps the blade over the top of the spade, while a straight downward shaft (`M 50 56 L 50 86`) mirrors the spade stem.

2. **Hearts Arrow-less Archway**:
   - *Rationale*: Removing the interior vertical arrow (`↑`) leaves an unobstructed archway (`M 24 82 Q 22 55 24 40 C 26 18, 74 18, 76 40 Q 78 55 76 82`) that encapsulates the Heart pip `♥` inside an archeological tomb arch.

3. **Clubs Circled Sun Cross (`⊕`)**:
   - *Rationale*: An organic hand-drawn outer circle combined with centered horizontal and vertical crosshair paths (`M 18 50 H 82`, `M 50 18 V 82`) frames the 3-lobed Club pip `♣` perfectly while echoing ancient sun wheel / tomb glyph iconography.

4. **Consistency across Text & Documentation**:
   - Update `getUpperLeftTooltip` in `PlayingCard.tsx` (`(∩ Archway)`, `(⊕ Sun Cross)`).
   - Update `RulesModal.tsx` legend strings.
   - Update `CardFaceIllustration.test.tsx` SVG snapshot/query tests.
   - Update `docs/rules.md` Section 6.A & 6.C visual guides.

## Risks / Trade-offs

- **[Risk]**: SVG path scaling or stroke width mismatch when rendering at mobile vs desktop breakpoints.
  - *Mitigation*: All paths use `vectorEffect: 'non-scaling-stroke'` and common viewBox `0 0 100 100`, preserving exact visual ratios across all card sizes.
