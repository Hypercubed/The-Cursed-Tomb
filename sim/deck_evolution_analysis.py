#!/usr/bin/env python3
"""
Deck Evolution & Unwinnable Solvability Analysis
=================================================
Simulates Cursed Tomb campaigns with all terminal victory and collapse conditions
disabled. Tracks per-round deck solvability using multi-probe Monte Carlo sampling
to analyze how quickly and how frequently persistent card degradation (scars, curses,
entombment) creates structurally unwinnable deck configurations.

Usage:
  python3 sim/deck_evolution_analysis.py [options]
"""

from __future__ import annotations

import argparse
import random
import statistics
import time
from dataclasses import dataclass
from multiprocessing import Pool, cpu_count
from typing import Dict, List, Optional, Tuple, Any

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


def _run_deck_evolution_worker(args: Tuple[int, int, RuleFlags, int, str, str, int, int]) -> Dict[str, Any]:
    camp_seed, max_redeals, flags, max_rounds, solver_name, probe_solver_name, n_probes, sample_interval = args
    camp_rng = random.Random(camp_seed)
    return run_infinite_campaign(
        rng=camp_rng,
        max_redeals=max_redeals,
        flags=flags,
        max_rounds=max_rounds,
        solver_name=solver_name,
        probe_solver_name=probe_solver_name,
        n_probes=n_probes,
        sample_interval=sample_interval,
    )


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


def snapshot_deck(registry: List[CardState]) -> List[Tuple[int, int, bool, int, bool]]:
    """Capture a snapshot of all card states without mutating the original."""
    return [(c.attrition_stage, c.reward_stage, c.blessed, c.anchor_absorption, c.temp_immune) for c in registry]


def restore_deck(registry: List[CardState], snapshot: List[Tuple[int, int, bool, int, bool]]) -> None:
    """Restore card state from a snapshot."""
    for c, snap in zip(registry, snapshot):
        c.attrition_stage, c.reward_stage, c.blessed, c.anchor_absorption, c.temp_immune = snap


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


def probe_solvability(
    active_cards: List[CardState],
    rng: random.Random,
    max_redeals: int,
    flags: RuleFlags,
    n_probes: int,
    probe_solver_name: str,
    full_registry: Optional[List[CardState]] = None,
) -> Tuple[int, int]:
    """
    Probe empirical winnability of the current active card pool by running n_probes
    independent random shuffles using independent CardState copies. Does NOT mutate
    the live campaign's card state.
    """
    if len(active_cards) < N_PYR:
        return (0, n_probes)

    if full_registry is not None:
        snap_before = snapshot_deck(full_registry)
    else:
        snap_before = snapshot_deck(active_cards)

    wins = 0

    for _ in range(n_probes):
        probe_pool = [copy_card(c) for c in active_cards]
        probe_solver = create_solver(probe_solver_name)
        probe_seed = rng.randint(0, 1_000_000_000)
        probe_rng = random.Random(probe_seed)

        outcome = play_round(
            pool=probe_pool,
            rng=probe_rng,
            max_redeals=max_redeals,
            flags=flags,
            solver=probe_solver,
        )

        if outcome.kind in ("perfect_win", "pyramid_clear"):
            wins += 1

    if full_registry is not None:
        restore_deck(full_registry, snap_before)
    else:
        restore_deck(active_cards, snap_before)

    return (wins, n_probes)


def run_infinite_campaign(
    rng: random.Random,
    max_redeals: int,
    flags: RuleFlags,
    max_rounds: int,
    solver_name: str,
    probe_solver_name: str,
    n_probes: int,
    sample_interval: int,
) -> Dict[str, Any]:
    """Run single campaign tracking per-round solvability across max_rounds."""
    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    round_records = []
    first_unwinnable_round = None

    for round_num in range(1, max_rounds + 1):
        active_cards = [c for c in registry if c.attrition_stage < 5]
        active_count = len(active_cards)

        if round_num == 1 or (round_num % sample_interval == 0):
            wins, total_probes = probe_solvability(
                active_cards=active_cards,
                rng=rng,
                max_redeals=max_redeals,
                flags=flags,
                n_probes=n_probes,
                probe_solver_name=probe_solver_name,
                full_registry=registry,
            )
            solvability_ratio = wins / total_probes if total_probes > 0 else 0.0
            is_unwinnable = wins == 0

            if is_unwinnable and first_unwinnable_round is None:
                first_unwinnable_round = round_num

            round_records.append(
                {
                    "round": round_num,
                    "active_cards": active_count,
                    "solvability_ratio": solvability_ratio,
                    "probe_wins": wins,
                    "total_probes": total_probes,
                    "is_unwinnable": is_unwinnable,
                }
            )

        if active_count >= N_PYR:
            solver = create_solver(solver_name)
            outcome = play_round(
                pool=active_cards,
                rng=rng,
                max_redeals=max_redeals,
                flags=flags,
                solver=solver,
                full_registry=registry,
            )
            if outcome.kind in ("perfect_win", "pyramid_clear"):
                _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

    return {
        "first_unwinnable_round": first_unwinnable_round,
        "round_records": round_records,
    }


