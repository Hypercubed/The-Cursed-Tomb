## Context

Today `src/App.tsx:552` gates the panel with `import.meta.env.VITE_SHOW_DEBUG === 'true' && <DebugPanel/>`. `VITE_SHOW_DEBUG` is Vite-replaced at build time; with `VITE_SHOW_DEBUG=false` the panel is DCE'd out of the bundle. `deploy.yml` sets `VITE_SHOW_DEBUG=false` for Pages. There is no runtime state, no `localStorage`, no `window` API. See `proposal.md` — Why.

The goal is `VITE_SHOW_DEBUG` as **default** with runtime override persisted in `localStorage` and console API, plus an always-printed startup hint. No `?debug` URL param.

## Goals / Non-Goals

**Goals:**
- Enable/disable DebugPanel in a running instance without rebuild; default sourced from `VITE_SHOW_DEBUG`.
- Persist choice in `localStorage` (`tomb:showDebug`) and apply on next load.
- Expose `window.tombDebug` (`enable/disable/toggle/isEnabled/help`) with immediate effect.
- Print styled console instructions on every startup (regardless of visibility), without spamming on HMR.
- Keep panel in prod bundle (no DCE stripping for now); `deploy.yml` value `false` becomes default-hidden not absent.

**Non-Goals:**
- URL query param (`?debug`) — explicitly excluded.
- Hard-strip escape hatch (`VITE_STRIP_DEBUG`) — explicitly deferred (prod includes debug code for now).
- Tainting or marking campaign stats when `forceWin` used via debug — out of scope.
- Keyboard shortcut toggle — not in this change.

## Decisions

### 1. Always bundle DebugPanel; env as default not gate
**Decision:** Change `App.tsx` guard from `import.meta.env.VITE_SHOW_DEBUG === 'true'` to runtime boolean `debugVisible`. `VITE_SHOW_DEBUG !== 'false'` yields `defaultVisible` (true unless explicitly `"false"` — tolerates undefined, `"true"`, empty). This preserves `deploy.yml` semantics: `false` → hidden by default but toggleable.
**Alternative:** Keep DCE when `false` and add separate `VITE_INCLUDE_DEBUG` to include toggleable stub. Rejected — duplicates flag, confusing; temporary inclusion cost (~15-30KB) acceptable; can add strip later if needed.
**Rationale:** Simplest reinterpretation; no workflow change; one flag stays source of default.

### 2. State ownership: hook `useDebugVisible`
**Decision:** New `src/hooks/useDebugVisible.ts` (or `src/utils/debugFlag.ts` + hook) owns `useState` + initialization + persistence + `window.tombDebug` wiring. `App.tsx` consumes `const { visible, enable, disable, toggle } = useDebugVisible()`.
**Alternative:** Inline all logic in `App.tsx`. Rejected — clutters `App.tsx` (already large), harder to test.
**Init:** Synchronous before first render:
```ts
function resolveInitial(): boolean {
  const envDefault = import.meta.env.VITE_SHOW_DEBUG !== 'false';
  try {
    const stored = localStorage.getItem('tomb:showDebug');
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  } catch {}
  return envDefault;
}
```
Persists on change via `localStorage.setItem('tomb:showDebug', String(next))` (try/catch). Listens `window.addEventListener('storage', ...)` for cross-tab sync; also handles invalid values (neither `"true"` nor `"false"` → ignore, fall back).

### 3. Global API: `window.tombDebug`
**Decision:** Namespace `window.tombDebug` not `window.enableDebug`. Shape:
```ts
window.tombDebug = { enable(), disable(), toggle(), isEnabled(): boolean, help(): void }
```
`help()` reprints instructions. Attach in `useEffect` with stable callbacks; also assign eagerly (outside effect) so console can call it before React mounts — or assign in `main.tsx` early and update closure via ref.
**Alternative:** `window.__TOMB_DEBUG__` / flat `window.enableDebug`. Rejected — noisy or too generic. Thematic namespacing wins.
**Typing:** Augment `Window` interface in `src/vite-env.d.ts` or `debugFlag.ts` for TS.

