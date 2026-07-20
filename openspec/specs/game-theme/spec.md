# Game Theme

## Purpose

Theme styles, typography, background texture, and color palette customizations to provide a premium, immersive ancient tomb visual theme for the card game.

## Requirements

### Requirement: Amber/gold accent replaces the blue accent palette
The primary interactive accent colour SHALL be an amber/gold tone (≈ `#d97706` / `#f59e0b` family) rather than the current blue (`#60a5fa`). All interactive elements that previously used the blue game-accent token SHALL use the new amber accent token.

#### Scenario: Interactive elements render in amber
- **WHEN** any interactive element (button, card hover, selected card border, focus ring) applies the accent colour
- **THEN** it SHALL display in the amber/gold family rather than blue

### Requirement: Tailwind config is extended with amber accent tokens
The `tailwind.config.js` SHALL define new colour tokens for the amber accent family: `game-accent` (updated to amber mid), `game-accent-light` (lighter amber for focus rings), and `game-accent-dark` (darker amber for pressed states).

#### Scenario: New amber tokens are available as Tailwind utilities
- **WHEN** a component applies `border-game-accent`, `text-game-accent`, or `bg-game-accent`
- **THEN** the rendered colour SHALL be from the amber family, not blue

### Requirement: App background uses a subtle texture
The root background (`game-bg`) SHALL be augmented with a very subtle CSS repeating-gradient or noise pattern that evokes aged stone or parchment without obscuring readability. The texture SHALL be implemented as a CSS background on the html/body or the outer shell element and SHALL be accessible (not rely solely on colour/texture to convey information).

#### Scenario: Background has visible texture at full opacity
- **WHEN** the app is rendered on a dark background
- **THEN** a subtle non-uniform texture SHALL be discernible against the flat background colour, and all text and cards SHALL remain fully readable

### Requirement: Headings use a thematic display font
The `h1` game title heading SHALL use a serif or display typeface that evokes an ancient/gothic aesthetic (e.g., `Cinzel` from Google Fonts). Body text and UI controls SHALL continue to use the existing sans-serif stack.

#### Scenario: Game title renders in display font
- **WHEN** the page loads and the h1 "Pyramid Solitaire" heading is visible
- **THEN** it SHALL render in the thematic display font rather than the default Inter/system-ui stack

#### Scenario: Body text and form controls use sans-serif
- **WHEN** setup labels, status text, or button labels are rendered
- **THEN** they SHALL use the Inter/system-ui font stack, not the display font
