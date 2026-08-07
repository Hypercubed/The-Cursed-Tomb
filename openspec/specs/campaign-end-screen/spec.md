# campaign-end-screen Spec

## Requirements

### Requirement: Campaign end screen appears on campaign defeat or voluntary retirement
When the campaign ends in defeat (starvation) or voluntary retirement, the application SHALL display a full-screen `CampaignEndModal`. Under the Endless Campaign Paradigm, a Perfect Win (clearing all 52 cards) is celebrated as an achievement in the `RoundSummaryModal` and allows the campaign to continue indefinitely rather than forcing a campaign victory end screen.

#### Scenario: Defeat modal opens on starvation
- **WHEN** `applyEndOfWeekLifecycle` resolves a campaign as `status === 'defeat'` with `defeatReason === 'starvation'`
- **THEN** the `CampaignEndModal` SHALL open in defeat mode with the headline "The Tomb Collapsed" and the sub-message "Starvation — not enough cards remain to deal a new pyramid"

#### Scenario: Defeat modal is non-dismissible except via new campaign
- **WHEN** the `CampaignEndModal` is open in defeat mode
- **THEN** clicking the backdrop or any close icon SHALL NOT close the modal
- **AND** the only enabled action SHALL be "Start New Campaign"

#### Scenario: Voluntary retirement modal opens
- **WHEN** the player clicks "Retire Campaign" from the summary or options UI
- **THEN** the `CampaignEndModal` SHALL open displaying final run metrics and achievements

### Requirement: Campaign end screen displays campaign run statistics
The `CampaignEndModal` SHALL display the player's campaign statistics for the completed run in both defeat and victory modes.

#### Scenario: Stats shown include rounds survived, pyramid outcomes, and entombed cards
- **WHEN** the `CampaignEndModal` is open
- **THEN** it SHALL display: rounds survived (roundNumber), pyramids cleared (partialVictories + completeVictories from campaign stats), pyramids collapsed (pyramidCollapses from campaign stats), total attempts, and count of entombed cards (cards at attritionStage 5 in masterDeck)

#### Scenario: Cards blessed and anchored count displayed
- **WHEN** the `CampaignEndModal` is open
- **THEN** it SHALL display the count of cards with blessed status and the count of cards with rewardStage >= 1 (anchored/fortifying) from the final masterDeck

### Requirement: Card Codex accessible from campaign end screen
The `CampaignEndModal` SHALL provide access to the final state of the card deck (Deck Matrix / matched-cards view) so the player can inspect the state of their deck at campaign end.

#### Scenario: View Card Codex button opens deck matrix
- **WHEN** the player clicks "View Card Codex" in the `CampaignEndModal`
- **THEN** the Deck Matrix (matched-cards modal) SHALL open showing the final masterDeck state
- **AND** the `CampaignEndModal` SHALL remain open beneath it

#### Scenario: Closing Deck Matrix returns to campaign end screen
- **WHEN** the player closes the Deck Matrix from within the campaign end flow
- **THEN** the `CampaignEndModal` SHALL still be visible and the player SHALL still be required to start a new campaign to exit

### Requirement: Defeat screen includes inline end-round attrition summary
The `CampaignEndModal` in defeat mode SHALL display a compact summary of the final round's attrition effects (scarred, cursed, and entombed cards) sourced from `RoundLifecycleEffects`. The `RoundSummaryModal` SHALL NOT open for campaign-ending defeat rounds — the `CampaignEndModal` is the sole modal for that outcome. The victory path does not include an attrition summary.

#### Scenario: Final round attrition marks shown in defeat screen
- **WHEN** the `CampaignEndModal` opens in defeat mode
- **THEN** it SHALL display the cards that were scarred, cursed, or entombed in the final round, derived from `RoundLifecycleEffects`
- **AND** the `RoundSummaryModal` SHALL NOT open for that round

#### Scenario: No attrition effects renders empty summary gracefully
- **WHEN** the `CampaignEndModal` opens in defeat mode AND `effects` contains no scarred, cursed, or entombed cards
- **THEN** the defeat screen SHALL render a message indicating no new marks were acquired in the final round

### Requirement: Autoplay stops when campaign end screen appears
When the `CampaignEndModal` opens, any active autoplay session SHALL be halted.

#### Scenario: Autoplay halts on campaign end
- **WHEN** the `CampaignEndModal` opens (defeat or victory)
- **THEN** autoplay `isPlaying` SHALL be set to false and the interval loop SHALL stop
