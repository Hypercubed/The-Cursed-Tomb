## Why

Currently, when cards are paired or drawn, they vanish instantly from the layout without visual transitions or feedback. Adding tactile card match animations, subtle glow/pulse effects on card selection, error shake animations on invalid pairs, and a victory flourish significantly elevates the visual polish and feedback of the tomb solitaire experience.

## What Changes

- Add card match fade-out/dissolve animations when cards are paired and removed.
- Add selection highlight pulse and error shake feedback when attempting an invalid pair.
- Add subtle card draw / flip animations when drawing cards from the stock to the waste pile.
- Add a tomb victory sparkle/glow animation when the pyramid is cleared or a game is won.
- Add a tomb pyramid collapse animation when no valid moves remain and the game is lost.
- Ensure animations respect user accessibility preferences (`prefers-reduced-motion`).

## Capabilities

### New Capabilities
- `card-match-animations`: Tactile visual animations for card selection, pairing, drawing, invalid move feedback, victory celebrations, and game-over pyramid collapse.

### Modified Capabilities
- `card-rendering`: Extend card components to support CSS animation state classes and transition lifecycle hooks.

## Impact

- **UI Components (`src/components/PlayingCard.tsx`, `PyramidBoard.tsx`, `DrawZone.tsx`)**: Adding state-driven CSS animation classes and timing handlers.
- **Styles (`src/index.css`)**: Adding keyframe animations for match fade-out, selection pulse, error shake, win celebration, and lose collapse.
