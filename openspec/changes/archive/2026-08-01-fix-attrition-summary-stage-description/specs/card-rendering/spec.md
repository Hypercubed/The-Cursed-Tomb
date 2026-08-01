# Card Rendering

## MODIFIED Requirements

### Requirement: Attrition Stage modal display
The Round Summary modal SHALL display accurate descriptions for cards receiving attrition marks, explicitly indicating that Stage 1 (Vulnerable) and Stage 2 (Doubtful) cards have no functional value shift, while Stage 3 cards display their active +1 or -1 functional value shift.

#### Scenario: Stage 1 card displayed in Round Summary modal
- **WHEN** a card increases to Attrition Stage 1
- **THEN** the modal SHALL display "Stage 1 (Vulnerable |N): 1st attrition stroke (No functional value shift yet)"
- **AND** SHALL NOT state that the functional value has shifted

#### Scenario: Stage 3 card displayed in Round Summary modal
- **WHEN** a card increases to Attrition Stage 3
- **THEN** the modal SHALL display its active functional value shift (+1 for Red, -1 for Black) and effective modified rank
