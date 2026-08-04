## Context

The current card rendering system in PlayingCard.tsx uses a unified blue ink aesthetic for all marks (blessings, curses, scars, anchors). While this maintains thematic consistency, it creates visual noise where important game states are hard to distinguish at a glance. The physical game faces the same issue with pen-and-paper marks.

The existing codebase already has:
- SVG-based ink mark rendering with organic stroke effects (ink-bleed filter)
- Corner index layout with rank/suit positioning
- Tooltip system for accessibility and detailed information
- Hand-drawn aesthetic using Caveat font and organic SVG paths

This change adds optional icons to the existing mark system without breaking the current visual language.

## Goals / Non-Goals

**Goals:**
- Add hand-drawable icons for blessings and curses that work in both physical and digital contexts
- Maintain the existing organic ink aesthetic and blue color scheme
- Keep icons simple (2-4 strokes) for quick hand-drawing during live play
- Ensure icons are semantically meaningful and map to their game mechanics
- Update UI to render icons alongside existing marks without disrupting current layout
- Update physical rules documentation with optional icon drawing instructions

**Non-Goals:**
- Changing the existing blue ink color scheme or organic stroke aesthetic
- Making icons mandatory (they remain optional additions)
- Changing the core mechanics of blessings or curses
- Adding complex animations or effects to icons
- Redesigning the entire card layout or corner index system

## Decisions

### 1. Card Face Illustration Placement Strategy

**Decision:** Prominent hand-drawn illustrations are rendered directly on the center face of mutated cards.

**Rationale:**
- Drawing images directly on the center face of the card creates an immediate, bold visual identity for mutated cards across the pyramid layout.
- Prevents visual clutter around corner rank/suit pips.
- Center face drawings clearly communicate game mechanics in both physical tabletop play and digital UI:
  - ♥ **Hearts (Resurrection)**: Tomb archway with upward arrow (`∩` + `↑`)
  - ♦ **Diamonds (Vault Safe)**: Rectangular safe box with central keyhole circle (`□` with `o`)
  - ♠ **Spades (Tunneling)**: Left-facing rounded capsule (`[ ⊃ ]`, rectangle with rounded left cap and flat right edge)
  - ♣ **Clubs (Wildcard)**: Infinity symbol (`∞`)
  - **Red Curse (Trap)**: Downward-pointing triangle (`▼`)
  - **Black Curse (Weight)**: Unicode trapezoid weight (`⏍`, trapezoid body with handle loop)

**Alternatives Considered:**
- *Small marks in corners:* Hard to scan during active play and creates visual clutter near rank digits.
- *Full-card background fills:* Overwhelms the card art and suit symbols.

### 2. SVG Icon Implementation

**Decision:** Create simple SVG path components for each icon, using the existing ink-bleed filter and organic stroke style.

**Rationale:**
- Reuses existing visual language (blue color, organic strokes, ink-bleed filter)
- SVG paths can be simple geometric shapes (arrows, squares, triangles) that match hand-drawn icons
- Consistent with existing SlashedRank and SuitPip components
- Easy to maintain and modify

**Alternatives Considered:**
- *Unicode characters:* Limited styling options, don't match organic ink aesthetic.
- *Custom font icons:* Adds dependency, harder to match hand-drawn feel.
- *CSS shapes:* Limited for complex shapes like arrows and question marks.

### 3. Icon Component Structure

**Decision:** Create dedicated components for each icon type (BlessingIcon, CurseIcon) that accept props for icon type and placement.

**Rationale:**
- Reusable across different card contexts (pyramid, waste, vault)
- Clear separation of concerns from existing mark components
- Easy to add new icon types in the future
- Consistent with existing component architecture (SuitIcon, AnchorBadge)

**Alternatives Considered:**
- *Inline SVG in PlayingCard:* Duplicates code, harder to maintain.
- *Single monolithic icon component:* Complex conditional logic, harder to understand.

### 4. Physical Game Documentation

**Decision:** Add optional icon drawing instructions to docs/rules.md in the relevant sections (blessings and curses), with simple ASCII diagrams.

