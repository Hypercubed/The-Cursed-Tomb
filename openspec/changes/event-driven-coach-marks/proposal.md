## Why

New players encountering *The Cursed Tomb* face layered game mechanics beyond standard Pyramid Solitaire—such as Attrition (red slashes), Sun Crosses (blue blessings), Entombed cards (Stage 5 decay), and Vault stashing. Currently, rules are explained only via a static `RulesModal`, which forces players to read wall-of-text documentation before playing.

An event-driven, contextual coach mark system will pause gameplay and display focused, bottom-banner explanations with spotlight highlights as mechanics occur for the first time, easing the learning curve without interrupting game momentum with forced move hints or intrusive modal popups.

## What Changes

- **Event-Driven Coach Mark Banner**: A responsive fixed bottom banner that appears when a player encounters a new game mechanic for the first time.
- **Element Spotlight Highlighting**: Adds a glowing pulse spotlight effect over the target UI element (Pyramid, Attrition card, Sun Cross card, Entombed card, Vault, or Draw pile) when its coach mark is active.
- **Gameplay Pause**: Pauses gameplay interactions while a coach mark banner is open, resuming when the user clicks `Next` / `Got It!`.
- **First-Run Autostart & Opt-Out Settings**: Automatically active on the user's first game with a "Don't show hints again" checkbox on the banner, as well as a toggle setting in local storage and the Rules/Settings UI to disable or re-enable coach mark hints anytime.
- **Persistence of Seen Events**: Saves completed coach mark step IDs into `StoredSettings` in `localStorage` so each hint triggers at most once.

## Capabilities

### New Capabilities
- `in-game-coach-marks`: Event-driven contextual banner coach marks with spotlight highlighting, pause controls, and persistence settings.

### Modified Capabilities
- `game-persistence`: Updates `StoredSettings` interface to persist `enableCoachMarks` boolean and `seenCoachMarkIds` array.

## Impact

- **UI Components**: Adds a new `CoachMarkBanner.tsx` component and spotlight overlay styling integrated into `GameShell.tsx` / `App.tsx`.
- **State Management**: Adds active coach mark state tracking and pause state handling into game loop / layout state.
- **Persistence**: Extends `StoredSettings` schema in `src/storage/persistence.ts`.
