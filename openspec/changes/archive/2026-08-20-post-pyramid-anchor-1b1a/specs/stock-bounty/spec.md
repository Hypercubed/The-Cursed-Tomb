## REMOVED Requirements

### Requirement: Stock Bounty 1–3 random Anchors per Win
**Reason**: Replaced by deterministic `1B+1A + post-pyramid` — avoids whole-deck shuffle and `N` tiers. Post-pyramid Anchors are `0-3` per Win, averaging `0.6` pairs.
**Migration**: Use `cursed-tomb-campaign` Survival Reward Phase post-pyramid Anchors instead of leftover-tier `N`.

### Requirement: Random draw until N non-Shields
**Reason**: Draw-until-non-Shield from active deck required shuffling 52 and flipping until `N` non-`+`. Replaced by in-hand post-pyramid cards getting Anchored directly.
**Migration**: No shuffled deck draw. Anchors are applied to the actual Stock/Waste/Vault cards cleared post-pyramid.

### Requirement: Stock Bounty replaces lower-card Anchor
**Reason**: Lower-card Anchor is restored. Base becomes `1B+1A` plus post-pyramid, not `1B + N random`.
**Migration**: Lower card of final pyramid pair again gains one Anchor; Anchors no longer come solely from random draw.

## ADDED Requirements

### Requirement: Post-pyramid Stock Anchor Source
Every card cleared **after the pyramid hits 0** (Stock-Waste pairs, Stock solo `K`, Waste/Vault solo `K` or pairs via `Stock-Waste`/`Waste`) SHALL each gain one blue Anchor (`—` → `+`, 0 blocks) before Foundation. `0` post-pyramid pairs → `0` post Anchors for that Win. Anchors remain addictive Shield blocks (`+` has 4 Scar absorbs). Vault top participates like Waste.

#### Scenario: Post-pyramid Stock-Waste pair both Anchored
- **WHEN** a post-pyramid Stock-Waste pair clears `5♥+8♣` after pyramid empty
- **THEN** both the Stock `5♥` AND the Waste `8♣` SHALL each gain one Anchor before Foundation

#### Scenario: Post-pyramid solo King Anchored
- **WHEN** a post-pyramid Stock or Waste solo `K` clears after pyramid empty
- **THEN** that `K` card SHALL gain one Anchor

#### Scenario: No post-pyramid cards means no post Anchors
- **WHEN** the Stock phase after pyramid empty yields `0` clears
- **THEN** no post-pyramid Anchors SHALL be awarded for that Win
