## Why

The app ships with no favicon: `index.html` has no `<link rel="icon">`, there is no `public/` directory, and no favicon asset exists anywhere in the repo. Every page load triggers a 404 for `/The-Cursed-Tomb/favicon.ico`, and browser tabs, bookmarks, and PWA installs show a generic placeholder instead of the game's identity.

## What Changes

- **Add an Ankh favicon**: Create a gold, hand-inked Ankh glyph favicon (SVG) on the dark tomb-tile background, matching the existing header emblem (`𓋹`) and the game's amber/gold `game-accent` visual language.
- **Wire favicon into `index.html`**: Add a `<link rel="icon">` reference that resolves correctly under the `/The-Cursed-Tomb/` base path (via Vite's `%BASE_URL%` placeholder) so it works in both dev and the GitHub Pages deployment.
- **Add iOS home-screen icon**: Provide an `apple-touch-icon` PNG (180×180) derived from the same glyph for mobile home-screen bookmarking.

## Capabilities

### New Capabilities
- `web-favicon`: Requirements for the favicon glyph design (Ankh motif, gold ink on dark tile), the set of icon assets shipped, and the `index.html` head wiring that must survive the GitHub Pages base path.

### Modified Capabilities
<!-- None -->

## Impact

- `index.html` — new `<link rel="icon">` and `<link rel="apple-touch-icon">` tags
- New static assets: `public/favicon.svg` and `public/apple-touch-icon.png` (copied into `dist/` by Vite)
- No runtime code, `game.ts`, or component changes
- Deployment: unchanged workflow; favicon assets must resolve under `/The-Cursed-Tomb/` on GitHub Pages
