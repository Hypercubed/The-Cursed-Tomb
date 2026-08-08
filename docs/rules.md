---
title: "The Cursed Tomb"
subtitle: "Official Ruleset"
version: "0.0.11"
date: "2026-08-08"
status: "draft"
description: "A persistent, mutating tactical card game played with a standard 52-card deck and fine-tip felt markers."
---

# The Cursed Tomb

A persistent, mutating tactical card game played with a standard 52-card deck and fine-tip felt markers (red and blue).

---

## 1. EXPEDITION OBJECTIVE & FAILURE CONDITIONS
Your ultimate goal is to play as long as possible before the deck becomes unplayable.

### The Tomb Collapses (Campaign End Conditions)
The campaign ends in instant defeat if the tomb collapses. The tomb collapses the moment the following condition is met:

1.  **Starvation Condition (Mandatory):** At the start of a new round, you do not have enough active cards remaining in your pool to build a full 28-card pyramid layout.

---

## 2. CORE DEFINITIONS & ZONE STATE TERMINOLOGY
*   **Printed Rank:** The immutable, original value printed on the card face (A, 2–10, J, Q, K). This value never changes. The Tomb-Collapse condition and all deck auditing steps look *only* at the Printed Rank.
*   **Functional Value:** The temporary mathematical value used during gameplay calculations. This value is dynamic, altered exclusively by Upper-Left **Scars `[ N ]`** (+1 for Red, -1 for Black).
*   **Exposed Card:** A card in the pyramid layout that has no other cards physically overlapping or underpinning it from the row below. Only exposed cards can be paired or cleared.
*   **The Stock:** The face-down draw pile.
*   **The Waste:** The face-up pile where cards flipped from the Stock land.
*   **The Foundation:** The separate, face-up destination pile where successfully paired and cleared cards are placed. **Cards in the Foundation are completely inert trophies;** they cannot be targeted, moved, or interacted with by any special rules or blessings for the remainder of the game.
*   **The Vault (Diamond Blessing):** A separate holding area beside the table, distinct from the Foundation. Multiple ♦ Diamond cards with the Hero's blessing (center-face Vault Box illustration) may be **instantly and freely** placed face-up into the Vault from the Stock pile, Waste pile, or Pyramid layout without spending an action. They form a First-In, Last-Out (FILO) stack: a Pyramid Diamond placed in the Vault unblocks the cards beneath it as if it were cleared, only the top (most recently vaulted) card may be paired, and clearing it exposes the card beneath. Vaulted cards survive all subsequent Waste pile Redeals for the duration of the game.
*   **The Graveyard Box:** A separate physical container used to hold dead cards. Cards in the Graveyard Box are permanently removed from the deck pool for the remainder of the campaign.

---

## 3. PREPARATION & DIFFICULTY
### Components
*   52-card deck
*   1 or 2 fine-tip markers (red and blue recommended)
*   Graveyard box
*   6-sided die (optional)

Before beginning the campaign, select your global difficulty setting. This dictates how many times you are allowed to cycle through the Waste Pile per game:

*   **Novice (Tutorial / Sandbox Mode):** Infinite Redeals allowed (unlimited passes through the Stock deck). This mode provides a relaxed environment to learn the mutation behaviors.
*   **Explorer (Easy):** 2 Redeals allowed (3 total passes through the Stock deck).
*   **Archaeologist (Normal):** 1 Redeal allowed (2 total passes through the Stock deck).
*   **Survivalist (Hard):** 0 Redeals allowed (1 single pass through the Stock deck).

### Tracking Redeals (Optional)
For physical tabletop play, Explorer is the only difficulty mode that requires tracking multiple redeals. (Novice allows infinite redeals, Archaeologist allows only a single redeal, and Survivalist allows zero.) You may optionally track remaining redeals using a physical counter:
*   **Die Counter Method:** Place a standard die (d6) beside the Stock pile set to your starting redeal allowance (2 for Explorer). Decrement the die value by 1 each time you pick up the Waste pile to form a new Stock pile.
*   **Token Method:** Place physical tokens (coins, poker chips, or counter tokens) beside the Stock pile equal to your allowed redeals, discarding one token upon each redeal.

