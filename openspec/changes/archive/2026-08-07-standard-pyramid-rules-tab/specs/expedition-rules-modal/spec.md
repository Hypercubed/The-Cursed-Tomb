## ADDED Requirements

### Requirement: Standard Pyramid Solitaire Documentation Rendering
The modal SHALL render a dedicated section documenting standard Pyramid Solitaire rules, including the game objective, layout structure, card values and target sum 13 pairing rules, stock/waste/redeal mechanics, and a comparison table contrasting standard solitaire with *The Cursed Tomb* campaign rules.

#### Scenario: Viewing standard pyramid rules content
- **WHEN** the "Standard Pyramid" tab is active
- **THEN** the modal SHALL render standard Pyramid Solitaire layout, card value pairing rules, stock draw/redeal limits, and the comparison matrix against campaign rules

## MODIFIED Requirements

### Requirement: Multi-Section Tabbed Rules Navigation
The Expedition Rules Compendium Modal SHALL organize documentation into distinct tabbed sections: Core Physical Ruleset, Standard Pyramid, Web Controls & Digital Guide, and Card Anatomy & Markings.

#### Scenario: Switching tabs updates active section view
- **WHEN** the player selects a tab (e.g., "Standard Pyramid" or "Web Play & Controls") in the modal
- **THEN** the modal body SHALL display the corresponding section content AND highlight the active tab button
