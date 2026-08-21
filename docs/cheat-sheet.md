---
title: "The Cursed Tomb"
subtitle: "Campaign Cheat Sheet & Quick Reference"
version: "0.0.13"
date: "2026-08-16"
version: "0.0.14"
date: "2026-08-20"
status: "draft"
description: "Terse quick-reference cheat sheet covering campaign structure, scar track, shield, curse traps, hero blessings, and card anatomy for The Cursed Tomb."
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

# The Cursed Tomb — Campaign Cheat Sheet

Quick-reference reference guide for **The Cursed Tomb** campaign rules, progression, blessings, curses, and markings.

---

## 1. Campaign Structure & Setup

* **Components:** Standard 52-card poker deck, red & blue fine-tip felt markers, Graveyard Box, d6 / tokens for redeals.
* **Objective:** **The Tomb is cursed to fail.** No final victory — score as many **Wins** (Pyramid Clear 28 or Perfect 52, §6/§7) as you can before Starvation.
* **The Tomb Collapses (Defeat):** Instant defeat if active deck pool has **< 28 cards** at round start (Starvation). Sole defeat; Perfect/Pyramid are not endings.
* **Campaign Reset Protocol:** Active Pool = Foundation + Stock + Waste + Vault (+ any Graveyard return on Perfect §7; exclude remaining Graveyard). Re-shuffle and deal 28-card pyramid (7 rows: 1–7).

### Global Difficulty Modes

| Difficulty | Allowed Redeals | Total Passes | Description |
|---|:---:|:---:|---|
| **Novice** | **∞** | Unlimited | Sandbox mode for casual exploration & learning. |
| **Explorer** | **2** | 3 Passes | Balanced entry campaign challenge. |
| **Archaeologist** | **1** | 2 Passes | Official baseline Egyptian expedition rules. |
| **Survivalist** | **0** | 1 Pass | Single pass through Stock; unforgiving test of survival. |

---

## 2. The Scar Track & Shield

When a round freezes (no legal moves left), all exposed **bottleneck cards** at the lowest remaining base tiers take **1 red Scar** (Upper-Left index). Five Scars = Entombed. A completed **Shield** (`+`, 2 Anchors) absorbs a Scar as one **red block** in a quadrant around the `+` instead.

### The Scar Track (Upper-Left, Red Strokes)

