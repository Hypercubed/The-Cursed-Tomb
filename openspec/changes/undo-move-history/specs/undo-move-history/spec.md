# Undo & Move History

## Purpose

Provides move history tracking and time-travel capabilities (Undo and Redo) scoped to the Debug Panel, allowing developers and testers to step backward and forward through moves during testing.

## ADDED Requirements

### Requirement: Game actions record state snapshots for Undo and Redo
The game engine SHALL append a snapshot of the prior `GameState` to `history` and clear `future` whenever a state-modifying action (`playCard`, `drawCard`, `cyclePile`) is executed.

#### Scenario: State-modifying move updates history and resets future
- **WHEN** a valid card pair is played, a card is drawn, or the pile is cycled
- **THEN** a snapshot of the prior state SHALL be appended to `history` AND `future` SHALL be set to `[]`

#### Scenario: Selection actions do not modify history or future
- **WHEN** a card is selected or deselected without changing board state
- **THEN** neither `history` nor `future` SHALL be modified

### Requirement: Undo action restores previous state
The game engine SHALL expose an `undo(state)` function that pops the latest snapshot from `history`, pushes the current state onto `future`, and returns the restored state.

#### Scenario: Triggering undo reverts state and enables redo
- **WHEN** `undo(state)` is called and `history` contains at least one state
- **THEN** the returned state SHALL equal the popped history snapshot AND the current state SHALL be appended to `future`

#### Scenario: Triggering undo on empty history is a no-op
- **WHEN** `undo(state)` is called and `history` is empty
- **THEN** the game state SHALL be returned unchanged

### Requirement: Redo action re-applies undone state
The game engine SHALL expose a `redo(state)` function that pops the latest state from `future`, pushes the current state onto `history`, and returns the restored state.

#### Scenario: Triggering redo advances state
- **WHEN** `redo(state)` is called and `future` contains at least one state
- **THEN** the returned state SHALL equal the popped future snapshot AND the current state SHALL be appended to `history`

#### Scenario: Triggering redo on empty future is a no-op
- **WHEN** `redo(state)` is called and `future` is empty
- **THEN** the game state SHALL be returned unchanged

### Requirement: Debug Panel provides Undo and Redo controls
The `DebugPanel` component SHALL render Undo and Redo buttons whose enabled states reflect `history` and `future` availability.

#### Scenario: Debug Panel button states reflect history and future availability
- **WHEN** the `DebugPanel` is rendered
- **THEN** the Undo button SHALL be enabled IF `history` is not empty
- **AND** the Redo button SHALL be enabled IF `future` is not empty

#### Scenario: Undo/Redo is restricted to Debug Panel
- **WHEN** viewing the standard player interface outside the Debug Panel
- **THEN** no Undo/Redo buttons SHALL be rendered AND no global `Ctrl+Z` shortcuts SHALL be registered
