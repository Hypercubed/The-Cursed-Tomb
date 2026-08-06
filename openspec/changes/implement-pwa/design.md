## Context

The Cursed Tomb is built with React, Vite, and TypeScript. To enable PWA capability without heavy manual boilerplate, `vite-plugin-pwa` provides automated manifest generation, Workbox-based service worker caching, and seamless Vite integration.

## Goals / Non-Goals

**Goals:**
- Integrate `vite-plugin-pwa` to auto-generate Service Worker and Web App Manifest during build.
- Support offline play by precaching all static assets (HTML, bundle JS/CSS, images, icons).
- Add high-quality app icons (192x192, 512x512, maskable) matching the tomb aesthetic.
- Include proper meta tags in `index.html` for iOS Safari and Android Chrome compatibility.

**Non-Goals:**
- Server-side push notifications.
- Background sync of network stats to remote servers (stats are local).

## Decisions

### 1. `vite-plugin-pwa` vs Custom Service Worker
- **Decision**: Use `vite-plugin-pwa` with `generateSW` strategy.
- **Rationale**: standard Workbox-backed precaching handles asset updates, cache invalidation, and offline routing out-of-the-box with minimal maintenance burden.
- **Alternative**: Writing a manual Service Worker, which requires custom cache busting and precache manifest building.

### 2. Service Worker Register Mode
- **Decision**: `autoUpdate` or standard register prompt.
- **Rationale**: Immediate offline availability with automatic cache updates on refresh ensures players always have the latest game version without stuck stale builds.

### 3. Visual & Icon Assets
- **Decision**: Create themed 192x192 and 512x512 PNG icons in `public/icons/` with dark gold/tomb aesthetics and maskable icon variants.

## Risks / Trade-offs

- **[Cache Invalidation on New Releases]** → Mitigation: `vite-plugin-pwa` handles cache keying based on build hashes automatically.
- **[iOS PWA Quirks]** → Mitigation: Explicit `apple-touch-icon` and `apple-mobile-web-app-capable` meta tags added to `index.html`.
