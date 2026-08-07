## 1. DrawZone Component Updates

- [x] 1.1 Add `discardPileCount: number` to `DrawZoneProps` in `DrawZone.tsx`.
- [x] 1.2 Update Stock header in `DrawZone.tsx` to display Stock card count badge (`drawPileCount`).
- [x] 1.3 Update Waste header in `DrawZone.tsx` to display Waste card count badge (`discardPileCount`).
- [x] 1.4 Update Vault header in `DrawZone.tsx` to display Vault stored card count capacity badge (`vaultCard ? 1 : 0` / `1/1`).

## 2. App Integration & Props

- [x] 2.1 Update `<DrawZone />` invocation in `App.tsx` to pass `discardPileCount={game.discardPile.length}`.

## 3. Verification

- [x] 3.1 Run tests (`npm test` / `vitest`) to ensure no regressions in game layout and draw zone tests.
