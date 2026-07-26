# gh-pages-deployment Specification

## Purpose
Automate continuous deployment of the application to GitHub Pages on pushes to the `main` branch, ensuring test and build validation and proper subfolder asset routing.

## Requirements

### Requirement: Automate testing and build execution
The deployment pipeline SHALL run automated tests and build static site assets when a push event occurs on the `main` branch.

#### Scenario: CI pipeline executes on push to main
- **WHEN** a commit is pushed to the `main` branch
- **THEN** the CI workflow SHALL run `npm ci`, run `npx vitest run` to execute all tests, and build the project static assets.

### Requirement: Deploy static assets to GitHub Pages
The workflow SHALL deploy the built files to the `gh-pages` branch to make them available on GitHub Pages.

#### Scenario: Automated deployment to gh-pages branch
- **WHEN** the test and build steps complete successfully on the `main` branch
- **THEN** the static files in the `dist/` directory SHALL be published to the `gh-pages` branch using the `actions/deploy-pages` action (or a similar deployment action).

### Requirement: Resolve asset paths relative to the subfolder
The build configuration SHALL use `/the-cursed-tomb/` as the base path so that assets are resolved correctly when served from GitHub Pages.

#### Scenario: Assets loaded correctly with repository base path
- **WHEN** the application is built and hosted under the repository subfolder path
- **THEN** all CSS, JS, and image assets in the output `index.html` SHALL be prefixed with `/the-cursed-tomb/`.
