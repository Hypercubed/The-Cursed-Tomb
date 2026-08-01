# Cursed Tomb Campaign (Delta)

## MODIFIED Requirements

### Requirement: Functional Value scaling and Retrospective Anchors
The game SHALL calculate card pairing values dynamically, applying a +1 value shift for Red Scars (stage 3+ Hearts/Diamonds) and a -1 value shift for Black Scars (stage 3+ Spades/Clubs). Functional values SHALL be clamped between 1 (Ace) and 13 (King). An Anchor (`[+]`) SHALL prevent future attrition progression but SHALL NOT erase pre-existing Scars or Curses.

#### Scenario: Scarred Red card acts as higher value
- **WHEN** a Red card (e.g., ♥ Queen, printed rank 12) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 13 AND it can be cleared solo as a King

#### Scenario: Scarred Black card acts as lower value
- **WHEN** a Black card (e.g., ♠ 10, printed rank 10) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 9

#### Scenario: Scarred Black Ace retains Functional Value of 1
- **WHEN** a Black Ace (e.g., ♠ Ace, printed rank 1) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 1 AND it SHALL remain pairable with a Queen (functional value 12)

#### Scenario: Scarred Red King retains Functional Value of 13
- **WHEN** a Red King (e.g., ♥ King, printed rank 13) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 13 AND it SHALL remain clearable solo as a King
