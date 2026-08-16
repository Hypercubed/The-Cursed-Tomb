---
title: "The Cursed Tomb"
subtitle: "Campaign Cheat Sheet & Quick Reference"
version: "0.0.12"
date: "2026-08-15"
status: "draft"
description: "Terse quick-reference cheat sheet covering campaign structure, attrition, curse traps, hero blessings, defensive immunity, and card anatomy for The Cursed Tomb."
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
* **Objective:** Achieve a **Perfect Win** (clear all 52 cards into the Foundation) or survive as many rounds as possible.
* **The Tomb Collapses (Defeat):** Instant defeat if active deck pool has **< 28 cards** at round start (Starvation).
* **Campaign Reset Protocol:** Active Pool = Foundation + Stock + Waste + Vault (exclude Graveyard). Re-shuffle and deal 28-card pyramid (7 rows: 1–7).

### Global Difficulty Modes

| Difficulty | Allowed Redeals | Total Passes | Description |
|---|:---:|:---:|---|
| **Novice** | **∞** | Unlimited | Sandbox mode for casual exploration & learning. |
| **Explorer** | **2** | 3 Passes | Balanced entry campaign challenge. |
| **Archaeologist** | **1** | 2 Passes | Official baseline Egyptian expedition rules. |
| **Survivalist** | **0** | 1 Pass | Single pass through Stock; unforgiving test of survival. |

---

## 2. The Attrition Track & Curse Traps

When a round freezes (no legal moves left), all exposed **bottleneck cards** at the lowest remaining base tiers take 1 red ink stroke across their rank number pip.

### The Attrition Failure Track

| Stage | Pip Mark | Value Shift | In-Game Effect |
|---|:---:|:---:|---|
| **1. Vulnerable** | `\|7` | None | 1st vertical stroke left of rank. No mechanical effect. |
| **2. Doubtful** | `\|7\|` | None | 2nd vertical stroke right of rank (framing digit). No mechanical effect. |
| **3. The Scar** | `\|7\\|8` | Red +1 / Black -1 | Backslash `\` across rank; new **Functional Value** written to right. Wraps 1↔13. |
| **4. The Curse** | `\|7X\|8` | Red +1 / Black -1 | Forward slash `/` forms `X` over rank + draw center curse icon. Enforces trap/weight. |
| **5. Entombed** | `[ X ]` | None | Giant `X` across face. **Permanently destroyed**; move to Graveyard Box. |

### Curse Traps Lookup (Stage 4)

| Suit / Color | Curse Name | Center Icon | Trap / Penalty Effect |
|---|---|:---:|---|
| **Red** (♥ / ♦) | **The Trap** | **`▼`** Triangle | **Pyramid Deal:** Overlapping cards dealt in next row are dealt **face-down**. Flip when exposed. |
| **Black** (♠ / ♣) | **Recycled Weight** | **`⏍`** Weight | **Pairing Penalty:** Cursed card goes to Foundation; paired partner **shuffles back into Stock**. |

### Curse Rules & Interactions
* **Mutual Exclusivity:** A card carries either a Blessing OR a Curse illustration on its center face—never both.
* **Blessed at Stage 4:** Receives `|NX|` rank mark and can be Entombed, but **skips** Curse trap/weight and keeps Blessing.
* **Cursed as Hero:** If a Stage 4 Cursed card is cleared as Hero, the **Blessing award is skipped**.
* **Simultaneous Perfect Win Priority:** Final pair clearing the entire deck ignores Black Curse partner reshuffle penalty.

---

## 3. Hero Blessings & Defensive Immunity

Unlocked on a **Pyramid Clear** (all 28 pyramid cards cleared). The final card play awards legacy unlocks:
* **Higher-Value Card:** Becomes the **Blessed Hero** (draw suit icon in Cobalt Blue ink on center face).
* **Lower-Value Card / Solo King (13):** Progresses defensive **Anchor track** in upper-right margin (`—` → `+`).

### Hero Blessings Lookup

| Suit | Blessing Name | Center Icon | Effect Summary |
|---|---|:---:|---|
| **♥ Hearts** | **Stock Reshuffle** | **`∩`** Archway | **On Clear:** Immediately shuffle all face-up Waste cards into face-down Stock without spending a redeal. |
| **♦ Diamonds** | **The Vault** | **`□`** Vault Box | **Anytime Exposed:** Free action to place into FILO Vault stack; unblocks cards beneath; survives redeals. |
| **♠ Spades** | **The Tunnel** | **Shovel** | **On Clear:** Move any 1 exposed pyramid card directly to the top of the Waste pile. |
| **♣ Clubs** | **Universal Wildcard** | **`⊕`** Sun Cross | **When Pairing:** Cross out rank digit (`X`); pairs with **ANY exposed card** regardless of rank/value. |

### Defensive Immunity: Anchors & Absorption Shield
* **1st Clear `[ — ]` (Fortifying):** Single horizontal line in upper-right margin. No mechanical effect.
* **2nd Clear `[ + ]` (Anchored):** Crossed vertically (`+`). Grants a **4-hit Absorption Shield**.
* **Absorption Shield:** Anchored cards absorb freeze hits instead of advancing Attrition stages. Mark 1 red dot/tick in an outer quadrant around `+` per hit (`1/4` → `2/4` → `3/4` → `4/4`).
* **Shield Exhaustion:** On the 4th hit, shield breaks (returns to un-anchored). Existing Scars/Curses are preserved.
* **Wildcard Partner Rule:** Existing ♣ Wildcard in final pair automatically takes Anchor stroke; partner gains Hero Blessing.

---

## 4. Card Anatomy & Ink Zone Layout

Physical card modifications are strictly confined to distinct visual zones:

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

### Zone & Color Summary

| Zone | Modification | Ink Color | Marks & Symbols |
|---|---|:---:|---|
| **Upper-Left Corner** | Rank Modifications | **Red** | `|` (Stage 1), `||` (Stage 2), `|N̸| V` (Stage 3 Scar), `|NX| V` (Stage 4 Curse) |
| **Upper-Left Corner** | Wildcard Rank | **Blue** | `X` crossed over rank pip (♣ Clubs Wildcard) |
| **Center Face** | Hero Blessings | **Blue** | `∩` (Hearts), `□` (Diamonds), Shovel (Spades), `⊕` (Clubs) |
| **Center Face** | Curse Traps | **Red** | `▼` (Red Trap), `⏍` (Black Weight) |
| **Upper-Right Margin** | Defensive Immunity | **Blue** | `—` (Fortifying Stage 1), `+` (Anchored Stage 2) |
| **Around Upper-Right `+`** | Absorption Hits | **Red** | 1 to 4 dots/ticks in outer quadrants around `+` |
| **Entire Card Face** | Entombment | **Red** | Giant `X` across face (Stage 5 Entombed → Graveyard) |
