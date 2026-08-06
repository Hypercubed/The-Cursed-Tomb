## Why

User-facing terminology is inconsistent across the application. "Game" sometimes means a single round (one shuffle + play) and sometimes means the multi-round campaign arc. "Campaign" refers both to the game mode and to the expedition within that mode. This creates confusion and makes the UI harder to understand.

## What Changes

- Align all user-facing text to use consistent terminology: "Round" for a single shuffle+play, "Expedition" for the multi-round campaign arc, "Campaign Mode" for the game mode choice
- Update README, modal titles, button labels, and UI text across all components
- Keep "Campaign Mode" as the mode name, but use "Expedition" when referring to the multi-round session within that mode
- Leave all code (types, functions, variables) unchanged — this is a text-only pass

## Capabilities

### New Capabilities
<!-- None - this is a polish/refinement change -->

### Modified Capabilities
<!-- None - no requirement changes, only UI text clarity improvements -->

## Impact

**Affected components:**
- README.md
- CampaignSetupModal.tsx
- CampaignEndModal.tsx
- GameSidebar.tsx
- ResetConfirmationModal.tsx
- KeyboardShortcutsModal.tsx

**No code changes** — types, function names, and internal variables remain as-is. Only user-visible strings are updated.
