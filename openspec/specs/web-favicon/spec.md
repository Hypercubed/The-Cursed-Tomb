# Web Favicon

## Purpose

Browser favicon and home-screen icon for The Cursed Tomb: a gold Ankh glyph on the dark tomb tile, wired into the document head in a base-path-safe way for both local development and the GitHub Pages deployment.

## Requirements
### Requirement: Favicon glyph design
The favicon SHALL render an Ankh glyph — a loop above a tau cross — in gold (amber-400 family, ≈ `#fbbf24`) on a dark tomb-tile background (root `game-bg` `#0d0a07` or panel `#18130e`). The glyph SHALL be drawn with a bold, uniform stroke (round caps and joins) in a hand-inked style consistent with the game's existing ink aesthetic. The favicon SHALL be recognizable at 16×16 CSS pixels (browser tab size) and SHALL remain legible when scaled up.

#### Scenario: Favicon recognizable in the browser tab
- **WHEN** the site is open in a browser tab at default zoom
- **THEN** the tab icon SHALL display a gold Ankh on a dark background that is clearly identifiable at 16×16 CSS pixels

#### Scenario: Glyph matches game identity
- **WHEN** the favicon is viewed at any size
- **THEN** the Ankh glyph and gold-on-dark palette SHALL visually match the header emblem (`𓋹`) and `game-accent` styling used in the app

### Requirement: SVG favicon asset
The repository SHALL include an SVG favicon asset (`public/favicon.svg`) with a square `viewBox`. The SVG SHALL be self-contained (no external references) and SHALL be a single source file suitable for all favicon sizes.

#### Scenario: Asset exists in source and build output
- **WHEN** the project is built with `npm run build`
- **THEN** a valid `favicon.svg` SHALL be present in `public/` and in the `dist/` output root

### Requirement: Document head wiring
`index.html` SHALL declare the favicon with `<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg">` (or an equivalent base-path-aware reference) so the URL resolves correctly under both the Vite dev server root and the `/The-Cursed-Tomb/` GitHub Pages base path. The page SHALL NOT request a missing `/favicon.ico` when a favicon link is present.

#### Scenario: Icon resolves in local development
- **WHEN** the dev server serves the page at `http://localhost:5173`
- **THEN** the browser SHALL load the favicon from a URL that resolves to the SVG asset without a 404

#### Scenario: Icon resolves on GitHub Pages
- **WHEN** the built site is served at `https://<owner>.github.io/The-Cursed-Tomb/`
- **THEN** the browser SHALL load the favicon from `/The-Cursed-Tomb/favicon.svg` without a 404

### Requirement: iOS home-screen icon
The repository SHALL include an `apple-touch-icon` PNG asset (`public/apple-touch-icon.png`) sized 180×180 pixels, rendering the same Ankh glyph on an opaque dark tile background (no transparency).

#### Scenario: Home-screen icon renders correctly
- **WHEN** a user adds the site to their iOS home screen
- **THEN** the home-screen icon SHALL display the gold Ankh on the dark tile without transparency artifacts

#### Scenario: Asset exists in build output
- **WHEN** the project is built with `npm run build`
- **THEN** `apple-touch-icon.png` SHALL be present in `public/` and in the `dist/` output root

