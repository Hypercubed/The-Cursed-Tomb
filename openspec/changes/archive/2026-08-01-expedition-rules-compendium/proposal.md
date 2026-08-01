## Why

The Cursed Tomb web application lacks an accessible in-game reference for the official physical rules (`docs/rules.md`) and a clear mapping of how those physical playing card rules translate to digital UI interactions (such as mouse clicks, Spades targeting mode, Diamond Vaulting, Black Curse pairing constraints, and automated post-round attrition). Exposing both the core physical ruleset and web game interactions in a dedicated modal will help players understand the deep mechanics, legacy attrition progression, hero blessings, and digital controls.

## What Changes

- Add a dedicated **Expedition Rules & Compendium Modal** accessible at any time during gameplay and setup.
- Organize the modal into clear tabs/sections:
  - **Core Physical Ruleset**: Complete, formatted presentation of the 7 official ruleset sections from `docs/rules.md` (Objective, Definitions, Preparation, Live-Play Architecture, Attrition Track, Survival Rewards, and Reset Protocol).
  - **Web Game Controls & Interaction Guide**: Comprehensive guide detailing digital interaction models (clicking, Spades targeting mode, Diamond Vaulting, Clubs wildcard selection, Black Curse pairing restrictions, and automated bottleneck processing).
  - **Card Anatomy & Ink Markings**: Visual reference mapping physical pen stroke locations (Scars, Curses, Blessings, Anchors) to digital corner index badges and functional value shifts.
- Add accessible trigger buttons across the application:
  - **Game Header**: Add a `📖 Rules & Guide` button in the top navigation bar.
  - **Game Sidebar**: Add a `📖 Expedition Rules` button in the sidebar.
  - **Campaign Setup Modal**: Add a direct `"Read Full Expedition Rules"` link/button in the rules overview section.
- Support standard accessibility features including `Escape` key dismissal and keyboard navigation.

## Capabilities

### New Capabilities
- `expedition-rules-modal`: Provides the structured Expedition Rules & Compendium modal UI, section/tabbed navigation, core physical rules text rendering, digital interaction mappings, card index anatomy reference, and global header/sidebar trigger integration.

### Modified Capabilities
- `campaign-setup-modal`: Add a direct navigation link from the expedition setup overview section to open the full Expedition Rules modal.

## Impact

- **Frontend Components**:
  - `src/components/RulesModal.tsx` (NEW)
  - `src/components/GameSidebar.tsx` (add rules button trigger)
  - `src/components/CampaignSetupModal.tsx` (add full rules link)
  - `src/App.tsx` (header button trigger, modal state management)
- **User Experience**: Players can seamlessly reference physical board game rules and web UI interaction rules at any point without leaving their active campaign.
