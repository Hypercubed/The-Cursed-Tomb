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

### 1. Icon Placement Strategy

**Decision:** Blessing icons integrate with existing suit pip placement, curse icons appear below the X mark.

**Rationale:**
- Blessings already circle the suit pip in the upper-left corner. Adding icons adjacent to this maintains the existing visual hierarchy.
- Clubs blessing specifically covers the rank number with a question mark, as requested, to communicate that value doesn't matter for wildcards.
- Curses appear as X marks over the rank. Adding icons below the X keeps the rank area clean while providing visual differentiation.
- This placement maps to the physical game's ink zones (upper-left for blessings, rank area for curses).

**Alternatives Considered:**
- *Icons in center of card:* Too disruptive to existing layout, harder to draw physically.
- *Icons replacing existing marks:* Would break backward compatibility and remove information.
- *Separate icon badge in corner:* Adds visual clutter, doesn't integrate with existing mark system.

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
