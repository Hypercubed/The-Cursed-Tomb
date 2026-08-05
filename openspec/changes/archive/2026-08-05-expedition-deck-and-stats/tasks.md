## 1. UI Component Updates

- [x] 1.1 Update `src/components/MatchedCardsModal.tsx` interface to accept optional `campaignStats` (`StoredCampaignStats`) and `achievements` (`CampaignAchievements`) props.
- [x] 1.2 Update modal title in `MatchedCardsModal.tsx` to "Expedition Deck & Stats", update subtitle, close button label, and ARIA attributes.
- [x] 1.3 Add top **Expedition Metrics & Achievements** summary section in `MatchedCardsModal.tsx` displaying run statistics (Explored, Conquered, Collapsed, Total Attempts, Deck Health %) and unlocked achievement badges.
- [x] 1.4 Update `src/components/GameSidebar.tsx` trigger button text and icon to `📊 Expedition Deck & Stats`.
- [x] 1.5 Update `src/App.tsx` JSX to pass `campaignStats={campaignStats}` and `achievements={campaign.achievements}` into `<MatchedCardsModal />`.

## 2. Verification & Testing

- [x] 2.1 Verify application builds cleanly (`npm run build`).
- [x] 2.2 Run unit test suite (`npm test`) to ensure all component and state tests pass cleanly.
- [x] 2.3 Verify in browser that clicking `📊 Expedition Deck & Stats` opens the modal with expedition metrics, achievement badges, 4×13 card matrix, and pair odds.
