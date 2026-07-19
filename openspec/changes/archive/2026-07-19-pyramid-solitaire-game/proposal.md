## Why

A web-based Pyramid Solitaire game provides a small playable demo and reusable game engine for the project. It adds an interactive browser experience with configurable rules and a complete victory condition.

## What Changes

- Add a Vite-based web application for playing Pyramid Solitaire in the browser.
- Implement game setup, card rendering, pyramid layout, draw pile, available moves, and win/loss detection.
- Add configurable rules for redraw limits and win condition:
  - Number of redraws: 0, 1, 2, or infinite.
  - Win condition: clear the pyramid, or clear both pyramid and draw pile (complete victory).
- Provide a playable UI for starting a game, interacting with cards, and completing a game.

## Capabilities

### New Capabilities
- `pyramid-solitaire-game`: A browser-based Pyramid Solitaire game with standard rules, configurable redraw count, and selectable win conditions.

### Modified Capabilities
- None

## Impact

- Adds a new frontend application and game logic module.
- Introduces Vite build configuration and related web dependencies.
- Affects project tooling around frontend packaging and local development.
