## Why

The current game implements standard ephemeral Pyramid Solitaire. The core vision of "The Cursed Tomb" requires a persistent campaign mode where a single 52-card deck accumulates permanent ink marks (Scars, Curses, Blessings, Anchors) across multiple rounds. We need to introduce the persistent campaign engine and allow users to select between "Standard Solitaire" and "Cursed Tomb" modes in the setup modal.

## What Changes

- **Game Mode Selection**: Add a mode toggle (Standard Solitaire vs Cursed Tomb Campaign) to the `CampaignSetupModal`.
- **Persistent Campaign State**: Introduce a higher-level state manager that persists the master 52-card deck and its mutations across rounds.
- **Card Mutations**: Expand the card model to track Attrition Stage (1-5), Reward Stage (1-2), Blessings, and Face-down locks.
- **Functional Value Math**: Update pairing logic to use Functional Value (Printed Rank ± Scars) rather than fixed Printed Rank.
- **End-of-Round Lifecycle**: Implement the Attrition phase (on freeze) and Reward phase (on pyramid clear) to apply ink marks.
- **Trap & Blessing Mechanics**: Implement Red Curse locks, Black Curse restrictions, Diamond Vault, and Spades/Hearts/Clubs triggers.
- **BREAKING**: Game state management shifts from single-round ephemeral state to being wrapped by a Campaign orchestrator.

## Capabilities

### New Capabilities
- `cursed-tomb-campaign`: The persistent campaign engine managing deck state, functional values, attrition tracking, and survival rewards across multiple rounds.

### Modified Capabilities
- `campaign-setup-modal`: Modifying the setup modal to include a game mode selection (Standard vs Cursed Tomb) alongside difficulty.
- `pyramid-solitaire-game`: Modifying the core game logic to evaluate `functionalValue` instead of `rank` and to support Cursed Tomb trap/blessing rules when the campaign mode is active.
- `debug-autoplay-panel`: Modifying the solver engine to respect functional values, traps, and mechanics when playing in cursed-tomb mode.
- `matched-cards-tracking`: Modifying the Matched Cards Tomb Vault modal to display deck campaign mutations (Scars, Curses, Blessings, Anchors, Graveyard status) and Functional Values.

## Impact

- **UI**: Updates to `CampaignSetupModal`, `PlayingCard` (to render ink marks), and `DrawZone` (to add the Diamond Vault).
- **State**: Significant refactoring of `game.ts` to separate single-round state from campaign state and to implement the end-of-round mutation logic.
- **Persistence**: Requires saving the campaign state (master deck, graveyard) to LocalStorage.
