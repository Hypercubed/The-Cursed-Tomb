#!/usr/bin/env python3
"""
Simulation Suite Orchestrator & RESULTS.md Updater
===================================================

Runs Cursed Tomb simulation benchmarks across 6 parts:
  Part 1: Single-Game Win & Collapse Rates (base_game_sim.py)
  Part 2: Base-Game Campaign Rounds to Perfect Win (campaign_rounds_sim.py)
  Part 3: Full Rules Campaign (cursed_tomb_sim.py)
  Part 4: Endless Campaign Endurance Sweep (sweep_thresholds.py)
  Part 5: FILO Vault Rule Comparison (compare_vault_sim.py)
  Part 6: Solver Comparison (test_solvers.py)

Usage:
  python3 sim/run_simulations.py [--quick | --full] [--seed 42] [--workers 4] [--parts 1 2 ...] [--update-results]
"""

import sys
import os
import re
import argparse
import subprocess
import time

SIM_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SIM_DIR)
RESULTS_MD = os.path.join(SIM_DIR, "RESULTS.md")

# Header and Separator Definitions
P1_HEADER = "| UI Redraw Setting        | Redraws | Pyramid Clear Rate | Total Victory Rate | Collapse Rate |"
P1_SEP    = "| :----------------------- | :-----: | -----------------: | -----------------: | ------------: |"

P2_HEADER = "| Difficulty    | Redraws | Win Rate within 500 Rounds | Avg Rounds to Win | Median Rounds |"
P2_SEP    = "| :------------ | :-----: | -------------------------: | ----------------: | ------------: |"

P3_T1_HEADER = "| Difficulty    | Redraws | Victory (all) | Collapse (all) | Stall | Timeout | Victory / Collapse of Resolved |"
P3_T1_SEP    = "| :------------ | :-----: | ------------: | -------------: | ----: | ------: | -----------------------------: |"

P3_T2_HEADER = "| Difficulty    |     Avg Rounds to Win |    Avg Rounds to Collapse |     Overall Avg to Resolve |"
P3_T2_SEP    = "| :------------ | --------------------: | ------------------------: | -------------------------: |"

P4_T1_HEADER = "| Difficulty    | Redraws | Mean Rounds Survived | Pyramids Cleared / Campaign | Perfect Wins / Campaign | Rank-Anchor Achievement |"
P4_T1_SEP    = "| :------------ | :-----: | -------------------: | --------------------------: | ----------------------: | ----------------------: |"

P4_T2_HEADER = "| Difficulty    | Starvation | Volatile Collapse | Deadlock | Round Cap |"
P4_T2_SEP    = "| :------------ | ---------: | ----------------: | -------: | --------: |"

P5_HEADER = "| Difficulty    | Mode               | Victory Rate | Collapse Rate | Timeout Rate* | Avg Rounds |"
P5_SEP    = "| :------------ | :----------------- | -----------: | ------------: | ------------: | ---------: |"

P6_HEADER = "| Solver Policy       | Single-Game Win Rate | Wins | Losses | Execution Time* | Moves / Game |"
P6_SEP    = "| :------------------ | -------------------: | ---: | -----: | --------------: | -----------: |"


def run_command(cmd, cwd=PROJECT_ROOT):
    """Executes command and returns stdout text."""
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
    if res.returncode != 0:
        print(f"Error running command: {cmd}\n{res.stderr}", file=sys.stderr)
        sys.exit(res.returncode)
    return res.stdout


def run_part1(games, seed, solver, workers):
    print(f"--- Running Part 1: Single-Game Win & Collapse Rates ({games} games) ---", flush=True)
    cmd = f"python3 sim/base_game_sim.py --games {games} --seed {seed} --solver {solver} --workers {workers}"
    output = run_command(cmd)
    
    rows = []
    redraw_map = {
        "0 redraws (Survivalist)": "0",
        "1 redraw  (Archaeologist)": "1",
        "3 redraws (Explorer)": "3",
        "5 redraws (Novice)": "5"
    }
    
    for line in output.splitlines():
        for label, r_val in redraw_map.items():
            if line.startswith(label):
                parts = line[len(label):].split()
                if len(parts) >= 3:
                    pyr_win = parts[0]
                    tot_vic = parts[1]
                    collapse = parts[2]
                    rows.append(f"| {label.strip():<24} | {r_val:^7} | {pyr_win:>18} | {tot_vic:>18} | {collapse:>13} |")
    return cmd, rows


