#!/usr/bin/env python3
"""
Cursed Tomb — Persistent Deck Evolution & Solvability Analysis (Script Version)
================================================================================
Runs deck evolution analysis programmatically without requiring the Jupyter Notebook UI.
"""

import sys
import os
import random
import subprocess
from pathlib import Path

# Auto-switch to .venv python if matplotlib is missing in current environment
try:
    import matplotlib
except ImportError:
    repo_root = Path(__file__).resolve().parent.parent
    venv_python = repo_root / ".venv" / "bin" / "python"
    if venv_python.exists() and sys.executable != str(venv_python):
        sys.exit(subprocess.call([str(venv_python)] + sys.argv))

# Ensure repository root and sim directory are in Python path
repo_root = Path.cwd().resolve()
if repo_root.name == "notebooks":
    repo_root = repo_root.parent
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))
sim_dir = str(repo_root / "sim")
if sim_dir not in sys.path:
    sys.path.insert(0, sim_dir)

from sim.deck_evolution_core import (
    run_collapse_campaign,
    aggregate_results,
    plot_evolution,
    write_aggregated_csv,
    load_aggregated_csv,
    RuleFlags,
    DIFFICULTIES,
    HAS_MPL,
)


import argparse

def main():
    parser = argparse.ArgumentParser(description="Run deck evolution analysis script.")
    parser.add_argument("-s", "--solver", choices=["greedy", "heuristic", "beam", "dfs"], default="greedy", help="Campaign solver strategy (default: greedy)")
    parser.add_argument("-p", "--probe-solver", choices=["greedy", "heuristic", "beam", "dfs"], default="greedy", help="Probe solver strategy (default: greedy)")
    parser.add_argument("--no-scars", action="store_true", help="Disable Scars rule")
    parser.add_argument("--no-curses", action="store_true", help="Disable Curses rule")
    parser.add_argument("--no-blessings", action="store_true", help="Disable Blessings rule")
    parser.add_argument("--no-attrition", action="store_true", help="Disable Attrition rule")
    parser.add_argument("--anchor-absorption", action="store_true", help="Enable Anchor Absorption mechanic")
    args = parser.parse_args()

    print("=== Cursed Tomb Deck Evolution Analysis ===")
    flags = RuleFlags(
        scars=not args.no_scars,
        curses=not args.no_curses,
        blessings=not args.no_blessings,
        attrition=not args.no_attrition,
        anchor_absorption=args.anchor_absorption,
        sealed_tomb_victory=False,
        rank_anchor_victory=False,
    )
    rng = random.Random()

    rule_parts = []
    if args.no_scars: rule_parts.append('no-scars')
    if args.no_curses: rule_parts.append('no-curses')
    if args.no_blessings: rule_parts.append('no-blessings')
    if args.no_attrition: rule_parts.append('no-attrition')
    if args.anchor_absorption: rule_parts.append('anchor-abs')
    rule_tag = f", {','.join(rule_parts)}" if rule_parts else ""

    print(f"Simulating 10 campaigns (max 30 rounds, 10 probes/round, solver={args.solver}, probe_solver={args.probe_solver}{rule_tag})...")
    results = [
        run_collapse_campaign(
            rng=rng,
            max_redeals=DIFFICULTIES['archaeologist'],
            flags=flags,
            max_rounds=500,
            solver_name=args.solver,
            probe_solver_name=args.probe_solver,
            n_probes=10,
            sample_interval=1,
        )
        for _ in range(10)
    ]

    agg, summary = aggregate_results(results, max_rounds=30, sample_interval=1)
    runs = [{"label": f"archaeologist/{args.solver} (p:{args.probe_solver}{rule_tag}) #1", "data": agg}]

    print("\nSummary Results:")
    for k, v in summary.items():
        print(f"  {k}: {v}")

    if HAS_MPL:
        output_png = "deck_evolution.png"
        plot_evolution(runs, output_path=output_png, show=False)
        print(f"\nPlot successfully saved to {output_png}")
    else:
        print("Matplotlib not available for plotting.")


if __name__ == "__main__":
    main()
