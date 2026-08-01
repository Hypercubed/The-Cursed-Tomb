# The Cursed Tomb (Official Ruleset v0.0.9)

A persistent, mutating tactical card game played with a standard 52-card deck and a permanent fine-tip marker. 

---

## ── 1. EXPEDITION OBJECTIVE & FAILURE CONDITIONS ──
Your ultimate goal is to achieve a single **Perfect Win**—completely moving all 52 cards of the deck into the face-up **Foundation pile**. 

*Note: This requirement is significantly more challenging than standard Pyramid Solitaire rulesets that only require a cleared layout. Every single card in the deck pool must find a partner or match to empty both the layout and the stock.*

### The Tomb Collapses (Campaign End Conditions)
The campaign ends in instant defeat if the tomb collapses. The tomb collapses the moment **either** of the following conditions is met:

1.  **Starvation Condition (Mandatory):** At the start of a new round, you do not have enough active cards remaining in your pool to build a full 28-card pyramid layout.
2.  **Volatile Collapse Condition (Optional / Variant):** All four physical cards sharing the exact same Printed Rank (e.g., all four 5s, or all four Aces) reside inside the Graveyard Box. *Include this rule if you want a faster, highly volatile threat hanging over specific numbers.*

---

## ── 2. CORE DEFINITIONS & ZONE STATE TERMINOLOGY ──
*   **Printed Rank:** The immutable, original value printed on the card face (A, 2–10, J, Q, K). This value never changes. The Tomb-Collapse condition and all deck auditing steps look *only* at the Printed Rank.
*   **Functional Value:** The temporary mathematical value used during gameplay calculations. This value is dynamic, altered exclusively by Upper-Right **Scars `[ N ]`** (+1 for Red, -1 for Black).
*   **Exposed Card:** A card in the pyramid layout that has no other cards physically overlapping or underpinning it from the row below. Only exposed cards can be paired or cleared.
*   **The Stock:** The face-down draw pile.
*   **The Waste:** The face-up pile where cards flipped from the Stock land.
*   **The Foundation:** The separate, face-up destination pile where successfully paired and cleared cards are placed. **Cards in the Foundation are completely inert trophies;** they cannot be targeted, moved, or interacted with by any special rules or blessings for the remainder of the game.
*   **The Vault (Diamond Blessing):** A separate holding area beside the table, distinct from the Foundation. When a ♦ Diamond card with the Fallen Hero blessing (circled suit symbol) is exposed on the Waste pile or the Pyramid layout, it may be **instantly and freely** placed face-up into the Vault without spending an action. A Pyramid Diamond placed in the Vault unblocks the cards beneath it as if it were cleared. The Vaulted card survives all subsequent Waste pile Redeals for the duration of the game and may be paired normally from the Vault at any future point.
*   **The Graveyard Box:** A separate physical container used to hold dead cards. Cards in the Graveyard Box are permanently removed from the deck pool for the remainder of the campaign.

---

## ── 3. PREPARATION & DIFFICULTY ──
Before beginning the campaign, select your global difficulty setting. This dictates how many times you are allowed to cycle through the Waste Pile per game:

*   **Novice (Tutorial / Sandbox Mode):** Unlimited Redeals allowed. This mode provides a relaxed environment to learn the mutation behaviors, turning the game into a pure puzzle-solver rather than a high-stakes legacy run.
*   **Explorer (Easy):** 2 Redeals allowed (3 total passes through the Stock deck).
*   **Archaeologist (Normal):** 1 Redeal allowed (2 total passes through the Stock deck).
*   **Survivalist (Hard):** 0 Redeals allowed (1 single pass through the Stock deck).

### Spatial Layout & Ink Zones
Ink modifications must be strictly confined to distinct visual zones:
*   **Upper-Left Corner Index:** Reserved exclusively for Rank modification marks, Scars, and Curses (`|`, `||`, `N`, `|X|`) drawn over the rank number pip, and Fallen Hero Suit Blessings (`[ (♦) ]`) drawn as a circle directly enclosing the printed suit pip.
*   **Upper-Right Corner Margin (and Bottom-Left in 180° rotation):** Reserved exclusively for defensive Immunity Anchor marks (`—` for Fortifying, `+` for Anchored).

