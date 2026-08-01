# Cursed Tomb Campaign

## MODIFIED Requirements

### Requirement: Attrition Phase on game freeze
When a round freezes (pyramid collapse), the campaign SHALL identify Bottlenecks (exposed cards at lowest remaining base tiers of the frozen pyramid) and increment their Attrition Stage by exactly one stroke unless they possess a completed Anchor (`[+]`) or active temporary immunity. End-of-round attrition SHALL be applied strictly once per failed round.

#### Scenario: Bottleneck card gains an attrition mark
- **WHEN** a round freezes AND an exposed pyramid card is not Anchored
- **THEN** its Attrition Stage SHALL increase by exactly 1 upon round completion
- **AND** advancing to the subsequent round SHALL NOT re-apply attrition for the already processed round
