# spec: card-rendering

## MODIFIED REQUIREMENTS

### Requirement: Attrition Scar Tooltips and Legends
- **GIVEN** a card with Attrition Stage 1, 2, or 3,
- **THEN** tooltips and modal labels SHALL interpolate the card's actual rank label (e.g. `|7`, `|7|`, `|7\|`) instead of literal placeholder `'N'`.
- **GIVEN** a generic header legend (such as in Matched Cards Tomb Vault),
- **THEN** the legend SHALL display `|#\| Scarred` instead of literal `|N\| Scarred`.
