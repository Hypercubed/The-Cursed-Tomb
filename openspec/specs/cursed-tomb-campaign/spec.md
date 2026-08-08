# Cursed Tomb Campaign

## Purpose

Defines rules and mechanics for multi-round Cursed Tomb campaigns, including deck persistence, card mutations (attrition/scars/curses/blessings/anchors), lifecycle phases, trap mechanics, and campaign end conditions. This spec is the digital implementation source of truth and SHALL match the physical ruleset in `docs/rules.md`.

## Requirements
### Requirement: Persistent 52-card deck with mutation tracking
The campaign SHALL maintain a persistent master deck of 52 cards across multiple rounds, tracking their Attrition Stage (0-5: None, Vulnerable, Doubtful, Scar, Curse, Entombed), Reward Stage (0-2: None, Fortifying `[—]`, Anchored `[+]`), Blessed status (`[O]`), and Graveyard status.

#### Scenario: Card mutations persist into new rounds
- **WHEN** a round ends and a new round begins
- **THEN** cards dealt into the new pyramid SHALL retain all ink marks (Scars, Curses, Blessings, Anchors) earned in previous rounds

#### Scenario: Card mutations persist across debug autoplay resets
- **WHEN** a game reset or autoplay auto-start occurs during an active campaign
- **THEN** cards dealt into the active pyramid SHALL maintain all ink marks (Scars, Curses, Blessings, Anchors) from the campaign's master deck rather than resetting to a default 52-card deck

### Requirement: Functional Value scaling and Retrospective Anchors
The game SHALL calculate card pairing values dynamically, applying a +1 value shift for Red Scars (stage 3+ Hearts/Diamonds) and a -1 value shift for Black Scars (stage 3+ Spades/Clubs). Functional values SHALL wrap circularly between 1 (Ace) and 13 (King). An Anchor (`[+]`) SHALL prevent future attrition progression but SHALL NOT erase pre-existing Scars or Curses.

#### Scenario: Scarred Red card acts as higher value
- **WHEN** a Red card (e.g., ♥ Queen, printed rank 12) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 13 AND it can be cleared solo as a King

#### Scenario: Scarred Black card acts as lower value
- **WHEN** a Black card (e.g., ♠ 10, printed rank 10) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL be evaluated as 9

#### Scenario: Scarred Black Ace wraps circularly to 13
- **WHEN** a Black Ace (e.g., ♠ Ace, printed rank 1) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL wrap to 13 AND it SHALL be clearable solo as a King

#### Scenario: Scarred Red King wraps circularly to 1
- **WHEN** a Red King (e.g., ♥ King, printed rank 13) has Attrition Stage 3 or 4
- **THEN** its Functional Value SHALL wrap to 1 AND it SHALL be pairable with a Queen (functional value 12)

### Requirement: Attrition Phase on game freeze
When a round freezes (pyramid collapse), the campaign SHALL identify Bottlenecks (exposed cards at lowest remaining base tiers of the frozen pyramid) and increment their Attrition Stage by exactly one stroke unless they possess a completed Anchor (`[+]`). End-of-round attrition SHALL be applied strictly once per failed round. If a Blessed card advances to Attrition Stage 4, its rank SHALL receive the Stage 4 rank marking (slash over rank), but the Curse trap mechanics (Red face-down deal or Black weight partner reshuffle) and Curse drawing SHALL be skipped.

#### Scenario: Bottleneck card gains an attrition mark
- **WHEN** a round freezes AND an exposed pyramid card is not Anchored
- **THEN** its Attrition Stage SHALL increase by exactly 1 upon round completion
- **AND** advancing to the subsequent round SHALL NOT re-apply attrition for the already processed round

#### Scenario: Entombed card moves to Graveyard
- **WHEN** an attrition mark increases a card's Attrition Stage to 5
- **THEN** the card SHALL be permanently moved to the Graveyard Box AND SHALL NOT be dealt in future rounds

#### Scenario: Anchored card ignores attrition
- **WHEN** a round freezes AND a bottleneck card has a completed Anchor (`[+]`)
- **THEN** its Attrition Stage SHALL NOT be modified

