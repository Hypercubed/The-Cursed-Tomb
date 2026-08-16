---
title: "Standard Pyramid Solitaire"
subtitle: "Classic Rules Foundation"
description: "Classic Pyramid Solitaire rules that form the foundation for The Cursed Tomb campaign mechanics."
license: "CC0-1.0"
spdx: "CC0-1.0"
---

<!--
SPDX-License-Identifier: CC0-1.0
No copyright is claimed over the underlying game of Pyramid Solitaire,
which is in the public domain. To the extent copyright exists in this
summary text, it is waived under CC0 1.0 Universal
(https://creativecommons.org/publicdomain/zero/1.0/).
See docs/LICENSE for details. Part I of the PDF rulebook (this document)
is therefore public domain / CC0, unlike Parts II & III which are CC BY-SA 4.0.
-->

# Standard Pyramid Solitaire Rules

> **Classic Pyramid Solitaire Foundation**
> 
> *The Cursed Tomb* is built upon standard Pyramid Solitaire. Understanding standard rules helps you master campaign mechanics and persistent legacy ink modifications.

---

## Definitions & Zones

*   **The Pyramid:** 28-card layout in 7 overlapping rows (§1).
*   **Exposed Card:** A pyramid card with no cards overlapping it from the row below; only exposed cards may be paired or cleared singly as a King.
*   **The Foundation:** Separate pile for cleared pairs and solo Kings — the destination for all removed cards.
*   **The Stock:** Face-down draw pile of the remaining 24 cards; turn top card face-up before it enters the Waste.
*   **The Waste (Talon):** Face-up discard pile where exposed Stock cards land when not paired; may be flipped as a block to redeal (not shuffled, §3).

---

## 1. Layout & Objective

### Pyramid Layout
28 cards are dealt face-up into 7 overlapping rows forming a pyramid (each card overlap covers corners of the card above; only base row is never overlapped):

```
              ┌───┐
              │ 1 │
            ┌─┴───┴─┐
            │ 2 │ 3 │
          ┌─┴───┴───┴─┐
          │ 4 │ 5 │ 6 │
        ┌─┴───┴───┴───┴─┐
        │ 7 │ 8 │ 9 │10 │
      ┌─┴───┴───┴───┴───┴─┐
      │11 │12 │13 │14 │15 │
    ┌─┴───┴───┴───┴───┴───┴─┐
    │16 │17 │18 │19 │20 │21 │
  ┌─┴───┴───┴───┴───┴───┴───┴─┐
  │22 │23 │24 │25 │26 │27 │28 │  7 cards — Row 7 (base)
  └───┴───┴───┴───┴───┴───┴───┘
```

`1+2+3+4+5+6+7 = 28`. Rows 1–6 each overlapped by two cards below; Row 7 holds `22–28` at the base.

### Exposed Cards
Only cards with no overlapping cards beneath them in lower rows are exposed and available to pair. A card becomes exposed when both cards directly below it have been cleared.

### Win Condition
Dismantle the pyramid by clearing all 28 cards to the Foundation pile.

### The Foundation
Cleared pairs (and solo Kings) are placed face-up in the **Foundation** — a separate destination pile of completed matches.

---

## 2. Target Sum 13 Pairing Rules

Cards are cleared by selecting pairs of exposed cards whose values sum exactly to **13**:

| Pair | Sum |
|------|-----|
| **King (13)** | Clears solo (1 click) |
| **Queen (12) + Ace (1)** | 13 |
| **Jack (11) + 2** | 13 |
| **10 + 3** | 13 |
| **9 + 4** | 13 |
| **8 + 5** | 13 |
| **7 + 6** | 13 |

### Card Values
- **Ace (A)** = 1
- **2–10** = Face value
- **Jack (J)** = 11
- **Queen (Q)** = 12
- **King (K)** = 13

---

## 3. Stock Draw & Waste Pile

### Stock Draw
The remaining cards form the face-down **Stock pile**. Turn the top Stock card face-up — it is immediately **exposed** and may be paired (or cleared solo as a King) before it enters the Waste pile. If no other move is played, that exposed Stock card is then placed face-up on the **Waste pile** (the face-up discard pile).

### Eligible Cards
The following cards can be paired together:
- Top card of the Waste pile
- Current exposed Stock card (before it enters Waste)
- Exposed Pyramid cards

### Redeals
When the Stock is exhausted, the **Waste pile is picked up and flipped over** as a block (turned face-down, **not shuffled**) to form a new Stock pile — this preserves the original Stock deal order — and dealing continues. House rules vary — some allow **1 redeal** (2 total passes; *The Cursed Tomb* Archaeologist setting), others play **up to 2 redeals** (3 passes, as on semicolon.com). After the allowed redeals are used, no further cycling is permitted and the game ends when no moves remain.

In *The Cursed Tomb* you choose the limit up front via Difficulty (§5 of the main rules).

---
