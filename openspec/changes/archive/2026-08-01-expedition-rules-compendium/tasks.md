## 1. Create Rules Modal Component

- [x] 1.1 Create `src/components/RulesModal.tsx` modal frame with header, title, tab navigation, backdrop dismiss, and `Escape` key handlers
- [x] 1.2 Implement tab state management (`core-rules`, `web-guide`, `card-anatomy`) with styled active state indicators

## 2. Implement Tab Content & Section Views

- [x] 2.1 Implement `Core Physical Ruleset` tab rendering the 7 formatted sections from `docs/rules.md`
- [x] 2.2 Implement `Web Controls & Digital Guide` tab rendering digital interaction mappings (clicks, Spades targeting mode, Diamond Vaulting, Clubs wildcard pairing, Black Curse pairing constraints, and automated post-round attrition)
- [x] 2.3 Implement `Card Anatomy & Ink Markings` tab rendering visual diagrams and legends for card corner indices (Scars, Curses, Blessings, Anchors)

## 3. Integration & Triggers

- [x] 3.1 Update `App.tsx` to manage `isRulesModalOpen` state and add a `📖 Rules & Guide` button to the top header navigation
- [x] 3.2 Update `src/components/GameSidebar.tsx` to add an `📖 Expedition Rules` button trigger
- [x] 3.3 Update `src/components/CampaignSetupModal.tsx` to add a `"Read Full Expedition Rules"` link in the Expedition Rules Overview section

## 4. Verification & Testing

- [x] 4.1 Write component unit tests verifying modal open/close triggers, tab switching, and dismissal behaviors
- [x] 4.2 Verify application build (`npm run build`) and test suite pass without errors
