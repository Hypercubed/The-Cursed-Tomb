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

    probe_wins = 0
    for _ in range(n_probes):
        # Create independent cloned pool for probe run
        cloned_active = [copy_card(c) for c in active_cards]
        probe_solver = create_solver(probe_solver_name)
        outcome = play_round(cloned_active, rng, max_redeals, flags, solver=probe_solver)
        if outcome.kind in ('pyramid_clear', 'perfect_win'):
            probe_wins += 1

    # Sanity check: confirm live deck state was not mutated by probes
    if full_registry is not None:
        snap_after = snapshot_deck(full_registry)
        assert snap_before == snap_after, "Oracle mutated live registry state!"
    else:
        snap_after = snapshot_deck(active_cards)
        assert snap_before == snap_after, "Oracle mutated live active card state!"

    return (probe_wins, n_probes)


@dataclass
class RoundData:
    round_num: int
    probe_wins: int
    n_probes: int
    is_unwinnable: bool
    is_first_unwinnable: bool


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
    """
    Runs a campaign for max_rounds rounds with all terminal victory and collapse
    conditions disabled. At sampled rounds, evaluates empirical solvability via oracle.
    """
    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    first_unwinnable_round: Optional[int] = None
    round_data_list: List[RoundData] = []
    stalled = False

    for round_num in range(1, max_rounds + 1):
        active = [c for c in registry if c.attrition_stage < flags.max_attrition_stage]
        is_sampled = ((round_num - 1) % sample_interval == 0)

        if len(active) < N_PYR or stalled:
            # Active count below 28 (starvation) or all active anchored (equilibrium stall)
            if is_sampled:
                if len(active) < N_PYR:
                    probe_wins = 0
                    is_unwinnable = True
                else:
                    # All anchored stall: probe solvability once
                    probe_wins, _ = probe_solvability(
                        active, rng, max_redeals, flags, n_probes, probe_solver_name, registry
                    )
                    is_unwinnable = (probe_wins == 0)

                is_first = False
                if is_unwinnable and first_unwinnable_round is None:
                    first_unwinnable_round = round_num
                    is_first = True

                round_data_list.append(RoundData(round_num, probe_wins, n_probes, is_unwinnable, is_first))
            continue

        # Check for all-anchored equilibrium stall
        if all(c.is_anchored() for c in active):
            stalled = True
            if is_sampled:
                probe_wins, _ = probe_solvability(
                    active, rng, max_redeals, flags, n_probes, probe_solver_name, registry
                )
                is_unwinnable = (probe_wins == 0)
                is_first = False
                if is_unwinnable and first_unwinnable_round is None:
                    first_unwinnable_round = round_num
                    is_first = True
                round_data_list.append(RoundData(round_num, probe_wins, n_probes, is_unwinnable, is_first))
            continue

        # Oracle probing before playing live round
        if is_sampled:
            probe_wins, _ = probe_solvability(
                active, rng, max_redeals, flags, n_probes, probe_solver_name, registry
            )
            is_unwinnable = (probe_wins == 0)
            is_first = False
            if is_unwinnable and first_unwinnable_round is None:
                first_unwinnable_round = round_num
                is_first = True
            round_data_list.append(RoundData(round_num, probe_wins, n_probes, is_unwinnable, is_first))

        # Play live campaign round
        solver = create_solver(solver_name)
        outcome = play_round(active, rng, max_redeals, flags, full_registry=registry, solver=solver)

        # Apply survival reward on pyramid clear or perfect win (freeze attrition is handled in play_round)
        if outcome.kind in ('pyramid_clear', 'perfect_win') and outcome.last_clear_type:
            _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

    return {
        "round_data": round_data_list,
        "first_unwinnable_round": first_unwinnable_round,
    }


