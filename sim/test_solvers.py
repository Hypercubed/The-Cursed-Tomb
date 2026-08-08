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
from multiprocessing import Pool, cpu_count

sys.path.insert(0, os.path.dirname(__file__))

from cursed_tomb_sim import play_round, CardState, RuleFlags, SUITS, RANKS, GameState, Move
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


def create_solver(solver_key: str):
    s = solver_key.lower()
    if 'greedy' in s:
        return GreedySolver()
    elif 'heuristic' in s:
        return HeuristicSolver()
    elif 'beam' in s:
        return BeamSearchSolver(depth=3, beam_width=4)
    elif 'dfs' in s:
        return DFSSolver(max_nodes=3000)
    raise ValueError(f"Unknown solver: {solver_key}")


def _run_single_solver_worker(args):
    game_seed, solver_key, max_redeals = args
    rng = random.Random(game_seed)
    pool = create_fresh_pool()
    solver = create_solver(solver_key)
    outcome = play_round(pool, rng, max_redeals, BASE_FLAGS, solver=solver)
    return outcome.kind, outcome.moves


def run_benchmark(n_games: int = 100, seed: int = 42, max_redeals: int = 2, n_workers: int = None):
    if n_workers is None:
        n_workers = cpu_count() or 1

    solvers = [
        ("Greedy", "greedy"),
        ("Heuristic", "heuristic"),
        ("BeamSearch (D3,B4)", "beam"),
        ("DFS (Max 3k nodes)", "dfs"),
    ]

    # Pre-generate identical seeds per game index for all solvers
    base_rng = random.Random(seed)
    game_seeds = [base_rng.randint(0, 1_000_000_000) for _ in range(n_games)]

    print(f"\n{'='*70}")
    print(f"  Solver Benchmark ({n_games} identical games per solver, seed={seed}, workers={n_workers})")
    print(f"  Difficulty: Explorer ({max_redeals} redraws)")
    print(f"{'='*70}\n")
    print(f"{'Solver':<22} | {'Win Rate':>10} | {'Wins':>6} | {'Losses':>6} | {'Time (s)':>9} | {'Moves/Game':>10}")
    print(f"{'-'*22}-+-{'-'*10}-+-{'-'*6}-+-{'-'*6}-+-{'-'*9}-+-{'-'*10}")

    for display_name, solver_key in solvers:
        worker_args = [(s, solver_key, max_redeals) for s in game_seeds]
        wins = 0
        losses = 0
        total_moves = 0
        t0 = time.time()

        if n_workers > 1 and n_games >= 10:
            chunk = max(1, n_games // (n_workers * 4))
            with Pool(processes=n_workers) as pool:
                for kind, moves in pool.imap_unordered(_run_single_solver_worker, worker_args, chunksize=chunk):
                    total_moves += moves
                    if kind in ('perfect_win', 'pyramid_clear'):
                        wins += 1
                    else:
                        losses += 1
        else:
            for args_item in worker_args:
                kind, moves = _run_single_solver_worker(args_item)
                total_moves += moves
                if kind in ('perfect_win', 'pyramid_clear'):
                    wins += 1
                else:
                    losses += 1

        elapsed = time.time() - t0
        win_rate = wins / n_games
        avg_moves = total_moves / n_games

        print(f"{display_name:<22} | {win_rate:>9.1%} | {wins:>6} | {losses:>6} | {elapsed:>9.2f} | {avg_moves:>10.1f}")

    print(f"\n{'='*70}\n")


def parse_args():
    p = argparse.ArgumentParser(description="Solver Benchmark")
    p.add_argument("--games", type=int, default=100, help="number of games per solver")
    p.add_argument("--seed", type=int, default=42, help="random seed")
    p.add_argument("--redraws", type=int, default=2, help="max redraws per game")
    p.add_argument("--workers", type=int, default=cpu_count(), help="number of parallel worker processes")
    return p.parse_args()


def verify_redeal_order():
    pool = create_fresh_pool()
    rng = random.Random(42)
    rng.shuffle(pool)
    pyr = pool[:28]
    stock = list(pool[28:])
    initial_stock_ids = [f"{c.rank}{c.suit}" for c in stock]
    state = GameState(pyr, list(stock), [], [], set(), {}, 2, BASE_FLAGS, rng)
    while state.stock:
        state.apply_move(Move('draw', ()))
    state.progress_this_pass = True
    state.apply_move(Move('redeal', ()))
    redealt_stock_ids = [f"{c.rank}{c.suit}" for c in state.stock]
    assert initial_stock_ids == redealt_stock_ids, f"Redeal order mismatch: {initial_stock_ids} vs {redealt_stock_ids}"
    print("✓ Verification: Simulation redeal preserves exact card draw order across passes")


def verify_stock_vault_progress():
    pool = create_fresh_pool()
    rng = random.Random(42)
    pyr = pool[:28]
    blessed_diamond = CardState('5', 'D', blessed=True)
    normal_card = CardState('2', 'C')
    stock = [blessed_diamond, normal_card]

    blessing_flags = RuleFlags(
        scars=False,
        curses=False,
        blessings=True,
        attrition=False,
        volatile_collapse=False,
    )
    state = GameState(pyr, list(stock), [], [], set(), {}, 1, blessing_flags, rng)
    assert not state.progress_this_pass

    legal_moves = state.get_legal_moves()
    vault_stock_moves = [m for m in legal_moves if m.kind == 'vault_stock']
    assert len(vault_stock_moves) == 1, "vault_stock move should be generated when top of stock is Blessed Diamond"

    state.apply_move(vault_stock_moves[0])
    assert len(state.vault) == 1
    assert state.vault[0] == blessed_diamond
    assert state.progress_this_pass

    state.apply_move(Move('draw', ()))
    assert not state.stock
    assert len(state.waste) == 1

    legal_moves = state.get_legal_moves()
    redeal_moves = [m for m in legal_moves if m.kind == 'redeal']
    assert len(redeal_moves) == 1, "Redeal should be available after explicit stock vaulting"

    state.apply_move(redeal_moves[0])
    assert len(state.stock) == 1
    assert state.stock[0] == normal_card
    assert not state.progress_this_pass
    assert state.redeals_left == 0

    waste_diamond = CardState('7', 'D', blessed=True)
    state_waste = GameState(pyr, [], [waste_diamond], [], set(), {}, 1, blessing_flags, rng)
    waste_moves = state_waste.get_legal_moves()
    vault_waste_moves = [m for m in waste_moves if m.kind == 'vault_waste']
    assert len(vault_waste_moves) == 1, "vault_waste move should be generated when top of waste is Blessed Diamond"
    state_waste.apply_move(vault_waste_moves[0])
    assert not state_waste.waste
    assert len(state_waste.vault) == 1
    assert state_waste.vault[0] == waste_diamond
    assert state_waste.progress_this_pass

    print("✓ Verification: Explicit stock and waste vaulting candidate moves set pass progress and enable redealing")


def main():
    args = parse_args()
    verify_redeal_order()
    verify_stock_vault_progress()
    run_benchmark(n_games=args.games, seed=args.seed, max_redeals=args.redraws, n_workers=args.workers)


if __name__ == "__main__":
    main()
