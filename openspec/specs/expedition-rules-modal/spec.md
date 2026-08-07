# expedition-rules-modal Specification

## Purpose
TBD - created by archiving change expedition-rules-compendium. Update Purpose after archive.
## Requirements
### Requirement: Expedition Rules Compendium Modal Presentation
The application SHALL provide a modal dialog ("Expedition Rules & Compendium") displaying the full official physical ruleset and web game digital interactions.

#### Scenario: Opening modal from header button
- **WHEN** the player clicks the `📖 Rules & Guide` button in the main application header
- **THEN** the Expedition Rules Compendium Modal SHALL open in an overlay

#### Scenario: Opening modal from sidebar button
- **WHEN** the player clicks the `📖 Expedition Rules` button in the game sidebar
- **THEN** the Expedition Rules Compendium Modal SHALL open in an overlay

#### Scenario: Dismissing modal
- **WHEN** the modal is open AND the player clicks the close button or presses the `Escape` key
- **THEN** the Expedition Rules Compendium Modal SHALL close

### Requirement: Multi-Section Tabbed Rules Navigation
The Expedition Rules Compendium Modal SHALL organize documentation into distinct tabbed sections: Core Physical Ruleset, Standard Pyramid, Web Controls & Digital Guide, and Card Anatomy & Markings.

#### Scenario: Switching tabs updates active section view
- **WHEN** the player selects a tab (e.g., "Standard Pyramid" or "Web Play & Controls") in the modal
- **THEN** the modal body SHALL display the corresponding section content AND highlight the active tab button

### Requirement: Core Physical Ruleset Documentation Rendering
The modal SHALL render all 7 sections of the official physical ruleset (`docs/rules.md`), including Expedition Objective & Defeat Conditions, Core Definitions, Preparation & Difficulty, Live-Play Architecture, Attrition Track, Survival Rewards, and Reset Protocol.

#### Scenario: Viewing physical rules content
- **WHEN** the "Core Physical Ruleset" tab is active
- **THEN** the modal SHALL render the formatted physical rules text with section headings and structural guidelines

### Requirement: Digital Interaction Mapping Guide
The modal SHALL provide a clear reference mapping physical paper & marker mechanics to web game UI actions (such as card selection, Spades targeting mode, Diamond Vaulting, Clubs wildcard pairing, Black Curse pyramid-only pairing, and automated post-round attrition processing).

#### Scenario: Reviewing digital controls mapping
- **WHEN** the "Web Play & Controls" tab is active
- **THEN** the modal SHALL display instructions for each digital interaction model, including click mechanics, mode transitions, and visual indicator badges

### Requirement: Expedition rules modal describes multi-card FILO Vault stacking
The Expedition Rules modal SHALL explicitly state that the Diamond Vault supports storing multiple Blessed Diamond cards in a stack, operating on a First-In, Last-Out (FILO) basis.

#### Scenario: Rules modal renders FILO vault rule text
- **WHEN** the player opens the Expedition Rules modal
- **THEN** the Vault rule description SHALL state that multiple Diamond cards can be vaulted and stack in FILO order

### Requirement: Standard Pyramid Solitaire Documentation Rendering
The modal SHALL render a dedicated section documenting standard Pyramid Solitaire rules, including the game objective, layout structure, card values and target sum 13 pairing rules, stock/waste/redeal mechanics, and a comparison table contrasting standard solitaire with *The Cursed Tomb* campaign rules.

#### Scenario: Viewing standard pyramid rules content
- **WHEN** the "Standard Pyramid" tab is active
- **THEN** the modal SHALL render standard Pyramid Solitaire layout, card value pairing rules, stock draw/redeal limits, and the comparison matrix against campaign rules

### Requirement: Card Anatomy and Ink Markings Visual Key
The modal SHALL present a visual key illustrating the physical placement of ink marks (Scars, Curses, Blessings, Anchors) on playing card corners and how they are rendered on digital card index badges in the web application.

#### Scenario: Inspecting card mark layout
- **WHEN** the "Card Anatomy" tab is active
- **THEN** the modal SHALL display visual diagrams mapping top-left Attrition/Blessing marks and top-right Immunity Anchor marks to digital card corner indices

