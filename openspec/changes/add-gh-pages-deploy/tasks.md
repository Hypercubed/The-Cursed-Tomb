## 1. Configure Vite Build Base Path

- [ ] 1.1 Update `vite.config.ts` to set `base: '/the-cursed-tomb/'`
- [ ] 1.2 Run `npm run dev` to verify the local development server continues to run successfully and serves the app

## 2. GitHub Actions Workflow Configuration

- [ ] 2.1 Create `.github/workflows/deploy.yml` containing the checkout, Node.js installation, caching, dependency installation, test run (`vitest run`), build compilation, and deploy to `gh-pages` branch using `JamesIves/github-pages-deploy-action@v4`
- [ ] 2.2 Verify workflow YAML syntax is correct

## 3. Verify Production Build

- [ ] 3.1 Run `npm run build` locally
- [ ] 3.2 Verify that the generated assets in `dist/index.html` (e.g. stylesheet link, script sources) are correctly prefixed with `/the-cursed-tomb/`