def run_part2(campaigns, seed, solver, workers):
    print(f"--- Running Part 2: Base-Game Campaign Rounds ({campaigns} campaigns) ---", flush=True)
    diffs = [
        ("Survivalist", "0", "survivalist"),
        ("Archaeologist", "1", "archaeologist"),
        ("Explorer", "3", "explorer"),
        ("Novice", "5", "novice")
    ]
    rows = []
    cmds = []
    for label, redraw, diff in diffs:
        cmd = f"python3 sim/campaign_rounds_sim.py --campaigns {campaigns} --difficulty {diff} --max-rounds 500 --solver {solver} --seed {seed} --workers {workers}"
        cmds.append(cmd)
        output = run_command(cmd)
        
        win_rate = "0.0%"
        avg_rounds = "N/A"
        median_rounds = "N/A"
        
        for line in output.splitlines():
            if "Victories" in line and "(" in line and ")" in line:
                win_rate = line.split("(")[1].split(")")[0]
            elif "Avg rounds to Perfect Win" in line:
                avg_rounds = line.split(":")[-1].strip()
            elif "Median rounds to win" in line:
                median_rounds = line.split(":")[-1].strip()
                
        rows.append(f"| {label:<13} | {redraw:^7} | {win_rate:>26} | {avg_rounds:>18} | {median_rounds:>13} |")
    return cmds, rows


def run_part3(campaigns, seed, solver, workers):
    print(f"--- Running Part 3: Full Rules Campaign ({campaigns} campaigns) ---", flush=True)
    diffs = [
        ("Survivalist", "0", "survivalist"),
        ("Archaeologist", "1", "archaeologist"),
        ("Explorer", "3", "explorer"),
        ("Novice", "5", "novice")
    ]
    
    table1_rows = []
    table2_rows = []
    cmd_pattern = f"python3 sim/cursed_tomb_sim.py --campaigns {campaigns} --seed {seed} --difficulty [difficulty] --solver {solver} --volatile-collapse --max-rounds 500 --workers {workers}"
    
    for label, redraw, diff in diffs:
        cmd = f"python3 sim/cursed_tomb_sim.py --campaigns {campaigns} --seed {seed} --difficulty {diff} --solver {solver} --volatile-collapse --max-rounds 500 --workers {workers}"
        output = run_command(cmd)
        
        vic_all = "0.00%"
        col_all = "0.00%"
        stall = "0.00%"
        timeout = "0.00%"
        vic_resolved = "0.00%"
        col_resolved = "0.00%"
        
        avg_win = "N/A"
        avg_col = "N/A"
        avg_res = "N/A"
        
        for line in output.splitlines():
            line_str = line.strip()
            if line_str.startswith("victory rate (all):"):
                vic_all = line_str.split(":")[-1].strip()
            elif line_str.startswith("collapse rate (all):"):
                col_all = line_str.split(":")[-1].strip()
            elif line_str.startswith("timeout rate (all):"):
                timeout = line_str.split(":")[-1].strip()
            elif line_str.startswith("victory rate:"):
                vic_resolved = line_str.split(":")[1].split("(")[0].strip()
            elif line_str.startswith("collapse rate:"):
                col_resolved = line_str.split(":")[1].split("(")[0].strip()
            elif line_str.startswith("avg rounds to win:"):
                avg_win = line_str.split(":", 1)[-1].strip()
            elif line_str.startswith("avg rounds to collapse:"):
                avg_col = line_str.split(":", 1)[-1].strip()
            elif line_str.startswith("overall avg to resolve:"):
                avg_res = line_str.split(":", 1)[-1].strip()
                
        res_str = f"{vic_resolved} / {col_resolved}"
        
        table1_rows.append(f"| {label:<13} | {redraw:^7} | {vic_all:>13} | {col_all:>14} | {stall:>5} | {timeout:>7} | {res_str:>30} |")
        table2_rows.append(f"| {label:<13} | {avg_win:>22} | {avg_col:>25} | {avg_res:>26} |")
        
    return cmd_pattern, table1_rows, table2_rows


