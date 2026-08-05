## MODIFIED Requirements

### Requirement: Attrition Scar Tooltips and Legends
Tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`. Generic header legends (such as in the Deck Codex) SHALL display a visual `N` rank mark with blue vertical strokes on both sides and a diagonal slash, followed by `Scarred`.

#### Scenario: Tooltips interpolate card rank label
- **GIVEN** a card with Attrition Stage 1, 2, or 3
- **THEN** tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`

#### Scenario: Generic header legend displays a marked N
- **GIVEN** a generic header legend (such as in the Deck Codex)
- **THEN** the legend SHALL display an `N` with blue vertical marks on both sides and a diagonal slash, followed by `Scarred`, to indicate a scarred card of any rank
