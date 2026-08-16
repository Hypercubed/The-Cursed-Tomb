## MODIFIED Requirements

### Requirement: Persistent 52-card deck with mutation tracking
The campaign SHALL maintain a persistent master deck of 52 cards across multiple rounds, tracking their Scar count (0–5: None, Vulnerable `|7`, Scarred `|7\\|8`, Cursed `|7X|8`, Imperiled `|7X|8`, Entombed `X`), Anchor/Shield stage (0–2: None, Fortified `—`, Shield `+` with 4 blocks), Blessed status, and Graveyard status.

#### Scenario: Card mutations persist into new rounds
- **WHEN** a round ends and a new round begins
- **THEN** cards dealt into the new pyramid SHALL retain all ink marks (Scars, Shield blocks, Blessings, Anchors) earned in previous rounds

#### Scenario: Card mutations persist across debug autoplay resets
- **WHEN** a game reset or autoplay auto-start occurs during an active campaign
- **THEN** cards dealt into the active pyramid SHALL maintain all ink marks (Scars, Shield blocks, Blessings, Anchors) from the campaign's master deck rather than resetting to a default 52-card deck

### Requirement: Functional Value scaling and Retrospective Anchors
The game SHALL calculate card pairing values dynamically, applying a +1 value shift for Red at 2+ Scars (Hearts/Diamonds) and a -1 shift for Black at 2+ Scars (Spades/Clubs). Functional values SHALL wrap circularly between 1 (Ace) and 13 (King). A Shield (`+`) SHALL prevent Scar progression by absorbing Scars as red blocks, but SHALL NOT erase pre-existing Scars or Curses.

#### Scenario: Scarred Red card acts as higher value
- **WHEN** a Red card (e.g., ♥ Queen, printed rank 12) has 2+ Scars
- **THEN** its Functional Value SHALL be evaluated as 13 AND it can be cleared solo as a King

#### Scenario: Scarred Black card acts as lower value
- **WHEN** a Black card (e.g., ♠ 10, printed rank 10) has 2+ Scars
- **THEN** its Functional Value SHALL be evaluated as 9

#### Scenario: Scarred Black Ace wraps circularly to 13
- **WHEN** a Black Ace (e.g., ♠ Ace, printed rank 1) has 2+ Scars
- **THEN** its Functional Value SHALL wrap to 13 AND it SHALL be clearable solo as a King

#### Scenario: Scarred Red King wraps circularly to 1
- **WHEN** a Red King (e.g., ♥ King, printed rank 13) has 2+ Scars
- **THEN** its Functional Value SHALL wrap to 1 AND it SHALL be pairable with a Queen (functional value 12)

### Requirement: Attrition Phase on game freeze
When a round freezes (pyramid collapse), the campaign SHALL identify Bottlenecks (exposed cards at lowest remaining base tiers of the frozen pyramid). Each bottleneck gains **one red Scar** in the Upper-Left index. Five Scars = Entombed. A completed **Shield** (`+`, 2 Anchors) contains **4 Scar absorption blocks**; each Scare that would advance the Scar track SHALL instead fill one red block in a quadrant around the `+`. On the 4th block the Shield SHALL exhaust (`rewardStage → 0`, `anchorAbsorption = 0`), preserving Scars. If a Blessed card with 2 Scars (Scarred) receives a mark it SHALL become 3 Scars Cursed, but the Curse trap mechanics and Cursed icon SHALL be skipped (blessing retained), and the rank SHALL show the Cursed `X` mark. Five Scars SHALL entomb the card to the Graveyard. No defacement: all prior ink remains if later resurrected.

#### Scenario: Bottleneck card gains a Scar
- **WHEN** a round freezes AND an exposed pyramid card is not Shielded (`rewardStage < 2`)
- **THEN** its Scar count (`attritionStage`) SHALL increase by exactly 1 upon round completion (1: `|7` → 2: `|7\\|8` → 3: `|7X|8` → 4: `|7X|8` → 5: `X`)
- **AND** advancing to the subsequent round SHALL NOT re-apply attrition for the already processed round

#### Scenario: Entombed card moves to Graveyard
- **WHEN** a Scar increases a card to 5 Scars
- **THEN** the card SHALL be placed in the Graveyard Box AND SHALL NOT be dealt in future rounds until possibly returned by a Perfect Win (§7)

#### Scenario: Shield absorbs freeze hit up to max capacity
- **WHEN** a round freezes AND an exposed bottleneck card has a completed Shield (`rewardStage === 2` and `anchorAbsorption < 3`)
- **THEN** its `anchorAbsorption` count SHALL increase by 1
- **AND** its Scar count SHALL NOT be modified
- **AND** its `rewardStage` SHALL remain at 2

#### Scenario: Shield breaks on 4th absorption hit
- **WHEN** a round freezes AND an exposed bottleneck card has a completed Shield with `anchorAbsorption === 4`
- **THEN** its `rewardStage` SHALL be reset to 0
- **AND** its Scar count SHALL NOT be reset (retaining current Scars)

