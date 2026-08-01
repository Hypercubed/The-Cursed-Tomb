## Context

The current ruleset in `docs/rules.md` and simulation implementation in `sim/cursed_tomb_sim.py` clamp card functional value shifts between 1 and 13, and provide suit blessings that are either physically awkward in tabletop play (Hearts Martyr temporary round immunity) or underpowered early in campaigns (Clubs Equalizer).

Simulation and design exploration confirmed that replacing Hearts with **Resurrection** (random draw from Graveyard Box back into active pool as Cursed), Clubs with **Universal Wildcard** (pairs with any exposed card to total 13), and switching to **Circular $A \leftrightarrow K$ Value Shifts** produces a highly engaging, balanced campaign experience (20.3% win rate on Normal / 37.4% on Easy with ~250-320 rounds per campaign).

## Goals / Non-Goals

**Goals:**
- Update rule descriptions in `docs/rules.md` for Hearts Resurrection, Clubs Universal Wildcard, and Circular $A \leftrightarrow K$ Value Shifts.
- Update `sim/cursed_tomb_sim.py` simulation engine to reflect the updated mechanics and default parameters.
- Update web application components and state logic to support random Graveyard Resurrection, Universal Clubs Wildcard pairing, and circular rank calculations.

**Non-Goals:**
- Changing Diamonds Vault or Spades Tunnel core mechanics (both remain in their current form).
- Modifying Attrition Track stages (0 to 5) or campaign setup constraints (28-card pyramid layout).

## Decisions

### 1. Hearts Resurrection (Random Draw from Graveyard Box)
- **Decision:** When a Hearts Hero is cleared, draw 1 **random** card from the Graveyard Box container and add it back to the active deck pool as **Stage 4 (Cursed)**.
- **Rationale:** Random draw creates an exciting tabletop "mystery pull" moment and clean digital UI animation. Reviving as Cursed (Stage 4) honors physical pen-and-paper rules (ink marks cannot be un-drawn). If the Graveyard Box is empty, clearing a Hearts Hero does nothing.
- **Alternatives Considered:**
  - *Player Choice of Revived Card:* Adds unnecessary mental slowdown during live tabletop play.
  - *Full Restoration to Stage 0:* Violates physical ink permanence constraint.
  - *Fallback Scar Cleansing:* Adds extra edge-case rules when Graveyard Box is empty; keeping it simple ("no action if empty") is cleaner for players to remember.

### 2. Clubs Universal Wildcard
- **Decision:** A Clubs Hero card can pair with **ANY exposed card** to clear both cards (treating the sum as 13).
- **Rationale:** Straightforward to calculate in live play (no mental arithmetic required). Gives players a high-impact tactical wildcard tool.
- **Alternatives Considered:**
  - *Original Equalizer (Ignore Scars):* Offers 0 mechanical value in early campaign rounds before scars exist.

### 3. Circular $A \leftrightarrow K$ Value Shifts
- **Decision:** Functional value shifts use modulo arithmetic: $1 \dots 13$. A Red Scar (+1) on a King (13) becomes an Ace (1). A Black Scar (-1) on an Ace (1) becomes a King (13), allowing a Black-Scarred Ace to clear solo.
- **Rationale:** Eliminates value dead-ends at 1 and 13. Intuitive on pen and paper (`|A\| 13` physically converts an Ace to a King).
- **Alternatives Considered:**
  - *Clamping at 1 and 13:* Creates useless scar marks when Ace gets -1 or King gets +1.

## Risks / Trade-offs

- **[Risk]** Universal Clubs Wildcards might be used greedily on low-value pairs.
  - **Mitigation:** The AI simulator and UI will prioritize exposed layout unblocking scores when selecting pairs.
- **[Risk]** Reviving Stage 4 cards might dilute the deck with cursed cards.
  - **Mitigation:** Adding active cards back into the pool prevents Starvation Collapse, extending campaign lifespan.
