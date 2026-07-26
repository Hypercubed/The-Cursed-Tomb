## 1. Engine Helper & Custom Hook

- [ ] 1.1 Expose `deselectCard` helper function in `src/game.ts`.
- [ ] 1.2 Implement `useKeyboardShortcuts` custom hook in `src/hooks/useKeyboardShortcuts.ts` to register global keydown handlers for `Space`, `D`, `Esc`, `N`, and `?`/`H`.

## 2. UI Integration & Badges

- [ ] 2.1 Integrate `useKeyboardShortcuts` hook in `App.tsx`.
- [ ] 2.2 Add shortcut badge labels (`[Space]`, `[Esc]`, `[N]`) to UI control buttons in `DrawZone.tsx` and `GameSidebar.tsx`.
- [ ] 2.3 Add a Keyboard Shortcuts legend modal / tooltip in the UI.

## 3. Testing & Verification

- [ ] 3.1 Add unit tests for keydown handling and input focus guard in `src/hooks/useKeyboardShortcuts.test.ts`.
- [ ] 3.2 Verify manual keyboard navigation and shortcut actions.