**Rationale:**
- Players can reference the rules document during play
- ASCII diagrams are clear and don't require images
- Optional nature is emphasized - icons are enhancements, not requirements
- Keeps documentation self-contained

**Alternatives Considered:**
- *Separate icon reference card:* Additional physical component, easy to lose.
- *Video tutorial:* Overkill for simple 2-4 stroke icons.
- *No documentation:* Players wouldn't know how to draw icons correctly.

### 5. Clubs Wildcard Value Coverage

**Decision:** Question mark icon renders over the rank number, replacing or overlaying the displayed value.

**Rationale:**
- Semantically perfect: "what value? any value works!"
- Directly addresses user request to cover the value
- Visually communicates that the rank is irrelevant for pairing
- Matches physical game where player would draw ? over the number

**Alternatives Considered:**
- *Icon beside rank:* Doesn't communicate that value is irrelevant.
- *Icon over suit pip:* Doesn't address the value-ignoring mechanic.
- *Color change only:* Doesn't work for physical game constraint.

### 6. Blessing and Curse Mutual Exclusivity Rules

**Decision:** Enforce strict mutual exclusivity between Blessings and Curses across game lifecycle logic and card visual rendering.
- **Blessed Card Attrition (Stage 3 -> 4)**: A Blessed card at Stage 3 that takes Attrition advances to Stage 4 rank marking (slash over rank) and can be Entombed (Stage 5) on a subsequent attrition mark, but **skips the Curse trap effect (Red face-down / Black pyramid-only lock) and skips the Curse icon**. It retains its Blessing power and Blessing icon on the card face.
- **Cursed Card Hero Award**: A Cursed card (Stage 4 with active Curse effect) cleared as a Fallen Hero at round end **skips the Blessing award** and remains Cursed only.
- **Single-Identity Rendering**: A card face renders EITHER a Blessing icon OR a Curse icon, never both.

**Rationale:**
- Prevents hybrid visual clutter (overlapping blue circles and curse trap symbols).
- Gives players tactical motivation to bless vulnerable cards to shield them from future Stage 4 trap effects.
- Simplifies rules and state understanding for both tabletop and digital play.

**Alternatives Considered:**
- *Blessing consumed on Attrition:* Stripping the blessing on Stage 4 attrition was considered, but keeping the blessing and suppressing the curse provides a clearer reward for earning hero blessings while allowing cards to still progress toward entombed rank marks.

## Risks / Trade-offs

- **[Risk]** Icons might clutter the card visual if too many marks accumulate
  - **Mitigation:** Icons are optional and small. Players can choose to use them selectively based on visual preference.
- **[Risk]** Physical players might find icon drawing adds time during attrition phase
  - **Mitigation:** Icons are explicitly optional. Minimal marks (just the circle or X) remain valid.
- **[Risk]** SVG icons might not perfectly match hand-drawn aesthetic
  - **Mitigation:** Use existing ink-bleed filter and organic stroke styles. Test visually before finalizing.
- **[Risk]** Icon meanings might not be immediately intuitive to new players
  - **Mitigation:** Include clear documentation and tooltip text explaining each icon's meaning.
- **[Trade-off]** More visual elements vs. cleaner design
  - **Decision:** Prioritize gameplay clarity over minimalism. Icons solve a real gameplay problem (missing important marks).

## Migration Plan

1. **Phase 1: Component Implementation**
   - Create BlessingIcon and CurseIcon components with SVG paths
   - Integrate icons into PlayingCard.tsx alongside existing mark rendering
   - Add icon-specific tooltips to existing tooltip system

2. **Phase 2: Documentation Updates**
   - Update docs/rules.md with optional icon drawing instructions
   - Add ASCII diagrams showing icon placement and stroke order
   - Update blessing and curse sections to reference icons

3. **Phase 3: Testing**
   - Visual testing: Ensure icons render correctly at all card sizes
   - Accessibility testing: Verify screen readers announce icon meanings via tooltips
   - Physical playtesting: Test hand-drawing icons during actual gameplay

4. **Phase 4: Rollout**
   - No migration needed - icons are optional additions
   - Existing cards without icons render identically to current behavior
   - Players can adopt icons gradually based on preference

## Open Questions

None identified. The design is straightforward with clear implementation path.
