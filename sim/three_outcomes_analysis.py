#!/usr/bin/env python3
"""
Three Outcomes Deck Evolution Analysis (Optimized & Parallelized with Progress Bar)
==================================================================================
Simulates Cursed Tomb campaigns across all 4 difficulty levels (novice, explorer,
archaeologist, survivalist) to quantify the exact frequency and timing of 3 outcomes:

1. STARVATION: Active cards drop below 28 (pyramid cannot be dealt physically).
2. PERMANENTLY UNCLEARABLE (>= 28 Cards): Active cards remain >= 28, but the deck
   enters an un-clearable state (0 probe wins) for all remaining rounds.
3. STABLE WINNABLE STATE: The deck maintains solvability and stabilizes at a
   positive win rate.

Also tracks:
- Average Round of Deck Stabilization (All 13 Ranks Anchored Equilibrium)
- Overall Win Rate % (all rounds across all campaigns)
- Stable-State Win Rate % (win rate during stabilized tail phase of winnable campaigns)
- Perfect Wins (Complete Victories: ALL 52 cards cleared in 1 round)
- Pyramid Clears (28 pyramid cards cleared)

Usage:
  python3 sim/three_outcomes_analysis.py [options]
"""

from __future__ import annotations

import argparse
import os
import random
import statistics
import time
from dataclasses import dataclass
from multiprocessing import Pool, cpu_count
from typing import Dict, List, Optional, Any, Tuple

import cursed_tomb_sim
from cursed_tomb_sim import (
    CardState,
    RuleFlags,
    DIFFICULTIES,
    RANKS,
    SUITS,
    N_PYR,
    play_round,
    _apply_survival_reward,
)

try:
    from solvers import GreedySolver, HeuristicSolver, BeamSearchSolver, DFSSolver
except ImportError:
    from .solvers import GreedySolver, HeuristicSolver, BeamSearchSolver, DFSSolver


def create_solver(solver_name: str):
    """Factory helper to instantiate solver by strategy name."""
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


def copy_card(card: CardState) -> CardState:
    """Return a fresh independent copy of a CardState object."""
    return CardState(
        rank=card.rank,
        suit=card.suit,
        attrition_stage=card.attrition_stage,
        reward_stage=card.reward_stage,
        blessed=card.blessed,
        temp_immune=card.temp_immune,
        anchor_absorption=card.anchor_absorption,
    )


def probe_solvability_fast(
    active_cards: List[CardState],
    rng: random.Random,
    max_redeals: int,
    flags: RuleFlags,
    n_probes: int,
    probe_solver_name: str,
) -> int:
    """
    Run up to n_probes independent random shuffles. Short-circuits and returns 1
    as soon as a single probe succeeds, or 0 if all n_probes fail.
    """
    if len(active_cards) < N_PYR:
        return 0
    for _ in range(n_probes):
        cloned = [copy_card(c) for c in active_cards]
        solver = create_solver(probe_solver_name)
        outcome = play_round(cloned, rng, max_redeals, flags, solver=solver)
        if outcome.kind in ('pyramid_clear', 'perfect_win'):
            return 1  # Short-circuit: proven winnable
    return 0


def format_avg_std(values: List[float | int]) -> str:
    """Format a list of numbers as 'mean ± std_dev'."""
    if not values:
        return "N/A"
    avg = statistics.mean(values)
    std = statistics.stdev(values) if len(values) > 1 else 0.0
    return f"{avg:.1f} ± {std:.1f}"


@dataclass
class CampaignOutcome:
    category: str  # 'starved' | 'perm_unclearable_ge28' | 'stable_winnable'
    round_num: Optional[int] = None
    pyramid_clears_count: int = 0
    perfect_wins_count: int = 0
    first_pyramid_clear_round: Optional[int] = None
    first_perfect_win_round: Optional[int] = None
    full_anchor_equilibrium_round: Optional[int] = None
    round_clear_results: Optional[List[bool]] = None


