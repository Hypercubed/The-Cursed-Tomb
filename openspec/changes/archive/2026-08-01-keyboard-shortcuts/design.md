## Context

Adding global keyboard shortcuts allows desktop players to trigger core actions (draw, cycle, deselect, new game) quickly without relying solely on cursor clicks.

## Goals / Non-Goals

**Goals:**
- Custom React hook `useKeyboardShortcuts` for clean event listener binding and unbinding.
- Ignore hotkeys when modals are open or text input elements have focus.
- Add visual hotkey indicators (e.g., `[Space]` badge on Draw button) in UI components.

**Non-Goals:**
- Customizable key remapping settings (fixed standard hotkeys are sufficient for solitaire).

## Decisions

### 1. Centralized Listener Hook (`useKeyboardShortcuts`)
- **Decision**: Encapsulate key binding logic inside `src/hooks/useKeyboardShortcuts.ts`.
- **Rationale**: Keeps `App.tsx` clean and ensures listeners are safely registered/unregistered during lifecycle changes.

### 2. Input & Modal Guard
- **Decision**: Check `document.activeElement` tagName (`INPUT`, `TEXTAREA`) and modal open state before processing keydowns.
- **Rationale**: Prevents accidental game actions when typing in inputs or interacting with dialogs.

## Risks / Trade-offs

- **[Risk]**: Conflict with browser default key combinations (e.g. `Space` scrolling the page).
- **Mitigation**: Call `e.preventDefault()` on handled keydown events (`Space`, `D`, `Esc`).