def run_part4(campaigns, seed, solver, workers):
    print(f"--- Running Part 4: Endless Campaign Endurance Sweep ({campaigns} campaigns) ---", flush=True)
    cmd = f"python3 sim/sweep_thresholds.py --campaigns {campaigns} --max-rounds 300 --solver {solver} --seed {seed} --workers {workers}"
    output = run_command(cmd)
    
    table1_rows = []
    table2_rows = []
    diffs = [("Survivalist", "0"), ("Archaeologist", "1"), ("Explorer", "3"), ("Novice", "5")]
    
    blocks = output.split("Difficulty: ")
    metrics_by_diff = {}
    
    for b in blocks[1:]:
        header = b.splitlines()[0]
        diff_key = header.split()[0].lower()
        
        rounds_survived = "N/A"
        pyr_cleared = "0.0"
        perf_wins = "0.0"
        anchor_ach = "0.0%"
        
        starv_rate = "0.0%"
        vol_col_rate = "0.0%"
        deadlock_rate = "0.0%"
        round_cap_rate = "0.0%"
        
        for line in b.splitlines():
            if "Mean Rounds Survived:" in line:
                rounds_survived = line.split(":")[-1].strip()
            elif "Mean Pyramids Cleared:" in line:
                pyr_cleared = line.split(":")[-1].split("per")[0].strip()
            elif "Mean Perfect Wins:" in line:
                perf_wins = line.split(":")[-1].split("per")[0].strip()
            elif "Rank-Anchor Achievement:" in line:
                anchor_ach = line.split(":")[-1].split("(")[0].strip()
            elif "starvation" in line and "|" in line:
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 3:
                    starv_rate = parts[2]
            elif "volatile_collapse" in line and "|" in line:
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 3:
                    vol_col_rate = parts[2]
            elif "deadlock" in line and "|" in line:
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 3:
                    deadlock_rate = parts[2]
            elif "round_cap" in line and "|" in line:
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 3:
                    round_cap_rate = parts[2]
                    
        metrics_by_diff[diff_key] = {
            "survived": rounds_survived,
            "pyr_cleared": pyr_cleared,
            "perf_wins": perf_wins,
            "anchor_ach": anchor_ach,
            "starv": starv_rate,
            "vol_col": vol_col_rate,
            "deadlock": deadlock_rate,
            "round_cap": round_cap_rate
        }
        
    for label, redraw in diffs:
        key = label.lower()
        m = metrics_by_diff.get(key, {})
        surv = m.get("survived", "N/A")
        pyr = m.get("pyr_cleared", "0.0")
        wins = m.get("perf_wins", "0.0")
        anch = m.get("anchor_ach", "0.0%")
        
        starv = m.get("starv", "0.0%")
        vol = m.get("vol_col", "0.0%")
        dead = m.get("deadlock", "0.0%")
        cap = m.get("round_cap", "0.0%")
        
        table1_rows.append(f"| {label:<13} | {redraw:^7} | {surv:>20} | {pyr:>26} | {wins:>23} | {anch:>23} |")
        table2_rows.append(f"| {label:<13} | {starv:>10} | {vol:>18} | {dead:>8} | {cap:>9} |")
        
    return cmd, table1_rows, table2_rows


def run_part5(campaigns, seed, workers):
    print(f"--- Running Part 5: FILO Vault Rule Comparison ({campaigns} campaigns) ---", flush=True)
    cmd = f"python3 sim/compare_vault_sim.py --campaigns {campaigns} --seed {seed} --workers {workers}"
    output = run_command(cmd)
    
    rows = []
    for line in output.splitlines():
        if "|" in line and not line.startswith("Difficulty") and not line.startswith("-"):
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 5:
                diff = parts[0]
                mode = parts[1]
                vic = parts[2]
                col = parts[3]
                avg_rnd = parts[4]
                
                v_num = float(vic.rstrip('%'))
                c_num = float(col.rstrip('%'))
                t_num = max(0.0, 100.0 - v_num - c_num)
                t_str = f"{t_num:.2f}%"
                
                rows.append(f"| {diff:<13} | {mode:<18} | {vic:>12} | {col:>13} | {t_str:>14} | {avg_rnd:>10} |")
                
    return cmd, rows