def run_single_campaign(args_tuple: Tuple[str, int, int, int, str, str]) -> CampaignOutcome:
    """Worker task to simulate a single campaign."""
    difficulty, max_rounds, n_probes, seed, solver_name, probe_solver_name = args_tuple
    max_redeals = DIFFICULTIES[difficulty]
    rng = random.Random(seed)

    flags = RuleFlags(
        scars=True,
        curses=True,
        blessings=True,
        attrition=True,
        volatile_collapse=False,
        sealed_tomb_victory=False,
        rank_anchor_victory=False,
    )

    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    round_probe_wins: List[int] = []
    round_clear_results: List[bool] = []

    pyramid_clears_count = 0
    perfect_wins_count = 0
    first_pyramid_clear_round: Optional[int] = None
    first_perfect_win_round: Optional[int] = None
    full_anchor_equilibrium_round: Optional[int] = None

    for round_num in range(1, max_rounds + 1):
        active = [c for c in registry if c.attrition_stage < flags.max_attrition_stage]

        if len(active) < N_PYR:
            # Outcome 1: Starvation (< 28 active cards)
            return CampaignOutcome(
                category='starved',
                round_num=round_num,
                pyramid_clears_count=pyramid_clears_count,
                perfect_wins_count=perfect_wins_count,
                first_pyramid_clear_round=first_pyramid_clear_round,
                first_perfect_win_round=first_perfect_win_round,
                full_anchor_equilibrium_round=full_anchor_equilibrium_round,
                round_clear_results=round_clear_results,
            )

        # Check for full Rank-Anchor Equilibrium (all 13 ranks anchored)
        if full_anchor_equilibrium_round is None:
            anchored_ranks = {c.rank for c in registry if c.reward_stage >= 2}
            if len(anchored_ranks) == len(RANKS):
                full_anchor_equilibrium_round = round_num

        # Evaluate solvability (fast short-circuiting)
        is_winnable = probe_solvability_fast(active, rng, max_redeals, flags, n_probes, probe_solver_name)
        round_probe_wins.append(is_winnable)

        # Play live campaign round
        solver = create_solver(solver_name)
        outcome = play_round(active, rng, max_redeals, flags, full_registry=registry, solver=solver)

        is_clear = outcome.kind in ('pyramid_clear', 'perfect_win')
        round_clear_results.append(is_clear)

        if is_clear:
            pyramid_clears_count += 1
            if first_pyramid_clear_round is None:
                first_pyramid_clear_round = round_num

            if outcome.kind == 'perfect_win':
                perfect_wins_count += 1
                if first_perfect_win_round is None:
                    first_perfect_win_round = round_num

            if outcome.last_clear_type:
                _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

    # Completed max_rounds with active cards >= 28. Evaluate final tail solvability.
    tail_len = min(10, len(round_probe_wins))
    tail = round_probe_wins[-tail_len:] if tail_len > 0 else []

    if tail and all(w == 0 for w in tail):
        first_zero = len(round_probe_wins) - tail_len + 1
        while first_zero > 1 and round_probe_wins[first_zero - 2] == 0:
            first_zero -= 1
        return CampaignOutcome(
            category='perm_unclearable_ge28',
            round_num=first_zero,
            pyramid_clears_count=pyramid_clears_count,
            perfect_wins_count=perfect_wins_count,
            first_pyramid_clear_round=first_pyramid_clear_round,
            first_perfect_win_round=first_perfect_win_round,
            full_anchor_equilibrium_round=full_anchor_equilibrium_round,
            round_clear_results=round_clear_results,
        )
    else:
        return CampaignOutcome(
            category='stable_winnable',
            pyramid_clears_count=pyramid_clears_count,
            perfect_wins_count=perfect_wins_count,
            first_pyramid_clear_round=first_pyramid_clear_round,
            first_perfect_win_round=first_perfect_win_round,
            full_anchor_equilibrium_round=full_anchor_equilibrium_round,
            round_clear_results=round_clear_results,
        )


def print_progress_bar(difficulty: str, current: int, total: int, start_time: float) -> None:
    """Print an in-place ASCII progress bar with percentage and ETA."""
    pct = (current / total) * 100.0 if total > 0 else 100.0
    bar_width = 30
    filled = int(round(bar_width * current / total)) if total > 0 else bar_width
    bar = "=" * filled + "-" * (bar_width - filled)

    elapsed = time.time() - start_time
    rate = current / elapsed if elapsed > 0 else 0
    eta = (total - current) / rate if rate > 0 else 0

    diff_str = difficulty.upper()
    status_str = f"\r [{diff_str:<13}] [{bar}] {pct:>5.1f}% ({current:>3}/{total}) | Elapsed: {elapsed:>4.1f}s | ETA: {eta:>4.1f}s"
    print(status_str, end="", flush=True)


