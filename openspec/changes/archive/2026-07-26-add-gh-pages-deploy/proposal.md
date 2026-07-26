## Why

Deploying the Pyramid Solitaire game manually is error-prone and inefficient. Automating the build and deployment process using GitHub Actions and GitHub Pages will ensure the live application is automatically built and deployed whenever changes are merged into the `main` branch.

## What Changes

- Add a GitHub Actions workflow configuration to build the application and deploy the static assets to GitHub Pages.
- Configure the Vite base URL prefix to match the repository name path (`/the-cursed-tomb/`) so assets resolve correctly when hosted on GitHub Pages.

## Capabilities

### New Capabilities
- `gh-pages-deployment`: GitHub Actions workflow that handles testing, building, and deploying the static build artifacts to GitHub Pages on every push to the `main` branch.

### Modified Capabilities
