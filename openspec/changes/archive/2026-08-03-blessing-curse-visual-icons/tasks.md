## 1. SVG Center Face Illustration Component Creation

- [x] 1.1 Create `CardFaceIllustration.tsx` component with SVG paths for all 4 suit blessings:
  - Hearts: Tomb archway with upward arrow (`∩` + `↑`)
  - Diamonds: Vault safe box (`□` with center keyhole `o`)
  - Spades: Left-facing rounded capsule (`[ ⊃ ]`, rectangle with rounded left cap and flat right edge)
  - Clubs: Infinity symbol (`∞`)
- [x] 1.2 Add SVG paths for Red and Black curses to `CardFaceIllustration.tsx`:
  - Red Curse: Downward-pointing triangle (`▼`)
  - Black Curse: Unicode trapezoid weight (`⏍`, trapezoid body with top handle loop)
- [x] 1.3 Apply existing ink-bleed filter and blue color (#1d4ed8) to all illustration paths
- [x] 1.4 Ensure illustrations use organic stroke styling matching existing mark components

## 2. Game Engine Lifecycle & Mutual Exclusivity Rules (`src/game.ts`)

- [x] 2.1 Update `isCursed()` and `isBlackCursed()` to check `!card.blessed` (Blessed cards skip Curse trap effects at Stage 4)
- [x] 2.2 Update `applyEndOfWeekLifecycle` hero award logic: skip Blessing award if hero card has `attritionStage === 4` (Cursed)
- [x] 2.3 Ensure Blessed cards advancing 3 -> 4 receive Stage 4 rank marking and can proceed to Stage 5 Entombed on subsequent attrition, but suppress Curse trap mechanics
- [x] 2.4 Update Python campaign simulator (`sim/cursed_tomb_sim.py`) to enforce Blessing/Curse mutual exclusivity

## 3. PlayingCard Component Integration & Center Face Rendering

- [x] 3.1 Integrate `CardFaceIllustration` into `PlayingCard.tsx` on center face of mutated cards
- [x] 3.2 Update `PlayingCard.tsx` to enforce single-identity rendering (display either a Blessing illustration OR a Curse illustration, never both)
- [x] 3.3 Ensure center face illustration scales appropriately across card size variants (sm, md, lg, xl, 2xl)
- [x] 3.4 Test center face drawing layout against card background art and rank/suit corner indices

## 4. Tooltip & Rules Modal Enhancement

- [x] 4.1 Update getUpperLeftTooltip to include icon symbol and meaning for blessings
- [x] 4.2 Update getUpperRightTooltip to include icon symbol and meaning for curses
- [x] 4.3 Ensure tooltip text references icon symbols (↑, □, ↓, ?, ▼, ≡) and explains mutual exclusivity (e.g. "Blessed card: Curse trap skipped")
- [x] 4.4 Update `RulesModal.tsx` to document Blessing/Curse mutual exclusivity and face drawings

## 5. Physical Rules Documentation

- [x] 5.1 Add ASCII diagrams for blessing icons to docs/rules.md Section 6 (Survival Rewards)
- [x] 5.2 Add ASCII diagrams for curse icons to docs/rules.md Section 4 (Traps & Modifications)
- [x] 5.3 Include icon drawing instructions with stroke order for each icon
- [x] 5.4 Specify single-identity face drawing guidelines (Blessing OR Curse drawing on card face)
- [x] 5.5 Document that Blessed cards taking Stage 4 attrition retain Blessing drawing and skip Curse drawing
- [x] 5.6 Add visual reference guide showing corner index layout with icons

## 6. Testing and Validation

- [x] 6.1 Unit tests: Verify `applyEndOfWeekLifecycle` skips Blessing award for Cursed hero cards
- [x] 6.2 Unit tests: Verify Stage 4 Blessed cards do not trigger Red face-down deals or Black pyramid-only pairing locks
- [x] 6.3 Visual testing: Verify all 4 blessing icons render correctly in web UI
- [x] 6.4 Visual testing: Verify both curse icons render correctly in web UI
- [x] 6.5 Test Clubs wildcard icon properly covers rank number
- [x] 6.6 Test cards without icons render identically to current behavior
- [x] 6.7 Physical playtesting: Draw single-identity icons on actual cards during gameplay
