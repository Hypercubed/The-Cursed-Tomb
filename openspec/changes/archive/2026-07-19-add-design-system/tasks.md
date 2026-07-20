## 1. Setup and Installation

- [x] 1.1 Install Tailwind CSS, PostCSS, and Autoprefixer as dev dependencies
- [x] 1.2 Verify package.json contains the new dependencies

## 2. Configuration

- [x] 2.1 Create tailwind.config.js in project root with custom theme colors
- [x] 2.2 Configure content paths to scan all React component files
- [x] 2.3 Define custom colors matching current dark theme (background: #111827, panel: #1f2937, border: #374151, accent: #60a5fa)
- [x] 2.4 Create postcss.config.js in project root
- [x] 2.5 Configure PostCSS to use Tailwind CSS and Autoprefixer plugins

## 3. CSS Entry Point

- [x] 3.1 Create or update main CSS file with Tailwind directives (@tailwind base; @tailwind components; @tailwind utilities)
- [x] 3.2 Import the CSS file in main.tsx entry point
- [x] 3.3 Remove or comment out old styles.css import temporarily

## 4. Component Migration

- [x] 4.1 Migrate app-shell layout styles to Tailwind utilities (flex, gap, max-width, margin, padding)
- [x] 4.2 Migrate panel styles to Tailwind utilities (background, border, rounded, padding)
- [x] 4.3 Migrate card styles to Tailwind utilities (width, height, border, rounded, gradient, colors)
- [x] 4.4 Migrate card states (blocked, selected, removed) to Tailwind utilities
- [x] 4.5 Migrate button styles to Tailwind utilities (base styles, hover, disabled, focus states)
- [x] 4.6 Migrate board and row layout styles to Tailwind utilities (grid, flex, gap)
- [x] 4.7 Migrate draw pile and draw card styles to Tailwind utilities
- [x] 4.8 Migrate status row and summary styles to Tailwind utilities
- [x] 4.9 Migrate remaining utility classes (small-text, game-info, logo)

## 5. Cleanup and Verification

- [x] 5.1 Remove custom CSS classes from styles.css after successful migration
- [x] 5.2 Delete or minimize styles.css file (keep only essential non-Tailwind styles if needed)
- [x] 5.3 Run development server and verify no errors
- [x] 5.4 Visually verify application matches pre-migration appearance
- [x] 5.5 Run production build and verify successful completion
- [x] 5.6 Verify CSS bundle size is optimized (unused styles purged)
- [x] 5.7 Test all interactive states (hover, focus, disabled, selected)
