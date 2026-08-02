# Keyboard Shortcuts

## Purpose

Provides hotkey navigation and actions for core game controls including drawing, pile cycling, card selection clearing, and game resets.

## Requirements

### Requirement: Global key bindings for game actions
The application SHALL listen for global keydown events during active gameplay to execute corresponding actions.

#### Scenario: Pressing Space or D draws or cycles stock
- **WHEN** the player presses `Space` or `d`/`D` while an active game is in progress
- **THEN** the top draw card SHALL move to the discard pile (or cycle the pile if draw pile is empty)

#### Scenario: Pressing Escape clears active card selection
- **WHEN** a card is selected AND the player presses `Escape`
- **THEN** `selectedCardId` SHALL be cleared to `null`

#### Scenario: Pressing N triggers new game / reset prompt
- **WHEN** the player presses `n`/`N`
- **THEN** the Reset Confirmation Modal SHALL open

#### Scenario: Keyboard shortcuts ignored when typing in input fields
- **WHEN** an input field or text area has focus AND a shortcut key is pressed
- **THEN** the game action SHALL NOT trigger