### Marker & Pen Selection
To preserve deck secrecy, ink marks must be drawn using **fine-tip felt markers** (e.g., Ultra-Fine Sharpie or fine felt-tip permanent markers) rather than ballpoint pens. Ballpoint pens press into stiff cardstock and leave indented impression marks readable on the card backs, inadvertently marking cards.

### Ink Colors & Visual Polarity (Optional)
Ink colors differentiate positive card modifications from negative card degradation at a glance:
*   **🔴 Red Ink (Negative Modifications):** Use red ink for all Attrition marks (Stage 1 & 2 slashes), Scars (Stage 3 rank slash & functional shift numbers), Curses (Stage 4 `X` and trap icons), and Entombed defacement (`X`).
*   **🔵 Blue Ink (Positive Modifications):** Use blue ink for all defensive Immunity marks (Stage 1 Fortifying `—` and Stage 2 Anchored `+`), center-face Blessing illustrations (`∩`, `□`, Shovel, `⊕`), and Sun Cross wildcard rank crossed-out marks (`X`).

### Spatial Layout & Ink Zones
Ink modifications must be strictly confined to distinct visual zones:
*   **Upper-Left Corner Index:** Reserved exclusively for Rank modification marks, Scars, Curses (`|`, `||`, `N`, `|X|`), and Sun Cross wildcard rank crossed-out marks (`X`) drawn over the rank number pip. Corner suit pips remain clean; Hero Suit Blessings are drawn directly on the center card face as suit-specific illustrations (`∩`, `□`, Shovel, `⊕`).
*   **Upper-Right Corner Margin (and Bottom-Left in 180° rotation):** Reserved exclusively for defensive Immunity Anchor marks (`—` for Fortifying, `+` for Anchored).

---

## 4. LIVE-PLAY PLAYGROUND ARCHITECTURE
Deal 28 cards face-up into a standard pyramid layout consisting of 7 rows. The remaining cards form the face-down **Stock Pile**. Cards are cleared by pairing exposed cards that add up to a Functional Value of exactly **13** (e.g., A + Q, 6 + 7). Standard Kings have a value of 13 and clear themselves singly into the Foundation.

### Stock & Waste Pairing Rules
*   **Top Stock Card Exposure:** Drawing exposes the top card of the Stock pile. The top Stock card is active and eligible for selection and pairing with any exposed Pyramid card, the top card of the Waste pile, or cleared singly if its functional value is 13, *prior* to entering the Waste pile.
*   **Passing to Waste:** Discarding or placing the top exposed Stock card onto the top of the Waste pile when no match is made or when holding the card for future play. Discarding a card to Waste does not decrement remaining pile cycles (redeals).

### The Traps & Modifications Modifiers
1.  **Value Shifts:** If a card has a **Scar** marked across its rank number pip (`|7̸| 8`), its functional value is modified for the duration of the game (+1 for Red, -1 for Black), with the effective modified value written directly to the right of the slashed base rank. *Functional values wrap circularly between 1 (Ace) and 13 (King); a -1 shift on a Black Ace wraps to value 13 (allowing it to clear solo as a King), and a +1 shift on a Red King wraps to value 1 (allowing it to pair with a Queen).*
2.  **Red Curses `[ |X| ]` (The Trap):** When dealing the pyramid, once a Red Curse card (`|X|`) is placed into a row, the overlapping cards placed into the next lower row must be dealt face-down. Face-down cards are revealed (flipped face-up) as soon as they become exposed and playable (or when targeted by a ♠ Spades Hero blessing). *(Recommended Center-Face Icon: Downward Triangle `▼` representing a trap door).*
3.  **Black Curses `[ |X| ]` (The Recycled Weight):** When paired with a matching partner card, the Black Cursed card moves to the Foundation stack, but the paired partner card is shuffled back into the face-down Stock draw pile instead of moving to the Foundation stack. *(Recommended Center-Face Icon: Trapezoid Weight `⏍` representing a heavy weight).*
4.  **Mutual Exclusivity Rule:** The recommended center-face illustration (Blessing or Curse) is drawn on the card face. A card carries EITHER a Blessing illustration OR a Curse illustration, never both.
    - If a Blessed card advances to Stage 4 Attrition, it receives the Stage 4 rank marking (`|X|` over rank digit) and can advance to Stage 5 Entombed on a subsequent attrition mark, but its **Curse trap mechanics (Red face-down deals / Black weight partner reshuffle) and Curse illustration are skipped**. The card retains its Blessing illustration.
    - If a Stage 4 Cursed card is cleared as the higher-value Hero card at round end, the **Blessing award is skipped**.
