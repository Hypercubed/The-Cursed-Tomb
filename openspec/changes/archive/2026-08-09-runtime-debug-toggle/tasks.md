## 1. Types and Docs

- [x] 1.1 Update `src/vite-env.d.ts` — add `VITE_SHOW_DEBUG?: string` to `ImportMetaEnv` and augment `Window` with `tombDebug: { enable(): void; disable(): void; toggle(): void; isEnabled(): boolean; help(): void }`.
- [x] 1.2 Update `.env.example` comment to describe `VITE_SHOW_DEBUG` as default visibility with runtime override via `tombDebug.enable()/disable()` persisted in `localStorage` key `tomb:showDebug`.

## 2. Runtime Visibility Hook

- [x] 2.1 Create `src/hooks/useDebugVisible.ts` (and/or `src/utils/debugFlag.ts`) — synchronous `resolveInitial()` (`localStorage.getItem('tomb:showDebug') ?? (import.meta.env.VITE_SHOW_DEBUG !== 'false')`), `useState` initializer, `enable/disable/toggle` callbacks that update state and `localStorage` (try/catch), `isEnabled`/`help` helpers, `storage` event listener for cross-tab sync, graceful handling of unavailable/invalid storage, and `window.tombDebug` assignment with ref-stable `isEnabled` closure.
- [x] 2.2 Wire hook into `src/App.tsx` — replace `{import.meta.env.VITE_SHOW_DEBUG === 'true' && (<DebugPanel .../>)}` guard with runtime boolean, consume `useDebugVisible()` at top-level of `App`.

## 3. Console Startup Instructions

- [x] 3.1 Add styled console hint in `src/main.tsx` (or `App.tsx` mount path) — `console.info` with `%c` styling (`𓋹 The Cursed Tomb — Debug`) that prints on every startup regardless of visibility (hidden: "Debug panel is HIDDEN — Enable: tombDebug.enable()", visible: "Debug panel is VISIBLE — Disable: tombDebug.disable()"), plus `help()` reprint; guard HMR spam so it prints once per page load (e.g., `window.__tombDebugHintPrinted` or `sessionStorage`).
- [x] 3.2 Verify hint is actionable — `tombDebug.help()` reprints same instructions; manual test: load with `VITE_SHOW_DEBUG=true` and `false`, with and without `tomb:showDebug` in `localStorage`, and after `tombDebug.enable()/disable()` + reload.

## 4. Verification

- [x] 4.1 Manual QA: dev default visible (`VITE_SHOW_DEBUG=true` + no LS) → panel shows; `tombDebug.disable()` → hides immediately and persists after reload; `tombDebug.enable()` → restores; `toggle()` flips; cross-tab `storage` event syncs; private-mode fallback (storage throws) keeps in-memory toggle working.
- [x] 4.2 Production default hidden: build with `VITE_SHOW_DEBUG=false` (as in `deploy.yml`) → panel hidden by default but `tombDebug.enable()` makes it appear without rebuild; panel code present in bundle (not DCE'd).
- [x] 4.3 Run `openspec validate --change runtime-debug-toggle --strict` and address any warnings; run existing tests (`npm test` / `vitest`) to ensure no regressions in `App.tsx` rendering.
