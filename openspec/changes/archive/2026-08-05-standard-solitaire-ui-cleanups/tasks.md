## 1. Draw Zone Layout Cleanups

- [x] 1.1 Add `mode` parameter to `DrawZone` props and condition the `♦ Vault` slot rendering on `mode !== 'standard'` (or `mode === 'cursed-tomb'`).
- [x] 1.2 Pass `game.mode` from `App.tsx` into `DrawZone`.

## 2. Sidebar Progress & Stats Conditioning

- [x] 2.1 Update `GameSidebar` to accept `gameMode` (or `mode`) prop.
- [x] 2.2 Conditionally hide active campaign metrics in `GameSidebar` when running in `standard` mode.
- [x] 2.3 Render mode-appropriate button labels in `GameSidebar` (e.g. "📊 Deck Matrix & Pair Odds", "New Game", "Start Game").

## 3. Modal Header & Label Adjustments

- [x] 3.1 Update `MatchedCardsModal` header title to "Deck Matrix & Strategic Pair Odds" when `mode === 'standard'`.
- [x] 3.2 Update `CampaignSetupModal` action button to "Start Standard Game" when `standard` mode is selected.
- [x] 3.3 Update `CampaignSetupModal` rules overview header to "Rules Overview (Standard Solitaire)" when `standard` mode is selected.
- [x] 3.4 Update header subtitle in `App.tsx` to "Classic Pyramid Solitaire" when `game.mode === 'standard'`.

## 4. Verification & Testing

- [x] 4.1 Run unit and integration tests to verify component rendering and state propagation.
- [x] 4.2 Verify layout switching between Standard Solitaire and Cursed Tomb Campaign mode in the UI.
