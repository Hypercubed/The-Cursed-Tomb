# MODIFIED Requirements

## MODIFIED Requirements

### Requirement: Attrition Phase on game freeze
When a round freezes (pyramid collapse), the campaign SHALL identify Bottlenecks (exposed cards at lowest remaining base tiers of the frozen pyramid) and increment their Attrition Stage by exactly one stroke unless they possess a completed Anchor (`[+]`) or active temporary immunity. If a Blessed card advances to Attrition Stage 4, its rank SHALL receive the Stage 4 rank marking (slash over rank), but the Curse trap mechanics (Red face-down deal or Black pyramid-only pairing lock) and Curse drawing SHALL be skipped.

#### Scenario: Blessed card taking Stage 4 Attrition skips Curse trap
- **WHEN** a card with a Blessing (`blessed === true`) at Stage 3 Scarred receives an attrition mark
- **THEN** its Attrition Stage SHALL increase to Stage 4 AND receive the Stage 4 rank marking (slash over rank)
- **THEN** the system SHALL skip the Curse trap effect (Red face-down deal or Black pyramid-only restriction)
- **THEN** the system SHALL skip the Curse icon drawing, retaining the Blessing power and Blessing icon on the card face
- **AND** a subsequent attrition mark SHALL advance the card to Stage 5 (Entombed)

### Requirement: Survival Reward Phase and Anchor Accumulation
When a round achieves a Pyramid Clear, the campaign SHALL evaluate the final visual transaction (Pair Clear or Solo King Clear) to assign rewards. If the higher-value Hero card is Stage 4 Cursed, the Blessing award SHALL be skipped.

#### Scenario: Cursed card cleared as Fallen Hero skips Blessing award
- **WHEN** a round ends in victory AND the higher-value Hero card of the final cleared pair is Cursed (Stage 4 with active Curse effect)
- **THEN** the system SHALL skip the Blessing award (`blessed` remains `false`)
- **THEN** the card SHALL remain Cursed with its active Curse trap effect and Curse icon
