## MODIFIED Requirements

### Requirement: Campaign End & Audit Conditions (Starvation)
The campaign engine SHALL audit the active deck pool size between rounds at campaign reset. Starvation (fewer than 28 active cards remaining) SHALL be the sole mandatory defeat condition. There is no Volatile Collapse condition; the entombment of all cards of a single rank has no special mechanical significance and SHALL NOT trigger defeat or any advisory warning.

#### Scenario: Starvation condition triggers campaign defeat
- **WHEN** fewer than 28 active cards remain in the campaign pool at the start of a new round
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse) with `defeatReason === 'starvation'`
- **AND** the `CampaignEndModal` SHALL open displaying the starvation defeat reason

## REMOVED Requirements

### Requirement: Volatile Collapse variant defeat condition
**Reason**: Never exposed in the digital game UI (toggle was wired but never rendered); 0.0% occurrence rate across all simulated difficulties even when explicitly enabled; starvation is both the intended and actual sole defeat path.
**Migration**: No migration needed — this mechanic was never reachable by players. The `defeatReason` type union loses the `'volatile-collapse'` branch; code that checked `volatileCollapse` or `volatilityWarning` is removed.
