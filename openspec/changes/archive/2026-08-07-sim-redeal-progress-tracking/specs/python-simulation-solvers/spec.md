## ADDED Requirements

### Requirement: Stock-to-Vault Progress Tracking for Redeal Availability
The Python simulation engine SHALL treat any game state mutation—including cards entering the Diamond Vault from the stock pile—as progress during the stock pass, enabling redeal availability when stock is depleted.

#### Scenario: Redeal permitted after stock auto-vaulting with zero pair clears
- **WHEN** a stock pass results in zero card pair clears but moves one or more blessed Diamond cards from stock into the Vault
- **THEN** the simulation engine marks progress for the pass and permits a redeal move if redeals remain and waste is non-empty
