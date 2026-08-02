## Why

Campaign defeat and victory resolve silently — the end state communicates itself only through the absence of a "Next Round" button in the round summary modal, with no dedicated moment of closure. Players who complete or lose a campaign deserve a clear, final screen that marks the event, surfaces their record, and gives them a deliberate path forward.

## What Changes

- Introduce a `CampaignEndModal` component that appears when `campaign.status === 'defeat'` or a campaign victory condition is reached, replacing the round summary modal as the final interaction for those outcomes.
- The modal is **non-dismissible by close/click-outside** — the only exit is "Start New Campaign" (defeat) or "Start New Campaign" / "View Codex" on victory.
- Victory screen shows: final defeat condition or victory headline, campaign stats (rounds survived, pyramids cleared, pyramids collapsed, total attempts, cards entombed, cards blessed/anchored), and an inline or launchable Card Codex (Deck Matrix / matched-cards view).
- Defeat screen shows: the specific defeat reason (`starvation` or `volatile-collapse`), same campaign stats, and the Card Codex so players can see the state of their deck when it fell.
- On "Start New Campaign", the modal closes and the campaign setup flow opens (same as clicking New Campaign today).
- Autoplay stops when the campaign end screen appears.

## Capabilities

### New Capabilities
- `campaign-end-screen`: Full-screen modal for campaign defeat and victory. Non-dismissible. Shows headline, defeat/victory condition, campaign run stats, and access to the final Card Codex. Only exit is starting a new campaign.

### Modified Capabilities
- `cursed-tomb-campaign`: Campaign end conditions now trigger a dedicated end screen rather than the absence of a UI element. The `starvation` and `volatile-collapse` defeat reasons must be surfaced in the UI.
- `win-loss-stats`: Campaign end screen reads and displays active campaign statistics (pyramids explored, pyramids collapsed, total attempts, campaign victory flag).

## Impact

- New component: `src/components/CampaignEndModal.tsx`
- `src/App.tsx`: New state flag `isCampaignEndModalOpen`; logic to detect campaign end after `applyEndOfWeekLifecycle` and open the modal instead of (or after) the round summary modal for final rounds; autoplay stop on modal open.
- `src/hooks/useAutoplay.ts`: Needs to stop when campaign end screen is triggered (via callback or state).
- No new data — `CampaignState` and `CampaignStats` already carry all required fields.
- No breaking changes to game logic or persistence.
