# Proposal: Standard Center Card Suit Images

## Why

While the thematic Egyptian symbols (Ankh, Scarab, Khopesh, Was Scepter) in the center of cards were visually unique, players found them confusing during gameplay when quickly scanning for card suits. Replacing the center symbols with standard playing card suit icons (Hearts, Diamonds, Spades, Clubs) eliminates visual ambiguity and improves gameplay readability while maintaining clear suit recognition.

## What Changes

- **Standard Center Suit Icons**: Update the center zone of `PlayingCard` to render standard suit shapes (Hearts ♥, Diamonds ♦, Spades ♠, Clubs ♣) using clean, standard SVG vector paths matching the suit color (red for Hearts/Diamonds, dark obsidian for Spades/Clubs).
- **Remove Thematic Egyptian Center SVGs**: Replace the custom Ankh, Scarab, Khopesh, and Was Scepter SVG paths in `SuitIcon` with standard playing card suit SVGs.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `card-rendering`: Modify the central card suit icon requirement so that the central card zone renders standard suit SVG symbols (♥, ♦, ♠, ♣) instead of custom thematic Egyptian symbols (Ankh, Scarab, Khopesh, Was Scepter).

## Impact

- `src/components/PlayingCard.tsx`: Update `SuitIcon` SVG path definitions for Hearts, Diamonds, Spades, and Clubs to use standard suit vectors.
- `openspec/specs/card-rendering/spec.md`: Update requirement and scenarios for central suit iconography.
