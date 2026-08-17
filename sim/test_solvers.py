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
from solvers import GreedySolver, HeuristicSolver, BeamSearchSolver, DFSSolver, NoviceSolver

BASE_FLAGS = RuleFlags(
    scars=False,
    curses=False,
    blessings=False,
    attrition=False,
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
    elif 'novice' in s:
        return NoviceSolver(seed=0)
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
        ("Novice", "novice"),
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
    print("[OK] Verification: Simulation redeal preserves exact card draw order across passes")


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

    print("[OK] Verification: Explicit stock and waste vaulting candidate moves set pass progress and enable redealing")


def verify_anchor_absorption():
    rng = random.Random(42)
    flags = RuleFlags(
        attrition=True,
        anchor_absorption=True,
        anchor_max_absorption=4,
        max_attrition_stage=5,
    )
    # Test card anchored at attrition_stage = 3 (scarred) placed in an exposed slot (index 21)
    scarred_card = CardState('7', 'S', attrition_stage=3, reward_stage=2, anchor_absorption=0)
    normal_card = CardState('8', 'C', attrition_stage=0, reward_stage=0)
    pyr = [normal_card] * 21 + [scarred_card] + [normal_card] * 6
    state = GameState(pyr, [], [], [], set(), {}, 0, flags, rng)

    # Hits 1..3: Absorbed, attrition remains 3, anchor remains active (reward_stage=2)
    for expected_count in range(1, 4):
        state.apply_freeze_attrition()
        assert scarred_card.anchor_absorption == expected_count
        assert scarred_card.reward_stage == 2
        assert scarred_card.attrition_stage == 3

    # Hit 4: 4th hit absorbed, anchor breaks (reward_stage=0), BUT attrition_stage MUST REMAIN 3 (not reset to 0)
    state.apply_freeze_attrition()
    assert scarred_card.anchor_absorption == 4
    assert scarred_card.reward_stage == 0
    assert scarred_card.attrition_stage == 3, f"Expected attrition_stage to remain 3, but got {scarred_card.attrition_stage}"

    # Hit 5: Attrition resumes from stage 3 -> 4 (Curse)
    state.apply_freeze_attrition()
    assert scarred_card.attrition_stage == 4

    # Hit 6: Attrition resumes from stage 4 -> 5 (Entombed)
    state.apply_freeze_attrition()
    assert scarred_card.attrition_stage == 5

    print("[OK] Verification: Anchor absorption shields up to 4 hits and resumes attrition from existing stage upon exhaustion")


def verify_dual_black_curse_resolution():
    rng = random.Random(42)
    flags = RuleFlags(
        scars=True,
        curses=True,
        blessings=True,
        attrition=True,
    )
    # ♠10: Black Curse (attrition 4), shifted -1 -> fVal 9
    card_ten = CardState('10', 'S', attrition_stage=4, reward_stage=0)
    # ♣5: Black Curse (attrition 3), shifted -1 -> fVal 4
    card_five = CardState('5', 'C', attrition_stage=3, reward_stage=0)

    # 1. Test Pyramid-Pyramid pair ('pp')
    pyr = [CardState('2', 'H')] * 21 + [card_ten, card_five] + [CardState('2', 'H')] * 5
    state = GameState(pyr, [], [], [], set(), {}, 1, flags, rng)
    state.apply_move(Move('pp', (21, 22)))
    assert len(state.stock) == 1
    assert state.stock[0] == card_five, "Lower functional value card (♣5) should be reshuffled to stock"
    assert 21 in state.removed and 22 in state.removed

    # 2. Test Pyramid-Waste pair ('pw')
    state_pw = GameState(pyr, [], [card_five], [], set(), {}, 1, flags, rng)
    state_pw.apply_move(Move('pw', (21, 'waste', None)))
    assert len(state_pw.stock) == 1
    assert state_pw.stock[0] == card_five, "Lower functional value card (♣5) should be reshuffled to stock"

    # 3. Test Stock-Pyramid pair ('stock_pyramid')
    state_sp = GameState(pyr, [card_five], [], [], set(), {}, 1, flags, rng)
    state_sp.apply_move(Move('stock_pyramid', (21,)))
    assert len(state_sp.stock) == 1
    assert state_sp.stock[0] == card_five, "Lower functional value card (♣5) should be reshuffled to stock"

    # 4. Test Stock-Waste pair ('stock_waste')
    state_sw = GameState(pyr, [card_ten], [card_five], [], set(), {}, 1, flags, rng)
    state_sw.apply_move(Move('stock_waste', ('waste', None)))
    assert len(state_sw.stock) == 1
    assert state_sw.stock[0] == card_five, "Lower functional value card (♣5) should be reshuffled to stock"

    print("[OK] Verification: Dual Black Curse pair resolves higher functional value to Foundation and lower to Stock")


def main():
    args = parse_args()
    verify_redeal_order()
    verify_stock_vault_progress()
    verify_anchor_absorption()
    verify_dual_black_curse_resolution()
    run_benchmark(n_games=args.games, seed=args.seed, max_redeals=args.redraws, n_workers=args.workers)


if __name__ == "__main__":
    main()
