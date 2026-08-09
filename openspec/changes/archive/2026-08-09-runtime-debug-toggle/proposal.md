## Why

The DebugPanel is gated by a Vite build-time flag `VITE_SHOW_DEBUG` (`import.meta.env.VITE_SHOW_DEBUG === 'true' && <DebugPanel/>` in `src/App.tsx`). This requires a rebuild and dev-server restart to toggle, which blocks quick QA, prod debugging, and demos on deployed builds. Production (GitHub Pages) currently strips the panel entirely from the bundle, making it impossible to enable without a new deployment. We need runtime toggling where the env var only sets the default and the user can enable/disable in a running instance, with discoverable console instructions.

## What Changes

- Reinterpret `VITE_SHOW_DEBUG` as the **default visibility** for the DebugPanel, not a build-time inclusion gate. The panel is always included in the bundle (for now).
- Add runtime visibility state resolved as `localStorage.getItem('tomb:showDebug') ?? envDefault`, where `envDefault = import.meta.env.VITE_SHOW_DEBUG !== 'false'` (defaults to visible unless explicitly `false`). Persist changes to `localStorage` key `tomb:showDebug` (`"true"`/`"false"`).
- Gate rendering in `src/App.tsx` on runtime state instead of `import.meta.env` directly; listen to `storage` events for cross-tab sync.
- Expose `window.tombDebug` global with `enable()`, `disable()`, `toggle()`, `isEnabled()`, `help()` for console control.
- Print concise enable/disable instructions to the browser console on every startup (always, regardless of current visibility) with styled output.
- Update documentation (`.env.example`, `README` if applicable) and type declarations (`src/vite-env.d.ts`) to reflect the new semantics. `deploy.yml` keeps `VITE_SHOW_DEBUG=false` — now meaning default-hidden but toggleable.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `build-time-flag`: Requirement changes from build-time dead-code elimination of DebugPanel to runtime default visibility with `localStorage` + `window.tombDebug` override and console hint. Existing scenarios (visible in dev, absent in prod, CI flag, docs) are revised.

## Impact

- **Code**: `src/App.tsx` (render guard), new `src/hooks/useDebugVisible.ts` or `src/utils/debugFlag.ts` (state + storage + window API), `src/main.tsx` or `App.tsx` (console hint), `src/vite-env.d.ts` (`VITE_SHOW_DEBUG`), `.env.example` comment.
- **Build**: DebugPanel stays in prod bundle (+~15-30KB); dead-code elimination of debug imports is removed. `deploy.yml` env line unchanged in value, changed in meaning.
- **Specs/Docs**: `openspec/specs/build-time-flag/spec.md` delta.
- **Risk**: Prod bundle slightly larger; `Force Win/Loss` accessible to anyone who knows `tombDebug.enable()` — acceptable for single-player local game; no stat tainting in this change.
