## ADDED Requirements

### Requirement: Anchor Absorption Simulation Default
The Python simulation suite (`RuleFlags`) SHALL enable `anchor_absorption = True` by default with `anchor_max_absorption = 4` to reflect the core game rules.

#### Scenario: Simulation flags default to enabled Anchor Absorption
- **WHEN** a `RuleFlags` instance is initialized without explicit overrides
- **THEN** `anchor_absorption` SHALL be `True` AND `anchor_max_absorption` SHALL be `4`
