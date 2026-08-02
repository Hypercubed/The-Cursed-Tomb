## Context

Campaign end (defeat or victory) currently communicates itself through the *absence* of a "Next Round" button in the `RoundSummaryModal`. There is no dedicated screen, no headline, no fanfare — the player must infer the campaign is over from a missing UI element. Autoplay is also unaware of campaign-level state; it only knows about `game.status` (the current round), so it can continue past a campaign defeat.

The existing architecture:
- `CampaignState` (`campaign`) lives in `App.tsx` state — separate from `game` (current round `GameState`).
- `applyEndOfWeekLifecycle` is already called in the `useEffect` on round end, updating `campaign.status` to `'defeat'` when conditions are met.
- `RoundSummaryModal` is shown after every round end (victory/partial/collapse) in campaign mode and conditionally renders "Next Round" based on `campaign.status === 'active'`.
- `useAutoplay` receives only `game: GameState` and an `onStartNewGame` callback — it has no campaign awareness.
- `CampaignStats` (from persistence) tracks pyramids explored/collapsed, total attempts, isVictory.

## Goals / Non-Goals

**Goals:**
- Display a distinct, non-dismissible modal when a campaign ends (defeat or victory).
- Surface the defeat reason (starvation / volatile-collapse) or victory headline clearly.
- Show campaign run statistics: rounds survived, pyramid outcomes, entombed/blessed/anchored card counts.
- Provide access to the Card Codex (Deck Matrix) from the end screen.
- Stop autoplay when the campaign end screen appears.
- The only exit from the modal is triggering the campaign setup flow (New Campaign).

**Non-Goals:**
- Defining a formal campaign victory condition (that already exists implicitly — the victory screen triggers when a `complete-victory` round advances but produces a new campaign with starvation defeat, or we need to define it; see Open Questions).
- Changing any game logic, card mutation rules, or persistence format.
- Adding animations or cinematic transitions in this change.

## Decisions

### Decision: New `CampaignEndModal` component, not extending `RoundSummaryModal`
The `RoundSummaryModal` is focused on per-round attrition effects and is intentionally dismissible. Campaign end is a distinct moment that is non-dismissible, has different content, and a different visual tone. Extending `RoundSummaryModal` would require conditional logic that obscures both concerns. A new component keeps responsibilities clean.

**Alternatives considered:** Conditional rendering inside `RoundSummaryModal` — rejected because the modal is intrinsically tied to round-level effects data and dismissal behaviour.

### Decision: Campaign end detected in App.tsx useEffect, not in game logic
The existing `useEffect` in `App.tsx` that calls `applyEndOfWeekLifecycle` is the right place to detect `campaign.status === 'defeat'` and set `isCampaignEndModalOpen = true`. This keeps all UI transition logic co-located. The game engine already sets `campaign.status`; the UI layer decides when to surface it.

**Flow:**
```
round ends (game.status changes)
  → useEffect fires
  → applyEndOfWeekLifecycle(campaign) → nextCampaignState
  → if nextCampaignState.status === 'defeat':
      setCampaign(nextCampaignState)
      setIsCampaignEndModalOpen(true)   ← new
      // skip RoundSummaryModal for final rounds
  → else:
      setCampaign(nextCampaignState)
      setIsRoundSummaryModalOpen(true)  ← existing path unchanged
```

### Decision: Non-dismissible via `pointer-events-none` on backdrop and no close button
The backdrop click handler is simply omitted and no close `✕` button is rendered, matching the design intent. No special focus-trap library needed — the modal is full-screen and the only interactive elements are the action buttons.

### Decision: Autoplay stop via `stop()` callback passed to App
`useAutoplay` already exposes a `stop()` function. `App.tsx` calls `stop()` immediately before setting `isCampaignEndModalOpen = true`. This keeps `useAutoplay` campaign-unaware and the integration surface minimal.

### Decision: Card Codex (Deck Matrix) opens alongside the end screen, not instead of it
The `CampaignEndModal` remains mounted when the Deck Matrix is opened. This preserves the non-dismissible contract — closing the Deck Matrix returns the player to the end screen. The `isMatchedCardsModalOpen` state already exists in `App.tsx`; the end modal just calls the same setter.

### Decision: Campaign victory condition
Per `docs/rules.md` §7: "If the board and deck are clear, you win the campaign." Campaign victory = `complete-victory` on any round (all 52 cards cleared to Foundation). There is no round cap. Every `complete-victory` IS a campaign win — the player achieved a Perfect Win and the campaign ends immediately. The `CampaignEndModal` in victory mode SHALL open whenever `game.status === 'complete-victory'` during an active campaign, replacing the `RoundSummaryModal` for that outcome.

## Risks / Trade-offs

- **Risk: Campaign victory definition is ambiguous** → We show the campaign victory end screen whenever a round ends in `complete-victory` during a campaign. If the player can keep going indefinitely, every `complete-victory` would trigger the end screen. This needs clarification (see Open Questions) before implementation.
- **Risk: RoundSummaryModal and CampaignEndModal both trying to open** → Mitigated by the `if/else` branch in the useEffect: defeat opens end screen only; non-defeat opens round summary only. They are mutually exclusive.
- **Risk: Autoplay producing a round-end event after campaign defeat** → The `stop()` call happens synchronously before setting `isCampaignEndModalOpen`, so autoplay is halted before any further interval fires.

### Decision: Defeat screen embeds an end-round attrition summary inline
The defeat `CampaignEndModal` includes a compact attrition summary section — the cards that were scarred, entombed, or otherwise changed in the final round — drawn from `RoundLifecycleEffects`. This is not the full `RoundSummaryModal` (no "Next Round" button, no final-pair transaction details, no vault button) — just the attrition marks list embedded inside the defeat screen. The `RoundSummaryModal` is skipped entirely for campaign-ending defeat rounds; the end screen is the only modal that opens.

The `CampaignEndModal` receives `effects: RoundLifecycleEffects | null` as a prop. If `effects` has any scarred/entombed/cursed cards, they are rendered in a compact list inside the defeat screen. The same `effects` value already computed in `App.tsx` (from `computeRoundLifecycleEffects`) is passed down.

**Non-goal:** The victory path does not include attrition summary (a Perfect Win has no failure effects).

## Open Questions

1. **Stats source**: `CampaignStats` comes from `defaultPersistenceManager` (local storage). At the point the end screen shows, stats have already been recorded by the `useEffect`. Should the end screen read from `campaignStats` state (already in App) or re-read from persistence? Using existing `campaignStats` state is simpler and consistent.
