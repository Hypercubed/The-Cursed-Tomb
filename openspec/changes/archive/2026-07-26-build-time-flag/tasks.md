## 1. Environment Variable Setup

- [x] 1.1 Create `.env.example` at project root with `VITE_SHOW_DEBUG=true` and a comment explaining the flag
- [x] 1.2 Verify that `.env` and `.env.local` are listed in `.gitignore` (so local overrides are never committed)

## 2. App Code

- [x] 2.1 In `src/App.tsx`, wrap `<DebugPanel … />` with `import.meta.env.VITE_SHOW_DEBUG === "true" && (…)`
- [x] 2.2 Verify locally with `npm run dev` that the panel still appears (no `.env` override set)
- [x] 2.3 Verify locally with `VITE_SHOW_DEBUG=false npm run build && npx serve dist` that the panel does not appear

## 3. CI / GitHub Actions

- [x] 3.1 In `.github/workflows/deploy.yml`, add `env: VITE_SHOW_DEBUG: "false"` to the `npm run build` step
- [x] 3.2 Confirm the workflow still passes and the deployed page shows no DebugPanel
