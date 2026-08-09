# repo-link Specification

## Purpose
Provide a persistent, accessible entry point from the deployed game to its open-source repository so players can discover source code, report issues, and explore development history.

## Requirements

### Requirement: Persistent footer with GitHub repository link
The game shell SHALL render a persistent footer containing a link to `https://github.com/Hypercubed/The-Cursed-Tomb` that is visible on all primary game states without requiring user interaction to reveal it.

#### Scenario: Footer visible on every primary game state
- **WHEN** the game is in `ready`, `in-progress`, or any terminal state (`won`, `complete-victory`, `partial-victory`, `pyramid-collapse`)
- **THEN** the footer with the GitHub link SHALL be visible at the bottom of the page shell

#### Scenario: Footer placement is below main content
- **WHEN** the page is rendered at any viewport width
- **THEN** the footer SHALL appear below the main board/sidebar grid and remain below content on both desktop and mobile stacked layouts

### Requirement: External link target and safety attributes
The GitHub link SHALL use the absolute URL `https://github.com/Hypercubed/The-Cursed-Tomb` and open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.

#### Scenario: Click opens GitHub in new tab
- **WHEN** the user activates the GitHub link
- **THEN** the browser SHALL navigate to `https://github.com/Hypercubed/The-Cursed-Tomb` in a new tab with `noopener` and `noreferrer` protections

#### Scenario: Link unaffected by Vite base path
- **WHEN** the app is served under the `/The-Cursed-Tomb/` base path on GitHub Pages or at `/` on the dev server
- **THEN** the link href SHALL remain the absolute GitHub URL and SHALL NOT be rewritten with the base path

### Requirement: Accessible link identification
The GitHub link SHALL have a visible text label (e.g., `GitHub` or `View source on GitHub`) and an accessible name, be keyboard-focusable, and show a visible focus indicator.

#### Scenario: Screen reader announces link purpose
- **WHEN** a screen reader encounters the link
- **THEN** its accessible name SHALL convey destination (contains `GitHub` and optionally the repository name)

#### Scenario: Keyboard navigation reaches the link
- **WHEN** the user tabs through the page
- **THEN** the GitHub link SHALL receive focus and display a visible focus ring

### Requirement: Visual integration with tomb theme and layout constraints
The footer SHALL integrate with the existing tomb palette (dark stone background, amber/gold accents, subtle border) using inline SVG for the GitHub Octocat tinted via `currentColor`, and SHALL NOT introduce page-level vertical scrolling on standard desktop viewports (768p and above).

#### Scenario: Footer matches tomb aesthetic
- **WHEN** the footer is rendered
- **THEN** its colors, borders, and icon tint SHALL use the existing `game-*` / amber palette and the Octocat SHALL inherit `currentColor`

#### Scenario: No layout overflow on desktop
- **WHEN** viewed on desktop viewports ≥1024px at standard heights (768p, 900p, 1080p)
- **THEN** the addition of the footer SHALL NOT cause page-level vertical scrollbars beyond what existed before (footer is compact, ~32–40px)
