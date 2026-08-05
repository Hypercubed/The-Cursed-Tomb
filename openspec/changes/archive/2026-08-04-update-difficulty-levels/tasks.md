## 1. Update CampaignSetupModal difficulty options

- [x] 1.1 In `src/components/CampaignSetupModal.tsx`, change Novice `value` from `null` to `5`
- [x] 1.2 Update Novice `redealsText` from `'Unlimited Redeals'` to `'5 Redeals (6 Passes)'`
- [x] 1.3 Update Novice `description` to reference "5 stock redeals" instead of "Unlimited"
- [x] 1.4 Change Explorer `value` from `2` to `3`
- [x] 1.5 Update Explorer `redealsText` from `'2 Redeals (3 Passes)'` to `'3 Redeals (4 Passes)'`
- [x] 1.6 Update Explorer `description` to reference "3 stock redeals" instead of "2"
- [x] 1.7 Add a comment near the `winRate` / `standardWinRate` / `campaignWinRate` fields for Novice and Explorer noting they are stale and need re-simulation

## 2. Update GameSidebar difficulty labels and options

- [x] 2.1 In `src/components/GameSidebar.tsx`, update `redrawOptions`: change the Novice entry label from `'Novice (Sandbox) — Unlimited'` to `'Novice (Sandbox) — 5 Redeals'` and its `value` from `null` to `5`
- [x] 2.2 Update the Explorer entry label from `'Explorer (Easy) — 2 Redeals'` to `'Explorer (Easy) — 3 Redeals'` and its `value` from `2` to `3`
- [x] 2.3 Update `getDifficultyLabel`: replace `if (value === null) return 'Novice (Sandbox)';` with `if (value === 5) return 'Novice (Sandbox)';` and replace `if (value === 2) return 'Explorer (Easy)';` with `if (value === 3) return 'Explorer (Easy)';`

## 3. Update RulesModal text

- [x] 3.1 In `src/components/RulesModal.tsx`, update the Novice line from "Unlimited Redeals. Relaxed learning mode." to "5 Redeals (6 Passes). Relaxed learning mode."

## 4. Update rules documentation

- [x] 4.1 In `docs/rules.md` Section 3 (Preparation & Difficulty), update the Novice bullet to "5 Redeals allowed (6 total passes through the Stock deck)"
- [x] 4.2 Update the Explorer bullet to "3 Redeals allowed (4 total passes through the Stock deck)"

## 5. Verify

- [x] 5.1 Start a new Novice campaign and confirm `redrawsRemaining` initializes to `5` (not `null`) — verify via dev tools or debug panel
- [x] 5.2 Start a new Explorer campaign and confirm `redrawsRemaining` initializes to `3`
- [x] 5.3 Confirm the campaign setup modal displays correct redeal text for all four difficulty levels
- [x] 5.4 Confirm the sidebar correctly labels saved games at each difficulty
