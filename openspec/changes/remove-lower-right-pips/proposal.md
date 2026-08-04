## Why

In physical card games, dual corner indices (top-left and bottom-right) enable players holding a fan of cards in either hand or from any angle to read rank and suit. In the digital version of *The Cursed Tomb*, cards are always rendered right-side up on screen and often overlap vertically in the pyramid deck layout. Retaining the bottom-right corner pip adds unnecessary visual clutter, consumes valuable vertical card space, and creates visual noise near overlapping card borders. Eliminating the bottom-right corner pip cleans up card presentation and streamlines legibility across viewports.

## What Changes

- Remove the bottom-right rank, suit, scar/curse, and blessing corner index pip from playing card rendering.
- Maintain the top-left index area as the sole primary index for card rank, suit, scars, curses, and blessings (with top-right reserved for anchor immunity badges and centre space for standard suit graphics).
- Update the `card-rendering` specification requirements and scenarios to remove the mirrored bottom-right corner pip mandate.
- Refactor card layout components (`PlayingCard.tsx`) to remove bottom-right index elements and styles.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Modify corner index requirements to eliminate bottom-right corner pips and mandate single-index corner rendering in top-left.

## Impact

- **Frontend Components**: `PlayingCard.tsx` and associated CSS/styling.
- **Specifications**: `openspec/specs/card-rendering/spec.md` updated via delta spec in this change.
- **Tests**: Any rendering/snapshot unit tests that expect bottom-right index elements.
