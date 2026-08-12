## ADDED Requirements

### Requirement: Anchor Absorption enabled in deck evolution analysis
The deck evolution analysis CLI and core simulation module SHALL enable Anchor Absorption by default to evaluate campaign solvability and collapse timelines under the official ruleset.

#### Scenario: Running evolution analysis with Anchor Absorption
- **WHEN** `python sim/deck_evolution_analysis.py` is executed without disabling anchor absorption
- **THEN** campaign simulations SHALL process freeze attrition using `anchor_absorption = True`