#### Scenario: Blessed card taking Stage 4 Attrition skips Curse trap
- **WHEN** a card with a Blessing (`blessed === true`) at Stage 3 Scarred receives an attrition mark
- **THEN** its Attrition Stage SHALL increase to Stage 4 AND receive the Stage 4 rank marking (slash over rank)
- **THEN** the system SHALL skip the Curse trap effect (Red face-down deal or Black weight partner reshuffle)
- **THEN** the system SHALL skip the Curse icon drawing, retaining the Blessing power and Blessing icon on the card face
- **AND** a subsequent attrition mark SHALL advance the card to Stage 5 (Entombed)

### Requirement: Survival Reward Phase and Anchor Accumulation
When a round achieves a Pyramid Clear, the campaign SHALL evaluate the final visual transaction (Pair Clear or Solo King Clear) to assign rewards. Cards SHALL accumulate Anchor progress up until they are Entombed (Attrition Stage 5). If the higher-value Hero card is Stage 4 Cursed, the Blessing award SHALL be skipped. The Wildcard Partner Rule SHALL apply when the final pair contains an existing ♣ Clubs Universal Wildcard.

#### Scenario: Final pair clear grants Hero and Anchor
- **WHEN** a pair clears the final pyramid cards
- **THEN** the card with the higher functional value SHALL gain the Blessed status (`[O]`) AND the lower-value card SHALL increment its Reward Stage (`[—]` or `[+]`) provided its Attrition Stage is less than 5

#### Scenario: Solo King clear grants Anchor stroke
- **WHEN** a standalone King clears the final pyramid card
- **THEN** it SHALL increment its Reward Stage (`[—]` or `[+]`) provided its Attrition Stage is less than 5 AND no Hero's Blessing SHALL be awarded

#### Scenario: Final pair clear containing Wildcard designates partner as Hero
- **WHEN** a pair clears the final pyramid cards AND one card is an existing ♣ Clubs Universal Wildcard (`blessed === true` AND `suit === '♣'`)
- **THEN** the Wildcard card SHALL NOT receive a new blessing and SHALL automatically become the Anchor (incrementing its Reward Stage if Attrition Stage is less than 5) AND the partner card SHALL be designated as the Hero card (gaining its suit blessing illustration unless already blessed or Stage 4 Cursed)
- **AND WHEN** both cards in the final pair are existing ♣ Clubs Universal Wildcards
- **THEN** neither card SHALL receive a blessing AND one Wildcard SHALL receive the Anchor stroke

#### Scenario: Cursed card cleared as Hero skips Blessing award
- **WHEN** a round ends in victory AND the higher-value Hero card of the final cleared pair is Cursed (Stage 4 with active Curse effect)
- **THEN** the system SHALL skip the Blessing award (`blessed` remains `false`)
- **THEN** the card SHALL remain Cursed with its active Curse trap effect and Curse icon

### Requirement: Trap mechanics enforcement (Red and Black Curses)
The game SHALL enforce structural traps for Stage 4 Cursed cards as defined in `docs/rules.md` §4.

#### Scenario: Red Curse deals overlapping card face-down
- **WHEN** a card with a Red Curse (Attrition Stage 4, Red suit: ♥ or ♦, not blessed) is dealt into the pyramid
- **THEN** card(s) placed into the next lower row beneath it SHALL be dealt face-down AND SHALL flip face-up when they become exposed (playable) or via a ♠ Spades blessing
- **AND** the center-face icon SHALL be the Downward Triangle `▼` (trap door)

#### Scenario: Black Curse recycles partner weight into Stock
- **WHEN** a pair is cleared that includes a Black Cursed card (Attrition Stage 4, Black suit: ♠ or ♣, not blessed)
- **THEN** the Black Cursed card SHALL move to the Foundation stack AND the paired partner card SHALL be shuffled back into the face-down Stock draw pile instead of moving to the Foundation stack
- **AND** if both cards in the pair are Black Cursed, both cards SHALL be handled per above: each Cursed card moves to the Foundation and each partner is reshuffled to Stock (resulting in both partners returning to Stock)
- **AND** the center-face icon SHALL be the Trapezoid Weight `⏍` (heavy weight)

