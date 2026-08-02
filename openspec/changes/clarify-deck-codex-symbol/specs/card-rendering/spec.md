## MODIFIED Requirements

### Requirement: Attrition Scar Tooltips and Legends
Tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`. Generic header legends (such as in the Deck Codex) SHALL display `|N\| Scarred` instead of literal `|#\| Scarred`.

#### Scenario: Tooltips interpolate card rank label
- **GIVEN** a card with Attrition Stage 1, 2, or 3
- **THEN** tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`

#### Scenario: Generic header legend displays N placeholder
- **GIVEN** a generic header legend (such as in the Deck Codex)
- **THEN** the legend SHALL display `|N\| Scarred` to indicate a scarred card of any rank
