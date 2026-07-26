## Context

The Pyramid Solitaire game currently uses dark basalt slate card faces (`#2d241d`), dark low-contrast text, dark panel backgrounds, and custom Egyptian SVG icons in corner indices. This leads to poor visual readability, particularly on small screens or when cards are blocked by overlaying rows.

## Goals / Non-Goals

**Goals:**
- Dramatically increase card readability and scanning speed during gameplay.
- Introduce warm, high-contrast light parchment card faces while maintaining the ancient Egyptian tomb aesthetic.
- Implement dual-badge suit iconography (standard classic suit characters in corners for instant scanability + thematic Egyptian SVG icons in center zone).
- Increase corner index font size, add bottom-right corner rotation/mirroring, and refine blocked card contrast.

**Non-Goals:**
- Changing core Pyramid Solitaire game rules, scoring logic, or win conditions.
- Completely removing tomb theme elements (ambient torch overlay, sandstone textures, and Cinzel display font will remain).

## Decisions

### Decision 1: High-Contrast Parchment Card Palette & Tokens
- **Choice**: Change `game-card-bg` to `#f5f0e6` (Warm Parchment), `game-card-text` to `#1c1710` (Dark Obsidian), `game-red` to `#dc2626` (Crisp Crimson), and update `game-panel` to `#241e17`.
- **Rationale**: Light parchment card faces create an immediate contrast pop against the dark stone board background (`#0d0a07` / `#241e17`).
- **Alternatives Considered**:
  - *Keep dark cards and only brighten text*: Insufficient contrast improvement for tiny suit icons.
  - *Lighten the entire app background to white*: Destroys the immersive tomb atmosphere.

### Decision 2: Dual-Badge Iconography System
- **Choice**:
  - Corner indices (top-left and rotated bottom-right): Standard unicode suit characters (`♥`, `♦`, `♠`, `♣`) paired with rank labels (`text-xs` / `text-sm font-bold`).
  - Center card zone: Large thematic Egyptian SVG artwork (Ankh for Hearts, Scarab for Diamonds, Khopesh for Spades, Was Scepter for Clubs).
- **Rationale**: Players instantly recognize Hearts/Diamonds/Spades/Clubs in corners, while enjoying Egyptian artwork on card faces.
- **Alternatives Considered**:
  - *Full classic playing card suit icons only*: Removes the unique Egyptian flavor.
  - *Full Egyptian icons only*: Maintained the original obscure icon readability issue.

### Decision 3: Translucent Stone Overlay for Blocked Cards
- **Choice**: Replace `brightness-[0.65]` filter with a subtle dark stone veil overlay (`bg-stone-900/35 backdrop-brightness-[0.85]`).
- **Rationale**: Blocked cards remain clearly readable while unmistakably signaling their unplayable/blocked state.

## Risks / Trade-offs

- **[Risk]** Color token changes might affect other components relying on `game-card-text` or `game-card-bg`.
  - *Mitigation*: Audit `GameSidebar.tsx`, `DrawZone.tsx`, and `PyramidBoard.tsx` to verify clean contrast across all panels.
- **[Risk]** Red suits on parchment might look too vibrant.
  - *Mitigation*: Tune crimson `#dc2626` to match warm sandstone palette tones.
