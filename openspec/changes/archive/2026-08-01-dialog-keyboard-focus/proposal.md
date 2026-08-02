## Why

When modal dialogs (such as the Round Summary, Reset Confirmation, Campaign End, and Campaign Setup dialogs) open, keyboard focus remains on the background UI or is unmanaged, forcing users to click with a mouse/pointer to proceed. Automatically focusing the primary action button (e.g., "Next Round" or "Confirm") and supporting standard dialog keyboard interaction (e.g. Enter to submit, Escape to close) improves keyboard accessibility and game flow.

## What Changes

- **Automatic Primary Focus**: When a modal dialog opens, auto-focus the primary call-to-action button (e.g. "Next Round" in `RoundSummaryModal`, "Confirm Reset" in `ResetConfirmationModal`, "Start Campaign" in `CampaignSetupModal`) or fallback to the Close button.
- **Escape Key Handling**: Ensure pressing `Escape` closes the active modal dialog cleanly.
- **Keyboard Navigation within Dialogs**: Allow `Enter` key presses on focused primary action buttons to trigger dialog actions seamlessly without requiring pointer clicks.

## Capabilities

### New Capabilities
- `dialog-keyboard-focus`: Auto-focusing primary action buttons on dialog open and managing keyboard accessibility (Enter/Escape) across game modals.

### Modified Capabilities
- `keyboard-shortcuts`: Clarify global hotkey handling during open dialog states so shortcuts do not conflict with dialog focus.

## Impact

- **Affected Components**: `RoundSummaryModal.tsx`, `ResetConfirmationModal.tsx`, `CampaignEndModal.tsx`, `CampaignSetupModal.tsx`, `RulesModal.tsx`, `KeyboardShortcutsModal.tsx`, `MatchedCardsModal.tsx`, and global `App.tsx` hotkey listeners.
- **Dependencies**: No external dependencies added; uses standard React `useRef` and `useEffect` patterns or accessible dialog patterns.
