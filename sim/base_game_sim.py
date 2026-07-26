#!/usr/bin/env python3
"""
Base Game Single-Round Simulator
=================================
Simulates the base game as implemented in the UI:
- Standard pyramid solitaire, 7 rows, 28 pyramid cards, 24 stock cards
- No scars, curses, blessings, or attrition (all legacy mechanics off)
- Win = clearing all pyramid cards (pyramid_clear OR perfect_win)
- Loss = frozen (no legal moves, no draws/redeals left)

Runs N games and reports:
  - Victory rate (% games where pyramid is cleared)
  - Collapse rate (% games where player is stuck)
  - Avg rounds (always 1, since each game = 1 round; not meaningful here)

Redraw options tested match the UI: 0, 1, 2, Infinite (9999).
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import random
import statistics
from cursed_tomb_sim import play_round, CardState, RuleFlags, SUITS, RANKS

BASE_FLAGS = RuleFlags(
    scars=False,
    curses=False,
    blessings=False,
    attrition=False,
    volatile_collapse=False,
)

REDRAW_OPTIONS = [
    ("0 redraws (Survivalist)", 0),
    ("1 redraw  (Archaeologist)", 1),
    ("2 redraws (Explorer)", 2),
    ("Infinite  (Novice)", 9999),
]

def create_fresh_pool():
    """52 pristine cards — no campaign state."""
    return [CardState(r, s) for s in SUITS for r in RANKS]

def run_single_game(pool, rng, max_redeals):
    outcome = play_round(pool, rng, max_redeals, BASE_FLAGS)
    return outcome.kind  # 'perfect_win' | 'pyramid_clear' | 'freeze'

def simulate(n_games, max_redeals, seed=42):
    rng = random.Random(seed)
    wins = 0    # pyramid_clear or perfect_win
    losses = 0  # freeze

    for _ in range(n_games):
        pool = create_fresh_pool()
        result = run_single_game(pool, rng, max_redeals)
        if result in ('perfect_win', 'pyramid_clear'):
            wins += 1
        else:
            losses += 1

    return wins, losses

def main():
    N = 10_000
    seed = 42

    print(f"\n{'='*60}")
    print(f"  Base Game Simulation (no legacy mechanics)")
    print(f"  {N:,} games per configuration, seed={seed}")
    print(f"{'='*60}\n")
    print(f"{'Configuration':<30} {'Win Rate':>10} {'Loss Rate':>10} {'Wins':>8} {'Losses':>8}")
    print(f"{'-'*30} {'-'*10} {'-'*10} {'-'*8} {'-'*8}")

    for label, redraws in REDRAW_OPTIONS:
        wins, losses = simulate(N, redraws, seed=seed)
        win_rate = wins / N
        loss_rate = losses / N
        print(f"{label:<30} {win_rate:>9.2%} {loss_rate:>10.2%} {wins:>8,} {losses:>8,}")

    print(f"\nNotes:")
    print(f"  - 'Collapse rate' = games where the player ran out of moves")
    print(f"  - 'Avg rounds' is not applicable (always 1 round per game)")
    print(f"  - Win = all pyramid cards cleared (partial OR complete victory)")
    print(f"  - Strategy: greedy heuristic (maximise newly-exposed cards per move)")
    print()

if __name__ == "__main__":
    main()