def aggregate_results(
    all_campaign_results: List[Dict[str, Any]],
    max_rounds: int,
    sample_interval: int,
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Builds per-round aggregate statistics across all campaigns and computes overall summary stats.
    """
    n_campaigns = len(all_campaign_results)
    sampled_rounds = list(range(1, max_rounds + 1, sample_interval))
    aggregated_rounds = []

    first_unwinnable_list = [
        res["first_unwinnable_round"] for res in all_campaign_results if res["first_unwinnable_round"] is not None
    ]
    never_unwinnable_count = sum(1 for res in all_campaign_results if res["first_unwinnable_round"] is None)
    always_unwinnable_count = sum(1 for res in all_campaign_results if res["first_unwinnable_round"] == 1)

    for idx, r in enumerate(sampled_rounds):
        unwinnable_count = 0
        first_unwinnable_count = 0
        win_rates = []
        cumul_unwinnable_count = 0

        for res in all_campaign_results:
            rd_list = res["round_data"]
            if idx < len(rd_list):
                rd = rd_list[idx]
                if rd.is_unwinnable:
                    unwinnable_count += 1
                if rd.is_first_unwinnable:
                    first_unwinnable_count += 1
                win_rates.append(rd.probe_wins / rd.n_probes)

            fur = res["first_unwinnable_round"]
            if fur is not None and fur <= r:
                cumul_unwinnable_count += 1

        mean_win_rate = statistics.mean(win_rates) if win_rates else 0.0

        aggregated_rounds.append({
            "round_num": r,
            "unwinnable_count": unwinnable_count,
            "unwinnable_pct": (unwinnable_count / n_campaigns) * 100.0,
            "first_unwinnable_count": first_unwinnable_count,
            "first_unwinnable_pct": (first_unwinnable_count / n_campaigns) * 100.0,
            "mean_win_rate": mean_win_rate,
            "cumul_unwinnable_count": cumul_unwinnable_count,
            "cumul_unwinnable_pct": (cumul_unwinnable_count / n_campaigns) * 100.0,
        })

    summary_stats = {
        "n_campaigns": n_campaigns,
        "max_rounds": max_rounds,
        "sample_interval": sample_interval,
        "first_unwinnable_list": first_unwinnable_list,
        "median_first_unwinnable": statistics.median(first_unwinnable_list) if first_unwinnable_list else None,
        "mean_first_unwinnable": statistics.mean(first_unwinnable_list) if first_unwinnable_list else None,
        "never_unwinnable_count": never_unwinnable_count,
        "never_unwinnable_pct": (never_unwinnable_count / n_campaigns) * 100.0,
        "always_unwinnable_count": always_unwinnable_count,
        "always_unwinnable_pct": (always_unwinnable_count / n_campaigns) * 100.0,
    }

    return aggregated_rounds, summary_stats


def print_round_table(aggregated: List[Dict[str, Any]], n_campaigns: int) -> None:
    """Print the per-round statistics table."""
    print("\n" + "=" * 78)
    print(f" PER-ROUND SOLVABILITY TABLE ({n_campaigns} campaigns)")
    print("=" * 78)
    print(f" {'Round':<7} | {'Unwinnable%':<12} | {'1st-Unwin%':<12} | {'Mean-Win-Rate':<14} | {'Cumul-Unwin%':<12}")
    print(" " + "-" * 76)

    for row in aggregated:
        r = row["round_num"]
        u_pct = row["unwinnable_pct"]
        f_pct = row["first_unwinnable_pct"]
        m_win = row["mean_win_rate"] * 100.0
        c_pct = row["cumul_unwinnable_pct"]
        print(f" {r:<7} | {u_pct:>10.1f}% | {f_pct:>10.1f}% | {m_win:>12.1f}% | {c_pct:>10.1f}%")
    print("=" * 78)


def print_ascii_chart(aggregated: List[Dict[str, Any]], max_rounds: int) -> None:
    """Render an ASCII bar chart of mean probe win rate vs round."""
    print("\n" + "=" * 78)
    print(" MEAN PROBE WIN RATE VS ROUND (50-char scale)")
    print("=" * 78)

    for row in aggregated:
        r = row["round_num"]
        win_rate = row["mean_win_rate"]
        bar_len = int(round(win_rate * 50))
        bar = "#" * bar_len
        print(f" R{r:<4} | {win_rate * 100:>5.1f}% | {bar:<50}")
    print("=" * 78)


def print_summary(summary_stats: Dict[str, Any], args: argparse.Namespace) -> None:
    """Print final summary block with config echo and key findings."""
    n = summary_stats["n_campaigns"]
    med = summary_stats["median_first_unwinnable"]
    mean = summary_stats["mean_first_unwinnable"]
    never_pct = summary_stats["never_unwinnable_pct"]
    always_pct = summary_stats["always_unwinnable_pct"]
    ever_count = len(summary_stats["first_unwinnable_list"])

    print("\n" + "=" * 78)
    print(" SUMMARY STATISTICS & FINDINGS")
    print("=" * 78)
    print(f" Configuration:")
    print(f"   - Campaigns:         {args.campaigns}")
    print(f"   - Max Rounds:        {args.max_rounds}")
    print(f"   - Probes per Sample: {args.probes}")
    print(f"   - Sample Interval:   {args.sample_interval}")
    print(f"   - Difficulty:        {args.difficulty}")
    print(f"   - Campaign Solver:   {args.solver}")
    print(f"   - Probe Solver:      {args.probe_solver}")
    print(f"   - Seed:              {args.seed if args.seed is not None else 'None (Random)'}")
    print("-" * 78)
    print(f" Findings:")
    print(f"   - Total Campaigns Evaluated:   {n}")
    print(f"   - Campaigns Becoming Unwinnable:{ever_count} ({(ever_count / n) * 100.0:.1f}%)")

    if ever_count > 0:
        print(f"   - First Unwinnable Round (Median): R{med:.1f}" if med is not None else "   - First Unwinnable Round (Median): N/A")
        print(f"   - First Unwinnable Round (Mean):   R{mean:.1f}" if mean is not None else "   - First Unwinnable Round (Mean):   N/A")
    else:
        print(f"   - No campaigns became unwinnable within {args.max_rounds} rounds.")

    print(f"   - Never Unwinnable Rate:        {never_pct:.1f}% ({summary_stats['never_unwinnable_count']}/{n})")
    print(f"   - Always Unwinnable Rate (R1):  {always_pct:.1f}% ({summary_stats['always_unwinnable_count']}/{n})")
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
    parser.add_argument("-s", "--seed", type=int, default=None, help="Random seed for reproducibility (default: None)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Print per-campaign round-of-first-unwinnable")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    # RuleFlags with all terminal victory/collapse checks disabled, but mechanics active
    flags = RuleFlags(
        scars=True,
        curses=True,
        blessings=True,
        attrition=True,
        volatile_collapse=False,
        sealed_tomb_victory=False,
        rank_anchor_victory=False,
    )

    max_redeals = DIFFICULTIES[args.difficulty]
    rng = random.Random(args.seed)

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
    print(f" Seed:             {args.seed}")
    print("=" * 78)

    all_campaign_results = []
    t0 = time.time()

    for i in range(1, args.campaigns + 1):
        # Create fresh seed per campaign if base seed specified
        camp_seed = rng.randint(0, 1_000_000_000) if args.seed is not None else None
        camp_rng = random.Random(camp_seed)

        res = run_infinite_campaign(
            rng=camp_rng,
            max_redeals=max_redeals,
            flags=flags,
            max_rounds=args.max_rounds,
            solver_name=args.solver,
            probe_solver_name=args.probe_solver,
            n_probes=args.probes,
            sample_interval=args.sample_interval,
        )
        all_campaign_results.append(res)

        if args.verbose:
            fur_str = f"R{res['first_unwinnable_round']}" if res["first_unwinnable_round"] is not None else "Never"
            print(f" Campaign {i:>4}/{args.campaigns}: 1st Unwinnable = {fur_str}")

    elapsed = time.time() - t0
    print(f"\nSimulation completed in {elapsed:.1f}s.")

    aggregated, summary_stats = aggregate_results(all_campaign_results, args.max_rounds, args.sample_interval)
    print_round_table(aggregated, args.campaigns)
    print_ascii_chart(aggregated, args.max_rounds)
    print_summary(summary_stats, args)


if __name__ == "__main__":
    main()
