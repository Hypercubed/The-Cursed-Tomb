## MODIFIED Requirements

### Requirement: Survival Reward Phase and Anchor Accumulation
When a round achieves a Win (Pyramid Clear or Perfect Win), the campaign SHALL evaluate the final visual transaction (Pair Clear or Solo King Clear) to assign rewards under the **Scar 2/3/5 + 1B+1A + post-pyramid** rules. Cards SHALL accumulate Anchors until Entombed (5 Scars). Blessing SHALL be offered first to the higher-value card of the final pair if eligible (<3 Scars and not already blessed); if ineligible, offer to the lower card if eligible; if both ineligible, no Blessing. **The lower card of the final pyramid pair SHALL gain one Anchor (`—` Fortified → `+` Shield with 0 blocks) regardless of eligibility for Blessing. Solo King clears SHALL also gain one Anchor.** After the pyramid hits 0, the round SHALL continue pairing `Stock+Waste+Vault` (using remaining redeals) until no moves remain; **every card cleared in this post-pyramid Stock phase SHALL gain one Anchor (`—` → `+`)** — both cards of a `Stock-Waste` or `Stock-Pyramid` pair, the Stock `K` solo, or the `Waste/Vault` solo `K` / pair with Waste/Vault. There is no `N=1–3` leftover-tier draw and no `draw-until-non-Shield` from the active deck. The Wildcard Partner Rule SHALL still apply when the final pair contains an existing ♣ Clubs Universal Wildcard (wildcard ineligible as primary, only as fallback lower candidate).

#### Scenario: Final pair clear grants Blessing with fallback and lower Anchor
- **WHEN** a pair clears the final pyramid cards AND the higher-value card is not already blessed AND has <3 Scars
- **THEN** that card SHALL gain Blessed status AND the lower-value card SHALL gain one Anchor (`rewardStage` +1, capping at `+`)
- **AND WHEN** the higher-value card is already blessed or has 3+ Scars
- **THEN** the Blessing SHALL be offered to the lower-value card if eligible AND the lower-value card SHALL still gain one Anchor
- **AND WHEN** both cards are ineligible for Blessing
- **THEN** no Blessing SHALL be awarded AND the lower-value card SHALL still gain one Anchor

#### Scenario: Final pair clear containing Wildcard designates partner as Hero and Anchors lower
- **WHEN** a pair clears the final pyramid cards AND one card is an existing ♣ Clubs Universal Wildcard (`blessed === true` AND `suit === '♣'`)
- **THEN** the Wildcard card SHALL be ineligible as the primary Blessing candidate AND only be considered as the fallback lower candidate AND the partner card SHALL be the primary candidate AND the lower-value card (whichever card is lower by Functional Value) SHALL still gain one Anchor

#### Scenario: Solo King clear grants one Anchor
- **WHEN** a standalone King clears the final pyramid card
- **THEN** no Hero's Blessing SHALL be awarded AND the King card SHALL gain one Anchor (`—` → `+`)

#### Scenario: Post-pyramid pair gives Anchors
- **WHEN** the pyramid is already empty AND a Stock card pairs with a Waste/Vault card (`stock_waste`) and both are removed to Foundation
- **THEN** both cards SHALL each gain one Anchor (`—` → `+`) before being placed in Foundation (counted next campaign)
- **AND WHEN** a Stock or Waste/Vault solo `K` clears after pyramid empty
- **THEN** that solo card SHALL gain one Anchor

#### Scenario: Post-pyramid phase continues with redeals
- **WHEN** the pyramid is empty AND `Stock+Waste+Vault` remain AND legal moves or redeals exist
- **THEN** the round SHALL continue drawing/pairing Stock/Waste until no moves and no redeals remain before awarding Survival Rewards as complete
- **AND WHEN** the post-pyramid Stock phase clears 0 pairs
- **THEN** no post-pyramid Anchors SHALL be awarded (total for the Win is just the final-pair `1B+1A`)
