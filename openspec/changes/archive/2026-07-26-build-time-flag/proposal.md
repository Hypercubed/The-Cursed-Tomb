## Why

Deploying the game to GitHub Pages makes the **DebugPanel** visible to all visitors. The panel is intended only for development and QA use; exposing it on the public site leaks internal controls (Force Win, Force Loss, Autoplay, solver strategy selection) and adds UI noise for real players. A compile-time flag lets us cleanly exclude it from the production bundle without changing the local developer experience.

## What Changes

- Add a Vite build-time environment variable `VITE_SHOW_DEBUG` that defaults to `true` (dev mode keeps the panel).
- Guard the `<DebugPanel />` rendering in `src/App.tsx` with `import.meta.env.VITE_SHOW_DEBUG`.
- Update `.github/workflows/deploy.yml` to set `VITE_SHOW_DEBUG=false` before `npm run build`.
- Add a `.env.example` documenting the new variable.

## Capabilities

### New Capabilities
- `build-time-flag`: A compile-time feature-toggle mechanism (`VITE_SHOW_DEBUG`) that controls whether development-only UI components are included in the build.

### Modified Capabilities
- _(none — no existing spec-level requirements are changing)_

## Impact

- **`src/App.tsx`**: Wrap `<DebugPanel />` in a compile-time conditional guard.
- **`.github/workflows/deploy.yml`**: Add `VITE_SHOW_DEBUG=false` env var to the build step.
- **`.env.example`** _(new file)_: Document the flag and its default for future contributors.
- **Bundle size**: When the flag is `false`, Vite's dead-code elimination removes `DebugPanel` and all its internal imports (`evaluateWinnability`, solver code paths it exercises) from the production bundle.
- **Developer experience**: No change — local `npm run dev` continues to show the panel by default.
