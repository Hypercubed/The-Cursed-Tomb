## Context

Currently, when dialogs (e.g. `RoundSummaryModal`, `ResetConfirmationModal`, `CampaignEndModal`, `CampaignSetupModal`) open in *The Cursed Tomb*, browser focus remains on the element that was focused before the modal opened (or body). Consequently, users navigating via keyboard cannot immediately press `Enter` or `Space` to activate the default button (e.g. "Next Round") without first tabbing to it or using the mouse.

## Goals / Non-Goals

**Goals:**
- Auto-focus primary action buttons (e.g., "Next Round", "Confirm Reset", "Start Campaign") whenever modal dialogs are rendered / opened.
- Fallback to focusing the close button when no primary action button exists (e.g., in informational modals like `RulesModal` or `KeyboardShortcutsModal`).
- Ensure `Escape` key closes the currently open modal.
- Ensure focus outline styling is clear and consistent with the dark parchment design system.

**Non-Goals:**
- Full custom accessibility focus trapping library implementation (e.g. react-aria / radix UI migration), keeping component updates minimal and standard.

## Decisions

### Decision 1: React `useRef` + `useEffect` Auto-Focus Pattern
- **Choice**: Use a React `useRef` attached to the primary action button and trigger `.focus()` in a `useEffect` when the modal is opened/mounted.
- **Rationale**: Direct, lightweight, and works consistently across browsers without adding extra npm dependencies.
- **Alternatives Considered**:
  - HTML `autoFocus` attribute: unreliable in React single-page apps when modal components conditionally render or transition.
  - Adding a third-party modal focus library: adds extra dependency overhead for straightforward modal components.

### Decision 2: Prioritizing Primary Action Buttons
- **Choice**: In modals with multiple buttons (e.g., `RoundSummaryModal` with "Next Round" and "Close"), the primary action (`onNextRound`) receives auto-focus. In modals with only a Close button, the Close button receives auto-focus.

## Risks / Trade-offs

- **[Risk]**: Global hotkeys (e.g. `Space` or `D` to draw) might trigger while typing or focusing modal elements.
  - **Mitigation**: Existing hotkey handling in `App.tsx` already skips game shortcuts when input controls or modals are active/open.

- **[Risk]**: Focus outline visibility on custom styled buttons.
  - **Mitigation**: Add standard `focus:ring-2 focus:ring-amber-500 focus:outline-none` focus styles to modal buttons.
