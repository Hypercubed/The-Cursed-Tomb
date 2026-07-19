## 1. Project Setup

- [x] 1.1 Initialize a Vite project with React and TypeScript
- [x] 1.2 Add card assets or UI styles for card rendering
- [x] 1.3 Configure npm scripts for development and build

## 2. Game Model and Logic

- [x] 2.1 Create card and deck models for suit, rank, and id
- [x] 2.2 Implement pyramid dealing logic and blocked card detection
- [x] 2.3 Implement draw pile handling with configurable redraw limits
- [x] 2.4 Implement move validation for pairs summing to 13 and lone King removal
- [x] 2.5 Implement win/loss detection for both pyramid-only and complete victory modes

## 3. UI and Interactions

- [x] 3.1 Build the game board UI with pyramid rows and draw pile display
- [x] 3.2 Add controls for selecting redraw limit and win condition before starting
- [x] 3.3 Add card selection and removal interactions with instant state updates
- [x] 3.4 Add restart/new game control and game status display

## 4. Validation and Polish

- [x] 4.1 Validate that the game deals a full 52-card deck and shuffles it
- [x] 4.2 Validate that blocked cards cannot be removed
- [x] 4.3 Validate redraw behavior for 0, 1, 2, and infinite redraws
- [x] 4.4 Validate win and loss conditions according to selected mode
- [x] 4.5 Ensure the app runs via Vite dev server and builds successfully