def aggregate_results(
    all_campaigns: List[Dict[str, Any]], max_rounds: int, sample_interval: int
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Aggregate per-round stats and overall summary statistics across all campaigns."""
    total_campaigns = len(all_campaigns)
    sampled_rounds = [1] + [r for r in range(sample_interval, max_rounds + 1) if r % sample_interval == 0 and r != 1]
    sampled_rounds = sorted(list(set(sampled_rounds)))

    round_buckets: Dict[int, List[Dict[str, Any]]] = {r: [] for r in sampled_rounds}

    for camp in all_campaigns:
        for rec in camp["round_records"]:
            r = rec["round"]
            if r in round_buckets:
                round_buckets[r].append(rec)

    aggregated_rounds = []
    for r in sampled_rounds:
        recs = round_buckets[r]
        if not recs:
            continue
        unwinnable_count = sum(1 for rec in recs if rec["is_unwinnable"])
        unwinnable_pct = (unwinnable_count / total_campaigns) * 100.0
        avg_active = statistics.mean(rec["active_cards"] for rec in recs)
        avg_solvability = statistics.mean(rec["solvability_ratio"] for rec in recs)

        aggregated_rounds.append(
            {
                "round": r,
                "unwinnable_count": unwinnable_count,
                "unwinnable_pct": unwinnable_pct,
                "avg_active": avg_active,
                "avg_solvability": avg_solvability,
            }
        )

    first_unwinnable_rounds = [
        camp["first_unwinnable_round"] for camp in all_campaigns if camp["first_unwinnable_round"] is not None
    ]
    ever_unwinnable_count = len(first_unwinnable_rounds)
    ever_unwinnable_pct = (ever_unwinnable_count / total_campaigns) * 100.0

    summary_stats = {
        "total_campaigns": total_campaigns,
        "ever_unwinnable_count": ever_unwinnable_count,
        "ever_unwinnable_pct": ever_unwinnable_pct,
        "mean_first_unwinnable": statistics.mean(first_unwinnable_rounds) if first_unwinnable_rounds else None,
        "median_first_unwinnable": statistics.median(first_unwinnable_rounds) if first_unwinnable_rounds else None,
        "min_first_unwinnable": min(first_unwinnable_rounds) if first_unwinnable_rounds else None,
        "max_first_unwinnable": max(first_unwinnable_rounds) if first_unwinnable_rounds else None,
    }

    return (aggregated_rounds, summary_stats)


def print_round_table(aggregated_rounds: List[Dict[str, Any]], total_campaigns: int) -> None:
    """Print tabular per-round breakdown of unwinnable rate & average active cards."""
    print(f"\nPer-Round Unwinnable Solvability Breakdown ({total_campaigns} campaigns)")
    print("-" * 78)
    print(f"{'Round':<8} | {'Unwinnable %':<15} | {'Unwinnable Count':<18} | {'Avg Active Cards':<18} | {'Avg Solvability':<15}")
    print("-" * 78)

    for row in aggregated_rounds:
        print(
            f"{row['round']:<8} | {row['unwinnable_pct']:>13.1f}% | {row['unwinnable_count']:>10}/{total_campaigns:<6} | {row['avg_active']:>17.1f} | {row['avg_solvability']:>14.2%}"
        )
    print("-" * 78)


def print_ascii_chart(aggregated_rounds: List[Dict[str, Any]], max_rounds: int) -> None:
    """Print ASCII progress chart tracking Unwinnable % over campaign rounds."""
    print("\nUnwinnable Deck % Over Campaign Rounds (ASCII Visual)")
    print("-" * 78)

    chart_width = 40
    for row in aggregated_rounds:
        pct = row["unwinnable_pct"]
        filled = int(round((pct / 100.0) * chart_width))
        bar = "█" * filled + "░" * (chart_width - filled)
        print(f" Round {row['round']:>3}: [{bar}] {pct:>5.1f}%")

    print("-" * 78)


def print_summary(summary: Dict[str, Any], args: argparse.Namespace, seed_label: str) -> None:
    """Print summary statistics for deck evolution solvability."""
    print("\nSummary Statistics — Deck Evolution & Unwinnability")
    print("=" * 78)
    print(f" Difficulty Setting:       {args.difficulty}")
    print(f" Total Campaigns Analyzed: {summary['total_campaigns']}")
    print(f" Random Seed:             {seed_label}")
    print(f" Campaigns Ever Unwinnable:{summary['ever_unwinnable_count']}/{summary['total_campaigns']} ({summary['ever_unwinnable_pct']:.1f}%)")

    if summary["mean_first_unwinnable"] is not None:
        print(f" Mean Round 1st Unwinnable:{summary['mean_first_unwinnable']:.1f}")
        print(f" Median Round 1st Unwinnable:{summary['median_first_unwinnable']:.1f}")
        print(f" Earliest Unwinnable Round: {summary['min_first_unwinnable']}")
        print(f" Latest Unwinnable Round:   {summary['max_first_unwinnable']}")
    else:
        print(" Mean Round 1st Unwinnable: N/A (No campaigns became unwinnable)")

    print("=" * 78 + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run Cursed Tomb deck evolution & unwinnable solvability analysis."
    )
    parser.add_argument("-c", "--campaigns", type=int, default=100, help="Number of campaigns to run (default: 100)")
    parser.add_argument("-r", "--max-rounds", type=int, default=100, help="Round cap per campaign (default: 100)")
    parser.add_argument("-p", "--probes", type=int, default=50, help="Number of random shuffles per oracle call (default: 50)")
    parser.add_argument("-i", "--sample-interval", type=int, default=1, help="Sampling interval in rounds (default: 1)")
    parser.add_argument("-d", "--difficulty", choices=list(DIFFICULTIES.keys()), default="archaeologist", help="Difficulty level (default: archaeologist)")
    parser.add_argument("--solver", choices=["greedy", "heuristic", "beam", "dfs"], default="heuristic", help="Campaign solver strategy (default: heuristic)")
    parser.add_argument("--probe-solver", choices=["greedy", "heuristic", "beam", "dfs"], default="greedy", help="Oracle probe solver strategy (default: greedy)")
    parser.add_argument("-s", "--seed", type=int, default=None, help="Random seed for reproducibility (default: None - random seed generated)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Print per-campaign round-of-first-unwinnable")
    parser.add_argument("--workers", type=int, default=cpu_count(), help="Number of parallel worker processes (default: CPU cores)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    # Generate random seed if --seed is not explicitly provided
    if args.seed is None:
        actual_seed = random.randint(0, 1_000_000_000)
        seed_label = f"{actual_seed} (Randomly Generated)"
    else:
        actual_seed = args.seed
        seed_label = str(actual_seed)

    flags = RuleFlags(
        scars=True,
        curses=True,
        blessings=True,
        attrition=True,
        sealed_tomb_victory=False,
        rank_anchor_victory=False,
    )

    max_redeals = DIFFICULTIES[args.difficulty]
    base_rng = random.Random(actual_seed)
    n_workers = args.workers

    print("=" * 78)
    print(" Cursed Tomb: Deck Evolution & Unwinnable Solvability Analysis")
    print("=" * 78)
    print(f" Start Time:       {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f" Difficulty:       {args.difficulty} (max_redeals={max_redeals})")
    print(f" Campaigns:        {args.campaigns}")
    print(f" Max Rounds:       {args.max_rounds}")
    print(f" Probes / Sample:  {args.probes}")
    print(f" Sample Interval:  {args.sample_interval}")
    print(f" Campaign Solver:  {args.solver}")
    print(f" Probe Solver:     {args.probe_solver}")
    print(f" Workers:          {n_workers}")
    print(f" Seed:             {seed_label}")
    print("=" * 78)

    worker_args = [
        (
            base_rng.randint(0, 1_000_000_000),
            max_redeals,
            flags,
            args.max_rounds,
            args.solver,
            args.probe_solver,
            args.probes,
            args.sample_interval,
        )
        for _ in range(args.campaigns)
    ]

    all_campaign_results = []
    t0 = time.time()

    if n_workers > 1 and args.campaigns >= 2:
        chunk = max(1, args.campaigns // (n_workers * 4))
        with Pool(processes=n_workers) as pool:
            for i, res in enumerate(pool.imap_unordered(_run_deck_evolution_worker, worker_args, chunksize=chunk), 1):
                all_campaign_results.append(res)
                if args.verbose:
                    fur_str = f"R{res['first_unwinnable_round']}" if res["first_unwinnable_round"] is not None else "Never"
                    print(f" Campaign {i:>4}/{args.campaigns}: 1st Unwinnable = {fur_str}")
    else:
        for i, args_item in enumerate(worker_args, 1):
            res = _run_deck_evolution_worker(args_item)
            all_campaign_results.append(res)
            if args.verbose:
                fur_str = f"R{res['first_unwinnable_round']}" if res["first_unwinnable_round"] is not None else "Never"
                print(f" Campaign {i:>4}/{args.campaigns}: 1st Unwinnable = {fur_str}")

    elapsed = time.time() - t0
    print(f"\nSimulation completed in {elapsed:.1f}s.")

    aggregated, summary_stats = aggregate_results(all_campaign_results, args.max_rounds, args.sample_interval)
    print_round_table(aggregated, args.campaigns)
    print_ascii_chart(aggregated, args.max_rounds)
    print_summary(summary_stats, args, seed_label)

if __name__ == "__main__":
    main()