---

## ── 4. LIVE-PLAY PLAYGROUND ARCHITECTURE ──
Deal 28 cards face-up into a standard pyramid layout consisting of 7 rows. The remaining cards form the face-down **Stock Pile**. Cards are cleared by pairing exposed cards that add up to a Functional Value of exactly **13** (e.g., A + Q, 6 + 7). Standard Kings have a value of 13 and clear themselves singly into the Foundation.

### The Traps & Modifications Modifiers
1.  **Value Shifts:** If a card has a **Scar** marked across its rank number pip (`|7̸| 8`), its functional value is modified for the duration of the game (+1 for Red, -1 for Black), with the effective modified value written directly to the right of the slashed base rank. *Functional values wrap circularly between 1 (Ace) and 13 (King); a -1 shift on a Black Ace wraps to value 13 (allowing it to clear solo as a King), and a +1 shift on a Red King wraps to value 1 (allowing it to pair with a Queen).*
2.  **Red Curses `[ |X| ]` (The Trap):** When dealing the pyramid, once a Red Curse card (`|X|`) is placed into a row, the overlapping cards placed into the next lower row must be dealt face-down. Face-down cards are revealed (flipped face-up) as soon as they become exposed and playable (or when targeted by a ♠ Spades Hero blessing). *(Note: This means Red Curses have no mechanical face-down effect when dealt in the last or second-to-last row, since there are either no rows beneath them or the cards in the bottom row are exposed immediately at the start of play.)*
3.  **Black Curses `[ |X| ]` (The Weight):** This card cannot be paired with cards drawn from the Stock or Waste pile. It can *only* be paired with another exposed card located inside the pyramid structure. Its matching partner can be any exposed card in the layout—regardless of that partner's own blessing, scar, or curse status—so long as their combined functional values total exactly 13.
4.  **The Scarred Hero Interaction:** A single card can be both Blessed (encircling the suit pip `(♦)`) and Cursed (crossing the rank pip `|X|`). It enforces its math shift and layout trap while in the pyramid, but successfully clearing it still unleashes its Suit Blessing.
5.  **Retrospective Anchor Rules:** An Anchor `[ + ]` drawn in the card's upper-right corner stops *future* degradation. If a card already has a Scar or Curse, those ink marks remain active; the Anchor simply blocks the card from progressing to Stage 5 (Entombed).
6.  **180° Symmetry:** For physical deck play, all pen strokes are marked symmetrically (scars, curses, and blessings in top-left/bottom-right corners; anchors in top-right/bottom-left corners) so cards remain readable when rotated.

---

## ── 5. THE ATTRITION TRACK (RANK PIP MARKS) ──
When a game freezes and no legal moves remain, you lose the round. Identify all **Bottlenecks**—every card left completely exposed at the lowest remaining base tiers of the frozen pyramid. Add pen strokes directly to the **Rank Number Pip** in both corner indices (top-left and bottom-right) to progress each bottleneck card down the failure track:

