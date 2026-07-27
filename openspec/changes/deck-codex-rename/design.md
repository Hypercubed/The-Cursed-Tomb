## Context

The modal currently titled "Matched Cards Tomb Vault" (`MatchedCardsModal.tsx`) serves two distinct purposes:
1. Displaying current-game card matched/removed status (4×13 grid) and remaining pair sum-13 odds.
2. Displaying campaign master deck state, including card mutations (Scars, Curses, Blessings, Anchors, Entombed status, and Functional Values).

Because the campaign rules also include a "Diamond Vault" gameplay mechanic, referring to this modal as "Tomb Vault" or "Matched Cards Tomb Vault" leads to user confusion. Renaming the interface to **Deck Codex** resolves this ambiguity and properly reflects the modal's role as a comprehensive deck manifest.

## Goals / Non-Goals

**Goals:**
- Rename the modal title to **Deck Codex** across the application.
- Update the status sidebar trigger button text to `View Deck Codex` (with icon `📜`).
- Adapt modal subtitles to provide clear context in both Campaign mode and Standard mode.
- Update accessibility attributes (aria-labels, dialog titles) and tooltips to match the new name.
- Keep all underlying card tracking, mutation rendering, and pair calculation logic intact.

**Non-Goals:**
- Changing the layout or visual styling of the 4×13 grid or pair statistics.
- Altering the underlying state management or props structure of `MatchedCardsModal.tsx`.
- Modifying any campaign card mutation rules or mechanics.

## Decisions

### Decision 1: Rename UI text while preserving component filename or creating clean aliases
- **Choice**: Update the modal header string to `Deck Codex` and sidebar trigger text to `View Deck Codex`. Retain `MatchedCardsModal.tsx` (or alias it) to minimize code churn and preserve existing import paths across components (`App.tsx`, `GameSidebar.tsx`).
- **Rationale**: Changing user-facing strings achieves 100% of the UX and spec clarity goals without breaking imports or refactoring unrelated files.

### Decision 2: Dynamic Modal Subtitle based on Game Mode
- **Choice**: Display mode-sensitive subtitles in `MatchedCardsModal.tsx`:
  - **Campaign Mode**: `"Master campaign deck state, active mutations & remaining pair odds"`
  - **Standard Mode**: `"Deck matrix overview & remaining strategic pair odds"`
- **Rationale**: Clarifies the dual utility of the Deck Codex for both new campaign players and traditional solitaire players.

## Risks / Trade-offs

- **[Risk]**: Existing documentation or spec references might still refer to "Tomb Vault" or "Matched Cards Vault".
  - **Mitigation**: Update `openspec/specs/matched-cards-tracking/spec.md` via delta spec to establish "Deck Codex" as the canonical name.