### Requirement: Suit Blessing powers
The game SHALL enforce the persistent powers of Hero Cards when cleared or exposed, as defined in `docs/rules.md` §6.

#### Scenario: Hearts Stock Reshuffle blessing
- **WHEN** a Blessed Hearts card (♥, blessed) is cleared
- **THEN** the game SHALL immediately shuffle all cards currently in the face-up Waste pile back into the face-down Stock draw pile without consuming a redeal

#### Scenario: Diamonds Vault blessing
- **WHEN** a Blessed Diamonds card (♦, blessed) is exposed on top of the Stock pile, on top of the Waste pile, OR is exposed in the Pyramid layout
- **THEN** the player MAY move it for free into the Diamond Vault slot by selecting the card and clicking the Diamond Vault slot (or via the vault action)
- **AND** multiple Blessed Diamonds MAY be stored in a First-In, Last-Out (FILO) stack; only the top (most recently vaulted) card MAY be paired and clearing it exposes the card beneath; Vaulted cards survive all subsequent Waste pile Redeals

#### Scenario: Spades Tunnel blessing
- **WHEN** a Blessed Spades card (♠, blessed) is cleared
- **THEN** the player SHALL select any one exposed card in the pyramid layout and the game SHALL move it directly onto the top of the face-up Waste pile

#### Scenario: Clubs Universal Wildcard blessing
- **WHEN** a Blessed Clubs card is paired with another exposed card
- **THEN** it SHALL legally pair with ANY exposed card regardless of the partner card's functional value (treating the combined sum as 13)

### Requirement: Resolution of Simultaneous End-States (Perfect Win priority)
When the final match that clears the entire deck and achieves a Perfect Win includes a card with a penalty effect (such as a Black Cursed card whose partner would normally be reshuffled to Stock), Victory SHALL take absolute priority.

#### Scenario: Perfect Win bypasses Black Curse penalty
- **WHEN** the final match that achieves a Perfect Win (all pyramid and Stock/Waste/Vault cards cleared) includes a Black Cursed card
- **THEN** the penalty reshuffle effect SHALL be bypassed AND both cards SHALL move to the Foundation AND the round SHALL be recorded as a Perfect Win

### Requirement: Campaign End & Audit Conditions (Starvation)
The campaign engine SHALL audit the active deck pool size between rounds at campaign reset. Starvation (fewer than 28 active cards remaining) SHALL be the sole mandatory defeat condition. There is no Volatile Collapse condition; the entombment of all cards of a single rank has no special mechanical significance and SHALL NOT trigger defeat or any advisory warning.

#### Scenario: Starvation condition triggers campaign defeat
- **WHEN** fewer than 28 active cards remain in the campaign pool at the start of a new round
- **THEN** the campaign SHALL end in instant defeat (Tomb Collapse) with `defeatReason === 'starvation'`
- **AND** the `CampaignEndModal` SHALL open displaying the starvation defeat reason

### Requirement: Endless Campaign Continuation Past Accomplishments
The campaign engine SHALL allow players to continue playing new rounds indefinitely after achieving Perfect Wins or Rank-Anchor accomplishments.

#### Scenario: Campaign continues after Perfect Win
- **WHEN** a round ends in a Perfect Win (all 52 cards cleared)
- **THEN** the game SHALL record a Perfect Win accomplishment badge
- **AND** the campaign SHALL prompt the player to continue to the next round with their persistent master deck

#### Scenario: Campaign continues after Rank-Anchor Accomplishment
- **WHEN** at least 1 card of each printed rank (13 total) becomes Anchored (`rewardStage === 2`, `[+]`)
- **THEN** the game SHALL record a Rank-Anchor accomplishment badge
- **AND** the campaign SHALL prompt the player to continue playing subsequent rounds
