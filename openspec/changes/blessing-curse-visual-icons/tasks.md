## 1. SVG Icon Component Creation

- [ ] 1.1 Create BlessingIcon component with SVG paths for all 4 suit blessings (↑, □, ↓, ?)
- [ ] 1.2 Create CurseIcon component with SVG paths for Red and Black curses (▼, ≡)
- [ ] 1.3 Apply existing ink-bleed filter and blue color (#1d4ed8) to all icon paths
- [ ] 1.4 Ensure icons use organic stroke styling matching existing mark components
- [ ] 1.5 Add props to BlessingIcon for suit type and icon placement
- [ ] 1.6 Add props to CurseIcon for curse type (Red vs Black)

## 2. PlayingCard Component Integration

- [ ] 2.1 Integrate BlessingIcon into SuitPip component for Hearts, Diamonds, Spades
- [ ] 2.2 Integrate BlessingIcon into SlashedRank component for Clubs (over rank number)
- [ ] 2.3 Integrate CurseIcon into SlashedRank component (below X mark for Stage 4)
- [ ] 2.4 Update CornerIndex to pass blessing/curse state to icon components
- [ ] 2.5 Ensure Clubs question mark icon covers/replaces displayed rank value
- [ ] 2.6 Test icon rendering at all card sizes (sm, md, lg, xl, 2xl)

## 3. Tooltip Enhancement

- [ ] 3.1 Update getUpperLeftTooltip to include icon symbol and meaning for blessings
- [ ] 3.2 Update getUpperRightTooltip to include icon symbol and meaning for curses
- [ ] 3.3 Ensure tooltip text references icon symbols (↑, □, ↓, ?, ▼, ≡)
- [ ] 3.4 Verify tooltip accessibility with screen reader testing

## 4. Physical Rules Documentation

- [ ] 4.1 Add ASCII diagrams for blessing icons to docs/rules.md Section 6 (Survival Rewards)
- [ ] 4.2 Add ASCII diagrams for curse icons to docs/rules.md Section 4 (Traps & Modifications)
- [ ] 4.3 Include icon drawing instructions with stroke order for each icon
- [ ] 4.4 Specify icon placement guidelines (above/below suit pip, over rank, below X)
- [ ] 4.5 Emphasize that icons are optional enhancements throughout documentation
- [ ] 4.6 Add visual reference guide showing corner index layout with icons

## 5. Testing and Validation

- [ ] 5.1 Visual testing: Verify all 4 blessing icons render correctly in web UI
- [ ] 5.2 Visual testing: Verify both curse icons render correctly in web UI
- [ ] 5.3 Test Clubs wildcard icon properly covers rank number
- [ ] 5.4 Test cards without icons render identically to current behavior
- [ ] 5.5 Test tooltip text displays correctly for all icon types
- [ ] 5.6 Physical playtesting: Draw icons on actual cards during gameplay
- [ ] 5.7 Verify icon simplicity (2-4 strokes) for hand-drawing during live play
