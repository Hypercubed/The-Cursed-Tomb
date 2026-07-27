## Context

We are introducing the core "Cursed Tomb" ruleset, turning the standard Pyramid Solitaire into a legacy campaign. The deck must persist across rounds, accumulating mutations (Scars, Curses, Blessings, Anchors) that fundamentally alter game logic, such as modifying card values (Functional Value) and imposing trap constraints (Red/Black curses).

## Goals / Non-Goals

**Goals:**
- Implement the `CampaignState` layer that wraps the ephemeral `GameState` to persist the 52-card pool.
- Expand the `Card` model to include persistent properties (`attritionStage`, `rewardStage`, `blessed`) and round-specific properties (`faceDown`, `tempImmune`).
- Update the core game engine to calculate `functionalValue` based on `printedRank` and active Scars.
- Implement the Attrition Phase (processing frozen board bottlenecks).
- Implement the Survival Reward Phase (processing Pyramid Clear final pair).
- Add specific mechanics: Red Curse locks, Black Curse restrictions, Diamond Vault, Spades/Hearts/Clubs blessing effects.
- Provide a mode toggle in `CampaignSetupModal` to choose between "Standard Solitaire" and "Cursed Tomb".
- Ensure the autoplay and solver engines (`src/solver.ts`) evaluate Functional Values and respect Cursed Tomb mechanics when the mode is active.
- Update `MatchedCardsModal` (Tomb Vault) to display deck campaign states (Scars, Curses, Blessings, Anchors, Entombed status, and Functional Values) in the 4×13 matrix.

**Non-Goals:**
- Comprehensive animations for ink marks or complex visual flair (rendering basic SVG overlays is sufficient for now).
- Cloud saves or leaderboards. LocalStorage is sufficient.

## Decisions

### Decision 1: Campaign vs Round State Architecture
We will wrap `GameState` inside a `CampaignState` when in Cursed Tomb mode.
- `CampaignState` holds: `mode: 'standard' | 'cursed-tomb'`, `difficulty`, `masterDeck` (array of `CursedCard`), `graveyard` (array of `CursedCard`), and `currentRound: GameState`.
- `GameState` continues to handle the immediate board layout (Pyramid, Stock, Waste) but its cards reference the mutated versions from `masterDeck`.
- **Rationale**: Keeps the core pairing logic isolated from the campaign lifecycle while allowing the campaign layer to mutate the deck between rounds.

### Decision 2: Functional Value Resolution
- Pairing logic will evaluate `functionalValue(card)` instead of `card.rank`.
- `functionalValue` = `printedRank` + (+1 if Red Suit && AttritionStage >= 3) + (-1 if Black Suit && AttritionStage >= 3).
- Clubs Equalizer blessing overrides this by forcing the partner to use `printedRank`.

### Decision 3: End of Round Lifecycle
When `checkForWin` detects a freeze (`pyramid-collapse`), the Campaign Orchestrator takes over:
1. Identifies Bottlenecks (exposed cards on lowest tiers).
2. Increments their `attritionStage` (unless Anchored or tempImmune).
3. Moves any `attritionStage === 5` to `graveyard`.
4. Checks Starvation condition (<28 active cards). If true, Campaign Over. Otherwise, prepare next round.

When `checkForWin` detects a clear (`complete-victory` or `partial-victory`):
1. Evaluates the final cleared pair.
2. Applies Fallen Hero `[O]` to higher value, Anchor `[+]` or `[—]` to lower value.

## Risks / Trade-offs

- **[Complexity in State Sync]** → Separating `masterDeck` from `currentRound` requires careful mapping. Mitigation: Use stable IDs (`suit` + `printedRank`) to merge round state changes back into the `masterDeck` at the end of the round.
- **[Infinite Loop in Targeting]** → Interactive targeting for Spades/Hearts interrupts standard play flow. Mitigation: Introduce an `interactionMode` flag in `GameState` (e.g., `'playing' | 'targeting-spades' | 'targeting-hearts'`) to control clicks.
