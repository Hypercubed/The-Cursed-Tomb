## Context

The application supports two primary game modes: Cursed Tomb Campaign (`cursed-tomb`) and Standard Solitaire (`standard`). However, several components—such as `DrawZone`, `GameSidebar`, `App`, `MatchedCardsModal`, and `CampaignSetupModal`—were originally built assuming campaign mechanics, leaving Expedition-specific UI elements (like the Diamond Vault slot, campaign progress metrics, and campaign terminology) visible even during Standard Solitaire play.

## Goals / Non-Goals

**Goals:**
- Conditionally hide or remove Expedition-only UI elements when in `standard` game mode.
- Update header text, modal titles, and button labels to dynamically reflect the active game mode.
- Provide a clean 2-slot Draw Zone interface (Stock & Waste) when playing Standard Solitaire.
- Ensure Standard Solitaire players receive mode-appropriate career statistics in the sidebar.

**Non-Goals:**
- Modifying underlying solitaire game logic, card pairing rules, or solver algorithms.
- Changing campaign-mode mechanics or visuals when playing in `cursed-tomb` mode.

## Decisions

1. **DrawZone Mode Conditioning (`DrawZone.tsx`)**:
   - *Decision*: Wrap the `♦ Vault` slot in `DrawZone` with a condition checking `mode === 'cursed-tomb'` (or `mode !== 'standard'`).
   - *Alternative Considered*: Disabling the Vault slot with a disabled state. (Rejected: A disabled Vault slot still clutters the UI and implies a feature exists when it doesn't in Standard Solitaire).

2. **Sidebar Stats Adaptation (`GameSidebar.tsx`)**:
   - *Decision*: In `GameSidebar`, render standard game statistics (Complete Victories, Partial Victories, Collapses/Losses, Win %, Current/Best Streak) when `gameMode === 'standard'`, and render the Active Campaign block when `gameMode === 'cursed-tomb'`.
   - *Alternative Considered*: Always showing both sets of stats. (Rejected: Distracts from standard solitaire context).

3. **Dynamic Terminology & Modal Content (`App.tsx`, `CampaignSetupModal.tsx`, `MatchedCardsModal.tsx`)**:
   - *Decision*: Pass `mode` context cleanly down to modals and replace static strings like "Start Campaign" or "Ancient Egyptian Solitaire Campaign" with dynamic mode-aware labels.
   - *Alternative Considered*: Hardcoding standard labels globally. (Rejected: Would break thematic Cursed Tomb campaign text).

## Risks / Trade-offs

- [Risk] Legacy stored stats might be displayed if mode state isn't synced when starting a new game.
  → *Mitigation*: Ensure `game.mode` is the source of truth for all layout conditioning.
