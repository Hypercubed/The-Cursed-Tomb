## Why

The Cursed Tomb is a browser-based solitaire card game that users want to play seamlessly offline and install as a standalone app on desktop and mobile devices. Adding Progressive Web App (PWA) support enables offline play, caching of game assets, fast load times, and an app-like installation experience.

## What Changes

- Add web app manifest (`manifest.webmanifest` / `manifest.json`) specifying app metadata, display mode, theme colors, and icons.
- Add app icons in required dimensions (e.g. 192x192, 512x512, maskable icons) for PWA installation.
- Implement a Service Worker for offline asset caching (HTML, JS, CSS, fonts, audio, images) and update strategy.
- Register the Service Worker in the client entry point with clean lifecycle handling and offline fallback capability.
- Add PWA meta tags in `index.html` (apple-touch-icon, theme-color, viewport adjustments).

## Capabilities

### New Capabilities
- `pwa-support`: Enables installing The Cursed Tomb as a Progressive Web App with web app manifest, offline service worker caching, and installation assets.

### Modified Capabilities

## Impact

- `index.html`: Added meta tags and manifest link.
- `vite.config.ts`: Configured `vite-plugin-pwa` or custom service worker build steps.
- `public/`: Added manifest file and PWA icons.
- `src/main.tsx` or entry point: Added Service Worker registration logic.
- Performance & Storage: Assets will be cached locally on user devices for instant loading and offline availability.
