## 1. Top Header Component & GameShell Layout

- [x] 1.1 Update `GameShell.tsx` to support a full-width header slot and top header bar layout.
- [x] 1.2 Move `<h1>The Cursed Tomb</h1>` and header elements out of `App.tsx`'s main column and into the full-width top header.
- [x] 1.3 Verify top baseline alignment so both `GameSidebar` and the main play area container align at the exact same horizontal top edge (`y=0`).

## 2. Sidebar Border & Frame Refactoring

- [x] 2.1 Refactor `GameSidebar.tsx` to remove asymmetrical border utilities (`border-l-[14px]`).
- [x] 2.2 Apply uniform border styling (`border border-[#2d2319]`) and `rounded-2xl` corners to `GameSidebar`.
- [x] 2.3 Verify visual consistency of nested setup and status cards inside the sidebar frame.

## 3. Debug Panel Integration & Re-anchoring

- [x] 3.1 Update `DebugPanel.tsx` trigger button to anchor cleanly relative to the header bar height.
- [x] 3.2 Ensure expanding the debug panel does not obscure the header or cause layout reflow.

## 4. Verification & Testing

- [x] 4.1 Run build and test suite (`npm run build`, `npm test`) to ensure zero errors.
- [x] 4.2 Verify layout responsiveness across desktop (≥1024px) and stacked mobile viewports (<1024px).
