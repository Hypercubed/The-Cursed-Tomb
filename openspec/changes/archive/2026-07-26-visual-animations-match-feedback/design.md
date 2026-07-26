## Context

Currently, card removals in `PlayingCard` and `PyramidBoard` are instantaneous state updates. Adding subtle CSS keyframe animations and brief state transitions improves tactile feel without impacting game state performance or blocking rapid clicks.

## Goals / Non-Goals

**Goals:**
- Pure CSS keyframe animations in `src/index.css` (zero external animation library dependencies).
- Smooth card pairing fade/dissolve, invalid selection shake, and selection glow.
- Staggered pyramid collapse tumble animation when game status transitions to `lost`.
- Respect `prefers-reduced-motion` media query to disable keyframes for users with motion sensitivity.

**Non-Goals:**
- Complex 3D physics engines or canvas particle systems.

## Decisions

### 1. CSS Keyframe Animations vs JS Animation Libraries
- **Decision**: Define CSS `@keyframes` in `src/index.css` and toggle CSS classes on React components.
- **Rationale**: Keeps bundle size minimal, ensures 60 FPS GPU-accelerated rendering (`transform`, `opacity`), and integrates cleanly with existing Tailwind styling.

### 2. Match Removal Lifecycle
- **Decision**: When a valid pair is formed, delay the underlying state removal by 150-250ms or play the CSS animation on match event.
- **Rationale**: Ensures the player visually sees the two matched cards flash/dissolve before disappearing from the layout.

### 3. Pyramid Collapse Lose Animation
- **Decision**: When `game.status === 'lost'`, apply a staggered CSS crumble/tumble keyframe animation (`animate-pyramid-collapse`) to remaining cards on `PyramidBoard`.
- **Rationale**: Reinforces the tomb theme visually when no moves remain, providing clear visual feedback that the pyramid has collapsed into ruin.

## Risks / Trade-offs

- **[Risk]**: Delaying state updates could feel sluggish during fast play or autoplay.
- **Mitigation**: Keep animation durations short ($\le 250\text{ms}$) and bypass animation delays when running autoplay/solver mode.
