#!/usr/bin/env python3
"""
Base Game Single-Round Simulator
=================================
Simulates the base game as implemented in the UI:
- Standard pyramid solitaire, 7 rows, 28 pyramid cards, 24 stock cards
- No scars, curses, blessings, or attrition (all legacy mechanics off)
- Win = clearing all pyramid cards (pyramid_clear OR perfect_win)
- Loss = frozen (no legal moves, no draws/redeals left)

Runs N games and reports win/collapse metrics using the specified solver.
"""

import sys
import os
import argparse
import random
import statistics
from multiprocessing import Pool, cpu_count

sys.path.insert(0, os.path.dirname(__file__))

from cursed_tomb_sim import play_round, CardState, RuleFlags, SUITS, RANKS
from solvers import GreedySolver, HeuristicSolver, BeamSearchSolver, DFSSolver

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

def create_solver(solver_name: str):
    s = solver_name.lower()
    if s == 'greedy':
        return GreedySolver()
    elif s == 'heuristic':
        return HeuristicSolver()
    elif s == 'beam':
        return BeamSearchSolver()
    elif s == 'dfs':
        return DFSSolver()
    raise ValueError(f"Unknown solver: {solver_name}")

def create_fresh_pool():
    """52 pristine cards — no campaign state."""
    return [CardState(r, s) for s in SUITS for r in RANKS]

def run_single_game(pool, rng, max_redeals, solver):
    outcome = play_round(pool, rng, max_redeals, BASE_FLAGS, solver=solver)
    return outcome.kind  # 'perfect_win' | 'pyramid_clear' | 'freeze'

def _run_single_game_worker(args):
    game_seed, max_redeals, solver_name = args
    rng = random.Random(game_seed)
    pool = create_fresh_pool()
    solver = create_solver(solver_name)
    return run_single_game(pool, rng, max_redeals, solver)

def simulate(n_games, max_redeals, solver_name="heuristic", seed=42, n_workers=None):
    if n_workers is None:
        n_workers = cpu_count() or 1

    base_rng = random.Random(seed)
    worker_args = [(base_rng.randint(0, 1_000_000_000), max_redeals, solver_name) for _ in range(n_games)]

    total_wins = 0    # pyramid_clear or perfect_win
    perfect_wins = 0  # perfect_win (clearing all 52 cards)
    pyramid_only = 0  # pyramid_clear (clearing 28 pyramid cards, stock remains)
    losses = 0        # freeze

    if n_workers > 1 and n_games >= 50:
        chunk = max(1, n_games // (n_workers * 4))
        with Pool(processes=n_workers) as pool:
            for result in pool.imap_unordered(_run_single_game_worker, worker_args, chunksize=chunk):
                if result == 'perfect_win':
                    perfect_wins += 1
                    total_wins += 1
                elif result == 'pyramid_clear':
                    pyramid_only += 1
                    total_wins += 1
                else:
                    losses += 1
    else:
        for args_item in worker_args:
            result = _run_single_game_worker(args_item)
            if result == 'perfect_win':
                perfect_wins += 1
                total_wins += 1
            elif result == 'pyramid_clear':
                pyramid_only += 1
                total_wins += 1
            else:
                losses += 1

    return total_wins, perfect_wins, pyramid_only, losses

def parse_args():
    p = argparse.ArgumentParser(description="Base game single-round simulation")
    p.add_argument("--games", type=int, default=1000, help="number of games per configuration")
    p.add_argument("--seed", type=int, default=42, help="random seed")
    p.add_argument("--solver", choices=["greedy", "heuristic", "beam", "dfs"], default="heuristic", help="solver strategy")
    p.add_argument("--workers", type=int, default=cpu_count(), help="number of parallel worker processes")
    return p.parse_args()

def main():
    args = parse_args()
    N = args.games
    seed = args.seed
    solver_name = args.solver
    workers = args.workers

    print(f"\n{'='*75}")
    print(f"  Base Game Simulation (no legacy mechanics)")
    print(f"  {N:,} games per configuration, seed={seed}, solver={solver_name}, workers={workers}")
    print(f"{'='*75}\n")
    print(f"{'Configuration':<28} {'Win Rate (Pyr)':>14} {'Total Vic Rate (52)':>19} {'Collapse Rate':>14} {'Perfect':>8} {'Pyr Only':>9} {'Losses':>8}")
    print(f"{'-'*28} {'-'*14} {'-'*19} {'-'*14} {'-'*8} {'-'*9} {'-'*8}")

    for label, redraws in REDRAW_OPTIONS:
        total_wins, perfect_wins, pyramid_only, losses = simulate(N, redraws, solver_name=solver_name, seed=seed, n_workers=workers)
        win_rate = total_wins / N
        total_vic_rate = perfect_wins / N
        loss_rate = losses / N
        print(f"{label:<28} {win_rate:>13.2%} {total_vic_rate:>18.2%} {loss_rate:>13.2%} {perfect_wins:>8,} {pyramid_only:>9,} {losses:>8,}")

    print(f"\nNotes:")
    print(f"  - 'Win Rate (Pyr)' = games where all 28 pyramid cards were cleared (includes Total Victories)")
    print(f"  - 'Total Vic Rate (52)' = games where all 52 cards (pyramid + stock/waste) were cleared")
    print(f"  - 'Collapse rate' = games where the player ran out of moves")
    print(f"  - Strategy: {solver_name}")
    print()

if __name__ == "__main__":
    main()
