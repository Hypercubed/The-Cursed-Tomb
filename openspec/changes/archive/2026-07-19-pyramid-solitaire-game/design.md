## Context

This change adds a standalone browser-based Pyramid Solitaire game to the project. The game should be built with Vite and may use a modern frontend framework or vanilla JavaScript. The key goal is a playable UI with standard Pyramid Solitaire rules and configurable redraw and win conditions.

## Goals / Non-Goals

**Goals:**
- Provide a Vite-based web app that launches a playable Pyramid Solitaire game.
- Implement game setup, card rendering, player interactions, and win/loss detection.
- Support configurable redraw limits (0, 1, 2, infinite) and two win conditions.
- Keep the architecture simple enough for maintainability and future extension.

**Non-Goals:**
- Building a full multi-page web app or backend service.
- Adding online multiplayer, persistence, or account integration.
- Implementing advanced animations beyond basic card movement state changes.

## Decisions

- Framework: Use Vite with React and TypeScript for rapid UI development and clean state management.
  - Rationale: React provides component structure for game board, controls, and state updates. TypeScript catches card model errors early.

- Game model: Represent cards as objects with suit, rank, id, and face-up state. Use a single game engine module for dealing, move validation, redraws, and win/loss detection.
  - Rationale: Separate game logic from UI simplifies testing and keeps components focused on rendering.

- UI layout: Render the pyramid as rows of cards with blocked state determined by coverage. Display the draw pile, current draw card, and control panel in a side area.
  - Rationale: A simple desktop layout is intuitive and supports all required interactions.

- Redraw semantics: Implement draw pile cycling through a configurable number of redraws. For finite redraws, track used redraws and disable redraw when exhausted. For infinite redraws, allow cycling without limit.
  - Rationale: This matches the requested rule variations and keeps the logic clean.

- Win condition: Offer a selection before starting a game. Evaluate win on either clearing the pyramid alone or clearing pyramid plus draw pile depending on selected mode.
  - Rationale: This meets user-configurable victory rules and keeps game-end logic explicit.

## Risks / Trade-offs

- [Risk] React adds some dependency weight compared with vanilla JS.
  - Mitigation: Use React only for the web app surface, keep logic encapsulated, and avoid heavier frameworks.

- [Risk] Implementing full solitaire rules in a single-session game could become complex around blocked card detection and redraw state.
  - Mitigation: Model card state clearly and build reuseable helper functions for validity checks.