### 4. Console hint: early + styled + once
**Decision:** Print from `src/main.tsx` (before `ReactDOM.createRoot`) or `App.tsx` mount effect. Message:
```
%c𓋹 The Cursed Tomb — Debug %c
Debug panel is HIDDEN|VISIBLE (default VITE_SHOW_DEBUG=...)
Enable:  tombDebug.enable()   Disable: tombDebug.disable()   Toggle: tombDebug.toggle()   Help: tombDebug.help()
```
Uses `console.info` with `%c` styling (`color:#f59e0b; font-weight:bold;` + reset). Always prints regardless of visibility. Guard HMR spam: `if (import.meta.hot) { /* still print once per load, not per HMR accept */ }` — either check `sessionStorage['tomb:debugHintPrinted']` or rely on `main.tsx` executing once per full reload (HMR does not re-execute `main.tsx` top-level in Vite 5? verify). Simpler: gate with a module-scoped `let printed = false` (survives HMR? no, re-executed). Preferred: `sessionStorage` or `window.__tombDebugHintPrinted`.
**Alternative:** `console.debug` (hidden by log level) — rejected; `console.warn` — noisy.

### 5. Storage key and error handling
**Decision:** Key `tomb:showDebug` (`"true"`/`"false"` strings). Wrap all `localStorage` in try/catch; on error, keep in-memory state toggleable for session (no persistence). Invalid stored string → treat as absent.

### 6. Env typing and docs
**Decision:** Add `VITE_SHOW_DEBUG?: string` to `ImportMetaEnv` in `src/vite-env.d.ts`. Update `.env.example` comment to: "Default visibility for DebugPanel; override at runtime via `tombDebug.enable()/disable()` in console (persisted in localStorage)." No `deploy.yml` value change.

## Risks / Trade-offs

- **Prod bundle larger** (panel + `solver.ts` `forceWin/forceLoss` already imported in `App.tsx` even when hidden — grep shows imports unconditional). Extra cost is only JSX branch, not solver code. Mitigation: revisit hard-strip flag later if size matters.
- **Cheat exposure in prod** — anyone opening console can `tombDebug.enable()` → `Force Win`. Risk is low for local single-player; no persistence/leaderboard taint. Mitigation: document; consider debug flag in stats later (non-goal).
- **Flicker** — reading `localStorage` must be synchronous init (not async effect) to avoid flash of default then override. Resolved via synchronous `useState(resolveInitial)` initializer.
- **`localStorage` unavailable** (Safari private, sandboxed iframe) — try/catch fallback to env default + in-memory toggle keeps feature working.
- **Stale `window.tombDebug` closure** if assigned outside React — callbacks must read current state via ref or re-assign on each render/effect. Mitigation: assign inside hook effect with stable setter, or use ref to latest `visible`.
- **Console hint discoverability** — always printing may be noisy for players who never open console. Acceptable per decision (user wants always); negligible visual cost (console only); can add opt-out later (`tombDebug.silence()` non-goal).

## Migration Plan

1. Land this change — no data migration; existing `localStorage` key `tomb:showDebug` is new, so first-load respects `VITE_SHOW_DEBUG`.
2. Deploy with `VITE_SHOW_DEBUG=false` (unchanged) → Pages defaults hidden but toggleable; verify `tombDebug.enable()` survives reload and cross-tab.
3. Rollback: revert guard to `import.meta.env...` — stored key becomes inert until next forward deploy. No DB impact.
4. Future: if hard-strip needed, add `VITE_STRIP_DEBUG` that conditionally `import()`s `DebugPanel` — can layer without re-breaking runtime toggle.

## Open Questions

- None blocking. Minor: exact console styling palette to match `GameShell` header — can tune in implementation without spec change.
