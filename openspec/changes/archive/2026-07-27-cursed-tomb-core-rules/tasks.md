## 1. State Model and Setup

- [x] 1.1 Expand `Card` type to `CursedCard` and add tracking for attrition/rewards/face-down in `src/game.ts`
- [x] 1.2 Implement `CampaignState` wrapper in `src/game.ts` to hold master deck, graveyard, and mode ('standard' | 'cursed-tomb')
- [x] 1.3 Add mode toggle (Standard vs Cursed Tomb) and Volatile Collapse variant toggle to `CampaignSetupModal`
- [x] 1.4 Implement functional value math helper: `getFunctionalValue(card, mode)` (+1 Red Scar, -1 Black Scar)

## 2. Pairing & Core Traps

- [x] 2.1 Update pairing validation to check functional value instead of rank when in cursed-tomb mode
- [x] 2.2 Implement Red Curse logic: when dealing pyramid, mark cards beneath red-cursed cards as `faceDown`
- [x] 2.3 Implement Black Curse logic: restrict black-cursed cards from pairing with stock or waste
- [x] 2.4 Update solver engine in `src/solver.ts` to respect Functional Values, Red Curses, and Black Curses during Cursed Tomb mode

## 3. End of Round Lifecycle

- [x] 3.1 Implement Attrition Phase logic (identifying bottlenecks on pyramid collapse, incrementing marks, Anchored immunity check)
- [x] 3.2 Implement Reward Phase logic (evaluating final pair vs Solo King clear, enforcing Rule of Ink Overlap, granting Hero/Anchor)
- [x] 3.3 Implement round transition: apply graveyard culling, audit Starvation (<28 active cards), and audit Volatile Collapse (4 entombed of one rank)

## 4. Blessings & Interactive Targeting

- [x] 4.1 Add Diamond Vault slot to `DrawZone` UI and allow free move from Waste to Vault for ♦ Heroes
- [x] 4.2 Implement `interactionMode` state for Spades Tunnel (flip face-down) and Hearts Martyr (temp Anchor immunity) target selection
- [x] 4.3 Add UI click handlers and visual target highlight indicators for manual Spades and Hearts targeting
- [x] 4.4 Implement Clubs Equalizer logic: when partnering with a ♣ hero, ignore partner's scar shift

## 5. Persistence & Rendering

- [x] 5.1 Implement LocalStorage saves for `CampaignState` (preserving master deck and graveyard mutations across reloads)
- [x] 5.2 Update `PlayingCard` component to render upper-left (Anchors/Blessings) and upper-right (Scars/Curses/Entombed) ink marks
- [x] 5.3 Update `MatchedCardsModal.tsx` (Tomb Vault) to render card campaign mutations (Scars, Curses, Blessings, Anchors, Entombed status) and Functional Values in the 4×13 grid
- [x] 5.4 Write/update unit tests in `game.test.ts` to verify functional values, traps, blessings, and end-of-round state transitions