5.  **Retrospective Anchor Rules:** An Anchor `[ + ]` drawn in the card's upper-right corner stops *future* degradation. If a card already has a Scar or Curse, those ink marks remain active; the Anchor simply blocks the card from progressing to Stage 5 (Entombed).
6.  **180° Symmetry:** (Optional) For physical deck play, all pen strokes are marked symmetrically (scars, curses, and blessings in top-left/bottom-right corners; anchors in top-right/bottom-left corners) so cards remain readable when rotated.

---

## 5. THE ATTRITION TRACK (RANK PIP MARKS)
When a game freezes and no legal moves remain, you lose the round. Identify all **Bottlenecks**—every card left completely exposed at the lowest remaining base tiers of the frozen pyramid. Add pen strokes directly to the **Rank Number Pip** in both corner indices (top-left and bottom-right) to progress each bottleneck card down the failure track:

*   **Stage 1 `[ |7 ]` (Vulnerable):** 1st Stroke. Single vertical line drawn to the left of the rank number. No mechanical effect.
*   **Stage 2 `[ |7| ]` (Doubtful):** 2nd Stroke. Single vertical line drawn to the right of the rank number, framing the number (`|N|`). No mechanical effect.
*   **Stage 3: The Scar `[ |7̸| 8 ]` (The Shift):** 3rd Stroke. Backslash `\` drawn directly across the rank number from top-left to bottom-right (overlapping the rank digit). Write the card's new **Functional Value** directly to the right (+1 for Red, -1 for Black).
*   **Stage 4: The Curse `[ |7X| 8 ]` (The Trap/Weight):** 4th Stroke. Forward slash `/` drawn directly across the rank number from bottom-left to top-right (crossing the backslash to form an `X` overlapping the rank digit). Enforces the structural rules defined in Section 4 with the modified functional value written to the right.
*   **Stage 5: Entombed:** Draw a giant dark `X` across the entire face of the card to deface it completely. The card is permanently destroyed and removed from the active deck pool for the remainder of the campaign, then placed into the Graveyard Box.

*Immunity Exception:* If a card possesses a completed **Anchor `[ + ]`** in its upper-right corner, ignore this penalty phase entirely.

---

## 6. THE SURVIVAL REWARDS (HERO BLESSINGS & ANCHORS)
If you completely clear all 28 cards from the pyramid layout but have leftover cards remaining in the Stock or Waste piles, you achieve a **Pyramid Clear**. Unlocked suit blessings carry over permanently and trigger across all subsequent rounds of the campaign.

**Card-Specific Legacy Unlocks:** A suit blessing applies strictly to the individual physical card it is drawn upon. While multiple separate cards in your deck can acquire the same suit blessing over the course of the campaign (creating multiple distinct Hero cards), each instance triggers independently when that specific card is cleared.

Identify the **final card play** (the last pair of cards, or single card played) used to clear the final card(s) from the pyramid board:

### A. The Final Pair Clear
Compare the final two cards' active Functional Values:
*   **The Higher-Value Card becomes the Blessed Hero:** Draw its suit-specific blessing illustration directly on the center face of the card to permanently unlock its blessing for all future games. *(If already blessed or if the card is Stage 4 Cursed, skip this effect).* The center-face illustration provides instant visual identification:
    *   ♥ **Hearts (Stock Reshuffle):** Center face icon: Tomb Archway (`∩`) representing resurrection from the tomb. When cleared, immediately shuffle all cards currently in the face-up Waste pile back into the face-down Stock draw pile without consuming a redeal.
    *   ♦ **Diamonds (The Vault):** Center face icon: Vault Box (`□`). When exposed on the Stock pile, Waste pile, OR Pyramid layout, you may instantly place this card face-up into a separate area on the side of the table (the Diamond Vault). Multiple Blessed Diamonds may be stored in a First-In, Last-Out (FILO) stack; **this action is completely free and does not interrupt your turn, but only the top card is playable.**
    *   ♠ **Spades (The Tunnel):** Center face icon: Tunnel Shovel (blade pointing down at bottom, handle extending up). When cleared, select any one exposed card in the pyramid layout and move it directly onto the top of the face-up Waste pile.
    *   ♣ **Clubs (Universal Wildcard):** Center face icon: Circled Sun Cross (`⊕`). Cross out the rank number digit in blue ink (`X`) on the upper-left and bottom-right corner indices. When pairing, this card can legally pair with **ANY exposed card** regardless of that partner card's functional value (treating the combined sum as 13).
*   **The Lower-Value Card builds the Anchor:** Progress its defensive immunity track by one stroke in the upper-right corner margin (and bottom-left corner rotated 180°):
    *   *First Stroke `[ — ]` (Fortifying):* Draw a single bold dark horizontal line in the upper-right corner margin. No mechanical effect yet.
    *   *Second Stroke `[ + ]` (Anchored):* Cross it vertically with a bold dark stroke (`+`) in the upper-right corner margin. The card is now permanently immune to rank loss marks.
*   **Wildcard Partner Rule:** If the final pair includes an existing **♣ Clubs Universal Wildcard** (`⊕`), the Wildcard cannot receive another blessing and **automatically becomes the Anchor** (incrementing its Anchor track `[ — ]` / `[ + ]`). Its partner card becomes the **Blessed Hero** (gaining its suit blessing illustration, unless already blessed or Stage 4 Cursed). If both cards in the final pair are Wildcards, neither can receive a blessing, and one Wildcard receives the Anchor stroke.

### B. The Solo Clear (Standalone Value 13 / King Clear)
If the final card clearing the board is played singly (a King or any card with an active Functional Value of 13), progress its upper-right Anchor track by one stroke (`[ — ]` or `[ + ]`). No Hero's Blessing is awarded.

*Anchor Progression & Entombment:* Cards continue to accumulate upper-right Anchor strokes (`[ — ]` and `[ + ]`) at all active attrition stages (including Scarred and Cursed cards at Stage 3 and 4) up until they are Entombed (Stage 5). Once a card reaches Stage 2 Anchored (`[ + ]`), it becomes immune to further round-freeze attrition.

### C. Visual Reference Guide
Mutated physical cards retain clear visual separation between corner index marks and center face drawings:

```
+───────────────────────────+
| |7̸| 8                [+]  |   <- Upper-Left: Slashed Rank, Functional Val
|  ♥                        |   <- Upper-Right: Anchor Badge [+]
|                           |
|           ╭───╮           |   <- Center Face: Blessing or Curse illustration
|           │ ∩ │           |      drawn on the card face
|           │   │           |      (Archway, Vault Box, Shovel, Sun Cross, ▼, ⏍)
|           ╰───╯           |
|                        ♥  |
|  [+]             |7̸| 8    |   <- 180° Symmetrical Bottom Index (optional)
+───────────────────────────+
```

---

## 7. THE TIMING & CAMPAIGN RESETS

### Resolution of Simultaneous End-States
If the final match played to clear the entire deck and achieve a **Perfect Win** includes a card with a penalty effect—such as a **Black Cursed card (`⏍`)** whose partner would normally be reshuffled back into the Stock pile—**the Perfect Win takes absolute priority.** The penalty effect is bypassed, both cards move to the Foundation, and the round is successfully cleared as a Perfect Win.

### Campaign Reset Protocol
1.  **Assemble Active Pool:** Gather all cards from the Foundation pile, remaining Stock, Waste, and the Diamond Vault. This forms your active pool. Leave all entombed `[ X ]` cards behind in the Graveyard Box.
2.  **Audit the Tomb:** Check the active pool and the Graveyard Box against your active campaign end conditions (Section 1). If you have fewer than 28 cards total in the active pool, the campaign ends in immediate defeat.
3.  **Shuffle and Re-Deal:** Re-shuffle the active pool and deal a new 28-card pyramid according to the setup constraints.
