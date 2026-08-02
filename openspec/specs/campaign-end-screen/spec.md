# campaign-end-screen Spec

## Requirements

### Requirement: Campaign end screen appears on campaign defeat
When the campaign ends in defeat (starvation or volatile collapse), the application SHALL display a full-screen, non-dismissible `CampaignEndModal` in defeat mode. The player SHALL NOT be able to close the modal by clicking outside it or pressing a close button. The only available action is "Start New Campaign", which opens the campaign setup flow.

#### Scenario: Defeat modal opens on starvation
- **WHEN** `applyEndOfWeekLifecycle` resolves a campaign as `status === 'defeat'` with `defeatReason === 'starvation'`
- **THEN** the `CampaignEndModal` SHALL open in defeat mode with the headline "The Tomb Collapsed" and the sub-message "Starvation — not enough cards remain to deal a new pyramid"

#### Scenario: Defeat modal opens on volatile collapse
- **WHEN** `applyEndOfWeekLifecycle` resolves a campaign as `status === 'defeat'` with `defeatReason === 'volatile-collapse'`
- **THEN** the `CampaignEndModal` SHALL open in defeat mode with the headline "The Tomb Collapsed" and the sub-message "Volatile Collapse — an entire rank has been entombed"

#### Scenario: Defeat modal is non-dismissible except via new campaign
- **WHEN** the `CampaignEndModal` is open in defeat mode
- **THEN** clicking the backdrop or any close icon SHALL NOT close the modal
- **AND** the only enabled action SHALL be "Start New Campaign"

### Requirement: Campaign end screen appears on campaign victory
When all campaign rounds are completed with a full pyramid clear (complete-victory on the final round), the application SHALL display the `CampaignEndModal` in victory mode. The modal SHALL be non-dismissible except via "Start New Campaign" or "View Card Codex" (which opens the Deck Matrix but does not close the campaign end modal).

#### Scenario: Victory modal opens on campaign complete-victory
- **WHEN** a round resolves as `complete-victory` AND the campaign has no further rounds to advance
- **THEN** the `CampaignEndModal` SHALL open in victory mode with the headline "The Tomb Has Been Conquered"

#### Scenario: Victory modal is non-dismissible except via new campaign
- **WHEN** the `CampaignEndModal` is open in victory mode
- **THEN** clicking the backdrop SHALL NOT close the modal
- **AND** the exit actions SHALL be "Start New Campaign" and "View Card Codex"

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
