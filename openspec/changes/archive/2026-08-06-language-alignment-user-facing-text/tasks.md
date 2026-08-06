## 1. Documentation

- [x] 1.1 Update README.md: change "series of games" to "expedition across multiple rounds"

## 2. Campaign Setup Modal

- [x] 2.1 Update modal subtitle: "Prepare" → "Configure your expedition"
- [x] 2.2 Update rules section heading: adjust "Expedition Rules Overview"
- [x] 2.3 Update difficulty section heading: "Select Campaign Difficulty" → "Select Expedition Difficulty"
- [x] 2.4 Update win rate labels: "Full Campaign" → "Expedition"
- [x] 2.5 Verify button text remains "Start Campaign" (correct as-is)

## 3. Campaign End Modal

- [x] 3.1 Update statistics section: "Campaign Run Statistics" → "Expedition Statistics"
- [x] 3.2 Update button: "Start New Campaign" → "Start New Expedition"

## 4. Game Sidebar

- [x] 4.1 Update reset button label: "New Game" / "New Campaign" → "New Round" / "New Expedition"

## 5. Reset Confirmation Modal

- [x] 5.1 Update button text: "Start New Campaign" → "Start New Expedition" (both occurrences)

## 6. Keyboard Shortcuts Modal

- [x] 6.1 Update shortcut label: "New Game / Reset" → "New Round / Reset"

## 7. Code Documentation

- [x] 7.1 Add comment to GameState type explaining user-facing terminology (round vs game)
- [x] 7.2 Add comment to CampaignState type explaining user-facing terminology (expedition vs campaign)

## 8. Verification

- [x] 8.1 Run dev server and test all modified modals in-browser
- [x] 8.2 Verify Standard Solitaire mode displays "New Round"
- [x] 8.3 Verify Campaign Mode displays "New Expedition"
- [x] 8.4 Check all button labels in both modes for consistency
