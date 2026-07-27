## 1. UI Components & Layout

- [x] 1.1 Create `CampaignSetupModal.tsx` component with rules overview, difficulty option cards (Novice, Explorer, Archaeologist, Survivalist), and Start Campaign button
- [x] 1.2 Style `CampaignSetupModal` using project design tokens, theme styles, and smooth enter animations

## 2. State & Modal Sequencing Integration

- [x] 2.1 Update `App.tsx` state to control `isCampaignSetupModalOpen` state on initial load and post-reset confirmation
- [x] 2.2 Wire `ResetConfirmationModal` reset trigger to launch `CampaignSetupModal` upon user confirmation
- [x] 2.3 Remove legacy header difficulty dropdown from `GameSidebar.tsx` / header controls in favor of modal setup

## 3. Verification & Testing

- [x] 3.1 Verify modal appears on fresh application load
- [x] 3.2 Verify clicking "New Campaign" opens reset confirmation modal, confirming opens setup modal, and starting campaign initializes game with selected difficulty
- [x] 3.3 Ensure existing test suite passes and build completes without errors
