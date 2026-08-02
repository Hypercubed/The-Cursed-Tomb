## MODIFIED Requirements

### Requirement: Campaign End & Audit Conditions (Starvation and Volatile Collapse)
The campaign engine SHALL audit active deck pool size and Graveyard counts between rounds. When a defeat condition is detected, the application SHALL surface the specific defeat reason in the campaign end screen rather than silently suppressing the "Next Round" button.

#### Scenario: Starvation condition triggers campaign defeat
- **WHEN** fewer than 28 active cards remain in the campaign pool at the start of a new round
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse) with `defeatReason === 'starvation'`
- **AND** the `CampaignEndModal` SHALL open displaying the starvation defeat reason

#### Scenario: Volatile Collapse variant condition
- **WHEN** the Volatile Collapse rule is enabled AND all 4 cards of any printed rank reside in the Graveyard Box
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse) with `defeatReason === 'volatile-collapse'`
- **AND** the `CampaignEndModal` SHALL open displaying the volatile-collapse defeat reason
