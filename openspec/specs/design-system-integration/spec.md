# Design System Integration

## Purpose

Tailwind CSS integration and style migration for the project, enabling a consistent and flexible design system while replacing custom CSS styling.

## Requirements

### Requirement: Tailwind CSS installation
The system SHALL install Tailwind CSS as a development dependency with compatible versions for the project's build environment.

#### Scenario: Successful installation
- **WHEN** developer runs npm install with Tailwind CSS packages
- **THEN** Tailwind CSS, PostCSS, and Autoprefixer are installed in devDependencies
- **THEN** package.json contains the new dependencies

### Requirement: Tailwind configuration
The system SHALL configure Tailwind CSS with a custom theme that matches the existing dark theme color palette.

#### Scenario: Configuration file creation
- **WHEN** tailwind.config.js is created in the project root
- **THEN** the configuration extends the default Tailwind theme
- **THEN** custom colors are defined matching the current dark theme (background: #111827, panel: #1f2937, border: #374151, accent: #60a5fa)
- **THEN** the content paths are configured to scan all React component files

#### Scenario: Color theme preservation
- **WHEN** Tailwind processes styles
- **THEN** the visual output matches the existing dark theme
- **THEN** all custom colors from styles.css are available as Tailwind utilities

### Requirement: PostCSS configuration
The system SHALL configure PostCSS to process Tailwind CSS during the build process.

#### Scenario: PostCSS setup
- **WHEN** postcss.config.js is created in the project root
- **THEN** the configuration includes Tailwind CSS and Autoprefixer plugins
- **THEN** Vite build process successfully processes Tailwind directives

### Requirement: CSS entry point
The system SHALL create a CSS entry point that imports Tailwind directives.

#### Scenario: Tailwind directives import
- **WHEN** the main CSS file is created or updated
- **THEN** it imports Tailwind's base, components, and utilities directives
- **THEN** the file is imported in the application's entry point (main.tsx)

### Requirement: Component style migration
The system SHALL migrate all existing custom CSS classes to Tailwind utility classes.

#### Scenario: App shell migration
- **WHEN** the app-shell component is migrated
- **THEN** flexbox layout is replaced with Tailwind flex utilities
- **THEN** spacing is replaced with Tailwind gap and padding utilities
- **THEN** max-width and margin are replaced with Tailwind sizing utilities

#### Scenario: Card component migration
- **WHEN** the card component is migrated
- **THEN** card dimensions use Tailwind width and height utilities
- **THEN** border styling uses Tailwind border and rounded utilities
- **THEN** background gradient is replaced with Tailwind gradient utilities or custom CSS via @apply

#### Scenario: Button component migration
- **WHEN** button styles are migrated
- **THEN** button base styles use Tailwind utilities
- **THEN** hover and disabled states use Tailwind variant modifiers
- **THEN** focus states use Tailwind ring utilities

### Requirement: Custom CSS removal
The system SHALL remove or deprecate the custom CSS file after successful migration.

#### Scenario: CSS file cleanup
- **WHEN** all components are successfully migrated to Tailwind
- **THEN** the custom styles.css file is removed or reduced to only essential non-Tailwind styles
- **THEN** the application renders identically to the pre-migration state

### Requirement: Build verification
The system SHALL verify that the build process works correctly with Tailwind CSS integration.

#### Scenario: Development build
- **WHEN** developer runs the development server
- **THEN** the application starts without errors
- **THEN** Tailwind styles are properly applied in the browser

#### Scenario: Production build
- **WHEN** developer runs the production build
- **THEN** the build completes successfully
- **THEN** unused Tailwind styles are purged from the output
- **THEN** the CSS bundle size is optimized
