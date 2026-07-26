## Context

The game current UI is standard/generic dark-themed cards and grey boxes. To fit the title "The Cursed Tomb", the game layout, cards, and theme need custom assets, atmospheric vignette overlays, HSL colors, and textured panels that make the user feel like they are exploring a dark Egyptian tomb.

## Goals / Non-Goals

**Goals:**
- Implement a complete custom theme based on "The Cursed Tomb" containing sandstone/basalt/amber/ruby coloring.
- Add an animated flickering vignette overlay simulating torchlight.
- Redesign the layout elements (sidebar as explorer's journal, draw pile as a pedestal, discard pile as a rune-glowing altar).
- Redesign the cards to look like basalt stone slates with thematic suit icons (Ankhs, Scarabs, Khopeshes, Scepters).

**Non-Goals:**
- Adding custom gameplay rules or mechanics (rules have been designed elsewhere and are out of scope for this visual change).

## Decisions

### 1. Palette Extension in Tailwind Config
We will update `tailwind.config.js` to override the colors with our new Egyptian tomb scheme:
- `game-bg`: `#070605` (Deep Obsidian)
- `game-panel`: `#171410` (Sandstone Wall)
- `game-border`: `#383026` (Stone Seam)
- `game-accent`: `#d97706` (Amber/Torchlight)
- `game-red`: `#ef4444` (Ruby/Carnelian)
- `game-card-bg`: `#1c1915` (Basalt Stone Card)
*Rationale*: Using explicit hex codes in Tailwind guarantees cohesive usage across all components.

### 2. Flickering Torchlight Vignette Overlay
We will add a fixed-position overlay div (`.torch-overlay`) inside `src/App.tsx` or `src/components/GameShell.tsx` with:
- `pointer-events: none` so that clicks pass through to interactive cards.
- A CSS radial gradient from transparent in the center to `#070605` at the edges.
- A CSS `@keyframes` animation named `torch-flicker` that oscillates scale and opacity.
*Rationale*: CSS animations are GPU-accelerated and highly performant, keeping standard layout interactives responsive.

### 3. Custom SVG Suits for Cards
Instead of rendering text characters (♥, ♦, ♠, ♣), the `PlayingCard` component will render inline SVG vectors:
- Hearts (♥) -> Ankh vector (life symbol)
- Diamonds (♦) -> Scarab vector (protection symbol)
- Spades (♠) -> Khopesh sword vector (weapon symbol)
- Clubs (♣) -> Was Scepter vector (power symbol)
*Rationale*: Inline SVGs render sharp at any scale, permit fill color matching (`text-game-red` vs `text-game-card-text`), and are highly customizable.

### 4. Layout Stylings (Journal & Pedestals)
- **Sidebar**: Add border decorations and aged stone/parchment background variables to `GameSidebar.tsx` to evoke a researcher's notebook.
- **Draw Pile**: Remove default buttons in `DrawZone.tsx` and replace them with a styled block carrying a golden scarab/ankh symbol.
- **Discard Altar**: Style the discard top with a gold shadow and runic borders when cards are present/active.

## Risks / Trade-offs

- **[Risk] Visual noise overlays block clicks** -> *Mitigation*: Ensure the `torch-overlay` strictly has `pointer-events-none` applied.
- **[Risk] Low readability of suits** -> *Mitigation*: Ensure the SVG suit icons are bold and simplified so they remain easily identifiable at card corner sizes (`text-[0.65rem]`).
