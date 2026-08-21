---
title: "The Cursed Tomb"
subtitle: "Official Ruleset"
version: "0.0.13"
date: "2026-08-16"
version: "0.0.14"
date: "2026-08-20"
status: "draft"
description: "A persistent, mutating tactical card game played with a standard 52-card deck and fine-tip felt markers."
license: "CC-BY-SA-4.0"
copyright: "Copyright (c) 2026 Jayson Harshbarger"
spdx: "CC-BY-SA-4.0"
---

<!--
SPDX-License-Identifier: CC-BY-SA-4.0
Copyright (c) 2026 Jayson Harshbarger
Licensed under Creative Commons Attribution-ShareAlike 4.0 International.
See docs/LICENSE or https://creativecommons.org/licenses/by-sa/4.0/
-->

# The Cursed Tomb

A persistent, mutating tactical card game played with a standard 52-card deck and fine-tip felt markers (red and blue).

---

## Definitions & Zones

For **Exposed Card**, **The Stock**, **The Waste**, and **The Foundation** see Standard Pyramid Rules (Definitions & Zones and §1–§3). *The Cursed Tomb* adds:

*   **Printed Rank:** The immutable, original value printed on the card face (A, 2–10, J, Q, K). This value never changes. The Starvation condition and all deck auditing steps look *only* at the Printed Rank (§1).
*   **Functional Value:** The temporary mathematical value used during gameplay calculations. This value is dynamic, altered exclusively by Upper-Left **Scars** — 2 Scars shift the value (+1 for Red, -1 for Black; §4).
*   **Scar:** One red stroke in the Upper-Left corner index (§4). Five Scars = Entombed.
*   **Anchor / Shield:** One blue stroke (`—`) or two (`+` forming a Shield) in the Upper-Right margin (§4–§5). A completed Shield (2 Anchors) contains 4 Scar absorption blocks.
*   **The Vault (Diamond Blessing):** A separate holding area beside the table, distinct from the Foundation. Multiple ♦ Diamond cards with the Hero's blessing (center-face Vault Box illustration) may be **instantly and freely** placed face-up into the Vault from the Stock pile, Waste pile, or Pyramid layout without spending an action. They form a First-In, Last-Out (FILO) stack: a Pyramid Diamond placed in the Vault unblocks the cards beneath it as if it were cleared, only the top (most recently vaulted) card may be paired, and clearing it exposes the card beneath. Vaulted cards survive all subsequent Waste pile Redeals for the duration of the game.
*   **The Graveyard Box:** A separate physical container used to hold dead cards. Cards in the Graveyard Box are permanently removed from the deck pool for the remainder of the campaign (until a Perfect Win returns one as 4 Scars `|X|` Imperiled, §5 C).

---

## 1. Expedition Objective & Failure Conditions
**The Cursed Tomb is cursed to fail — eventually every expedition collapses.** There is no final victory. Your objective is to endure as many rounds as possible and achieve as many **Wins** as you can before the deck becomes unplayable.

