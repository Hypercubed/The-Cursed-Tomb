## Context

The project is a single-file React app (`src/App.tsx`, ~200 lines) with a Tailwind CSS design system that was migrated from custom CSS. The migration preserved the original layout structure — a plain vertical `flex-col` stack of panels — and the original functional card component (a `72px` button with centered rank+suit text). The result is a working but visually undistinguished interface that reads like a form rather than a game.

The Tailwind token set already defines the colour palette (`game-bg`, `game-panel`, `game-border`, `game-accent`, `game-red`, etc.). The accent is currently blue (`#60a5fa`). The app's title "The Cursed Tomb" suggests untapped thematic potential.

All game logic lives in `src/game.ts` and is completely decoupled from rendering — no game-logic changes are required.

## Goals / Non-Goals

**Goals:**
- Decompose `App.tsx` into focused presentational components
- Implement a responsive two-column shell (sidebar + board) for desktop
- Make the pyramid the visual hero of the layout
- Redesign cards to resemble real playing cards (corner rank/suit layout)
- Shift the accent palette to amber/gold and add background texture
- Add a thematic display font for headings

**Non-Goals:**
- Any changes to `src/game.ts` or game rules
- Animations or card-flip transitions (future change)
- Mobile-first responsive redesign beyond basic stacking (this change targets ≥ 1024px desktop)
- Adding a component library or CSS-in-JS

## Decisions

**Component decomposition over monolith**

`App.tsx` will be split into:
```
src/
  components/
    GameShell.tsx       ← responsive two-column wrapper
    GameSidebar.tsx     ← setup controls + status panel
    PyramidBoard.tsx    ← pyramid rows rendering
    DrawZone.tsx        ← draw pile + discard pile strip
    PlayingCard.tsx     ← single card with corner layout
  App.tsx               ← state owner; composes the above
```

`App.tsx` retains all `useState`/handlers and passes props down. No new state management library needed — the game state is already a single flat object.

**Two-column layout via Tailwind `lg:grid`**

```
Mobile (< 1024px):          Desktop (≥ 1024px):
┌─────────────────────┐     ┌────────────┬──────────────────┐
│  Header (h1)        │     │  Sidebar   │  Header          │
├─────────────────────┤     │            ├──────────────────┤
│  Sidebar (stacked)  │     │  • Setup   │  PyramidBoard    │
├─────────────────────┤     │  • Status  │  (hero area)     │
│  PyramidBoard       │     │            ├──────────────────┤
├─────────────────────┤     │            │  DrawZone        │
│  DrawZone           │     └────────────┴──────────────────┘
└─────────────────────┘
```

`GameShell` uses `grid grid-cols-1 lg:grid-cols-[280px_1fr]` with `gap-6`. The sidebar width (`280px`) is fixed; the board column grows to fill remaining space.

**`PlayingCard` corner layout via CSS Grid**

Each card uses a 3-row grid:
```
┌──────────────────────┐
│ Rank  ← top-left     │  row 1 (justify-start)
│ Suit                 │
│                      │  row 2 (spacer / large centre suit)
│              Suit    │  row 3 (justify-end, rotate-180)
│              Rank  → │
└──────────────────────┘
```

Implementation: `grid grid-rows-[auto_1fr_auto]` with `min-h-[96px] w-[72px]`. The bottom corner element uses `rotate-180` via Tailwind. The centre row is a flex container holding a larger suit glyph for visual richness.

**Amber/gold accent via Tailwind config update**

Replace the current `game-accent` (#60a5fa blue) and `game-accent-light` (#93c5fd) with:
```js
'game-accent':       '#d97706',  // amber-600
'game-accent-light': '#fbbf24',  // amber-400 (focus rings)
'game-accent-dark':  '#92400e',  // amber-800 (pressed states)
```
All existing usages of `border-game-accent`, `text-game-accent`, `shadow-[...game-accent...]` automatically pick up the new colour via the token name. No class-name changes needed in components.

**Background texture via CSS repeating-gradient**

A subtle texture is added to `index.css` on the `body`:
```css
body {
  background-color: theme('colors.game-bg');
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,255,255,0.015) 2px,
    rgba(255,255,255,0.015) 4px
  );
}
```
This gives a very faint line-grid that reads as "stone" without images or additional assets. Purely decorative — no accessibility impact.

**Thematic heading font via Google Fonts**

`Cinzel` (Google Fonts) is loaded in `index.html` via a `<link>` preconnect + stylesheet. It's applied only to `h1` via a Tailwind `fontFamily` extension:
```js
fontFamily: {
  display: ['Cinzel', 'Georgia', 'serif'],
}
```
Applied as `font-display` on `h1`. Body text remains `Inter/system-ui`.

**DrawZone replaces the current draw/discard layout**

The existing draw/discard UI is two `w-24` containers buried at the bottom of the board panel. `DrawZone` becomes a horizontal flex strip:
```
┌─────────────────────────────────────────────────────┐
│  [Draw pile]              [Discard top]              │
│  ┌──────────┐             ┌──────────┐               │
│  │  Draw    │  ← button   │  A♥     │  ← card face  │
│  │  next    │             └──────────┘               │
│  └──────────┘                                        │
│  Cycles: 2                                           │
└─────────────────────────────────────────────────────┘
```

Empty pile slots show a dashed-border placeholder card with label text.

## Risks / Trade-offs

**Token rename breaks hot-reload cache** → `tailwind.config.js` change triggers full CSS rebuild; dev server picks it up automatically. No prod risk.

**`rotate-180` on card corners may clip overflow** → Use `overflow-hidden` on the card container and ensure the card has explicit `min-h`. Testing on smallest supported viewport needed.

**`Cinzel` is a Google Fonts network request** → Mitigated with `font-display: swap` and `preconnect`. If offline support becomes a requirement, swap for a self-hosted font — but that's a future concern.

**Decomposing `App.tsx` while keeping state at the top** → Props drilling is shallow (one level); not complex enough to require context or a state library. If components multiply, revisit.

**Visual regression on card layout** → The existing `card.removed → invisible` behaviour must be preserved exactly. `PlayingCard` must pass through `invisible` (not `hidden`) to maintain row spacing on removed cards, consistent with the existing spec.

## Open Questions

- Should the sidebar be collapsible on tablet-width viewports (768–1023px)? Currently scoped as "stack vertically" — a collapsible drawer is deferred.
- Should the large centre suit symbol be shown for all cards or only for face cards? An open aesthetic decision; the implementation will default to all cards but can be toggled.