#### Scenario: Blessed card taking 3rd Scar skips Curse trap
- **WHEN** a card with a Blessing (`blessed === true`) at 2 Scars (Scarred) receives another Scar
- **THEN** its Scar count SHALL increase to 3 Scars AND receive the Cursed `X` rank marking
- **THEN** the system SHALL skip the Curse trap effect (Red face-down deal or Black weight partner reshuffle)
- **THEN** the system SHALL skip the Curse icon drawing, retaining the Blessing icon
- **AND** a subsequent Scar SHALL advance the card to 4 Scars (Imperiled, still Cursed-icon-suppressed), and another to 5 Scars Entombed

### Requirement: Survival Reward Phase and Anchor Accumulation
When a round achieves a Win (Pyramid Clear or Perfect Win), the campaign SHALL evaluate the final visual transaction (Pair Clear or Solo King Clear) to assign rewards under the **Scar 2/3/5 + random Stock Bounty** rules. Cards SHALL accumulate Anchors until Entombed (5 Scars). Blessing SHALL be offered first to the higher-value card of the final pair if eligible (<3 Scars and not already blessed); if ineligible, offer to the lower card if eligible; if both ineligible, no Blessing. The lower card SHALL NOT automatically gain an Anchor; Anchors come solely from the Stock Bounty random draw (N=1–3, draw-until-non-Shield). The Wildcard Partner Rule SHALL apply when the final pair contains an existing ♣ Clubs Universal Wildcard (wildcard ineligible as primary, only as fallback lower candidate).

#### Scenario: Final pair clear grants Blessing with fallback
- **WHEN** a pair clears the final pyramid cards AND the higher-value card is not already blessed AND has <3 Scars
- **THEN** that card SHALL gain Blessed status
- **AND WHEN** the higher-value card is already blessed or has 3+ Scars (Cursed/Imperiled)
- **THEN** the Blessing SHALL be offered to the lower-value card if that card is not already blessed AND has <3 Scars
- **AND WHEN** both cards are ineligible (both already blessed or both 3+ Scars)
- **THEN** no Blessing SHALL be awarded

#### Scenario: Final pair clear containing Wildcard designates partner as Hero
- **WHEN** a pair clears the final pyramid cards AND one card is an existing ♣ Clubs Universal Wildcard (`blessed === true` AND `suit === '♣'`)
- **THEN** the Wildcard card SHALL be ineligible as the primary Blessing candidate AND only be considered as the fallback lower candidate (which will fail if both are Wildcards) AND the partner card SHALL be the primary candidate

#### Scenario: Solo King clear grants Stock Bounty only
- **WHEN** a standalone King clears the final pyramid card
- **THEN** no Hero's Blessing SHALL be awarded AND the Stock Bounty random draw (N=1–3) SHALL still be applied

### Requirement: Trap mechanics enforcement (Red and Black Curses)
The game SHALL enforce structural traps for 3–4 Scar Cursed cards as defined in `docs/rules.md` §4.

#### Scenario: Red Curse deals overlapping card face-down
- **WHEN** a card with a Red Curse (3–4 Scars, Red suit: ♥ or ♦, not blessed) is dealt into the pyramid
- **THEN** card(s) placed into the next lower row beneath it SHALL be dealt face-down AND SHALL flip face-up when they become exposed (playable) or via a ♠ Spades blessing
- **AND** the center-face icon SHALL be the Downward Triangle `▼` (trap door)

#### Scenario: Black Curse recycles partner weight into Stock
- **WHEN** a pair is cleared that includes a Black Cursed card (3–4 Scars, Black suit: ♠ or ♣, not blessed)
- **THEN** the Black Cursed card SHALL move to the Foundation stack AND the paired partner card SHALL be shuffled back into the face-down Stock draw pile instead of moving to the Foundation stack
- **AND** if both cards in the pair are Black Cursed, both cards SHALL be handled per above: each Cursed card moves to the Foundation and each partner is reshuffled to Stock
- **AND** the center-face icon SHALL be the Trapezoid Weight `⏍` (heavy weight)

### Requirement: Perfect Win Graveyard Return
On a Perfect Win only (0 leftover, all Stock+Waste+Vault cleared), after §6 Survival Rewards and the Stock Bounty, the game SHALL shuffle the Graveyard Box face-down, draw one random Entombed `X` card if any, and return it to the active deck as **4 Scars `|7X|8` Imperiled** (still Cursed, still shifted; all prior ink including Anchors/Blessing retained), one Scar from death. If the Graveyard is empty, no return SHALL occur. This is the sole way an `X` Entombed card re-enters play.

#### Scenario: Perfect Win returns one Entombed card
- **WHEN** a round ends in a Perfect Win AND at least one card is in the Graveyard
- **THEN** one random Entombed card SHALL be moved from the Graveyard to the active pool with `attritionStage = 4` (`|7X|` Imperiled, still Cursed)

#### Scenario: Perfect Win with empty Graveyard returns nothing
- **WHEN** a round ends in a Perfect Win AND the Graveyard is empty
- **THEN** no card movement SHALL occur