A **Win** is scored whenever you clear all 28 cards from the pyramid layout in a single round — whether you clear only the pyramid ([Pyramid Clear](#5-the-survival-rewards-hero-blessings--anchors)) or clear the entire deck including Stock, Waste, and Vault ([Perfect Win](#6-the-timing--campaign-resets)). Every Win grants Survival Rewards (§5). Keep a tally of your Wins (and separately your Perfect Wins) on paper — your final score is how many you earned before the tomb claimed you.

### The Tomb Collapses (Campaign End Condition)
The campaign ends in instant defeat if the tomb collapses, which occurs the moment the following condition is met:

**Starvation —** At the start of a new round, you do not have enough active cards remaining in your pool to build a full 28-card pyramid layout. This is the sole way the campaign ends — Perfect Wins and Pyramid Clears are accomplishments, not endings; you always shuffle and continue (§6) until starvation.


---

## 2. Preparation & Difficulty
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

> **Dry-erase option:** Ultra-fine dry-erase markers work for a *reversible* campaign (Scars/Anchors/Blessings wipe off with a dry cloth), but they **smudge badly** — handling and stacking cards, riffling, or even palm sweat can blur fresh marks, and eraser dust can ghost onto other cards.

### Ink Colors & Visual Polarity (Optional)
Ink colors differentiate positive card modifications from negative card degradation at a glance:
*   **🔴 Red Ink (Scars & Leftovers):** One red stroke = one **Scar** in the Upper-Left corner index (§5). Scars carry rank-frame marks, functional-value shifts (at 2 Scars), curse `X` marks (at 3 Scars), and the 5th Scar Entombment (`X` → Graveyard).
*   **🔵 Blue Ink (Anchors & Shield):** One blue stroke `—` = one **Anchor** in the Upper-Right margin; two Anchors form a **Shield** `+` containing **4 Scar absorption blocks** (§5–§6). Also used for center-face Blessing illustrations (`∩`, `□`, Shovel, `⊕`) and Sun Cross wildcard rank crossed-out marks (`X`).

### Spatial Layout & Ink Zones
Ink modifications must be strictly confined to distinct visual zones:
*   **Upper-Left Corner Index:** Reserved exclusively for **Scars** — the 1–5 red strokes (`|`, `\`, `X`, `|`, `X`) that track vulnerability → shift → curse → imperiled → entombed (§5), plus functional-value numbers and Sun Cross wildcard `X` marks drawn over the rank pip. Corner suit pips remain clean; Hero Suit Blessings are drawn directly on the center card face (`∩`, `□`, Shovel, `⊕`).
*   **Upper-Right Corner Margin (and Bottom-Left in 180° rotation):** Reserved exclusively for **Anchors & Shield** — blue `—` (1 Anchor, Fortified) and `+` (2 Anchors, Shield) with up to 4 red absorption blocks in the quadrants of the `+` (§5–§6).

---

## 3. Live-Play Playground Architecture
Deal 28 cards face-up into a standard pyramid layout consisting of 7 rows. The remaining cards form the face-down **Stock Pile**. Cards are cleared by pairing exposed cards that add up to a Functional Value of exactly **13** (e.g., A + Q, 6 + 7). Standard Kings have a value of 13 and clear themselves singly into the Foundation.

### Stock & Waste Pairing Rules
For Stock/Waste pairing — **Stock top exposed before Waste, eligible to pair with Waste top or Pyramid, or clear solo on `13`** — see Standard Pyramid Rules §3. Passing the exposed Stock top to the Waste pile does not cost a redeal.

### The Traps & Modifications Modifiers
1.  **Value Shifts (2 Scars):** When a card has **2 Scars** (`|\7 8`) a diagonal `\` is drawn across the rank pip and the new **Functional Value** is written to the right (+1 for Red, -1 for Black). *Functional values wrap circularly between 1 (Ace) and 13 (King); a -1 shift on a Black Ace wraps to value 13 (allowing it to clear solo as a King), and a +1 shift on a Red King wraps to value 1 (allowing it to pair with a Queen).*
2.  **Red Curse (3 Scars `|X`) (The Trap):** When dealing the pyramid, once a Red 3-Scar card (`|X`) is placed into a row, the overlapping cards placed into the next lower row must be dealt face-down. Face-down cards are revealed (flipped face-up) as soon as they become exposed and playable (or when targeted by a ♠ Spades Hero blessing). *(Recommended Center-Face Icon: Downward Triangle `▼` representing a trap door).*
3.  **Black Curse (3–4 Scars `|X`/`|X|`) (The Recycled Weight):** When paired with a matching partner card, the Black 3-Scar (`|X`) or 4-Scar (`|X|`) card moves to the Foundation stack, but the paired partner card is shuffled back into the face-down Stock draw pile instead of moving to the Foundation stack. If **both** cards in the pair are Black Cursed, the card with the higher functional value moves to the Foundation stack, while only the partner card with the lower functional value is reshuffled back into the face-down Stock draw pile. *(Recommended Center-Face Icon: Trapezoid Weight `⏍` representing a heavy weight).*
4.  **Mutual Exclusivity Rule:** The recommended center-face illustration (Blessing or Curse) is drawn on the card face. A card carries EITHER a Blessing illustration OR a Curse illustration, never both.
    - If a Blessed card reaches 3 Scars, it receives the 3-Scar rank marking (`|X|` over rank digit) and can advance through 4 Scars `|X|` to 5 Scars Entombed, but its **Curse trap mechanics (Red face-down deals / Black weight partner reshuffle) and Curse illustration are skipped**. The card retains its Blessing illustration.
    - If a 3- or 4-Scar Cursed card is offered as the primary Blessing candidate at round end (§6), the **Blessing is offered to the lower card instead**; if both are Cursed/blessed, **no Blessing is awarded**.
5.  **Anchor & Shield (Upper-Right):** One blue Anchor `—` (1 Anchor, Fortified) has no effect; a second blue stroke forms a **Shield** `+` (2 Anchors) that contains **4 Scar absorption blocks**. Each absorbed Scar is recorded as a **Red dot/tick** in one outer quadrant of the `+` (top-left, top-right, bottom-left, bottom-right). On the 4th block the Shield exhausts (returning to no Anchors), after which Scars resume. Existing Scars (including shift/curse marks) are preserved when a Shield exhausts.
6.  **180° Symmetry:** (Optional) For physical deck play, all pen strokes are marked symmetrically (Scars in top-left/bottom-right corners; Anchors & Shield in top-right/bottom-left corners) so cards remain readable when rotated.

---

## 4. The Attrition Track (Scars)
When a game freezes and no legal moves remain, you lose the round. Identify all **Bottlenecks** — **every card left completely exposed** (no cards overlapping it) in the frozen pyramid, regardless of row. Each bottleneck gains **one red Scar** (one stroke) in the Upper-Left corner index (top-left and bottom-right for 180° symmetry). Five Scars = Entombed.

*   **1 Scar `[ |7 ]` — Vulnerable:** Single vertical line to the left of the rank number. No mechanical effect.
*   **2 Scars `[ |\7 8 ]` — Scarred:** Backslash `\` across the rank digit (forming `|\7`). Write the card's new **Functional Value** to the right (+1 for Red, -1 for Black). *Wraps 1 (Ace) ↔ 13 (King).*
*   **3 Scars `[ |X 8 ]` — Cursed:** Forward slash `/` across the rank (forming an `X` over the digit: `|X`). Enforces the curse trap/weight of §4 with the shifted value to the right.
*   **4 Scars `[ |X| 8 ]` — Imperiled (Vulnerable to Entombment):** Right vertical bar `|` framing the `X` (`|X|`). Still **Cursed** (same trap/weight as 3 Scars), but the next Scar will entomb it.
*   **5 Scars `X` — Entombed:** Place the card face-down in the **Graveyard Box**. It is removed from the active pool (starvation §1 counts active <28) until possibly returned by a Perfect Win (§7). No defacement — all prior Scar/Anchor/Blessing ink remains and is kept if the card is resurrected (it returns as 4 Scars `|X|`, still cursed & imperiled).

*Shield Exception:* A completed **Shield** (`+`, 2 Anchors) in the Upper-Right contains **4 Scar absorption blocks**. Each freeze hit that would add a Scar is instead recorded as one **Red block (dot/tick) in a quadrant around the `+`** (top-left, top-right, bottom-left, bottom-right). On the 4th block the Shield exhausts (anchors → 0), after which Scars resume. Existing Scars, shifts, and curses are preserved.

---

## 5. The Survival Rewards (Hero Blessings & Anchors)
Whenever you score a **Win** — clearing all 28 cards from the pyramid layout in a round (§1) — you earn Survival Rewards. A **Pyramid Clear** (pyramid empty with cards remaining in Stock/Waste/Vault) and a **Perfect Win** (pyramid *and* Stock/Waste/Vault empty, §7) both count as Wins. Apply the rewards below, then continue to the Campaign Reset (§7).

Unlocked suit blessings carry over permanently and trigger across all subsequent rounds of the campaign.

**Card-Specific Legacy Unlocks:** A suit blessing applies strictly to the individual physical card it is drawn upon. While multiple separate cards in your deck can acquire the same suit blessing over the course of the campaign (creating multiple distinct Hero cards), each instance triggers independently when that specific card is cleared.

Identify the **pair that cleared the pyramid** (the 28th pyramid card — i.e., the last pair or solo card whose removal left the pyramid empty). On a Pyramid Clear this is the round's final play. On a Perfect Win this pair was the last *pyramid* play; you may continue pairing Stock/Waste/Vault cards until the deck is empty, but **set the pyramid-clear pair aside now as the Blessing candidate** (or mark its Blessing immediately) — it remains the Blessing pair even though the round continues. Apply its Blessing when the pyramid hits 0, then finish the Descent (§5 B) with remaining redeals before Graveyard Return (§5 C).

### A. The Final Pyramid Pair
Compare the final two cards' active Functional Values to determine the **primary Blessing candidate** (higher value) and the fallback. If the last pyramid Diamond (`♦`) was **vaulted** rather than cleared to the Foundation, that vault move *does* count as clearing the pyramid for the Win — the vaulted Diamond is the "hero" card (already Blessed `□`, so its Blessing is skipped and only Anchors apply) and the Blessing is offered to its paired partner or fallback per below, or not at all if both ineligible:

*   **Blessing (1 per Win, with fallback):** The higher-value card is the primary candidate. Draw its suit-specific blessing illustration (Blue, center face) if it is **not already blessed and has <3 Scars** (i.e., not yet Cursed; §5). If the primary is ineligible (already blessed — e.g., a vaulted Diamond `□` — or 3+ Scars), offer the Blessing to the **lower-value card** instead if eligible. If both are ineligible (both already blessed or both 3+ Scars cursed), **no Blessing is awarded** this Win.
    *   ♥ **Hearts (Stock Reshuffle):** Tomb Archway (`∩`). On clear, immediately shuffle all face-up Waste into face-down Stock (no redeal cost).
    *   ♦ **Diamonds (The Vault):** Vault Box (`□`). When exposed (Stock/Waste/Pyramid), you may instantly place into the FILO Diamond Vault (free, non-interrupting; only top card playable; survives redeals; unblocks beneath).
    *   ♠ **Spades (The Tunnel):** Shovel (blade down, handle up). On clear, move any 1 exposed pyramid card to the top of the Waste pile.
    *   ♣ **Clubs (Universal Wildcard):** Circled Sun Cross (`⊕`). Cross out the rank digit in blue (`X`) at both corner indices. When pairing, it pairs with **ANY exposed card** (treated as combined 13 — effectively functional `0` through `12` to complement the partner's `13` through `1`); however, it **cannot be 13 by itself** — a Wildcard may not clear solo as a King (its functional value is `0–12` inclusive).
    *   **Wildcard Partner Rule:** If the final pair includes an existing **♣ Wildcard** (`⊕`), the Wildcard cannot receive another blessing and is **not eligible as the primary** — it will be considered only as the fallback lower candidate (which will fail if both are Wildcards). The partner card is the primary candidate.

### B. The Descent — Post-Pyramid Anchors

The instant the 28th pyramid card clears, score the **Win**. The higher Functional Value of the final pair receives its suit Blessing `∩` / `□` / Shovel / `⊕` if eligible (`<3 Scars`, not already Blessed; fallback to lower if higher ineligible, none if both ineligible). **The lower card of the final pair receives one Anchor** `—` (`—` Fortified → `+` Shield with 0 blocks). Solo `13` (`K`) gets its one Anchor. A vaulted `□` Diamond skips Blessing — anchor its partner (§5 A).

Slide `Stock+Waste+Vault` to the center as the **Descent**. Keep order, keep remaining redeals. Continue standard §3 pairing (`Stock` top may pair with `Waste` top / `Vault` top or clear solo on `13`; `Vault` FILO only top playable; Hearts `∩` / Spades Shovel still trigger if you clear a Blessed card in the Descent). Do **not** gather or shuffle the whole deck; do **not** start a new redeal; do **not** fan-count `leftover`.

For each pair or solo you clear in the Descent, immediately add one Anchor `—` to **both cards just cleared** (if solo, that one card). If a card is already a `+` Shield, skip it — no double-ink. `Freeze` (no legal moves and no redeals) ends the Descent. `0` remaining after the Descent = **Perfect Win** — slide back, then Graveyard Return `X→|X| 4` (§5 C).

Valid at all Scar stages including `2-Scar Scarred` and `3-4-Scar Cursed/Imperiled` until `5 Scars` Entombed. All marks additive red/blue ink, never erased. Isolation is physical: you moved the pile, each clear pings ink on the cards in front of you.

### C. Perfect Win Graveyard Return

On a **Perfect Win** only (pyramid *and* Stock+Waste+Vault empty, 0 leftover), after applying A–B above, shuffle the **Graveyard Box** (`X` 5-Scar Entombed cards) face-down and draw **one random card**. Return it to the active deck as **4 Scars `|X| 8` — Imperiled (Vulnerable to Entombment)** (still Cursed, still shifted; §5). Its prior Scars, Anchor/Shield, and Blessing ink are kept — it resumes with its dying `|X| 8` state, one Scar from death. If the Graveyard is empty, no return occurs. This is the sole way an `X` Entombed card re-enters play; all marks remain permanent and additive.

### D. Visual Reference Guide
Mutated physical cards retain clear visual separation between corner index marks and center face drawings:

```
+───────────────────────────+
| |7\| 8               [+]• |   <- Upper-Left: Scars 2/5 + value; Upper-Right: Shield + 2/4 red absorption blocks (dots in quadrants around +)
|  ♥  •                     |   <- Shield block quadrants (Red dots; 4th exhausts Shield → 0 Anchors)
|           ╭───╮           |   <- Center Face: Blessing or Curse (∩ □ Shovel ⊕ / ▼ ⏍)
|           │ ∩ │           |
|           │   │           |
|           ╰───╯           |
|                    •  ♥  •|
|  [+]•            |7\| 8   |   <- 180° symmetrical indices; Shield dots mirrored
+───────────────────────────+
```
*Upper-Right `+` shows 2 of 4 Shield blocks filled (two Red dots in quadrants). Empty quadrants remain blue `+`; filled quadrants are red ticks/dots. At 4/4 the Shield breaks.*



---

## 6. The Timing & Campaign Resets
Both Pyramid Clears and Perfect Wins are accomplishments, not endings. After scoring a Win and applying Survival Rewards (§6), you always continue to the Campaign Reset Protocol below — the tomb is cursed to endure until starvation.

### Resolution of Simultaneous End-States
If the final match played to clear the entire deck and achieve a **Perfect Win** includes a card with a penalty effect—such as a **Black Cursed card (`⏍`)** whose partner would normally be reshuffled back into the Stock pile—**the Perfect Win takes absolute priority.** The penalty effect is bypassed, both cards move to the Foundation, and the round is successfully cleared as a Perfect Win. Record the Perfect Win on your tally and proceed to the reset.

### Campaign Reset Protocol
1.  **Record the Win:** If the round ended in a Pyramid Clear or Perfect Win, add one to your Win tally (and, for a Perfect Win, one to your Perfect Win tally), then apply Survival Rewards (§6 A–C, including Graveyard Return for a Perfect). A Perfect Win counts as a Win.
2.  **Assemble Active Pool:** Gather all cards from the Foundation pile, remaining Stock, Waste, and the Diamond Vault (plus any Graveyard returnee). This forms your active pool. Leave all remaining `X` 5-Scar Entombed cards behind in the Graveyard Box.
3.  **Audit the Tomb:** Check the active pool against your active campaign end condition (Section 1). If you have fewer than 28 cards total in the active pool, the campaign ends in immediate defeat — record your final tallies as your score.
4.  **Shuffle and Re-Deal:** If you have 28 or more active cards, re-shuffle the active pool and deal a new 28-card pyramid according to the setup constraints. The curse continues.
5.  **Graveyard audit:** Graveyard cards remain separable and countable at any time. When you return one on a Perfect, it is already counted in the new active pool — do not double-count.
