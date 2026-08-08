# The Cursed Tomb — Example of Play

> Companion to `rules.md` (Ruleset v0.0.11). This is a scripted, annotated walkthrough — not a separate ruleset. All mechanics below follow Sections 1–7 of the official rules.

This example assumes **Archaeologist (1 Redeal)** and uses a single, invented shuffle so you can replay it at the table. Rank values: **A=1, 2–10 = face, J=11, Q=12, K=13**. Pairs must sum to **Functional Value 13** (§4). Kings (or any card whose Functional Value is 13) clear singly.

---

## 0. Before You Start — Ink Zones Reminder

Every marked card has two independent zones (§3, §6C):

* **Upper-Left / Bottom-Right:** Rank marks — Attrition strokes `|`, `||`, Scar `|̸| 8`, Curse `|X| 8`, Clubs Wildcard crossed-rank `X`.
* **Upper-Right / Bottom-Left:** Anchor — `—` (Fortifying) then `+` (Anchored, immune).
* **Center face:** Blessing `∩` `□` `Shovel` `⊕` *or* Curse `▼` `⏍` — never both (§4.4).

---

## 1. Setup — Round 1, Fresh Deck

You have a standard 52-card deck, red + blue fine-tip markers (§3), a d6 on **1**, and an empty Graveyard Box (§2).

Shuffle. Deal 28 cards face-up into a 7-row pyramid (1-2-3-4-5-6-7). The remaining 24 form the face-down **Stock**. Waste and Foundation start empty, Vault empty.

For this example, the bottom row (Row 7, 7 cards) reads left to right:

```
Row 1:                [K♣]
Row 2:              [5♥] [9♣]
Row 3:            [Q♦] [3♠] [K♠]
Row 4:          [2♥] [A♦] [8♠] [4♣]
Row 5:        [6♥] [6♠] [J♥] [10♦] [J♣]
Row 6:      [7♣] [5♦] [4♥] [9♥] [3♥] [2♠]
Row 7:    [Q♣] [8♥] [A♠] [10♣] [7♥] [4♦] [K♦]
```

All cards are unmarked (Stage 0) and exposed = only Row 7 plus any card not covered by the row below (§2). Die shows **1 Redeal** remaining.

---

## 2. Opening Moves — Standard Pairing, King, Stock Top

**Move 1 — Pyramid pair.** `Q♣ (12) + A♠ (1) = 13`. Both are exposed in Row 7. Pair them → both to Foundation (inert trophies, §2). Neither `7♣` nor `5♦` is exposed yet — each Row 6 card is covered by *two* Row 7 cards (`7♣` by `Q♣+8♥`, `5♦` by `8♥+A♠`) and `8♥` still remains, so `8♥` must also be cleared before those Row 6 cards become exposed (§2, §4).

**Move 2 — King solo.** `K♣` in Row 1 is not yet exposed (still covered). But `K♦` in Row 7 *is* exposed. Clear `K♦` singly → Foundation. `2♠` in Row 6 is *not* yet exposed — it is still covered by `4♦` (Row 7 col6) even after `K♦` (col7) is gone; each pyramid card needs *both* cards below it removed to become exposed.

**Move 3 — Using the Stock top.** No exposed pyramid pair sums to 13. Draw: flip Stock top `Q♥ (12)` face-up — it sits *on* Stock, not yet in Waste (§4 Stock & Waste Pairing Rules). It is active. `A♦ (1)` is exposed in Row 4. `Q♥ + A♦ = 13` → pair Stock top with pyramid card → both to Foundation. The next Stock card becomes the new top. You did **not** discard to Waste, so redeals unchanged.

**Move 4 — Pass to Waste.** Next Stock top is `3♣ (3)`. No exposed 10 available. You choose to pass: place `3♣` onto Waste (face-up, top of Waste). Die still on **1** — passing never costs a redeal (§4).

Table now:

```
Waste (top →): [3♣]
Stock (top →): [9♦] ...
Foundation: Q♣ A♠ K♦ Q♥ A♦ (5 cards)
```

Waste top `3♣` is now pairable with exposed `10♦ (10)` in Row 5 → `3+10=13`. Pair Waste top with pyramid → both to Foundation. Waste is now empty again.

**Redeal.** Eventually Stock empties. With Waste holding, say, 8 cards and Die on **1**, you *cycle*: pick up entire Waste, flip face-down as new Stock, decrement Die **1 → 0**. This is a **Redeal** (§3). Vault cards (none yet) would survive this step — they stay beside the table.

---

## 3. Mid-Game — Scars Change Math (§4.1, §5 Stage 3)

Play continues until the game freezes: no exposed pair sums to 13, Stock top cannot pair, and redeals are exhausted (here, 0). Suppose the frozen pyramid's exposed bottom tiers are:

```
Exposed bottlenecks: [7♥ (printed 7, red)]  [4♦ (4, red)]  [2♠ (2, black)]
All other remaining cards are still blocked.
```

