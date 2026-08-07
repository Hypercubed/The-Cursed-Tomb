## ADDED Requirements

### Requirement: Multi-card Vault stacking and top-card rendering
The Diamond Vault SHALL support storing multiple Blessed Diamond cards in a First-In, Last-Out (FILO) stack. When multiple cards reside in the Vault, the Draw zone SHALL render the top (most recently vaulted) card as playable, while the Vault count badge SHALL display the total count of cards in the Vault stack.

#### Scenario: Stacking multiple cards into the Vault
- **WHEN** a player vaults a Blessed Diamond card while another card is already in the Vault
- **THEN** the new card SHALL be added to the top of the Vault stack, and the top card SHALL become the exposed, playable Vault card

#### Scenario: Clearing top card from Vault stack
- **WHEN** the top card of a multi-card Vault stack is paired and cleared to the Foundation
- **THEN** it SHALL be removed from the Vault, exposing the previously vaulted card beneath it on top of the Vault stack
