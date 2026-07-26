## ADDED Requirements

### Requirement: Draw and discard piles render as pedestals
The draw pile SHALL render with a stone pedestal visual containing a golden icon on its face. The discard pile SHALL render with a sandstone altar aesthetic that displays a glowing golden runic frame when a card is active or selected.

#### Scenario: Draw pile displays as a stone block
- **WHEN** the draw pile is rendered
- **THEN** it SHALL show a stone-block design with a centered golden icon

#### Scenario: Discard pile displays altar styling
- **WHEN** the discard pile is rendered
- **THEN** it SHALL show a sandstone altar slot, and show a glowing golden frame when a card is selected or active

### Requirement: Sidebar is styled as a leather-bound journal
The left sidebar containing the setup and status panels SHALL use a styled container background evoking a weathered, leather-bound explorer's journal.

#### Scenario: Sidebar renders with journal styling
- **WHEN** the page is loaded
- **THEN** the sidebar container SHALL display with a dark leather-like frame and aged parchment interior panels
