## Context

The DebugPanel (`src/components/DebugPanel.tsx`) is a floating overlay that exposes development controls: Force Win, Force Loss, single-step autoplay, solver strategy selection, and deal winnability analysis. It is currently unconditionally rendered in `src/App.tsx` and therefore appears on every build — including the public GitHub Pages deployment.

Vite supports build-time environment variables via `import.meta.env.*`. Variables prefixed with `VITE_` are inlined at compile time and participate in dead-code elimination when their value is a boolean literal.

## Goals / Non-Goals

**Goals:**
- Strip `DebugPanel` and all debug-only code paths from the GitHub Pages (production) build.
- Keep the panel fully visible during local development (`npm run dev`) without any extra steps.
- Give future contributors a documented, conventional way to control this toggle.

**Non-Goals:**
- Runtime feature flags or remote config (not needed for this simple use case).
- Hiding other parts of the UI based on deployment environment.
- Generalising into a full feature-flag system.

## Decisions

### Decision: `VITE_SHOW_DEBUG` as a string `"true"/"false"`, compared with `=== "true"`

**Alternatives considered:**
- `VITE_SHOW_DEBUG=1` (numeric) — less readable.
- A single `VITE_PRODUCTION=true` sentinel — inverted logic is error-prone.
- `MODE`-based check (`import.meta.env.MODE === "development"`) — too broad; a local `npm run build` would also suppress the panel.

**Decision**: Use `VITE_SHOW_DEBUG` as an explicit opt-in string. Default to `"true"` in `.env` (dev) and explicitly set to `"false"` in CI. The guard expression is:

```ts
import.meta.env.VITE_SHOW_DEBUG === "true" && <DebugPanel … />
```

Vite replaces the literal at build time; when the value is `"false"`, the entire branch is eliminated by the minifier.

### Decision: Set the variable in `deploy.yml` via `env:`, not as a GitHub Secret

The flag value is not sensitive — it's the same for every deployment. Using an inline `env:` block in the workflow is simpler, more visible during code review, and doesn't require managing secrets.

### Decision: Add `.env.example` rather than `.env`

`.env` files with real values should not be committed (even non-secret ones can cause confusion). An `.env.example` with `VITE_SHOW_DEBUG=true` serves as documentation and can be copied locally.

## Risks / Trade-offs

- **[Risk] Tree-shaking not guaranteed** → Vite's Rollup bundler reliably eliminates dead code on boolean-constant guards. This is a well-documented pattern; no mitigation needed beyond ensuring the guard is a simple equality check (not a function call).
- **[Risk] Developer sets `VITE_SHOW_DEBUG=false` locally by accident** → Impact is minimal (panel hides during local build). Documented default in `.env.example` reduces chance of confusion.
- **[Risk] Future components need the same guard** → The pattern is easy to replicate. No abstraction needed at this scale.
