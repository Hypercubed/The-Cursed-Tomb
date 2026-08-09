## MODIFIED Requirements

### Requirement: Build-time debug visibility toggle
The application SHALL support a Vite environment variable `VITE_SHOW_DEBUG` that controls the default visibility of the DebugPanel, with runtime override via `localStorage` and a console API. The DebugPanel component SHALL always be included in the bundle regardless of the flag value.

#### Scenario: DebugPanel visible in development
- **WHEN** the application is built or served with `VITE_SHOW_DEBUG=true` (or the variable is absent and defaults to `true`) and no runtime override is stored in `localStorage`
- **THEN** the DebugPanel SHALL be rendered and interactable in the UI

#### Scenario: DebugPanel absent from production build
- **WHEN** the application is built with `VITE_SHOW_DEBUG=false` and no runtime override is stored
- **THEN** the DebugPanel SHALL be hidden by default but remain in the bundle and toggleable at runtime (it SHALL NOT be eliminated from the production bundle by Vite's dead-code elimination)

#### Scenario: GitHub Actions deployment sets the flag
- **WHEN** the `deploy.yml` GitHub Actions workflow runs `npm run build`
- **THEN** the build environment SHALL have `VITE_SHOW_DEBUG=false` set
- **THEN** the resulting static site deployed to GitHub Pages SHALL hide the DebugPanel by default while keeping it toggleable via the runtime API

#### Scenario: Flag is documented for contributors
- **WHEN** a contributor clones the repository
- **THEN** a `.env.example` file at the project root SHALL be present documenting `VITE_SHOW_DEBUG=true` as the default development value and noting that it controls default visibility (override at runtime via `tombDebug`)

## ADDED Requirements

### Requirement: Runtime debug visibility override
The system SHALL allow the user to enable or disable the DebugPanel at runtime in a running instance, with the choice persisted in `localStorage` under key `tomb:showDebug`, resolved with precedence `localStorage` over `VITE_SHOW_DEBUG` default, and exposed via a global `window.tombDebug` console API that updates visibility immediately without requiring a reload.

#### Scenario: Enable debug panel at runtime
- **WHEN** the user calls `tombDebug.enable()` in the browser console (or code calls the enable path)
- **THEN** the system SHALL set `localStorage` key `tomb:showDebug` to `"true"` and make the DebugPanel visible immediately

#### Scenario: Disable debug panel at runtime
- **WHEN** the user calls `tombDebug.disable()`
- **THEN** the system SHALL set `localStorage` key `tomb:showDebug` to `"false"` and hide the DebugPanel immediately

#### Scenario: Toggle debug panel
- **WHEN** the user calls `tombDebug.toggle()`
- **THEN** the system SHALL flip the current visibility, persist the new value to `tomb:showDebug`, and update the UI immediately

#### Scenario: Query debug state
- **WHEN** the user calls `tombDebug.isEnabled()`
- **THEN** the system SHALL return `true` if the panel is currently visible and `false` otherwise

#### Scenario: Help reprints instructions
- **WHEN** the user calls `tombDebug.help()`
- **THEN** the system SHALL reprint the console debug instructions

#### Scenario: Persistence across reload
- **WHEN** the user has enabled (or disabled) the panel via `tombDebug` and reloads the page
- **THEN** the system SHALL restore the last persisted `tomb:showDebug` value as the initial visibility, regardless of `VITE_SHOW_DEBUG`

#### Scenario: Stored value takes precedence over env default
- **WHEN** `VITE_SHOW_DEBUG=false` but `localStorage` contains `tomb:showDebug="true"` (or vice versa)
- **THEN** the stored value SHALL determine initial visibility

#### Scenario: Cross-tab synchronization
- **WHEN** visibility is changed in one tab
- **THEN** other open tabs SHALL synchronize visibility on the next `storage` event for `tomb:showDebug`

#### Scenario: Graceful handling when storage is unavailable or invalid
- **WHEN** `localStorage` is unavailable (e.g., private browsing) or contains an invalid value
- **THEN** the system SHALL fall back to the `VITE_SHOW_DEBUG` default without throwing and SHALL remain toggleable in memory for the session

### Requirement: Console debug instructions
The system SHALL print concise instructions for enabling/disabling the debug menu to the browser console on every application startup, regardless of current visibility, and the message SHALL be styled and actionable.

#### Scenario: Instructions printed when hidden
- **WHEN** the application starts and the debug panel is hidden (default or persisted)
- **THEN** the console SHALL print a message indicating the panel is hidden and how to enable it via `tombDebug.enable()` / `tombDebug.help()`

#### Scenario: Instructions printed when visible
- **WHEN** the application starts and the debug panel is visible
- **THEN** the console SHALL print a message indicating the panel is visible and how to disable/toggle it via `tombDebug.disable()` / `tombDebug.toggle()`

#### Scenario: Instructions are not spammed on HMR
- **WHEN** the module is hot-reloaded in development (Vite HMR)
- **THEN** the startup message SHALL be printed at most once per page load (not on every HMR update)
