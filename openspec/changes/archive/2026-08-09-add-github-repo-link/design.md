## Context

The game shell is `src/components/GameShell.tsx` — a full-screen layout with a header, a two-column grid (sidebar + main board), and no footer. See `proposal.md` for motivation. The app is Vite + React 18 + Tailwind, deployed to GitHub Pages under `base: '/The-Cursed-Tomb/'`. No in-game external links exist yet; `README.md` already references `https://github.com/Hypercubed/The-Cursed-Tomb` and the Pages site `https://hypercubed.github.io/The-Cursed-Tomb/`.

## Goals / Non-Goals

**Goals:**
- Add a compact, persistent footer to `GameShell` with a single external link to the GitHub repo that is visible in all game states and integrates with the tomb palette.
- Use an inline Octocat SVG (`currentColor`) — no external asset, no base-path concern.
- Accessible: visible text label, `aria-label` fallback, keyboard focus indicator, proper `target`/`rel`.

**Non-Goals:**
- No new routes, no footer navigation, no version/commit badge, no build-time flag or env var.
- No changes to `game-layout` spec requirements (alignment/scroll constraints remain; footer must not break them).
- No analytics or click tracking.

## Decisions

**Decision: Footer lives in `GameShell`, not `App` header or modals**
- Rationale: `GameShell` wraps every state (`ready`, `in-progress`, terminal). One insertion covers all cases. Header is already crowded (4 action buttons + status pill) and hidden-work on mobile; sidebar is `order-2` on mobile (below fold). Footer below the `max-w-[1600px]` content grid is the standard OSS-game pattern.
- Alternative considered: Header icon — rejected due to crowding and weaker discoverability for "view source" intent. Sidebar footer — rejected due to mobile stacking.

**Decision: Inline SVG Octocat via `currentColor`**
- Rationale: Self-contained like `public/favicon.svg`; no fetch, no 404 under `base: '/The-Cursed-Tomb/'`. `currentColor` tints amber (`text-amber-300/70` → hover `text-amber-300`) to match sidebar stats palette.
- Alternative: `<img src="%BASE_URL%github.svg">` — rejected, unnecessary asset pipeline.

**Decision: Absolute absolute href `https://github.com/Hypercubed/The-Cursed-Tomb`**
- Rationale: External absolute URL is unaffected by `vite.config.ts` `base`. No rewrite needed.

**Decision: Small fixed-height bar with subtle border, centered content**
- Rationale: `border-t border-[#2d2319]`, `bg-[#120e0a]` or `bg-[#18130e]` with `py-2.5`, footer text `text-xs font-mono`. Height 32–40px keeps `game-layout` scroll constraint satisfied.

## Risks / Trade-offs

- **Mobile double-scrollbar / footer pushes content beyond viewport** → Mitigation: Keep footer compact; verify at 768p height; no `sticky` footer, just flow after grid. `GameShell` `min-h-screen` already handles scrolling.
- **Theme clash if icon is pure white** → Mitigation: `currentColor` + amber utility; verify contrast passes on `#120e0a`.
- **Spec archive leaves placeholder if `## Purpose` missing or too brief** → Mitigation: Delta spec Purpose is >50 chars per `openspec validate --strict`.

## Migration Plan

No migration. Additive DOM change. Deploy via existing `gh-pages-deployment` workflow (`npm ci && npm run build → actions/deploy-pages`). Rollback: revert `GameShell` footer JSX.

## Open Questions

None.
