## Context

Pyramid Solitaire (The Cursed Tomb) is built using React, TypeScript, Vite, and Tailwind CSS. The app has unit tests written with Vitest. Currently, there is no automated deployment setup, and the app must be built and hosted manually. Setting up a GitHub Actions workflow will enable continuous deployment to GitHub Pages.

## Goals / Non-Goals

**Goals:**
- Automate building, testing, and deploying the application to GitHub Pages.
- Ensure the deployment runs automatically on every push to the `main` branch.
- Prevent broken builds or failing tests from deploying.
- Configure asset path prefixes correctly.

**Non-Goals:**
- Setting up a custom domain.
- Automating release tagging or version bumping.
- Configuring multi-environment (dev/staging/prod) deployments.

## Decisions

### 1. Deployment Mechanism: Deploy via `gh-pages` branch vs. Custom GitHub Pages Action
- **Option A (Chosen):** Deploy to `gh-pages` branch using `JamesIves/github-pages-deploy-action@v4`.
  - *Rationale:* It is simple, highly customizable, and works out-of-the-box on GitHub without requiring specific repository-level setting updates for Actions-based Pages deployment sources.
- **Option B:** Deploy directly via GitHub Pages official workflow actions (`actions/upload-pages-artifact` + `actions/deploy-pages`).
  - *Rationale:* While it avoids cluttering repository branches, it requires the repository owner to change the Pages deployment source in GitHub settings from "Deploy from branch" to "GitHub Actions". Option A is more robust for default repository configurations.

### 2. Vite Base URL Configuration
- **Decision:** Set `base: '/the-cursed-tomb/'` in `vite.config.ts`.
  - *Rationale:* This ensures all script, style, and image requests are correctly prefixed with the repository subfolder when hosted at `https://<owner>.github.io/the-cursed-tomb/`.

### 3. CI Pipeline Steps
- **Steps:**
  1. Checkout source code.
  2. Install Node.js and dependencies using `npm ci`.
  3. Run tests using `npm run test` (which executes Vitest in non-interactive run mode).
  4. Build production static assets using `npm run build`.
  5. Deploy the `dist/` directory to the `gh-pages` branch.

## Risks / Trade-offs

- **[Risk]** The deployment action fails due to missing repository permissions.
  - *Mitigation:* Explicitly add `permissions: contents: write` to the GitHub Actions job configuration so it has write access to create/update the `gh-pages` branch.
- **[Risk]** Running `npm run dev` locally might break if the base path `/the-cursed-tomb/` is applied in development.
  - *Mitigation:* Vite automatically handles the base path correctly during local development (serving at `http://localhost:5173/the-cursed-tomb/` or falling back to root redirection). We will verify that development server functionality is not impaired.
