"""
Deck Evolution Core Module
===========================
Pure simulation, statistics collection, CSV serialization, and plotting functions
for Cursed Tomb persistent deck evolution and solvability analysis.

Free of CLI parsing (argparse) and multiprocessing.Pool to enable seamless reuse
in interactive Jupyter notebooks, standalone scripts, and batch sweeps.
"""

from __future__ import annotations

import csv
import os
import random
import statistics
import sys
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Any, Union

try:
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
except ImportError:
    from . import cursed_tomb_sim
    from .cursed_tomb_sim import (
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

try:
    import matplotlib
    import matplotlib.pyplot as plt
    HAS_MPL = True
except ImportError:
    HAS_MPL = False
    plt = None


@dataclass
class DeckStats:
    """Snapshot of minimal card composition statistics for a 52-card deck."""
    active: int     # count of cards with attrition_stage < 5
    blessed: int    # count of cards with blessed == True
    cursed: int     # count of cards with attrition_stage == 4
    anchored: int   # count of cards with reward_stage == 2


def compute_deck_stats(registry: List[CardState]) -> DeckStats:
    """Compute current composition stats from persistent card registry."""
    active = sum(1 for c in registry if c.attrition_stage < 5)
    blessed = sum(1 for c in registry if c.blessed)
    cursed = sum(1 for c in registry if c.attrition_stage == 4)
    anchored = sum(1 for c in registry if c.reward_stage == 2)
    return DeckStats(active=active, blessed=blessed, cursed=cursed, anchored=anchored)


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
    raise ValueError(f"Unknown solver strategy: {solver_name}")


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
    Probe empirical winnability of active card pool by running n_probes
    independent random shuffles using independent CardState copies.
    Does NOT mutate the live campaign's card state.
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


def run_collapse_campaign(
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
    Run a single collapse-only campaign tracking per-round deck composition and solvability.
    
    Terminates when active cards drop below 28 (collapse_starvation) or max_rounds is reached.
    Victories apply survival rewards and continue to the next round.
    """
    registry = [CardState(r, s) for s in SUITS for r in RANKS]
    round_records = []
    first_unwinnable_round = None
    terminal_reason = "timeout"
    last_round_played = 0

    for round_num in range(1, max_rounds + 1):
        stats = compute_deck_stats(registry)
        if stats.active < N_PYR:
            terminal_reason = "collapse_starvation"
            break

        last_round_played = round_num

        if round_num == 1 or (round_num % sample_interval == 0):
            active_cards = [c for c in registry if c.attrition_stage < 5]
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
            is_unwinnable = (wins == 0)

            if is_unwinnable and first_unwinnable_round is None:
                first_unwinnable_round = round_num

            round_records.append(
                {
                    "round": round_num,
                    "active": stats.active,
                    "blessed": stats.blessed,
                    "cursed": stats.cursed,
                    "anchored": stats.anchored,
                    "solvability_ratio": solvability_ratio,
                    "probe_wins": wins,
                    "total_probes": total_probes,
                    "is_unwinnable": is_unwinnable,
                }
            )

        active_cards = [c for c in registry if c.attrition_stage < 5]
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
        "total_rounds": last_round_played,
        "terminal_reason": terminal_reason,
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
        n_contributing = len(recs)
        if n_contributing == 0:
            continue
        unwinnable_count = sum(1 for rec in recs if rec["is_unwinnable"])
        unwinnable_pct = (unwinnable_count / n_contributing) * 100.0
        mean_active = statistics.mean(rec["active"] for rec in recs)
        mean_blessed = statistics.mean(rec["blessed"] for rec in recs)
        mean_cursed = statistics.mean(rec["cursed"] for rec in recs)
        mean_anchored = statistics.mean(rec["anchored"] for rec in recs)
        mean_probe_win_rate = statistics.mean(rec["solvability_ratio"] for rec in recs)

        aggregated_rounds.append(
            {
                "round": r,
                "n_contributing": n_contributing,
                "unwinnable_count": unwinnable_count,
                "unwinnable_pct": unwinnable_pct,
                "mean_active": mean_active,
                "mean_blessed": mean_blessed,
                "mean_cursed": mean_cursed,
                "mean_anchored": mean_anchored,
                "mean_probe_win_rate": mean_probe_win_rate,
            }
        )

    first_unwinnable_rounds = [
        camp["first_unwinnable_round"] for camp in all_campaigns if camp["first_unwinnable_round"] is not None
    ]
    ever_unwinnable_count = len(first_unwinnable_rounds)
    ever_unwinnable_pct = (ever_unwinnable_count / total_campaigns) * 100.0 if total_campaigns > 0 else 0.0

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


def write_aggregated_csv(filepath: str, aggregated_rounds: List[Dict[str, Any]]) -> None:
    """Write aggregated per-round composition and winability means to CSV."""
    if not filepath:
        return
    parent = os.path.dirname(filepath)
    if parent:
        os.makedirs(parent, exist_ok=True)
    fieldnames = [
        "round",
        "mean_active",
        "mean_blessed",
        "mean_cursed",
        "mean_anchored",
        "mean_probe_win_rate",
        "unwinnable_count",
        "unwinnable_pct",
        "n_contributing",
    ]
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in aggregated_rounds:
            writer.writerow({
                "round": row["round"],
                "mean_active": round(row["mean_active"], 4),
                "mean_blessed": round(row["mean_blessed"], 4),
                "mean_cursed": round(row["mean_cursed"], 4),
                "mean_anchored": round(row["mean_anchored"], 4),
                "mean_probe_win_rate": round(row["mean_probe_win_rate"], 4),
                "unwinnable_count": row["unwinnable_count"],
                "unwinnable_pct": round(row["unwinnable_pct"], 4),
                "n_contributing": row["n_contributing"],
            })


def write_per_campaign_csv(filepath: str, all_campaigns: List[Dict[str, Any]]) -> None:
    """Write detailed per-campaign per-round stats to long-form CSV."""
    if not filepath:
        return
    parent = os.path.dirname(filepath)
    if parent:
        os.makedirs(parent, exist_ok=True)
    fieldnames = [
        "campaign",
        "round",
        "active",
        "blessed",
        "cursed",
        "anchored",
        "probe_wins",
        "total_probes",
        "is_unwinnable",
    ]
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for camp_idx, camp in enumerate(all_campaigns, 1):
            for rec in camp["round_records"]:
                writer.writerow({
                    "campaign": camp_idx,
                    "round": rec["round"],
                    "active": rec["active"],
                    "blessed": rec["blessed"],
                    "cursed": rec["cursed"],
                    "anchored": rec["anchored"],
                    "probe_wins": rec["probe_wins"],
                    "total_probes": rec["total_probes"],
                    "is_unwinnable": rec["is_unwinnable"],
                })


def load_aggregated_csv(filepath: str) -> List[Dict[str, Any]]:
    """Load aggregated per-round data from CSV."""
    aggregated_rounds = []
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            aggregated_rounds.append({
                "round": int(row["round"]),
                "mean_active": float(row["mean_active"]),
                "mean_blessed": float(row["mean_blessed"]),
                "mean_cursed": float(row["mean_cursed"]),
                "mean_anchored": float(row["mean_anchored"]),
                "mean_probe_win_rate": float(row["mean_probe_win_rate"]),
                "unwinnable_count": int(row["unwinnable_count"]),
                "unwinnable_pct": float(row["unwinnable_pct"]),
                "n_contributing": int(row["n_contributing"]),
            })
    return aggregated_rounds


def plot_evolution(
    runs_or_aggregated: Union[List[Dict[str, Any]], List[Dict[str, Any]]],
    output_path: Optional[str] = None,
    title_suffix: str = "",
    show: bool = False,
) -> Any:
    """
    Generate 3-panel time-series plot of deck active count, composition, and solvability vs round.
    
    Accepts either a single aggregated_rounds list or a list of run dicts:
    [{"label": "archaeologist/greedy", "data": aggregated_rounds}, ...]
    
    Handles missing matplotlib gracefully by printing a warning to stderr.
    """
    if not HAS_MPL:
        sys.stderr.write("Warning: matplotlib is not installed; skipping plot generation.\n")
        return None

    if not runs_or_aggregated:
        return None

    # Normalize input format
    first_item = runs_or_aggregated[0]
    if "round" in first_item:
        runs = [{"label": "Run" + title_suffix, "data": runs_or_aggregated}]
    else:
        runs = runs_or_aggregated

    fig, axes = plt.subplots(3, 1, figsize=(10, 10), sharex=True)
    ax1, ax2, ax3 = axes

    # Panel 1: Active Cards
    ax1.axhline(y=28, color='red', linestyle='--', alpha=0.7, label='Collapse Starvation (28)')
    for run in runs:
        data = run["data"]
        label = run.get("label", "Run")
        rounds = [r["round"] for r in data]
        active = [r["mean_active"] for r in data]
        ax1.plot(rounds, active, label=f"{label} - Active Cards", marker='o', markersize=3)
    ax1.set_ylabel("Active Cards")
    ax1.set_title("Active Card Count Over Campaign Rounds")
    ax1.grid(True, linestyle=':', alpha=0.6)
    ax1.legend(loc='best', fontsize='small')

    # Panel 2: Deck Composition
    for run in runs:
        data = run["data"]
        label = run.get("label", "Run")
        rounds = [r["round"] for r in data]
        blessed = [r["mean_blessed"] for r in data]
        cursed = [r["mean_cursed"] for r in data]
        anchored = [r["mean_anchored"] for r in data]
        ax2.plot(rounds, blessed, label=f"{label} - Blessed", color='green', linestyle='-')
        ax2.plot(rounds, cursed, label=f"{label} - Cursed", color='purple', linestyle='--')
        ax2.plot(rounds, anchored, label=f"{label} - Anchored", color='blue', linestyle=':')
    ax2.set_ylabel("Mean Card Count")
    ax2.set_title("Deck Composition Statistics (Blessed, Cursed, Anchored)")
    ax2.grid(True, linestyle=':', alpha=0.6)
    ax2.legend(loc='best', fontsize='small')

    # Panel 3: Solvability & Unwinnable Rate
    for run in runs:
        data = run["data"]
        label = run.get("label", "Run")
        rounds = [r["round"] for r in data]
        win_rate = [r["mean_probe_win_rate"] * 100.0 for r in data]
        unwinnable_pct = [r["unwinnable_pct"] for r in data]
        ax3.plot(rounds, win_rate, label=f"{label} - Probe Win Rate %", color='tab:blue', linestyle='-')
        ax3.plot(rounds, unwinnable_pct, label=f"{label} - Unwinnable %", color='tab:orange', linestyle='--')
    ax3.set_xlabel("Round")
    ax3.set_ylabel("Percentage (%)")
    ax3.set_ylim(-5, 105)
    ax3.set_title("Empirical Solvability & Unwinnable Rate vs Round")
    ax3.grid(True, linestyle=':', alpha=0.6)
    ax3.legend(loc='best', fontsize='small')

    plt.tight_layout()

    if output_path:
        parent = os.path.dirname(output_path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        fig.savefig(output_path, dpi=150)

    if show:
        plt.show()
    else:
        plt.close(fig)

    return fig


def print_round_table(aggregated_rounds: List[Dict[str, Any]], total_campaigns: int) -> None:
    """Print tabular per-round breakdown of deck composition & solvability."""
    print(f"\nPer-Round Deck Evolution Breakdown ({total_campaigns} campaigns)")
    print("-" * 95)
    print(f"{'Round':<6} | {'Alive':<6} | {'Active':<8} | {'Blessed':<8} | {'Cursed':<8} | {'Anchored':<8} | {'Unwinnable %':<14} | {'Win Rate':<10}")
    print("-" * 95)

    for row in aggregated_rounds:
        alive_str = f"{row['n_contributing']}/{total_campaigns}"
        print(
            f"{row['round']:<6} | {alive_str:<6} | {row['mean_active']:>8.1f} | {row['mean_blessed']:>8.1f} | {row['mean_cursed']:>8.1f} | {row['mean_anchored']:>8.1f} | {row['unwinnable_pct']:>12.1f}% | {row['mean_probe_win_rate']:>9.2%}"
        )
    print("-" * 95)


def print_ascii_chart(aggregated_rounds: List[Dict[str, Any]], max_rounds: int) -> None:
    """Print ASCII progress chart tracking Unwinnable % over campaign rounds."""
    print("\nUnwinnable Deck % Over Campaign Rounds (ASCII Visual)")
    print("-" * 78)

    chart_width = 40
    for row in aggregated_rounds:
        pct = row["unwinnable_pct"]
        filled = int(round((pct / 100.0) * chart_width))
        bar = "█" * filled + "░" * (chart_width - filled)
        print(f" Round {row['round']:>3} ({row['n_contributing']} alive): [{bar}] {pct:>5.1f}%")

    print("-" * 78)


def print_summary(summary: Dict[str, Any], args_or_opts: Any, seed_label: str) -> None:
    """Print summary statistics for deck evolution solvability."""
    difficulty = getattr(args_or_opts, 'difficulty', str(args_or_opts.get('difficulty', 'archaeologist') if isinstance(args_or_opts, dict) else 'archaeologist'))
    solver = getattr(args_or_opts, 'solver', str(args_or_opts.get('solver', 'greedy') if isinstance(args_or_opts, dict) else 'greedy'))
    probe_solver = getattr(args_or_opts, 'probe_solver', str(args_or_opts.get('probe_solver', 'greedy') if isinstance(args_or_opts, dict) else 'greedy'))
    probes = getattr(args_or_opts, 'probes', args_or_opts.get('probes', 50) if isinstance(args_or_opts, dict) else 50)

    print("\nSummary Statistics — Deck Evolution & Unwinnability")
    print("=" * 78)
    print(f" Difficulty Setting:       {difficulty}")
    print(f" Campaign Solver:          {solver}")
    print(f" Probe Solver:             {probe_solver}")
    print(f" Probes per Round:         {probes}")
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
