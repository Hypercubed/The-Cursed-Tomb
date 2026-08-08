## 1. Storage & Settings Data Model

- [ ] 1.1 Update `StoredSettings` interface in `src/storage/persistence.ts` to support `enableCoachMarks` and `seenCoachMarkIds`.
- [ ] 1.2 Update default settings and storage persistence functions to save and restore coach mark preferences.
- [ ] 1.3 Add unit tests in `src/storage/persistence.test.ts` for coach mark settings persistence.

## 2. Coach Mark Component & Overlay Setup

- [ ] 2.1 Create `CoachMarkBanner.tsx` component with fixed bottom positioning, step title, explanation text, "Don't show hints again" toggle, and "Next / Got It" action button.
- [ ] 2.2 Add DOM attribute targets (`data-coachmark`) to `PyramidBoard`, `DrawZone`, `PlayingCard`, and `Vault` components.
- [ ] 2.3 Add styling for dimming backdrop and glowing spotlight target ring in `index.css`.

## 3. Event Evaluation Hook & Interaction Pause

- [ ] 3.1 Create `useCoachMarks` hook to monitor game state mutations and evaluate triggers (`rule-13`, `attrition-mark`, `sun-cross`, `entombed`, `vault-intro`).
- [ ] 3.2 Wire `isPausedByCoachMark` into `App.tsx` and board click handlers to prevent card selection during active coach mark banners.
- [ ] 3.3 Add coach mark toggle setting into `RulesModal.tsx` and settings interface.

## 4. Testing & Verification

- [ ] 4.1 Create component tests for `CoachMarkBanner.tsx` verifying render, dismissal, and opt-out interactions.
- [ ] 4.2 Run existing unit and simulation tests (`npm test`) to ensure no regressions in core game logic.
