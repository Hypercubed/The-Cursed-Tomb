## Why

Currently, Fortifying (`—`) and Anchored (`+`) immunity marks are rendered directly over/through the suit symbol in the corner index. However, immunity marks protect the entire card from Attrition Track degradation on round collapse and have nothing to do with suit behavior (unlike Suit Blessings, which encircle the suit pip). Furthermore, stacking printed suit pips, blessing circles `(O)`, and anchor strokes in the top-left suit pip creates visual clutter and suffers from poor contrast on dark suit pips ($\spadesuit$, $\clubsuit$) during physical tabletop play.

Relocating immunity marks to a dedicated Top-Right corner zone (and Bottom-Left in 180° rotation) establishes a clean separation of concerns, improves visual legibility in the digital UI, and makes physical tabletop pen marking fast, un-cluttered, and high contrast.

## What Changes

- **Relocate Immunity / Anchor Marks:** Move Fortifying (`—`) and Anchored (`+`) marks out of the suit pip and into the top-right corner of the card (and bottom-left corner rotated 180°).
- **Clean Suit Pip Rendering:** Reserve the suit pip zone exclusively for suit identification and Fallen Hero Blessing halos `(O)`.
- **Top-Right Immunity Badge:** Render Fortifying (`—`) stage 1 and Anchored (`+`) stage 2 as crisp blue handwritten-style pen overlay marks in the upper-right corner.
- **Rulebook Update:** Update `docs/rules.md` (Section 3, 5, and 6) to formalize top-right / bottom-left corner placement for Anchor strokes in physical tabletop play.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Requirements updated so immunity/anchor marks (`—`, `+`) render in the upper-right card corner (and bottom-left in 180° rotation) instead of over the suit pip.

## Impact

- `src/components/PlayingCard.tsx`: Update corner rendering to display `rewardStage` immunity badges in top-right (and bottom-left rotated 180°).
- `docs/rules.md`: Update spatial layout rules and physical ink zone guidelines for Anchors.
- `MatchedCardsModal.tsx` & Tooltips: Align legend descriptions, tooltips, and vault view badges with top-right anchor positioning.
