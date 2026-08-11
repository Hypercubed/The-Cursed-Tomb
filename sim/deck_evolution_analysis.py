#!/usr/bin/env python3
"""
Deck Evolution & Unwinnable Solvability Analysis CLI
=====================================================
Simulates Cursed Tomb campaigns with collapse starvation (<28 active cards)
as the sole terminal condition. Tracks per-round deck composition and empirical
solvability using multi-probe Monte Carlo sampling.

Usage:
  python sim/deck_evolution_analysis.py [options]
"""

from __future__ import annotations

import argparse
import os
import random
import sys
import subprocess
import time
from pathlib import Path
from multiprocessing import Pool, cpu_count
from typing import Dict, List, Tuple, Any

# Auto-switch to .venv python if matplotlib is missing in current environment
try:
    import matplotlib
except ImportError:
    repo_root = Path(__file__).resolve().parent.parent
    venv_python = repo_root / ".venv" / "bin" / "python"
    if venv_python.exists() and sys.executable != str(venv_python):
        sys.exit(subprocess.call([str(venv_python)] + sys.argv))

try:
    import cursed_tomb_sim
    from cursed_tomb_sim import RuleFlags, DIFFICULTIES
except ImportError:
    from . import cursed_tomb_sim
    from .cursed_tomb_sim import RuleFlags, DIFFICULTIES

try:
    from deck_evolution_core import (
        run_collapse_campaign,
        aggregate_results,
        write_aggregated_csv,
        write_per_campaign_csv,
        plot_evolution,
        print_round_table,
        print_ascii_chart,
        print_summary,
    )
except ImportError:
    from .deck_evolution_core import (
        run_collapse_campaign,
        aggregate_results,
        write_aggregated_csv,
        write_per_campaign_csv,
        plot_evolution,
        print_round_table,
        print_ascii_chart,
        print_summary,
    )


def _run_deck_evolution_worker(args: Tuple[int, int, RuleFlags, int, str, str, int, int]) -> Dict[str, Any]:
    camp_seed, max_redeals, flags, max_rounds, solver_name, probe_solver_name, n_probes, sample_interval = args
    camp_rng = random.Random(camp_seed)
    return run_collapse_campaign(
        rng=camp_rng,
        max_redeals=max_redeals,
        flags=flags,
        max_rounds=max_rounds,
        solver_name=solver_name,
        probe_solver_name=probe_solver_name,
        n_probes=n_probes,
        sample_interval=sample_interval,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run Cursed Tomb deck evolution & unwinnable solvability analysis."
    )
    parser.add_argument("-c", "--campaigns", type=int, default=100, help="Number of campaigns to run (default: 100)")
    parser.add_argument("-r", "--max-rounds", type=int, default=100, help="Round cap per campaign (default: 100)")
    parser.add_argument("-p", "--probes", type=int, default=50, help="Number of random shuffles per oracle call (default: 50)")
    parser.add_argument("-i", "--sample-interval", type=int, default=1, help="Sampling interval in rounds (default: 1)")
    parser.add_argument("-d", "--difficulty", choices=list(DIFFICULTIES.keys()), default="archaeologist", help="Difficulty level (default: archaeologist)")
    parser.add_argument("--solver", choices=["greedy", "heuristic", "beam", "dfs"], default="greedy", help="Campaign solver strategy (default: greedy)")
    parser.add_argument("--probe-solver", choices=["greedy", "heuristic", "beam", "dfs"], default="greedy", help="Oracle probe solver strategy (default: greedy)")
    parser.add_argument("--csv", type=str, default=None, help="Output CSV path for aggregated round statistics")
    parser.add_argument("--csv-per-campaign", type=str, default=None, help="Output CSV path for detailed per-campaign statistics")
    parser.add_argument("--plot", type=str, default=None, help="Output PNG path for deck evolution plot")
    parser.add_argument("--plot-dir", type=str, default=None, help="Output directory for deck evolution plot")
    parser.add_argument("-s", "--seed", type=int, default=None, help="Random seed for reproducibility (default: None - random seed generated)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Print per-campaign round-of-first-unwinnable")
    parser.add_argument("--workers", type=int, default=cpu_count(), help="Number of parallel worker processes (default: CPU cores)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

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

    all_campaign_results: List[Dict[str, Any]] = []
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

    if args.csv:
        write_aggregated_csv(args.csv, aggregated)
        print(f"Aggregated CSV written to: {args.csv}")

    if args.csv_per_campaign:
        write_per_campaign_csv(args.csv_per_campaign, all_campaign_results)
        print(f"Per-campaign CSV written to: {args.csv_per_campaign}")

    plot_path = args.plot
    if not plot_path and args.plot_dir:
        plot_path = os.path.join(args.plot_dir, "deck_evolution.png")

    if plot_path:
        plot_evolution(aggregated, output_path=plot_path)
        print(f"Plot written to: {plot_path}")


if __name__ == "__main__":
    main()