def run_part6(games, redraws, seed):
    print(f"--- Running Part 6: Solver Comparison ({games} games) ---", flush=True)
    cmd = f"python3 sim/test_solvers.py --games {games} --redraws {redraws} --seed {seed}"
    output = run_command(cmd)
    
    rows = []
    for line in output.splitlines():
        if "|" in line and not line.startswith("Solver") and not line.startswith("-"):
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 6:
                solver_name = parts[0]
                win_rate = parts[1]
                wins = parts[2]
                losses = parts[3]
                time_s = parts[4] + ("s" if not parts[4].endswith("s") else "")
                moves = parts[5]
                
                rows.append(f"| {solver_name:<18} | {win_rate:>20} | {wins:>4} | {losses:>6} | {time_s:>15} | {moves:>12} |")
                
    return cmd, rows


def update_markdown_file(results_map):
    """Updates RESULTS.md content with new table rows."""
    if not os.path.exists(RESULTS_MD):
        print(f"Error: {RESULTS_MD} not found", file=sys.stderr)
        return

    with open(RESULTS_MD, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace Part 1 table
    if 1 in results_map:
        rows = results_map[1]
        pattern = r"(\| UI Redraw Setting\s+\|\s+Redraws\s+\|\s+Pyramid Clear Rate\s+\|\s+Total Victory Rate\s+\|\s+Collapse Rate\s+\|\n\| :---\s+\|\s+:---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n### Observations|\n---)"
        new_body = "\n".join(rows)
        content = re.sub(pattern, r"\1" + new_body + r"\3", content, flags=re.DOTALL)

    # Replace Part 2 table
    if 2 in results_map:
        rows = results_map[2]
        pattern = r"(\| Difficulty\s+\|\s+Redraws\s+\|\s+Win Rate within 500 Rounds\s+\|\s+Avg Rounds to Win\s+\|\s+Median Rounds\s+\|\n\| :---\s+\|\s+:---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n---)"
        new_body = "\n".join(rows)
        content = re.sub(pattern, r"\1" + new_body + r"\3", content, flags=re.DOTALL)

    # Replace Part 3 tables
    if 3 in results_map:
        r1, r2 = results_map[3]
        pattern1 = r"(\| Difficulty\s+\|\s+Redraws\s+\|\s+Victory \(all\)\s+\|\s+Collapse \(all\)\s+\|\s+Stall\s+\|\s+Timeout\s+\|\s+Victory / Collapse of Resolved\s+\|\n\| :---\s+\|\s+:---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n### Round-resolution metrics)"
        new_body1 = "\n".join(r1)
        content = re.sub(pattern1, r"\1" + new_body1 + r"\3", content, flags=re.DOTALL)

        pattern2 = r"(\| Difficulty\s+\|\s+Avg Rounds to Win\s+\|\s+Avg Rounds to Collapse\s+\|\s+Overall Avg to Resolve\s+\|\n\| :---\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\nThe resolved-rate column)"
        new_body2 = "\n".join(r2)
        content = re.sub(pattern2, r"\1" + new_body2 + r"\3", content, flags=re.DOTALL)

    # Replace Part 4 tables
    if 4 in results_map:
        r1, r2 = results_map[4]
        pattern1 = r"(\| Difficulty\s+\|\s+Redraws\s+\|\s+Mean Rounds Survived\s+\|\s+Pyramids Cleared / Campaign\s+\|\s+Perfect Wins / Campaign\s+\|\s+Rank-Anchor Achievement\s+\|\n\| :---\s+\|\s+:---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n### End-type rates)"
        new_body1 = "\n".join(r1)
        content = re.sub(pattern1, r"\1" + new_body1 + r"\3", content, flags=re.DOTALL)

        pattern2 = r"(\| Difficulty\s+\|\s+Starvation\s+\|\s+Volatile Collapse\s+\|\s+Deadlock\s+\|\s+Round Cap\s+\|\n\| :---\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n---)"
        new_body2 = "\n".join(r2)
        content = re.sub(pattern2, r"\1" + new_body2 + r"\3", content, flags=re.DOTALL)

    # Replace Part 5 table
    if 5 in results_map:
        rows = results_map[5]
        pattern = r"(\| Difficulty\s+\|\s+Mode\s+\|\s+Victory Rate\s+\|\s+Collapse Rate\s+\|\s+Timeout Rate\*\s+\|\s+Avg Rounds\s+\|\n\| :---\s+\|\s+:---\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n\\\* `compare_vault_sim.py`)"
        new_body = "\n".join(rows)
        content = re.sub(pattern, r"\1" + new_body + r"\3", content, flags=re.DOTALL)

    # Replace Part 6 table
    if 6 in results_map:
        rows = results_map[6]
        pattern = r"(\| Solver Policy\s+\|\s+Single-Game Win Rate\s+\|\s+Wins\s+\|\s+Losses\s+\|\s+Execution Time\*\s+\|\s+Moves / Game\s+\|\n\| :---\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\s+---:\s+\|\n)(.*?)(\n\n\\\* Execution time)"
        new_body = "\n".join(rows)
        content = re.sub(pattern, r"\1" + new_body + r"\3", content, flags=re.DOTALL)

    with open(RESULTS_MD, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\nSuccessfully updated {RESULTS_MD}")


def print_table_with_headers(title, header, sep, rows):
    print(f"\n{title}")
    print(header)
    print(sep)
    for r in rows:
        print(r)
    print()


def main():
    parser = argparse.ArgumentParser(description="Run Cursed Tomb simulations and update RESULTS.md")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--quick", action="store_true", help="Run fast verification simulations")
    group.add_argument("--full", action="store_true", help="Run full benchmark simulations (default)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed (default 42)")
    parser.add_argument("--workers", type=int, default=4, help="Worker processes (default 4)")
    parser.add_argument("--parts", nargs="+", type=int, choices=[1, 2, 3, 4, 5, 6], help="Parts to run (default all)")
    parser.add_argument("--update-results", action="store_true", help="Update sim/RESULTS.md file")
    
    args = parser.parse_args()
    
    quick_mode = args.quick
    parts_to_run = set(args.parts) if args.parts else {1, 2, 3, 4, 5, 6}
    
    p1_games = 100 if quick_mode else 10000
    p2_camps = 20 if quick_mode else 1000
    p3_camps = 20 if quick_mode else 1000
    p4_camps = 20 if quick_mode else 1000
    p5_camps = 20 if quick_mode else 1000
    p6_games = 20 if quick_mode else 50
    
    print("========================================================================")
    print(f"  Cursed Tomb Simulation Runner (Mode: {'QUICK' if quick_mode else 'FULL'})")
    print(f"  Seed: {args.seed} | Workers: {args.workers} | Parts: {sorted(list(parts_to_run))}")
    print("========================================================================\n")
    
    results_map = {}

    if 1 in parts_to_run:
        cmd1, rows1 = run_part1(p1_games, args.seed, "heuristic", args.workers)
        results_map[1] = rows1
        print_table_with_headers("Part 1 Results:", P1_HEADER, P1_SEP, rows1)

    if 2 in parts_to_run:
        cmds2, rows2 = run_part2(p2_camps, args.seed, "heuristic", args.workers)
        results_map[2] = rows2
        print_table_with_headers("Part 2 Results:", P2_HEADER, P2_SEP, rows2)

    if 3 in parts_to_run:
        cmd3, r3_t1, r3_t2 = run_part3(p3_camps, args.seed, "heuristic", args.workers)
        results_map[3] = (r3_t1, r3_t2)
        print_table_with_headers("Part 3 Results (Outcomes):", P3_T1_HEADER, P3_T1_SEP, r3_t1)
        print_table_with_headers("Part 3 Results (Round-Resolution Metrics):", P3_T2_HEADER, P3_T2_SEP, r3_t2)

    if 4 in parts_to_run:
        cmd4, r4_t1, r4_t2 = run_part4(p4_camps, args.seed, "heuristic", args.workers)
        results_map[4] = (r4_t1, r4_t2)
        print_table_with_headers("Part 4 Results (Endurance Sweep):", P4_T1_HEADER, P4_T1_SEP, r4_t1)
        print_table_with_headers("Part 4 Results (End-Type Rates):", P4_T2_HEADER, P4_T2_SEP, r4_t2)

    if 5 in parts_to_run:
        cmd5, rows5 = run_part5(p5_camps, args.seed, args.workers)
        results_map[5] = rows5
        print_table_with_headers("Part 5 Results:", P5_HEADER, P5_SEP, rows5)

    if 6 in parts_to_run:
        cmd6, rows6 = run_part6(p6_games, 3, args.seed)
        results_map[6] = rows6
        print_table_with_headers("Part 6 Results:", P6_HEADER, P6_SEP, rows6)

    if args.update_results:
        update_markdown_file(results_map)

if __name__ == "__main__":
    main()
