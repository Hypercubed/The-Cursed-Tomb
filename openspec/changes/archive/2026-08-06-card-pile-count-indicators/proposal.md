## Why

Players currently cannot easily see how many cards remain in the Stock or Waste piles, or whether the Vault holds a card. Adding card count indicators to Stock, Waste, and Vault gives players better tactical awareness and visibility into their remaining deck reserves during play.

## What Changes

- Add card count badge indicator to the Stock pile slot in `DrawZone`.
- Add card count badge indicator to the Waste pile slot in `DrawZone`.
- Add card count/capacity badge indicator to the Vault slot in `DrawZone` (in Cursed Tomb mode).
- Pass `discardPileCount` from `App.tsx` down into `DrawZone.tsx`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `game-layout`: Update Draw & Waste pile slot requirements to mandate displaying visible card count indicators for Stock, Waste, and Vault piles.

## Impact

- `src/components/DrawZone.tsx`: Modified props and rendering logic to include count badges.
- `src/App.tsx`: Updated `DrawZone` usage to pass `discardPileCount`.
