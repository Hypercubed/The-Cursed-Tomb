## 1. Footer Component & Layout

- [x] 1.1 Add persistent footer to `src/components/GameShell.tsx` below the `max-w-*` content grid (still inside `min-h-screen` shell) with compact stone styling (`border-t border-[#2d2319]`, amber palette, `py-2.5`, `text-xs`) and centered content.
- [x] 1.2 Include inline GitHub Octocat SVG (16×16, `fill="currentColor"`, `aria-hidden="true"`) tinted via `currentColor` — no external asset — plus visible text label (e.g., `View source on GitHub` or `Hypercubed/The-Cursed-Tomb`) and optional Ankh/amber divider.
- [x] 1.3 Wire anchor to `https://github.com/Hypercubed/The-Cursed-Tomb` with `target="_blank" rel="noopener noreferrer"` and accessible name (`aria-label` if icon-adjacent, visible text otherwise).
- [x] 1.4 Verify layout at breakpoints: desktop ≥1024px (no new page-level vertical scrollbar at 768p/900p/1080p), tablet, and mobile stacked (`<1024px` grid collapse, footer below content, no horizontal overflow).

## 2. Accessibility & Behavior

- [x] 2.1 Ensure link is keyboard-focusable with visible focus ring (`focus-visible:ring`, `focus-visible:ring-amber-500` or equivalent) and correct tab order after main content.
- [x] 2.2 Confirm absolute href is not rewritten by Vite `base: '/The-Cursed-Tomb/'` (external absolute URL) and opens in new tab on click.

## 3. Verification

- [x] 3.1 Manual smoke check: `npm run dev` → footer visible in `ready`, `in-progress`, and terminal states; link navigates correctly; hover/focus states match amber palette.
- [x] 3.2 Run `npm test` and `npm run build` — no regressions in existing specs (`game-layout` alignment/scroll scenarios unaffected).
- [x] 3.3 Run `openspec validate --strict --change add-github-repo-link` — all artifacts pass.
