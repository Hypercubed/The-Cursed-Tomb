## 1. CampaignEndModal Component

- [x] 1.1 Create `src/components/CampaignEndModal.tsx` with props: `isOpen`, `mode: 'defeat' | 'victory'`, `defeatReason?: 'starvation' | 'volatile-collapse'`, `campaign: CampaignState`, `campaignStats`, `roundNumber`, `effects: RoundLifecycleEffects | null`, `onStartNewCampaign`, `onOpenVault`
- [x] 1.2 Render defeat headline "The Tomb Collapsed" with sub-message based on `defeatReason` (starvation vs volatile-collapse)
- [x] 1.3 Render victory headline "The Tomb Has Been Conquered"
- [x] 1.4 Render campaign run statistics section: rounds survived, pyramids cleared, pyramids collapsed, total attempts
- [x] 1.5 Derive and render entombed card count (cards at `attritionStage === 5` in `masterDeck`) from `campaign`
- [x] 1.6 Derive and render blessed card count and anchored/fortifying card count from `campaign.masterDeck`
- [x] 1.7 Render "View Card Codex" button that calls `onOpenVault`
- [x] 1.8 Render "Start New Campaign" button that calls `onStartNewCampaign`
- [x] 1.9 Make modal non-dismissible: backdrop has no `onClick` handler and no close `✕` button is rendered
- [x] 1.10 In defeat mode, render a compact inline attrition summary from `effects`: scarred, cursed, and entombed cards as a list (no final-pair transaction details, no vault button — just the marks); render "No new marks in the final round" if `effects` has none
- [x] 1.11 Style modal consistent with existing game aesthetic (dark parchment palette, `font-display` headings, amber/red accents for defeat, amber/gold accents for victory)

## 2. App.tsx Integration

- [x] 2.1 Add `isCampaignEndModalOpen` state (`useState(false)`) to `App.tsx`
- [x] 2.2 In the round-end `useEffect`, after `applyEndOfWeekLifecycle`, add branch: if `nextCampaignState.status === 'defeat'`, compute `effects` via `computeRoundLifecycleEffects`, call `stop()` (autoplay), set `roundEffects`, then `setIsCampaignEndModalOpen(true)` — do NOT set `isRoundSummaryModalOpen`
- [x] 2.3 In the round-end `useEffect`, detect `game.status === 'complete-victory'` during an active campaign and open `CampaignEndModal` in victory mode (per rules.md: a Perfect Win = campaign victory, no round cap)
- [x] 2.4 Wire `<CampaignEndModal>` into the JSX with all required props: `isOpen={isCampaignEndModalOpen}`, `campaign`, `campaignStats`, `effects={roundEffects}`, `onStartNewCampaign` opens `isCampaignSetupModalOpen`, `onOpenVault` opens `isMatchedCardsModalOpen`
- [x] 2.5 Reset `isCampaignEndModalOpen` to `false` in `handleStartCampaign` so starting a new campaign clears the modal

## 3. Autoplay Stop on Campaign End

- [x] 3.1 Confirm `useAutoplay` exposes `stop()` in its return value (it already does — verify)
- [x] 3.2 In the `useEffect` branch that sets `isCampaignEndModalOpen = true`, call `stop()` before the state update

## 4. Verification

- [x] 4.1 Manual test: run campaign to defeat (use Debug panel force-loss to accelerate), verify `CampaignEndModal` opens with correct defeat reason, correct stats, and cannot be closed except via "Start New Campaign"
- [x] 4.2 Manual test: "View Card Codex" opens Deck Matrix and end modal remains visible behind it; closing Deck Matrix returns to end modal
- [x] 4.3 Manual test: "Start New Campaign" from end modal opens campaign setup flow
- [x] 4.4 Manual test: autoplay running when campaign defeat triggers — verify autoplay stops when end modal appears
- [x] 4.5 Build passes with no TypeScript errors (`npm run build`)
