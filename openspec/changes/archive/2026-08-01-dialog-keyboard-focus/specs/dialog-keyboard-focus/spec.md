# Dialog Keyboard Focus

## ADDED Requirements

### Requirement: Automatic focus on primary action upon modal display
When any modal dialog opens, the application SHALL automatically set focus to the primary action element (such as "Next Round", "Confirm Reset", or "Start Campaign") or fallback to the dialog close button if no primary action is available.

#### Scenario: Round Summary modal auto-focuses Next Round button
- **WHEN** the Round Summary Modal opens after a round ends
- **THEN** keyboard focus SHALL automatically be placed on the "Next Round" button (or "Retry Round" button)
- **AND** pressing `Enter` SHALL trigger the primary action immediately

#### Scenario: Reset Confirmation modal auto-focuses Confirm button
- **WHEN** the Reset Confirmation Modal opens
- **THEN** keyboard focus SHALL automatically be placed on the confirmation action button

#### Scenario: Close button fallback for informational modals
- **WHEN** an informational modal (e.g. Rules Modal, Matched Cards Modal, Keyboard Shortcuts Modal) opens
- **THEN** keyboard focus SHALL automatically be placed on the modal close button or header close control

### Requirement: Escape key dismisses active dialog
When a modal dialog is currently open and active, pressing the `Escape` key SHALL close the modal dialog without executing any primary destructive action.

#### Scenario: Pressing Escape inside an open modal
- **WHEN** a modal dialog is open AND the user presses `Escape`
- **THEN** the modal SHALL trigger its close callback and close
