# Purpose
Controls debug UI visibility via environment variables, allowing debug tools to be excluded from production builds.

## Requirements

### Requirement: Build-time debug visibility toggle
The application SHALL support a Vite environment variable `VITE_SHOW_DEBUG` that controls whether the DebugPanel component is included in the compiled output.

#### Scenario: DebugPanel visible in development
- **WHEN** the application is built or served with `VITE_SHOW_DEBUG=true` (or the variable is absent and defaults to `true`)
- **THEN** the DebugPanel SHALL render and be interactable in the UI

#### Scenario: DebugPanel absent from production build
- **WHEN** the application is built with `VITE_SHOW_DEBUG=false`
- **THEN** the DebugPanel SHALL NOT appear in the rendered UI
- **THEN** the DebugPanel component and its imports SHALL be eliminated from the production bundle by Vite's dead-code elimination

#### Scenario: GitHub Actions deployment sets the flag
- **WHEN** the `deploy.yml` GitHub Actions workflow runs `npm run build`
- **THEN** the build environment SHALL have `VITE_SHOW_DEBUG=false` set
- **THEN** the resulting static site deployed to GitHub Pages SHALL NOT include the DebugPanel

#### Scenario: Flag is documented for contributors
- **WHEN** a contributor clones the repository
- **THEN** a `.env.example` file at the project root SHALL be present documenting `VITE_SHOW_DEBUG=true` as the default development value