Per §5 you lose the round. Identify **Bottlenecks** — *every* exposed card at the lowest remaining base tiers — not just one. Each gets **one** Attrition stroke (§5):

* Before: `7♥` was unmarked. → Stage 1 `|7` (red `|` left of rank, no effect).
* `4♦` unmarked → `|4`.
* `2♠` unmarked → `|2`.

Assemble Active Pool (§7): gather Foundation + Stock + Waste + Vault (Vault empty). No cards are Entombed yet, so 52 cards shuffle for Round 2.

### Round 2 — Same `7♥` Returns

Round 2's pyramid happens to place that same physical `7♥ |7` in Row 4. Later you freeze again with `7♥` still a bottleneck. It advances:

* Stage 1 `|7` → Stage 2 `|7|` (add right-hand `|`, still no effect).

### Round 3 — The Scar

Freeze again, `7♥ |7|` is still a bottleneck. Third stroke is diagonal `\` across the rank plus writing the new **Functional Value** to the right (§5 Stage 3):

* Red suits shift **+1**: `7♥` printed 7 → functional **8**. You draw `|7̸| 8` in red in the Upper-Left.
* Had this been a black card, e.g., `2♠ |2|` → `|2̸| 1` (2 − 1 = 1). A scarred Black Ace `A♠` would wrap `1 − 1 → 13` and clear solo as a King; a scarred Red King `K♥` would wrap `13 + 1 → 1` and pair with a Queen.

That `7♥` now pairs as an **8**: e.g., with a `5` (8+5=13), *not* with a 6. Its Printed Rank is still 7 for Tomb Collapse checks (§2).

### Round 4 — The Curse

One more freeze as bottleneck → Stage 4 `|7X| 8`: add forward slash `/` forming `X` over rank. Now enforce §4.2/4.3:

* Because `7♥` is **Red Cursed** `|X|`, the *next* time you deal a pyramid and this card lands, say, in Row 2, the two cards that would overlap it in Row 3 must be dealt **face-down**. When those face-down cards later become exposed (no cards cover them), you flip them face-up (§4.2, `▼` trap-door icon in center).
* Had it been a **Black Cursed** card like `10♣ |10X| 9`, its trap is different: when you later pair that `10♣ (now 9)` with, say, `4♦ (4)` → `9+4=13`, the Black Cursed `10♣` goes to Foundation, but its partner `4♦` does **not** — it is shuffled back into the face-down Stock (§4.3, `⏍` weight icon). If *both* paired cards are Black Cursed, each partner is recycled.

**Mutual exclusivity reminder (§4.4):** If this `7♥` had been a Blessed Hero (see §6) when it hit Stage 4, you would still draw `|X|` over the rank, but you would **skip** both the trap and the curse illustration — it keeps its blessing.

---

## 4. The Vault — Diamond Blessing in Action (§2, §6A ♦)

Late in Round 3 you achieved a **Pyramid Clear** (all 28 pyramid cards cleared, with cards left in Stock/Waste). The final pair that cleared the pyramid was:

```
Final pair:  8♦ (8, functional 8)  +  5♥ (5, functional 5) — both clean, unblessed, uncursed
Higher value 8 → Hero, lower value 5 → Anchor (§6A)
```

`8♦` is the higher-value card, unblessed and not cursed → it becomes the Hero. You draw **Vault Box `□`** in blue on the center of the physical `8♦`. `5♥` is the lower-value card → it receives Anchor progress (`—` then `+` on a future clear).

> **If the higher-value card had been already blessed or Stage 4 Cursed:** per §6A you skip the blessing entirely — no promotion. Example: `Q♥ (12, already blessed) + 8♦ (8)` → `Q♥` is skipped, `8♦` does **not** become Hero; `8♦` instead receives the Anchor stroke and no new blessing is awarded that round.

**Next round, vaulting is free.** Early in Round 4:

* `8♦ □` appears as **Stock top** → you may *instantly* place it face-up into the Vault beside the table, free action (§2, §6A). It does not cost a turn, does not go to Waste, and survives redeals.
* Later, `4♦ □` appears exposed in the pyramid → also vault it. Vault now has a **FILO stack**: bottom `[8♦]`, top `[4♦]`. Only the top `4♦` is pairable. Pairing `4♦ (4) + 9♣ (9) = 13` → `4♦` to Foundation, revealing `8♦` underneath, now the playable top.
* A third blessed Diamond later vaults on top again — unlimited stacking, always last-in first-out.

At campaign reset (§7), you gather Vault cards into the Active Pool like everything except Graveyard.

---

## 5. Pyramid Clear — Blessings & Anchors (§6)

Back to that Round 3 Pyramid Clear final pair in detail:

Suppose the last two exposed cards were:

```
Card A: J♥ (11, printed J, functional 11) — clean, unblessed
Card B: 2♠ (2, printed 2, functional 2) — clean, unblessed, blocked nothing else
11 + 2 = 13 → last pair, pyramid empty.
```

* **Higher value 11 → Hero (Blessed).** `J♥` gets the Hearts blessing: draw Tomb Archway `∩` in blue center. In all future rounds, *whenever that physical `J♥ ∩` is cleared*, immediately shuffle the entire Waste pile back into Stock **without** spending the Die (§6A ♥). Foundation cards never interact — only Waste → Stock.
* **Lower value 2 → Anchor.** `2♠` gets `—` in Upper-Right (Fortifying, Stage 1). No immunity yet. A second Anchor as lower card in a future clear would cross it to `+` (Anchored, §6A), making it immune to all future Attrition (§5 Immunity Exception + §4.5).

**Wildcard Partner Rule in effect.** Suppose instead the final pair had been:

```
Card A: 9♠ (9) — clean
Card B: 4♣ ⊕ (4, Clubs blessed Wildcard, functional value ignored)
```

Even though `9 > 4`, the Wildcard **cannot** become Hero again. So `4♣ ⊕` automatically becomes the Anchor (`—`/`+`), and `9♠` becomes the Hero (gaining its suit blessing, unless already blessed or Stage 4 Cursed). If *both* were Wildcards, neither gets a blessing; you choose one to receive the Anchor stroke (§6A Wildcard Partner Rule).

**Solo clear.** If the last card had been a lone `K♣` (or any card functioning as 13), no blessing is awarded — that card gets the Anchor stroke only (§6B).

Anchor progress continues even on Scarred/Cursed cards until Entombed; once a card reaches `+`, it never takes Attrition again (§4.5, §6 note).

---

## 6. Freeze with an Anchored Card

Round 5 freezes with bottlenecks `8♦ □ (Anchored +)` and `5♠ |5|`. Per §5:

* `8♦ □ [+]` — **skip** Attrition entirely (Immunity Exception).
* `5♠ |5|` → `|5̸| 4` (black, −1). Mark in red. The Anchored Vault card stays pristine.

---

## 7. Entombment & Graveyard (§5 Stage 5)

`7♥` has survived to Stage 4 `|7X| 8`. One more freeze as bottleneck:

* Stage 4 → Stage 5: draw a giant `X` across the entire face in red (§5 Entombed). Place it in the **Graveyard Box** (§2). It is permanently removed. From now on your Active Pool is 51 cards. Starvation (§1) is still far away (you need <28 to collapse), but losing the fourth `7` would trigger the optional Volatile Collapse variant if you are playing with it.

---

## 8. Campaign Reset & Audit (§7)

After each round (clear or freeze):

1. **Assemble:** Foundation + Stock + Waste + Vault → Active Pool. Leave Graveyard cards behind.
2. **Audit:** Is Active Pool < 28? → **Starvation** defeat, mandatory (§1). If playing with Volatile variant, does any Printed Rank have *all four* copies in Graveyard? → Volatile defeat (§1.2). Otherwise, shuffle Active Pool and deal a new 28-card pyramid — remembering:
   * Red Cursed cards force face-down deals below them (§4.2).
   * Vault-eligible Diamonds can be vaulted instantly when exposed.

**Perfect Win priority (§7 Resolution):** If the *very last* pair that empties not just the pyramid but also Stock/Waste/Vault (i.e., all cards reach Foundation) includes a Black Cursed card, ignore its weight penalty — both cards go to Foundation and you record a Perfect Win. This is an accomplishment; per §7 you continue the campaign unless you choose to retire.

---

## 9. Quick Reference — What to Mark, Where

| Mark | Zone | Ink | When |
|---|---|---|---|
| `|` `||` | Upper-Left rank pip | Red | Stage 1–2 Attrition (§5) |
| `|N̸| V` (slash + new value) | Upper-Left rank pip | Red | Stage 3 Scar (§5), V = Functional Value (+1 red, −1 black, wrap 1↔13) |
| `|NX| V` (cross) | Upper-Left rank pip | Red | Stage 4 Curse (§5) |
| `▼` / `⏍` | Center face | Red | Curse illustration (§4.2–4.3) — skipped if already blessed |
| `∩` `□` `Shovel` `⊕` | Center face | Blue | Hero Blessing (§6A) — skipped if already blessed or cursed |
| `X` over rank | Upper-Left rank pip | Blue | Clubs Wildcard crossed-rank (§6A ♣) |
| `—` then `+` | Upper-Right margin | Blue | Anchor Fortifying → Anchored (§6), immune thereafter |
| Giant `X` | Entire face | Red | Entombed → Graveyard (§5 Stage 5) |

Face-down cards from Red Curses are temporary — flip face-up the moment they become exposed. Vault cards never enter Waste/Stock cycles until the round ends.

---

*Try replaying the scripted shuffle above solo once, then start a real campaign at **Novice (5 Redeals)** to learn the mutation rhythm before moving to Archaeologist. For the digital implementation, see the web game's **📖 Expedition Rules** and **Card Anatomy** tabs — they render these same zones with digital ink styling.*
