# Stock Bounty

## Purpose

Rewards Stock depletion after every Win with additive random Anchors so Stock-efficient play builds Shields, while keeping marks permanently additive and covering solo King clears.

## Requirements

### Requirement: Stock Bounty 1–3 random Anchors per Win
Every **Win** (Pyramid Clear or Perfect Win) SHALL grant `N = 1–3` blue Anchors via random draw: `N=3` if `leftover = Stock+Waste+Vault` is `0` (Perfect) or `≤4`; `N=2` if `≤8`; else `N=1` mandatory. Leftover is counted by fanning piles face-up at the moment the pyramid hits 0.

#### Scenario: Perfect Win grants 3 Anchors
- **WHEN** a Win ends with `leftover = 0`
- **THEN** `N` SHALL be `3`

#### Scenario: Efficient Win grants 2 Anchors
- **WHEN** a Win ends with `leftover = 6`
- **THEN** `N` SHALL be `2`

#### Scenario: Inefficient Win grants 1 Anchor
- **WHEN** a Win ends with `leftover = 18`
- **THEN** `N` SHALL be `1`

### Requirement: Random draw until N non-Shields
To award Anchors, the game SHALL shuffle the **remaining active deck** (`attritionStage < 5`) face-down and flip cards one-by-one until `N` cards that are *not* already a Shield (`rewardStage < 2`, i.e. not `+`) have been found. Each such card SHALL gain one blue Anchor (`—` → `+`, Shield with 0 blocks). If a flipped card is already a Shield (`+`), it SHALL be skipped and flipping continues (no-op on `+`, never waste the bounty). If the pool runs out of non-Shield cards, awarding SHALL stop with `<N` Anchors. Solo K/13 clears SHALL also grant this bounty (no Blessing case).

#### Scenario: Draw skips existing Shields
- **WHEN** a flipped active card already has `rewardStage === 2` (`+`)
- **THEN** it SHALL NOT gain another Anchor AND flipping SHALL continue until a non-Shield is found or the pool is exhausted

#### Scenario: Solo King clear still grants Stock Bounty
- **WHEN** the final clear is a solo King with `leftover = 12`
- **THEN** `N` SHALL be `1` AND one random non-Shield active card SHALL gain an Anchor

### Requirement: Stock Bounty replaces lower-card Anchor
The deterministic lower-value card Anchor from the final pair (§6 A lower) SHALL be **removed**. Anchors SHALL be awarded *only* via the Stock Bounty random draw; the base `1B+1A` becomes `1B + 1–3 random`. Solo clears follow the same bounty.

#### Scenario: Lower card does not get automatic Anchor
- **WHEN** a pair clears the final pyramid cards
- **THEN** the lower-value card SHALL NOT automatically gain an Anchor; Anchors SHALL come solely from the Stock Bounty draw
