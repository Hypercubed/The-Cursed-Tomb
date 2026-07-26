# Undo & Move History

## Purpose

Provides state tracking and undo capabilities for Pyramid Solitaire, allowing players to step backward through previous moves (pairings, draws, pile recycles) while updating board state, status, and persistent stats.

## ADDED Requirements

### Requirement: Game actions record previous state snapshots
The game engine SHALL record a snapshot of the prior `GameState` in a `history` array before applying any state-modifying action (`playCard`, `drawCard`, `cyclePile`).

#### Scenario: State-modifying move pushes previous state to history
- **WHEN** a valid card pair is played, a card is drawn, or the pile is cycled
- **THEN** a snapshot of the state prior to that move SHALL be appended to `history`

#### Scenario: Selection actions do not append to history
- **WHEN** a card is selected or deselected without triggering a pair removal or state mutation
- **THEN** `history` SHALL NOT be modified

### Requirement: Undo action restores previous state
The game engine SHALL expose an `undo(state)` function that pops the most recent state snapshot from `history` and restores the board, draw/discard piles, redraw counter, and win/loss status.

#### Scenario: Triggering undo reverts board state
- **WHEN** `undo(state)` is called and `history` contains at least one state snapshot
- **THEN** the returned game state SHALL equal the popped snapshot AND `history` length SHALL decrease by 1

#### Scenario: Triggering undo on empty history is a no-op
- **WHEN** `undo(state)` is called and `history` is empty
- **THEN** the game state SHALL be returned unchanged

### Requirement: UI provides Undo control and keyboard shortcut
The user interface SHALL render an Undo button in the game controls and listen for keyboard shortcuts (`Ctrl+Z` or `U`) to invoke the Undo action when available.

#### Scenario: Undo button state reflects history availability
- **WHEN** `history` contains one or more state snapshots
- **THEN** the Undo button SHALL be enabled AND pressing `Ctrl+Z` or `U` SHALL trigger `undo(state)`

#### Scenario: Undo button disabled when history is empty
- **WHEN** `history` is empty
- **THEN** the Undo button SHALL be disabled
