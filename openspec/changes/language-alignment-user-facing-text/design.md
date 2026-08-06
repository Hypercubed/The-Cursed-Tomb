## Context

The Cursed Tomb has two game modes: "Standard Solitaire" (single-round play) and "Campaign Mode" (multi-round persistent deck). Within Campaign Mode, players play an "expedition" consisting of multiple "rounds."

Current terminology is inconsistent:
- "Game" sometimes means a round, sometimes means the expedition
- "Campaign" refers to both the mode and the multi-round session
- Button labels mix "New Game" and "New Campaign" without clear distinction

The codebase uses `GameState` (one round), `CampaignState` (expedition state), and `GameMode` type (`'standard' | 'cursed-tomb'`). These internal names are fine—the confusion is user-facing only.

## Goals / Non-Goals

**Goals:**
- Establish consistent user-facing language: "Round" = one play, "Expedition" = multi-round arc, "Campaign Mode" = game type
- Update all UI strings (modals, buttons, labels, README) to use aligned terminology
- Zero code changes—types, functions, and variables stay as-is

**Non-Goals:**
- Refactoring type names (`GameState`, `CampaignState`)
- Changing function signatures or internal logic
- Updating test file strings (those are code, not user-facing)

## Decisions

### Decision 1: Hybrid internal/external split
**Choice:** Keep code as-is (`GameState`, `CampaignState`), change only user-visible text.

**Rationale:** Renaming `GameState` → `RoundState` cascades through 500+ references and breaks tests. The internal names are clear in context. User-facing polish doesn't justify the refactor risk.

**Alternatives considered:**
- **Deep refactor** (rename types): High risk, multi-day effort, same user outcome
- **Minimal (text only)**: Low risk, same user outcome, 1-hour effort ← chosen

### Decision 2: "Campaign Mode" stays, "Expedition" for the arc
**Choice:** Mode selection says "Campaign Mode", but once in that mode, UI says "expedition" for the multi-round session.

**Rationale:**
- "Campaign" is an established game industry term for extended/meta-game modes
- "Expedition" matches the ancient tomb theme and clearly means "your journey through multiple rounds"
- Splitting mode-name from session-name resolves the overload

**Example mapping:**
- Mode choice: "Standard Solitaire" vs "Campaign Mode"
- Within campaign: "Round 3 of your expedition"
- End screen: "Your expedition has failed" / "Start New Expedition"

## Risks / Trade-offs

**[Risk]** Internal/external terminology split confuses developers.  
**Mitigation:** Document the mapping in a code comment at `GameState` and `CampaignState` type definitions. Future devs see the alignment immediately.

**[Risk]** Missed strings—grep might not catch all variations.  
**Mitigation:** Manual review of each changed file after grep-guided updates. Test in-browser to spot any remaining inconsistencies.

**[Trade-off]** Code still says "game" and "campaign" while UI says "round" and "expedition".  
**Accepted:** This is intentional. Code stability > perfect alignment. The split is documented and doesn't harm users.
