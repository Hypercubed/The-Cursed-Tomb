## Context

See `proposal.md`. Currently, `GameState.vaultCard` in `src/game.ts` is `Card | null`, restricting the Vault to 1 card. The Python simulator `sim/cursed_tomb_sim.py` has `vault = []` but allows playing any card in `vault` rather than enforcing FILO stack top order.

## Goals / Non-Goals

**Goals:**
- Update rules documentation in `docs/rules.md` to clarify multi-card FILO Vault stacking.
- Refactor `GameState` in `src/game.ts` from `vaultCard?: Card | null` to `vaultCards: Card[]`.
- Update game engine helper functions (`canAnyMove`, `findAvailableMoves`, `moveToVault`, `selectCard`, etc.) to operate on the top card of `vaultCards` (`vaultCards[vaultCards.length - 1]`).
- Update Python simulator (`sim/cursed_tomb_sim.py`) to restrict vault moves to the top of `self.vault` stack (`self.vault[-1]`).
- Update UI components (`DrawZone.tsx`, `App.tsx`, `RulesModal.tsx`) to pass `vaultCards` and render the top vault card and count badge.

**Non-Goals:**
- Changing standard solitaire rules.
- Allowing arbitrary random access to non-top cards in the Vault stack.

## Decisions

### 1. Data Structure Alignment (`vaultCards: Card[]`)
- **Decision**: Represent the Vault as an array `vaultCards: Card[]` in `GameState`.
- **Rationale**: Arrays provide explicit stack semantics (`push` onto end, `pop` or slice from top).
- **Backward Compatibility**: Provide a convenience getter/prop `topVaultCard = vaultCards[vaultCards.length - 1] ?? null` for UI components.

### 2. Python Simulator Solver Logic
- **Decision**: In `sim/cursed_tomb_sim.py`, move candidates from vault are restricted to `self.vault[-1]` (top of stack).
- **Rationale**: Aligns Python simulation behavior precisely with game rules and TypeScript engine.

### 3. UI Vault Slot & Counter Display
- **Decision**: The Vault slot renders `topVaultCard`. The Vault header badge displays `vaultCards.length` (e.g. `[0]`, `[1]`, `[2]`, ...).
- **Rationale**: Keeps the DrawZone compact while giving clear visibility of stack depth.

## Risks / Trade-offs

- [Persistence Schema Backward Compatibility] → Mitigation: In `loadGameState`, convert legacy `vaultCard` (if present in localStorage) into `vaultCards: vaultCard ? [vaultCard] : []`.
