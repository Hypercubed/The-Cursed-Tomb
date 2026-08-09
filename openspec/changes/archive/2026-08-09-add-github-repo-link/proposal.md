## Why

The web game at `https://hypercubed.github.io/The-Cursed-Tomb/` has no in-game link back to its source repository (`https://github.com/Hypercubed/The-Cursed-Tomb`). Players who discover the game via the deployed URL have no way to find the source, report issues, or explore the code without checking the README. Adding a persistent, themed page footer with a GitHub link closes that loop.

## What Changes

- Add a persistent page footer to the game shell (visible in all game states: `ready`, `in-progress`, `won`/`lost`) with an external link to `https://github.com/Hypercubed/The-Cursed-Tomb`.
- Footer copy uses the existing tomb palette (amber/gold accents on dark stone) and includes a GitHub Octocat icon rendered as an inline SVG (no external asset dependency, `currentColor` so it tints correctly).
- Link opens in a new tab with `target="_blank" rel="noopener noreferrer"` and carries an accessible name (`aria-label` / visible text).
- No routing, no build-time flag, no environment-specific behavior — the URL is absolute so `base: '/The-Cursed-Tomb/'` is irrelevant.

## Capabilities

### New Capabilities
- `repo-link`: Persistent footer link to the GitHub repository — placement, styling, accessibility, and link behavior.

### Modified Capabilities
- _None_ — `game-layout` and `gh-pages-deployment` are not requirements-changed; the footer is additive and layout-fitting is addressed in design/tasks.

## Impact

- **Code:** `src/components/GameShell.tsx` (or `src/App.tsx` wrapper) — add footer element. Optional tiny Tailwind/CSS tweak if a new utility class is needed.
- **Specs:** New spec `specs/repo-link/spec.md` (delta for this change).
- **No breaking changes.** No API, persistence, or build config changes. Footer height is small (< 40px) and must not introduce page-level vertical scroll on standard desktop viewports.
