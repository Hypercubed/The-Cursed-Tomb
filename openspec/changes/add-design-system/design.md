## Context

The project is a React-based pyramid solitaire game built with Vite and TypeScript. Currently, it uses a custom CSS file (`src/styles.css`) with approximately 155 lines of hardcoded styles. The styling approach uses custom class names like `.app-shell`, `.panel`, `.card`, etc., with manually defined colors, spacing, and layout properties. This creates maintenance overhead and lacks a systematic approach to design consistency.

The current color scheme uses a dark theme with colors like `#111827` (background), `#1f2937` (panels), `#374151` (borders), and `#60a5fa` (accents). The project uses Vite as the build tool, which has good support for PostCSS and Tailwind CSS integration.

## Goals / Non-Goals

**Goals:**
- Integrate Tailwind CSS as the primary styling system
- Maintain visual consistency with the current dark theme
- Migrate all existing custom CSS to Tailwind utility classes
- Establish a scalable design system for future development
- Improve developer experience with utility-first CSS

**Non-Goals:**
- Changing the visual design or color scheme (maintain current look)
- Adding new UI components or features
- Migrating to a different framework (staying with React)
- Implementing a full component library (only styling system)

## Decisions

**Tailwind CSS over other design systems:**
- Chosen Tailwind CSS due to its utility-first approach, excellent React integration, and widespread adoption
- Alternatives considered: CSS Modules (too verbose), Styled Components (runtime overhead), Bootstrap (too opinionated)
- Tailwind provides the best balance of flexibility, performance, and developer experience

**PostCSS + Autoprefixer integration:**
- Using PostCSS for Tailwind processing is the standard approach and integrates well with Vite
- Autoprefixer ensures cross-browser compatibility
- This combination is battle-tested and recommended by Tailwind documentation

**Tailwind configuration approach:**
- Will create `tailwind.config.js` to extend the default theme with custom colors matching the current dark theme
- This preserves the existing visual identity while gaining Tailwind's utility benefits
- Configuration will include custom color palette (gray-900, gray-800, gray-700, blue-400 equivalents)

**Migration strategy:**
- Incremental migration: component by component rather than big-bang replacement
- Keep existing CSS during migration to allow visual comparison
- Remove custom CSS classes only after successful Tailwind migration
- This approach reduces risk and allows easy rollback

**Vite configuration:**
- Will add PostCSS configuration file (`postcss.config.js`) for Tailwind processing
- No major changes to existing Vite configuration needed
- Tailwind's Vite plugin is not required since PostCSS handles the processing

## Risks / Trade-offs

**Learning curve for Tailwind:**
- Risk: Team may need time to learn Tailwind's utility class approach
- Mitigation: Tailwind has excellent documentation and the utility classes are intuitive; migration will serve as learning opportunity

**Initial file size increase:**
- Risk: Tailwind's default CSS bundle is larger than current custom CSS
- Mitigation: Tailwind's purge/JIT mode in production removes unused styles, resulting in smaller final bundles

**Visual regression during migration:**
- Risk: Migrated components may not exactly match original styling
- Mitigation: Incremental migration with visual testing at each step; keep original CSS until migration is verified

**Build time impact:**
- Risk: PostCSS processing may add small build time overhead
- Mitigation: Impact is minimal (<100ms) and outweighed by development benefits; Tailwind's JIT mode is fast

**Custom CSS remnants:**
- Risk: Some complex styles may be difficult to replicate with utilities
- Mitigation: Tailwind allows arbitrary values and custom CSS via `@apply` directive; can keep minimal custom CSS if needed