| Scars | Pip Mark | Value / Curse | Effect |
|---|:---:|:---:|---|
| **1** | `|7` | — | 1st bar left of rank. **Vulnerable**, no effect. |
| **2** | `|\7 8` | Red +1 / Black -1 | Backslash `\` across rank; new **Functional Value** right. Wraps 1↔13. |
| **3** | `|X 8` | Red +1 / Black -1 | `X` (`\`+`/`); **Cursed** — trap/weight. |
| **4** | `|X| 8` | Red +1 / Black -1 | Right bar `|` → `|X|`; **Imperiled** — still Cursed, next Scar entombs. |
| **5** | `X` | — | **Entombed** face-down → Graveyard Box (removed until Perfect §7 returns it as 4 Scars `|X|`). |

### Curse Traps (3–4 Scars)

| Scars | Color | Curse Name | Center Icon | Effect |
|---|:---:|---|---|---|
| 3–4 | **Red** (♥ / ♦) | **The Trap** | **`▼`** | **Pyramid Deal:** Overlapping next row dealt **face-down**. Flip when exposed. |
| 3–4 | **Black** (♠ / ♣) | **Recycled Weight** | **`⏍`** | **Pairing:** Cursed to Foundation; partner **shuffles back into Stock** (if both Cursed: higher value to Foundation, lower to Stock). |

### Scar / Shield Rules
* **Mutual Exclusivity:** A card carries either a Blessing OR a Curse center icon — never both.
* **Blessed at 3+ Scars:** Receives `|NX|` / `|NX|` marks and can advance to `X` Entombed, but **skips** Curse trap/weight and keeps Blessing.
* **Cursed as Hero:** If a 3- or 4-Scar Cursed card is the primary Blessing candidate, the **Blessing is offered to the lower card instead** (§3); if both are cursed/blessed, **no Blessing**.
* **Perfect Priority:** Final pair clearing the entire deck ignores the Black Curse partner reshuffle.
* **Shield absorbs Scars:** A `+` Shield contains **4 red blocks** (quadrants around `+`). Each freeze that would add a Scar instead fills one block; on the 4th the Shield exhausts (→ 0 Anchors), Scars preserved. **Imperiled `|X|` is still Cursed** — it retains `X` trap/weight until entombed.
* **Perfect Graveyard Return (§3 C):** Perfect Win shuffles Graveyard face-down, draws 1 random `X` Entombed card, returns it as **4 Scars `|X|` Imperiled** (keeps prior Scar/Anchor/Blessing ink, still Cursed). If empty, nothing happens.

---

## 3. Hero Blessings & The Descent

Unlocked on **any Win** (Pyramid Clear 28 or Perfect 52). Compare the **final pair's Functional Values**:

* **Blessing (1 per Win, with fallback):** Higher-value card is primary. Draw its suit icon (Blue, center face) if **not already blessed and <3 Scars** (not yet Cursed). If primary is ineligible (already blessed — e.g., vaulted Diamond `□` — or 3+ Scars), offer to the **lower card** instead if eligible. If both ineligible, **no Blessing**. Vaulting the last pyramid Diamond `♦` counts as a Win; the vaulted card is the hero (already blessed, so skipped) and only Anchors (§5 B) apply. Solo `K`/`13` gives no Blessing.
* **The Descent — Post-Pyramid Anchors (both cards):** The instant the pyramid hits 0, score `1B+1A` (higher Blessed if eligible, lower `—→+`; solo `K` `+`). Slide `Stock+Waste+Vault` to center — keep order, keep remaining redeals, no gather/shuffle. Continue `Stock top ↔ Waste/Vault top` pairing (§3) until freeze. **Each pair or solo cleared in the Descent adds one Anchor to both cards just cleared** (solo → that card; if already `+` skip). `0` after Descent = Perfect → Graveyard Return.

### Hero Blessings Lookup

| Suit | Blessing Name | Center Icon | Effect Summary |
|---|:---:|---|
| **♥ Hearts** | **Stock Reshuffle** | **`∩`** Archway | **On Clear:** Immediately shuffle all face-up Waste cards into face-down Stock without spending a redeal. |
| **♦ Diamonds** | **The Vault** | **`□`** Vault Box | **Anytime Exposed:** Free action to place into FILO Vault stack; unblocks cards beneath; survives redeals. |
| **♠ Spades** | **The Tunnel** | **Shovel** | **On Clear:** Move any 1 exposed pyramid card directly to the top of the Waste pile. |
| **♣ Clubs** | **Universal Wildcard** | **`⊕`** Sun Cross | **When Pairing:** Cross out rank digit (`X`); pairs with **ANY exposed card** (as `0–12` to sum 13); **cannot clear solo** as 13. |

### Anchors & Shield
* **1st Anchor `[ — ]` (Fortified):** Horizontal line Upper-Right. No effect.
* **2nd Anchor `[ + ]` (Shield):** Vertical crossing `+`. Grants **4 Scar blocks** (quadrants around `+`).
* **Shield blocks:** Each freeze that would add a Scar instead fills one red dot/tick (`1/4` → `4/4`). On the 4th the Shield breaks (→ 0 Anchors), Scars preserved. Valid at all Scar stages including Scarred/Cursed/Imperiled until 5 Scars Entombed.
* **Wildcard Partner Rule:** If the final pair includes an existing ♣ Wildcard (`⊕`), it cannot receive another Blessing and is **not eligible as primary** — it may only be the fallback lower candidate. If both are Wildcards, **no Blessing**.

### C. Perfect Win Graveyard Return (§3/§7)
* **On Perfect only (0 leftover after Descent):** After A–B The Descent above, shuffle Graveyard (`X` 5-Scar Entombed cards) face-down, draw **1 random card**, return to active deck as **4 Scars `|X| 8` — Imperiled** (keeps prior Scar/Anchor/Blessing ink, still Cursed, one Scar from death). If empty, no effect. Sole way an `X` re-enters play; all marks remain permanent and additive.

---

## 4. Card Anatomy & Ink Zone Layout

Physical card modifications are strictly confined to distinct visual zones:

```
+───────────────────────────+
| |\7 8              [+]• |   <- Upper-Left: Scars + value (`|\7`: 2 Scars); Upper-Right: Shield + 2/4 red blocks
|  ♥  •                     |   <- Shield quadrants (Red dots; 4th exhausts Shield → 0)
|           ╭───╮           |   <- Center Face: Blessing or Curse (∩ □ Shovel ⊕ / ▼ ⏍)
|           │ ∩ │           |
|           │   │           |
|           ╰───╯           |
|                    •  ♥  •|
|  [+]•            |\7 8   |   <- 180° symmetrical; Shield dots mirrored
+───────────────────────────+
```
*`+` shows 2/4 Shield blocks (two red dots); empty quadrants stay blue. At 4/4 the Shield breaks.*

### Zone & Color Summary

| Zone | Modification | Ink Color | Marks & Symbols |
|---|---|:---:|---|
| **Upper-Left Corner** | Scars (1–5) | **Red** | `|7` (1 Vulnerable) → `|\7 8` (2 Scarred) → `|X 8` (3 Cursed) → `|X| 8` (4 Imperiled) → `X` (5 Entombed) |
| **Upper-Left Corner** | Wildcard Rank | **Blue** | `X` crossed over rank pip (♣ Clubs Wildcard) |
| **Center Face** | Hero Blessings | **Blue** | `∩` (Hearts), `□` (Diamonds), Shovel (Spades), `⊕` (Clubs) |
| **Center Face** | Curse Traps | **Red** | `▼` (Red Trap), `⏍` (Black Weight) |
| **Upper-Right Margin** | Anchors / Shield | **Blue** | `—` (1 Fortified), `+` (2 = Shield) |
| **Around Upper-Right `+`** | Scar Absorption Blocks | **Red** | 1 to 4 dots/ticks in outer quadrants around `+` |
| **Graveyard Box** | Entombed | — | `X` 5-Scar cards (face-down, out of pool) |
