## Context

The game currently tracks lifetime wins, losses, partial clears, and streak statistics. A "Reset" button clears all stats. Re-framing Pyramid Solitaire into a tomb exploration campaign gives the player a goal: achieve a **Complete Clear** to win the active campaign. During a campaign, players attempt as many pyramids as needed, with the UI tracking "Pyramids Explored" (partial clears) and "Pyramids Collapsed" (losses/resignations).

## Goals / Non-Goals

**Goals:**
- Introduce an active Campaign tracking state (`activeCampaignStats`) alongside cumulative lifetime statistics.
- Increment campaign-specific counts when game outcomes occur (`partial-victory` -> Pyramids Explored, `pyramid-collapse` -> Pyramids Collapsed, `complete-victory` -> Campaign Victory).
- Display Campaign status and progress clearly in the `GameSidebar`.
- Reframe the "Reset" action to "New Campaign", which resets the active campaign metrics upon player confirmation.
- Update UI labels and victory/defeat modals to feature thematic campaign terminology.

**Non-Goals:**
- Multi-tomb progression trees, branching paths, or relic inventory systems (deferred to future campaign expansions).
- Changing core pyramid solitaire matching mechanics or rules.

## Decisions

1. **Campaign State Structure**:
   - Maintain `activeCampaignStats`:
     ```ts
     export interface CampaignStats {
       pyramidsExplored: number; // Partial clears
       pyramidsCollapsed: number; // Losses / resignations
       isVictory: boolean; // True once complete-victory achieved
       totalAttempts: number; // Sum of explored + collapsed + cleared
     }
     ```
   - Persist active campaign stats in `localStorage` under `cursed_tomb_campaign_stats`.

2. **Outcome Recording Logic**:
   - `complete-victory`: Increment `completeVictories` in cumulative stats, mark `isVictory = true` in active campaign, increment `totalAttempts`.
   - `partial-victory`: Increment `partialVictories` in cumulative stats, increment `pyramidsExplored` in active campaign, increment `totalAttempts`.
   - `pyramid-collapse`: Increment `pyramidCollapses` in cumulative stats, increment `pyramidsCollapsed` in active campaign, increment `totalAttempts`.

3. **New Campaign Flow**:
   - Clicking the "New Campaign" button opens `ResetConfirmationModal` with the question: *"Start a new campaign? This will reset your active campaign stats."*
   - Confirming resets `activeCampaignStats` to initial zero counts and sets `isVictory = false`.

4. **Sidebar UI Presentation**:
   - Divide sidebar statistics into "Active Campaign" and "Lifetime Record".
   - Highlight Campaign Victory when `isVictory` is true.

## Risks / Trade-offs

- **[Risk] Existing user localStorage compatibility** → Mitigation: Fall back gracefully to a default active campaign state if `cursed_tomb_campaign_stats` key is not found.
- **[Risk] Duplicate outcome recording on page refresh** → Mitigation: Leverage single outcome recording pattern established in game status state.
