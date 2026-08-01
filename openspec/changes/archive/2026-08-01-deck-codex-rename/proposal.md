## Why

The current modal title "Matched Cards Tomb Vault" is outdated and misleading. With the addition of Cursed Tomb Campaign deck mutations (Scars, Curses, Blessings, Anchors, Entombed status, and dynamic Functional Values), the modal displays the entire master campaign deck state rather than just in-game matched cards. Furthermore, "Tomb Vault" creates confusion with the gameplay "Diamond Vault" mechanic where exposed Diamond cards are vaulted.

Renaming the modal and its trigger to "Deck Codex" accurately reflects its role as the authoritative inspector for both campaign deck state and active deal card tracking, while eliminating term collisions with the Diamond Vault.

## What Changes

- Rename the modal title from "Matched Cards Tomb Vault" to **Deck Codex**.
- Update modal header subtitle to reflect both master deck state/mutations and strategic remaining pair odds.
- Update sidebar trigger button text from `View Matched Vault` to `View Deck Codex` (`📜 View Deck Codex`).
- Update accessibility aria-labels, tooltips, and documentation references from "Matched Cards Tomb Vault" / "Tomb Vault" to "Deck Codex".
- Update spec requirements in `matched-cards-tracking` to reference the **Deck Codex Modal**.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier. Each creates specs/<name>/spec.md -->

### Modified Capabilities
- `matched-cards-tracking`: Update requirements and scenarios to specify the "Deck Codex" modal and sidebar trigger label.

## Impact

- **UI Components**: `src/components/MatchedCardsModal.tsx` (or renamed `DeckCodexModal.tsx`), `src/components/GameSidebar.tsx`, `src/App.tsx`.
- **Documentation & Specs**: `openspec/specs/matched-cards-tracking/spec.md` delta spec.
- **User Experience**: Improved clarity, eliminated term confusion with Diamond Vault gameplay mechanic.
