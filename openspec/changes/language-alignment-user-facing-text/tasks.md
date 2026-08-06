## 1. Documentation

- [ ] 1.1 Update README.md: change "series of games" to "expedition across multiple rounds"

## 2. Campaign Setup Modal

- [ ] 2.1 Update modal subtitle: "Prepare" → "Configure your expedition"
- [ ] 2.2 Update rules section heading: adjust "Expedition Rules Overview"
- [ ] 2.3 Update difficulty section heading: "Select Campaign Difficulty" → "Select Expedition Difficulty"
- [ ] 2.4 Update win rate labels: "Full Campaign" → "Expedition"
- [ ] 2.5 Verify button text remains "Start Campaign" (correct as-is)

## 3. Campaign End Modal

- [ ] 3.1 Update statistics section: "Campaign Run Statistics" → "Expedition Statistics"
- [ ] 3.2 Update button: "Start New Campaign" → "Start New Expedition"

## 4. Game Sidebar

- [ ] 4.1 Update reset button label: "New Game" / "New Campaign" → "New Round" / "New Expedition"

## 5. Reset Confirmation Modal

- [ ] 5.1 Update button text: "Start New Campaign" → "Start New Expedition" (both occurrences)

## 6. Keyboard Shortcuts Modal

- [ ] 6.1 Update shortcut label: "New Game / Reset" → "New Round / Reset"

## 7. Code Documentation

- [ ] 7.1 Add comment to GameState type explaining user-facing terminology (round vs game)
- [ ] 7.2 Add comment to CampaignState type explaining user-facing terminology (expedition vs campaign)

## 8. Verification

- [ ] 8.1 Run dev server and test all modified modals in-browser
- [ ] 8.2 Verify Standard Solitaire mode displays "New Round"
- [ ] 8.3 Verify Campaign Mode displays "New Expedition"
- [ ] 8.4 Check all button labels in both modes for consistency
