#!/usr/bin/env python3
"""
Benchmark script for comparing simulation solvers.

Compares Greedy, Heuristic, BeamSearch, and DFS solvers on identical deck seeds.
Reports Win Rate, Execution Time, and average moves per game.
"""

import os
import sys
import time
import random
import argparse

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


def create_fresh_pool():
    return [CardState(r, s) for s in SUITS for r in RANKS]


def run_benchmark(n_games: int = 100, seed: int = 42, max_redeals: int = 2):
    solvers = {
        "Greedy": GreedySolver(),
        "Heuristic": HeuristicSolver(),
        "BeamSearch (D3,B4)": BeamSearchSolver(depth=3, beam_width=4),
        "DFS (Max 3k nodes)": DFSSolver(max_nodes=3000),
    }

    print(f"\n{'='*70}")
    print(f"  Solver Benchmark ({n_games} identical games per solver, seed={seed})")
    print(f"  Difficulty: Explorer ({max_redeals} redraws)")
    print(f"{'='*70}\n")
    print(f"{'Solver':<22} | {'Win Rate':>10} | {'Wins':>6} | {'Losses':>6} | {'Time (s)':>9} | {'Moves/Game':>10}")
    print(f"{'-'*22}-+-{'-'*10}-+-{'-'*6}-+-{'-'*6}-+-{'-'*9}-+-{'-'*10}")

    for name, solver in solvers.items():
        rng = random.Random(seed)
        wins = 0
        losses = 0
        total_moves = 0
        t0 = time.time()

        for _ in range(n_games):
            pool = create_fresh_pool()
            if hasattr(solver, 'reset'):
                solver.reset()

            outcome = play_round(pool, rng, max_redeals, BASE_FLAGS, solver=solver)
            total_moves += outcome.moves

            if outcome.kind in ('perfect_win', 'pyramid_clear'):
                wins += 1
            else:
                losses += 1

        elapsed = time.time() - t0
        win_rate = wins / n_games
        avg_moves = total_moves / n_games

        print(f"{name:<22} | {win_rate:>9.1%} | {wins:>6} | {losses:>6} | {elapsed:>9.2f} | {avg_moves:>10.1f}")

    print(f"\n{'='*70}\n")


def parse_args():
    p = argparse.ArgumentParser(description="Solver Benchmark")
    p.add_argument("--games", type=int, default=100, help="number of games per solver")
    p.add_argument("--seed", type=int, default=42, help="random seed")
    p.add_argument("--redraws", type=int, default=2, help="max redraws per game")
    return p.parse_args()


def main():
    args = parse_args()
    run_benchmark(n_games=args.games, seed=args.seed, max_redeals=args.redraws)


if __name__ == "__main__":
    main()
