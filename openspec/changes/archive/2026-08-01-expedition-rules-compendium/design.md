## Context

The Cursed Tomb is a mutating solitaire game that implements a legacy campaign deck system based on the physical board game rules defined in `docs/rules.md`. Currently, the web app only presents a basic 4-box summary inside `CampaignSetupModal.tsx`, leaving players without in-game access to the full physical ruleset or clear instructions on how physical pen-and-paper mechanics map to web UI interactions (mouse clicks, Spades targeting mode, Diamond Vaulting, Clubs wildcard selection, Black Curse pairing constraints, and automated post-round attrition).

This design establishes a dedicated React component (`RulesModal.tsx`) and application state management to render a comprehensive Expedition Rules & Compendium UI.

## Goals / Non-Goals

**Goals:**
- Provide a clean, atmospheric, modal dialog (`RulesModal.tsx`) matching the game's dark tomb aesthetic (`#120e0a`, gold/amber highlights, parchment-styled panels).
- Organize rules into three intuitive tabs:
  1. `📜 Core Physical Ruleset`: Complete formatted breakdown of the 7 sections from `docs/rules.md`.
  2. `🌐 Web Controls & Guide`: Comprehensive mapping of physical rules to digital mouse clicks, UI modes, and automated lifecycle behaviors.
  3. `🂡 Card Anatomy & Ink Markings`: Visual diagram & key showing card corner index placements for Scars, Curses, Blessings, and Anchors.
- Add triggers in `App.tsx` (header button), `GameSidebar.tsx` (sidebar button), and `CampaignSetupModal.tsx` (rules section link).
- Ensure full keyboard accessibility (`Escape` dismissal, focus trap / backdrop click dismissal).

**Non-Goals:**
- Dynamic markdown parser dependencies (rule content will be cleanly structured into React JSX data structures / components to maintain zero external runtime dependencies).
- In-game interactive rule tutorials or guided walk-throughs (out of scope for this change).

## Decisions

### Decision 1: Structured React Component with Tabbed Sub-views over Dynamic Markdown Rendering
- **Rationale**: Storing rule sections as structured TypeScript constants/JSX elements inside `RulesModal.tsx` avoids adding dynamic markdown rendering packages (like `react-markdown`) to dependencies, keeping bundle size minimal while allowing custom UI components (such as styled callout cards, comparison tables, and visual card anatomy diagrams).
- **Alternatives Considered**:
  - *Raw Markdown Fetch*: Importing `docs/rules.md` at build time and parsing it. Rejected because raw markdown lacks visual side-by-side digital interaction comparison callouts and interactive card anatomy diagrams.

### Decision 2: Centralized Modal State in `App.tsx` with Prop Callbacks
- **Rationale**: Managing `isRulesModalOpen` state at the top level in `App.tsx` allows triggering the modal cleanly from multiple places: the top navigation bar header, the `GameSidebar`, and the `CampaignSetupModal`.
- **Alternatives Considered**:
  - *Independent Local Modal Instances*: Creating separate modal instances inside each component. Rejected to prevent redundant DOM elements and state desynchronization.

### Decision 3: Visual Comparison Callout Boxes ("Physical Rule" vs "Web Game Action")
- **Rationale**: Users need to quickly bridge physical paper rules with digital web app mechanics. Structuring the Web Controls section with side-by-side physical rule vs web UI action callouts creates immediate clarity.

## Risks / Trade-offs

- **[Risk]**: Modal content length may be long on mobile viewports.
  - **Mitigation**: Implement internal sticky section navigation and smooth auto-scrolling with viewport-constrained scrollable containers (`max-h-[80vh] overflow-y-auto`).
- **[Risk]**: Rule text drift between `docs/rules.md` and `RulesModal.tsx`.
  - **Mitigation**: Mirror the exact section headers, numbers, and terminology from `docs/rules.md` in the structured component data.