*   **Stage 1 `[ |7 ]` (Vulnerable):** 1st Stroke. Single vertical line drawn to the left of the rank number. No mechanical effect.
*   **Stage 2 `[ |7| ]` (Doubtful):** 2nd Stroke. Single vertical line drawn to the right of the rank number, framing the number (`|N|`). No mechanical effect.
*   **Stage 3: The Scar `[ |7̸| 8 ]` (The Shift):** 3rd Stroke. Backslash `\` drawn directly across the rank number from top-left to bottom-right (overlapping the rank digit). Write the card's new **Functional Value** directly to the right (+1 for Red, -1 for Black).
*   **Stage 4: The Curse `[ |7X| 8 ]` (The Trap/Weight):** 4th Stroke. Forward slash `/` drawn directly across the rank number from bottom-left to top-right (crossing the backslash to form an `X` overlapping the rank digit). Enforces the structural rules defined in Section 4 with the modified functional value written to the right.
*   **Stage 5: Entombed:** The card is removed from the active deck pool and placed into the Graveyard Box. *(Note: Its Stage 4 Curse mark remains on the card. If later returned to the active deck pool via a ♥ Hearts Resurrection blessing, it returns as a Stage 4 Cursed card, preserving all previous failure ink marks and functional value shifts).*

*Immunity Exception:* If a card possesses a completed **Anchor `[ + ]`** in its upper-right corner, ignore this penalty phase entirely.

---

## ── 6. THE SURVIVAL REWARDS (SUIT PIP MARKS) ──
If you completely clear all 28 cards from the pyramid layout but have leftover cards remaining in the Stock or Waste piles, you achieve a **Pyramid Clear**. Unlocked suit blessings carry over permanently and trigger across all subsequent rounds of the campaign.

**Card-Specific Legacy Unlocks:** A suit blessing `[ (♦) ]` applies strictly to the individual physical card it is drawn upon. While multiple separate cards in your deck can acquire the same suit blessing over the course of the campaign (creating multiple distinct Hero cards), each instance triggers independently when that specific card is cleared.

Isolate the **final visual transaction** used to remove the last card(s) from the board:

### A. The Final Pair Clear
Compare the final two cards' active Functional Values:
*   **The Higher-Value Card becomes the Fallen Hero:** Draw a circle completely enclosing its printed suit symbol `[ (♦) ]` in both corner indices to permanently unlock its blessing for all future games. *(If already circled, skip this effect).*
    *   ♥ **Hearts (Resurrection):** When cleared, draw 1 **random card** blindly from the physical Graveyard Box container and shuffle it back into your active deck pool as Stage 4 (Cursed), preserving all ink marks. *(If the Graveyard Box is empty, no action is taken).*
    *   ♦ **Diamonds (The Vault):** When exposed on the Waste pile OR on the Pyramid layout, you may instantly place this card face-up into a separate area on the side of the table (the Diamond Vault slot). **This action is completely free and does not interrupt your turn.** Placing a Pyramid Diamond card into the Vault unblocks cards beneath it. You may immediately proceed to draw a new stock card, interact with the layout, or choose to pair the newly vaulted Diamond right away. It survives all subsequent Waste pile Redeals for the duration of this game.
    *   ♠ **Spades (The Tunnel):** When cleared, immediately flip one face-down card in the pyramid layout face-up.
    *   ♣ **Clubs (Universal Wildcard):** When pairing, this card can legally pair with **ANY exposed card** regardless of that partner card's functional value (treating the combined sum as 13).
*   **The Lower-Value Card builds the Anchor:** Progress its defensive immunity track by one stroke in the upper-right corner margin (and bottom-left corner rotated 180°):
    *   *First Stroke `[ — ]` (Fortifying):* Draw a single bold dark horizontal line in the upper-right corner margin. No mechanical effect yet.
    *   *Second Stroke `[ + ]` (Anchored):* Cross it vertically with a bold dark stroke (`+`) in the upper-right corner margin. The card is now permanently immune to rank loss marks.

### B. The Sibling Clear (Solo King Clear)
If the final card clearing the board is a standalone King, it acts as both structural points. Progress its upper-right Anchor track by one stroke (`[ — ]` or `[ + ]`). No Fallen Hero blessing is awarded.

*Rule of Ink Overlap:* If a selected card already features Stage 3 or 4 Attrition marks (`|N|`, `|X|`) from the failure track, it cannot become an Anchor; the horizontal stroke `[ — ]` cannot be applied and the defensive reward is lost. Ink never moves backward.

---

## ── 7. THE TIMING & CAMPAIGN RESETS ──

### Resolution of Simultaneous End-States
If the final matching action of a game simultaneously satisfies the conditions for a Perfect Win but includes a card that would otherwise trigger an adverse effect via a lingering state, **Victory takes absolute priority.** If the board and deck are clear, you win the campaign.

### Campaign Reset Protocol
1.  **Assemble Active Pool:** Gather all cards from the Foundation pile, remaining Stock, Waste, and the Diamond Vault. This forms your active pool. Leave all entombed `[ X ]` cards behind in the Graveyard Box.
2.  **Audit the Tomb:** Check the active pool and the Graveyard Box against your active campaign end conditions (Section 1). If you have fewer than 28 cards total in the active pool, or if your variant rule applies and a rank hits a count of 4, the campaign ends in immediate defeat.
3.  **Shuffle and Re-Deal:** Re-shuffle the active pool and deal a new 28-card pyramid according to the setup constraints.
