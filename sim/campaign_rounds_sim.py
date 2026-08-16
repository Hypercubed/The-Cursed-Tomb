#!/usr/bin/env python3
"""
Base Game Campaign Simulator - Avg Rounds to Perfect Win
=========================================================
Simulates the base game WITHOUT legacy mechanics (no attrition/scars/curses/blessings).
Since the tomb never collapses in the base game, each campaign plays rounds until either:
  - A Perfect Win (all 52 cards cleared in one round) -> Victory
  - Max rounds hit -> Timeout

Reports: victory rate within cap, avg rounds to achieve a perfect win.
"""
import sys, os, random, time, argparse
from multiprocessing import Pool, cpu_count

sys.path.insert(0, os.path.dirname(__file__))
from cursed_tomb_sim import play_round, CardState, RuleFlags, SUITS, RANKS
from solvers import GreedySolver, HeuristicSolver, BeamSearchSolver, DFSSolver, NoviceSolver

BASE_FLAGS = RuleFlags(scars=False, curses=False, blessings=False, attrition=False)

DIFFICULTIES = {
    "novice": 5,             # 6 total passes
    "explorer": 3,           # 4 total passes
    "archaeologist": 1,      # 2 total passes
    "survivalist": 0,        # 1 single pass
}

MAX_MOVES_PER_REDEAL = {
    "survivalist": 500,
    "archaeologist": 1000,
    "explorer": 2000,
    "novice": 2000,
}

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
    elif s == 'novice':
        return NoviceSolver(seed=0)
    raise ValueError(f"Unknown solver: {solver_name}")

def create_pool():
    return [CardState(r, s) for s in SUITS for r in RANKS]

def run_campaign(rng, max_redeals, max_rounds, max_moves, solver_name="heuristic"):
    for round_num in range(1, max_rounds + 1):
        pool = create_pool()
        solver = create_solver(solver_name)
        outcome = play_round(pool, rng, max_redeals, BASE_FLAGS, max_moves=max_moves, solver=solver)
        if outcome.kind == 'perfect_win':
            return 'victory', round_num
    return 'timeout', max_rounds

def _run_campaign_worker(args):
    camp_seed, max_redeals, max_rounds, max_moves, solver_name = args
    rng = random.Random(camp_seed)
    return run_campaign(rng, max_redeals, max_rounds, max_moves, solver_name=solver_name)

def simulate(difficulty, max_redeals, max_rounds, n_campaigns, max_moves, solver_name="heuristic", seed=42, n_workers=None):
    if n_workers is None:
        n_workers = cpu_count() or 1

    label = f"{difficulty} ({max_redeals} redraws)" if max_redeals < 9999 else f"{difficulty} (infinite redraws)"
    print(f"\nRunning: {label} ({n_campaigns} campaigns, max {max_rounds} rounds each, solver={solver_name}, workers={n_workers}) ...", flush=True)
    
    base_rng = random.Random(seed)
    worker_args = [(base_rng.randint(0, 1_000_000_000), max_redeals, max_rounds, max_moves, solver_name) for _ in range(n_campaigns)]

    victories = 0
    timeouts = 0
    win_rounds = []
    t0 = time.time()

    if n_workers > 1 and n_campaigns >= 10:
        chunk = max(1, n_campaigns // (n_workers * 4))
        with Pool(processes=n_workers) as pool:
            for result, rounds in pool.imap_unordered(_run_campaign_worker, worker_args, chunksize=chunk):
                if result == 'victory':
                    victories += 1
                    win_rounds.append(rounds)
                else:
                    timeouts += 1
    else:
        for args_item in worker_args:
            result, rounds = _run_campaign_worker(args_item)
            if result == 'victory':
                victories += 1
                win_rounds.append(rounds)
            else:
                timeouts += 1

    elapsed = time.time() - t0
    win_rate = victories / n_campaigns
    avg_rounds = (sum(win_rounds) / len(win_rounds)) if win_rounds else None
    win_rounds_sorted = sorted(win_rounds)
    median_rounds = win_rounds_sorted[len(win_rounds_sorted)//2] if win_rounds_sorted else None

    print(f"\n{'─'*58}")
    print(f"  {label}")
    print(f"  {n_campaigns:,} campaigns | max {max_rounds} rounds | {elapsed:.1f}s")
    print(f"{'─'*58}")
    print(f"  Victories  : {victories:,} ({win_rate:.1%})")
    print(f"  Timeouts   : {timeouts:,} (didn't win within {max_rounds} rounds)")
    if avg_rounds:
        print(f"  Avg rounds to Perfect Win : {avg_rounds:.1f}")
        print(f"  Median rounds to win      : {median_rounds}")
        buckets = [(1,1),(2,2),(3,5),(6,10),(11,20),(21,max_rounds)]
        print(f"  Win-round distribution:")
        for lo, hi in buckets:
            count = sum(1 for r in win_rounds_sorted if lo <= r <= hi)
            if count == 0:
                continue
            pct = count / len(win_rounds_sorted) * 100
            bar = '█' * max(1, int(pct / 2))
            label_str = f"{lo}" if lo == hi else f"{lo}–{hi}"
            print(f"    Round {label_str:>5}: {count:>5} ({pct:4.1f}%) {bar}")
    else:
        print(f"  No victories recorded within {max_rounds}-round cap.")
    print(flush=True)
    
    return {
        "victories": victories,
        "timeouts": timeouts,
        "win_rate": win_rate,
        "avg_rounds": avg_rounds,
        "median_rounds": median_rounds,
        "win_rounds_sorted": win_rounds_sorted,
    }

def parse_args():
    p = argparse.ArgumentParser(description="Base Game Campaign Simulator - Rounds to Perfect Win")
    p.add_argument("--campaigns", type=int, default=200, help="number of campaigns to simulate")
    p.add_argument("--difficulty", choices=list(DIFFICULTIES.keys()), default="archaeologist")
    p.add_argument("--max-rounds", type=int, default=200, help="max rounds per campaign")
    p.add_argument("--solver", choices=["greedy", "heuristic", "beam", "dfs", "novice"], default="heuristic", help="solver strategy")
    p.add_argument("--seed", type=int, default=42, help="random seed for reproducibility")
    p.add_argument("--workers", type=int, default=cpu_count(), help="number of parallel worker processes")
    return p.parse_args()

def main():
    args = parse_args()
    max_redeals = DIFFICULTIES[args.difficulty]
    max_moves = MAX_MOVES_PER_REDEAL[args.difficulty]
    
    print(f"\n{'='*58}")
    print(f"  Base Game: Rounds to Perfect Win (no legacy mechanics)")
    print(f"  Victory = all 52 cards cleared in one round")
    print(f"  No collapse possible (tomb never starves w/o attrition)")
    print(f"{'='*58}", flush=True)

    simulate(args.difficulty, max_redeals, args.max_rounds, args.campaigns, max_moves, solver_name=args.solver, seed=args.seed, n_workers=args.workers)

    print(f"{'='*58}")
    print(f"  Strategy: {args.solver}")
    print(f"  seed={args.seed} for reproducibility")
    print(f"{'='*58}\n")

if __name__ == "__main__":
    main()
