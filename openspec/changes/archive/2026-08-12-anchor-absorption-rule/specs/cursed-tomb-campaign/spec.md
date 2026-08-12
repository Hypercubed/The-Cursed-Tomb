## MODIFIED Requirements

### Requirement: Attrition Phase on game freeze
When a round freezes (pyramid collapse), the campaign SHALL identify Bottlenecks (exposed cards at lowest remaining base tiers of the frozen pyramid). If an exposed card possesses a completed Anchor (`[+]`, `rewardStage === 2`), it SHALL absorb 1 freeze attrition mark by incrementing its `anchorAbsorption` count. On absorbing the 4th mark, the card's `rewardStage` SHALL drop to 0 (anchor shield breaks), while its `attritionStage` SHALL remain unchanged. An un-anchored exposed card SHALL increment its `attritionStage` by exactly one stroke up to maximum stage 5 (Entombed). End-of-round attrition SHALL be applied strictly once per failed round. If a Blessed card advances to Attrition Stage 4, its rank SHALL receive the Stage 4 rank marking (slash over rank), but the Curse trap mechanics (Red face-down deal or Black weight partner reshuffle) and Curse drawing SHALL be skipped.

#### Scenario: Bottleneck card gains an attrition mark
- **WHEN** a round freezes AND an exposed pyramid card is not Anchored (`rewardStage < 2`)
- **THEN** its Attrition Stage SHALL increase by exactly 1 upon round completion
- **AND** advancing to the subsequent round SHALL NOT re-apply attrition for the already processed round

#### Scenario: Entombed card moves to Graveyard
- **WHEN** an attrition mark increases a card's Attrition Stage to 5
- **THEN** the card SHALL be permanently moved to the Graveyard Box AND SHALL NOT be dealt in future rounds

#### Scenario: Anchored card absorbs freeze hit up to max capacity
- **WHEN** a round freezes AND an exposed bottleneck card has a completed Anchor (`rewardStage === 2`) AND its `anchorAbsorption` count is less than 3
- **THEN** its `anchorAbsorption` count SHALL increase by 1
- **AND** its `attritionStage` SHALL NOT be modified
- **AND** its `rewardStage` SHALL remain at 2

#### Scenario: Anchored card shield breaks on 4th absorption hit
- **WHEN** a round freezes AND an exposed bottleneck card has a completed Anchor (`rewardStage === 2`) AND its `anchorAbsorption` count reaches 4
- **THEN** its `rewardStage` SHALL be reset to 0
- **AND** its `attritionStage` SHALL NOT be reset to 0 (retaining its current attrition level)

#### Scenario: Blessed card taking Stage 4 Attrition skips Curse trap
- **WHEN** a card with a Blessing (`blessed === true`) at Stage 3 Scarred receives an attrition mark
- **THEN** its Attrition Stage SHALL increase to Stage 4 AND receive the Stage 4 rank marking (slash over rank)
- **THEN** the system SHALL skip the Curse trap effect (Red face-down deal or Black weight partner reshuffle)
- **THEN** the system SHALL skip the Curse icon drawing, retaining the Blessing power and Blessing icon on the card face
- **AND** a subsequent attrition mark SHALL advance the card to Stage 5 (Entombed)