def analyze_difficulty_parallel(
    difficulty: str,
    n_campaigns: int,
    max_rounds: int,
    n_probes: int,
    base_rng: random.Random,
    solver_name: str,
    probe_solver_name: str,
    n_workers: int,
) -> Dict[str, Any]:
    """Run batch simulation for a single difficulty level in parallel with a live progress bar."""
    worker_args = [
        (difficulty, max_rounds, n_probes, base_rng.randint(0, 1_000_000_000), solver_name, probe_solver_name)
        for _ in range(n_campaigns)
    ]

    outcomes: List[CampaignOutcome] = []
    t_start = time.time()

    print_progress_bar(difficulty, 0, n_campaigns, t_start)

    with Pool(processes=n_workers) as pool:
        for i, outcome in enumerate(pool.imap_unordered(run_single_campaign, worker_args, chunksize=1), 1):
            outcomes.append(outcome)
            print_progress_bar(difficulty, i, n_campaigns, t_start)

    # Clear progress bar line
    print("\r" + " " * 90 + "\r", end="", flush=True)

    starved = [o for o in outcomes if o.category == 'starved']
    unclearable = [o for o in outcomes if o.category == 'perm_unclearable_ge28']
    winnable = [o for o in outcomes if o.category == 'stable_winnable']

    starved_r = [o.round_num for o in starved if o.round_num is not None]
    unclearable_r = [o.round_num for o in unclearable if o.round_num is not None]

    # Full Rank Anchor Equilibrium stats
    anchor_eq_rounds = [o.full_anchor_equilibrium_round for o in outcomes if o.full_anchor_equilibrium_round is not None]
    anchor_eq_pct = (len(anchor_eq_rounds) / n_campaigns) * 100.0

    # Overall win rate (all rounds across all campaigns)
    total_rounds_all = sum(len(o.round_clear_results) for o in outcomes if o.round_clear_results)
    total_clears_all = sum(o.pyramid_clears_count for o in outcomes)
    overall_win_rate_pct = (total_clears_all / total_rounds_all) * 100.0 if total_rounds_all > 0 else 0.0

    # Stable-State win rate (tail 50% rounds of stable winnable campaigns)
    stable_tail_clears = 0
    stable_tail_rounds = 0
    for o in winnable:
        if o.round_clear_results:
            n_rds = len(o.round_clear_results)
            tail_start = max(0, n_rds // 2)  # evaluate second half of campaign
            tail_results = o.round_clear_results[tail_start:]
            stable_tail_clears += sum(1 for r in tail_results if r)
            stable_tail_rounds += len(tail_results)

    stable_state_win_rate_pct = (stable_tail_clears / stable_tail_rounds) * 100.0 if stable_tail_rounds > 0 else 0.0

    # Pyramid clear stats
    pyr_clears_list = [o.pyramid_clears_count for o in outcomes]
    first_pyr_rounds = [o.first_pyramid_clear_round for o in outcomes if o.first_pyramid_clear_round is not None]

    # Perfect win (Complete Victory: ALL 52 cards) stats
    perfect_wins_list = [o.perfect_wins_count for o in outcomes]
    first_perfect_rounds = [o.first_perfect_win_round for o in outcomes if o.first_perfect_win_round is not None]
    runs_with_perfect_win_count = len(first_perfect_rounds)

    avg_pyr_clears = statistics.mean(pyr_clears_list) if pyr_clears_list else 0.0
    avg_perfect_wins = statistics.mean(perfect_wins_list) if perfect_wins_list else 0.0

    return {
        "difficulty": difficulty,
        "n_campaigns": n_campaigns,
        "max_rounds": max_rounds,
        # Outcome 1: Starvation
        "starved_pct": (len(starved) / n_campaigns) * 100.0,
        "starved_r_str": format_avg_std(starved_r),
        "starved_med_r": statistics.median(starved_r) if starved_r else None,
        # Outcome 2: Permanently Unclearable (>= 28 cards)
        "unclearable_pct": (len(unclearable) / n_campaigns) * 100.0,
        "unclearable_r_str": format_avg_std(unclearable_r),
        "unclearable_med_r": statistics.median(unclearable_r) if unclearable_r else None,
        # Outcome 3: Stable Winnable & Rank Anchor Equilibrium
        "winnable_pct": (len(winnable) / n_campaigns) * 100.0,
        "stable_state_win_rate_pct": stable_state_win_rate_pct,
        "anchor_eq_pct": anchor_eq_pct,
        "anchor_eq_r_str": format_avg_std(anchor_eq_rounds),
        "anchor_eq_med_r": statistics.median(anchor_eq_rounds) if anchor_eq_rounds else None,
        # Win Rates
        "overall_win_rate_pct": overall_win_rate_pct,
        # Pyramid Clears (28 cards)
        "avg_pyramid_clears": avg_pyr_clears,
        "first_pyr_r_str": format_avg_std(first_pyr_rounds),
        "first_pyr_med_r": statistics.median(first_pyr_rounds) if first_pyr_rounds else None,
        # Perfect Wins (Complete Victories: ALL 52 cards)
        "avg_perfect_wins": avg_perfect_wins,
        "perfect_win_rate_pct": (avg_perfect_wins / max_rounds) * 100.0,
        "max_perfect_wins": max(perfect_wins_list) if perfect_wins_list else 0,
        "runs_with_perfect_win_pct": (runs_with_perfect_win_count / n_campaigns) * 100.0,
        "first_perfect_r_str": format_avg_std(first_perfect_rounds),
        "first_perfect_med_r": statistics.median(first_perfect_rounds) if first_perfect_rounds else None,
    }


def print_difficulty_section(res: Dict[str, Any], elapsed: float) -> None:
    """Print formatted difficulty section report after completion."""
    diff = res["difficulty"].upper()
    n = res["n_campaigns"]
    max_r = res["max_rounds"]

    print(f"==========================================================================", flush=True)
    print(f" DIFFICULTY: {diff} ({n} campaigns × {max_r} rounds) -- Completed in {elapsed:.1f}s", flush=True)
    print(f"==========================================================================", flush=True)

    # 1. Starvation
    s_pct = res["starved_pct"]
    if res["starved_r_str"] != "N/A":
        s_str = f"{s_pct:>5.1f}%  (Avg: Round {res['starved_r_str']}, Median: Round {res['starved_med_r']:.1f})"
    else:
        s_str = f"{s_pct:>5.1f}%  (Never starves within round cap)"
    print(f"  1. Deck Starves (< 28 cards):            {s_str}", flush=True)

    # 2. Permanently Unclearable (>= 28 cards)
    u_pct = res["unclearable_pct"]
    if res["unclearable_r_str"] != "N/A":
        u_str = f"{u_pct:>5.1f}%  (Avg First Round: Round {res['unclearable_r_str']}, Median: Round {res['unclearable_med_r']:.1f})"
    else:
        u_str = f"{u_pct:>5.1f}%  (Never soft-locks while >= 28 cards)"
    print(f"  2. Permanently Unclearable (>= 28 cards):  {u_str}", flush=True)

    # 3. Stable Winnable State
    w_pct = res["winnable_pct"]
    st_rate = res["stable_state_win_rate_pct"]
    print(f"  3. Reaches Stable Winnable State:        {w_pct:>5.1f}%  (Stable-State Win Rate: {st_rate:.1f}%)", flush=True)

    # Full Rank Anchor Equilibrium Timing
    eq_pct = res["anchor_eq_pct"]
    if res["anchor_eq_r_str"] != "N/A":
        eq_r_str = res["anchor_eq_r_str"]
        eq_r_med = res["anchor_eq_med_r"]
        print(f"     - Full Rank-Anchor Stabilization:     {eq_pct:.1f}% of runs  (Avg Round: Round {eq_r_str}, Median: Round {eq_r_med:.1f})", flush=True)
    else:
        print(f"     - Full Rank-Anchor Stabilization:     0.0% of runs within round cap", flush=True)

    # Accomplishment Stats
    print(f"  ------------------------------------------------------------------------", flush=True)
    print(f"  🔺 Pyramid Clear (28 Cards Cleared) Performance:", flush=True)
    avg_pyr = res["avg_pyramid_clears"]
    ov_rate = res["overall_win_rate_pct"]
    pyr_r_str = res["first_pyr_r_str"]
    pyr_r_med = res["first_pyr_med_r"]
    print(f"     - Overall Pyramid Clear Win Rate:     {ov_rate:.1f}%  ({avg_pyr:.1f} clears / {max_r} rounds)", flush=True)
    print(f"     - Stable-State Pyramid Clear Rate:    {st_rate:.1f}%  (in stabilized tail phase)", flush=True)
    print(f"     - First Pyramid Clear Round:          Round {pyr_r_str} (Median: Round {pyr_r_med:.1f})", flush=True)

    print(f"  🏆 Complete Victory (Perfect Win: ALL 52 Cards Cleared) Stats:", flush=True)
    avg_pw = res["avg_perfect_wins"]
    pw_rate = res["perfect_win_rate_pct"]
    max_pw = res["max_perfect_wins"]
    pw_pct = res["runs_with_perfect_win_pct"]
    print(f"     - Perfect Win Rate:                   {pw_rate:.2f}%  ({avg_pw:.2f} victories / {max_r} rounds)", flush=True)
    print(f"     - Runs Achieving >= 1 Perfect Win:    {pw_pct:.1f}%  (Max in a run: {max_pw})", flush=True)
    if res["first_perfect_r_str"] != "N/A":
        p_r_str = res["first_perfect_r_str"]
        p_r_med = res["first_perfect_med_r"]
        print(f"     - First Perfect Win Round:            Round {p_r_str} (Median: Round {p_r_med:.1f})\n", flush=True)
    else:
        print(f"     - First Perfect Win Round:            N/A (0 Perfect Wins in sample)\n", flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Analyze the 3 core campaign outcomes & complete victory accomplishment stats."
    )
    parser.add_argument("-c", "--campaigns", type=int, default=100, help="Campaigns to run per difficulty (default: 100)")
    parser.add_argument("-r", "--max-rounds", type=int, default=200, help="Max rounds cap per campaign (default: 200)")
    parser.add_argument("-p", "--probes", type=int, default=30, help="Oracle probes per sampled round (default: 30)")
    parser.add_argument("--solver", choices=["greedy", "heuristic", "beam", "dfs"], default="heuristic", help="Campaign solver strategy (default: heuristic)")
    parser.add_argument("--probe-solver", choices=["greedy", "heuristic", "beam", "dfs"], default="heuristic", help="Oracle probe solver strategy (default: heuristic)")
    parser.add_argument("-j", "--workers", type=int, default=None, help="Number of CPU cores to use (default: all available cores)")
    parser.add_argument("-s", "--seed", type=int, default=None, help="Random seed for reproducibility (default: None - random seed generated)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.seed is None:
        actual_seed = random.randint(0, 1_000_000_000)
        seed_label = f"{actual_seed} (Randomly Generated)"
    else:
        actual_seed = args.seed
        seed_label = str(actual_seed)

    base_rng = random.Random(actual_seed)
    n_workers = args.workers if args.workers is not None else cpu_count()

    print("=" * 82, flush=True)
    print(" Cursed Tomb: Three Outcomes Campaign Analysis (Parallelized)", flush=True)
    print("=" * 82, flush=True)
    print(f" Start Time:       {time.strftime('%Y-%m-%d %H:%M:%S')}", flush=True)
    print(f" CPU Cores Used:   {n_workers} / {cpu_count()}", flush=True)
    print(f" Campaigns / Diff: {args.campaigns}", flush=True)
    print(f" Max Rounds:       {args.max_rounds}", flush=True)
    print(f" Probes / Round:   {args.probes}", flush=True)
    print(f" Campaign Solver:  {args.solver}", flush=True)
    print(f" Probe Solver:     {args.probe_solver}", flush=True)
    print(f" Seed:             {seed_label}", flush=True)
    print("=" * 82 + "\n", flush=True)

    all_results = []
    t_start = time.time()

    for diff in ["novice", "explorer", "archaeologist", "survivalist"]:
        t0 = time.time()
        res = analyze_difficulty_parallel(
            diff, args.campaigns, args.max_rounds, args.probes, base_rng, args.solver, args.probe_solver, n_workers
        )
        t_diff = time.time() - t0
        all_results.append(res)
        print_difficulty_section(res, t_diff)

    t_total = time.time() - t_start
    print("=" * 82, flush=True)
    print(f" All 4 difficulties finished in {t_total:.1f}s total.", flush=True)
    print("=" * 82, flush=True)


if __name__ == "__main__":
    main()
