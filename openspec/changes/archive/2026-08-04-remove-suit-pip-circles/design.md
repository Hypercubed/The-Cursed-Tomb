## Context

Playing cards currently render a hand-drawn blue SVG circle halo (`[O]`) around the top-left corner suit pip when `blessed` is true. Now that `CardFaceIllustration.tsx` renders large, suit-specific center face illustrations (`∩` Tomb Archway, `□` Vault Box, Shovel, `⊕` Sun Cross) for blessed cards, the corner suit circle is redundant. `docs/rules.md` also needs to be updated to reflect that physical play rules specify center-face drawings rather than encircling corner suit pips.

## Goals / Non-Goals

**Goals:**
- Simplify `SuitPip` component rendering in `PlayingCard.tsx` so it renders only the suit symbol (`♥`, `♦`, `♠`, `♣`).
- Retain all center face blessing illustrations (`CardFaceIllustration.tsx`) as the primary visual identity for card blessings.
- Update `docs/rules.md` (physical game ruleset, spatial layout section, survival rewards section, and ASCII diagram) to document center-face illustrations for blessings without corner suit circles.
- Update `RulesModal.tsx` card anatomy text, legend descriptions, and live card mockups to reflect single-identity center face blessings.
- Ensure test suites (`PlayingCard.test.tsx`, `CardFaceIllustration.test.tsx`, `RulesModal.test.tsx`) pass cleanly.

**Non-Goals:**
- Modifying center face blessing SVG shapes or curse SVG shapes.
- Changing Attrition Stage scars (`SlashedRank`) or Immunity Anchors (`AnchorBadge`).

## Decisions

### 1. Remove SVG Blue Ring from `SuitPip` in `PlayingCard.tsx`
- **Choice**: Simplify `SuitPip` to render strictly the suit symbol text/SVG without conditional `blessed` circle overlay logic.
- **Rationale**: Removes redundant visual marking, declutters top-left corner index, and matches the single-identity design used for Stage 4 Curses.
- **Alternative Considered**: Keeping a smaller mini-icon in the suit pip. Rejected because center face illustrations are already visible in pyramid layouts (~50% upper card height exposed).

### 2. Update Physical Ruleset (`docs/rules.md`) & Web Compendium (`RulesModal.tsx`)
- **Choice**: Revise Section 3, Section 6, and Section 6.C ASCII diagram in `docs/rules.md` alongside `RulesModal.tsx` Card Anatomy tab text and mockups to reference center-face illustrations for blessings instead of `[O]` suit pip halos.
- **Rationale**: Keeps physical rules documentation, web interaction guide, and component anatomy perfectly in sync with visual rendering.

## Risks / Trade-offs

- **[Risk]** Test suites expecting `[O]` or circle SVG elements in `PlayingCard` rendering could fail.
- **Mitigation**: Search for and update component test assertions in `PlayingCard.test.tsx` or `RulesModal.test.tsx`.
