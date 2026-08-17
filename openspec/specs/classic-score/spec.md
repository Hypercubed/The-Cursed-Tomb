# Classic Score

## Purpose

Provides pass-weighted classic Pyramid scoring adapted to The Cursed Tomb so Wins, difficulty, and Stock depletion can be compared on one scale and mapped to Stock Bounty stars.

## Requirements

### Requirement: Classic pass-weighted scoring
The campaign SHALL calculate a Classic Score for every round as `classic_score = base(pass) - leftover`, where `leftover = remaining pyramid cards + remaining Stock+Waste+Vault` at round end (0 = Perfect Win). `base = 50` if pyramid cleared on pass 1, `35` on pass 2, `20` on pass 3, `10` beyond 3 (Novice infinite), `0` if pyramid not cleared. Higher is better; freezes are negative. Helpers `classic_base_score(pass, cleared)` and `classic_score(pass, cleared, leftover)` SHALL be available in `sim/cursed_tomb_sim.py` and re-exported via `deck_evolution_core`.

#### Scenario: Perfect on pass 1 scores 50
- **WHEN** a round ends in a Perfect Win on the first stock pass AND `leftover = 0`
- **THEN** Classic Score SHALL be `50 - 0 = 50`

#### Scenario: Pyramid clear on pass 2 with stock leftover
- **WHEN** a round ends in a Pyramid Clear on the second pass AND `leftover = 6`
- **THEN** Classic Score SHALL be `35 - 6 = 29`

#### Scenario: Freeze scores negative
- **WHEN** a round freezes with `pyramid not cleared` AND `leftover = 30`
- **THEN** Classic Score SHALL be `0 - 30 = -30`

### Requirement: Classic star mapping for Stock Bounty
The Stock Bounty star rating SHALL map Classic Score thresholds to Anchor counts: `≥40 → 3★`, `≥25 → 2★`, `≥12 → 1★`, else `0★`. This mapping SHALL match the Stock Bounty `≤4→3, ≤8→2, else 1` anchor ladder (Perfect `0` always 3★). `classic_bonus_stars(leftover, pass, cleared)` SHALL implement it.

#### Scenario: Star mapping for efficient clear
- **WHEN** Classic Score for a cleared round is `42`
- **THEN** star rating SHALL be `3`

#### Scenario: Star mapping for inefficient clear
- **WHEN** Classic Score for a cleared round is `10`
- **THEN** star rating SHALL be `0`
