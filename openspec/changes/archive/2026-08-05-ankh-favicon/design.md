## Context

`index.html` currently declares no favicon, the repo has no `public/` directory, and no favicon asset exists. Browsers therefore request `/The-Cursed-Tomb/favicon.ico` on every load (404), and the tab/bookmark shows a generic globe. The game already has a strong visual identity: a dark tomb theme (`#0d0a07` root bg, `#18130e` panels, amber/gold accents) and the Ankh glyph (`𓋹`) used as the header emblem. The project deploys to GitHub Pages under the `/The-Cursed-Tomb/` base path, which makes asset URLs base-path-sensitive.

## Goals / Non-Goals

**Goals:**
- Ship a favicon that reads as "The Cursed Tomb" instantly — gold Ankh on dark tile, echoing the header emblem and `game-accent` palette.
- Wire it into `index.html` so it works in dev (`http://localhost:5173`) and on GitHub Pages (`/The-Cursed-Tomb/`).
- Provide an iOS home-screen icon so mobile bookmarking isn't a blank tile.

**Non-Goals:**
- No PWA web app manifest or installability features (no `manifest.json`, no maskable-icon requirements).
- No animated favicon, no multi-size `.ico` sprite, no per-browser icon matrix beyond SVG + apple-touch PNG.
- No `theme-color` meta, no light/dark favicon variants (the app is a permanent dark theme).
- No changes to runtime code, `game.ts`, components, or tests.

## Decisions

### Decision 1: SVG favicon (not PNG/ICO)
Ship `favicon.svg` as the primary favicon, referenced with `type="image/svg+xml"`.

- **Why**: Vector = crisp at every scale (16px tab through 512px), tiny file, hand-authorable in-repo without image tooling, and matches the game's hand-inked SVG aesthetic (see `CardFaceIllustration.tsx`).
- **Alternatives considered**:
  - `favicon.ico` — rejected: legacy IE format; one fixed low-res bitmap; requires binary tooling.
  - PNG-only (32px + 48px) — rejected: needs to be generated from the SVG anyway; less crisp; more files.

### Decision 2: Base-path-safe href via `%BASE_URL%`
Reference the icon as `<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg">`.

- **Why**: Vite rewrites `%BASE_URL%` at build time to the configured `base: '/The-Cursed-Tomb/'`, so one tag works in dev and on GitHub Pages. A hard-coded `/favicon.svg` would 404 in production; a bare `favicon.svg` relative path is fragile.
- **Alternatives considered**:
  - Absolute `/The-Cursed-Tomb/favicon.svg` — works but duplicates the base path and breaks if the repo is renamed or `base` changes.
  - Inline `data:` URI in the head — zero extra files, but bloaty, harder to maintain, and can't be reused for the apple-touch icon.

### Decision 3: Assets live in `public/`
Place `favicon.svg` and `apple-touch-icon.png` in `public/` so Vite copies them verbatim into `dist/` (and they get the correct URLs under the base path).

### Decision 4: Glyph design — bold gold Ankh, stroke-based
- Square `viewBox` (e.g. `0 0 64 64`).
- Dark tile background: `#0d0a07` (root `game-bg`) or `#18130e` (panel) — flat fill, full-bleed square.
- Glyph: Ankh built from a loop + stem + crossbar drawn with a single uniform stroke (round caps/joins), gold ≈ `#fbbf24` (amber-400 family, consistent with `game-accent`).
- Stroke weight sized so the glyph remains legible at 16×16 CSS pixels (thick strokes, no fine detail).
- Optional subtle hand-inked irregularity (slight loop tilt / stroke wobble) consistent with the existing ink aesthetic — never at the cost of 16px legibility.

### Decision 5: `apple-touch-icon.png` is a flattened bitmap
180×180 PNG, same design, **opaque** (the dark tile baked in).

- **Why**: iOS renders apple-touch icons without transparency — a transparent icon becomes a black tile or is flattened over white. Baking in the background keeps the design intact on home screens.

## Risks / Trade-offs

- **[Risk] Very old browsers ignore SVG favicons** → *Mitigation*: every evergreen browser (Chrome, Firefox, Safari, Edge) supports SVG favicons as of 2026; the apple-touch PNG covers the remaining mobile case.
- **[Risk] Base path regression breaks the icon in production** → *Mitigation*: `%BASE_URL%` is rewritten by Vite from the single source of truth (`vite.config.ts`); verify on the deployed GitHub Pages URL after build.
- **[Risk] Ankh illegible at 16px** → *Mitigation*: stroke-based design with generous stroke width; visually check at 16px in the browser tab before finalizing the path.
- **[Risk] Transparent apple-touch icon looks wrong on iOS** → *Mitigation*: PNG is exported opaque (Decision 5).

## Migration Plan

1. Add `public/favicon.svg` and `public/apple-touch-icon.png`.
2. Add `<link>` tags to `index.html` head.
3. Build (`npm run build`), confirm `dist/favicon.svg` exists, and check the tab icon in dev and on the deployed GitHub Pages URL.

Rollback: remove the `<link>` tags and delete the two files — no other surface is touched.

## Open Questions

- None blocking. Exact SVG path data (loop proportions, stroke width, optional wobble) is left to implementation, gated by the 16px legibility check.
