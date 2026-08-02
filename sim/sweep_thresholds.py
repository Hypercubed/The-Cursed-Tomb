#!/usr/bin/env python3
"""
Difficulty sweep: test campaign outcomes across all 4 difficulty levels:
  - novice (unlimited redeals)
  - explorer (2 redeals / 3 passes)
  - archaeologist (1 redeal / 2 passes)
  - survivalist (0 redeals / 1 pass)

Tracks rate and round statistics (mean ± std dev) for each end type:
  - victory: perfect win (all 52 cards foundationed in 1 round)
  - sealed: sealed tomb win (< 28 living un-anchored cards remain)
  - starvation: < 28 active cards remaining
  - volatile: all 4 cards of a single rank entombed (Volatile Collapse)
  - all_immune: all remaining active cards are anchored
  - deadlock: N consecutive rounds with zero card state changes
  - round_cap: reached max_rounds safety cap

Usage:
  python3 sweep_thresholds.py [--campaigns N] [--max-rounds R] [--deadlock-limit D] [--seed S] [--no-volatile]
"""
import argparse, random, time, statistics, cursed_tomb_sim

def get_stats_str(rounds_list):
    if not rounds_list:
        return "N/A"
    avg = statistics.mean(rounds_list)
    std = statistics.stdev(rounds_list) if len(rounds_list) > 1 else 0.0
    return f"{avg:5.1f} ± {std:<4.1f} rnds"

def run_batch(n, seed, difficulty_name, max_rounds, deadlock_limit, volatile_collapse=True):
    rng = random.Random(seed)
    flags = cursed_tomb_sim.RuleFlags(volatile_collapse=volatile_collapse)
    max_redeals = cursed_tomb_sim.DIFFICULTIES[difficulty_name]
    
    rounds_by_type = {
        'victory': [],
        'sealed': [],
        'starvation': [],
        'volatile': [],
        'all_immune': [],
        'deadlock': [],
        'round_cap': []
    }
    
    t0 = time.time()
    for _ in range(n):
        r = cursed_tomb_sim.run_campaign(rng, max_redeals, flags, max_rounds, deadlock_limit=deadlock_limit)
        k = r['result']
        rnd = r['rounds']
        
        if k == 'victory':
            rounds_by_type['victory'].append(rnd)
        elif k == 'victory_sealed':
            rounds_by_type['sealed'].append(rnd)
        elif k == 'collapse_starvation':
            rounds_by_type['starvation'].append(rnd)
        elif k == 'collapse_volatile':
            rounds_by_type['volatile'].append(rnd)
        elif k == 'all_immune_stall':
            rounds_by_type['all_immune'].append(rnd)
        elif k == 'stall_deadlock':
            rounds_by_type['deadlock'].append(rnd)
        elif k == 'timeout':
            rounds_by_type['round_cap'].append(rnd)
            
    elapsed = time.time() - t0
    
    end_types = ['victory', 'sealed', 'starvation', 'volatile', 'all_immune', 'deadlock', 'round_cap']
    
    print(f"\n==========================================================================")
    print(f" Difficulty: {difficulty_name.upper()} (max_redeals={max_redeals}) -- {n} campaigns ({elapsed:.1f}s)")
    print(f"==========================================================================")
    print(f" {'End Type':<15} | {'Count':<7} | {'Rate':<7} | {'Rounds (Mean ± Std Dev)':<25}")
    print(f" -------------------------------------------------------------------------")
    for end_type in end_types:
        r_list = rounds_by_type[end_type]
        cnt = len(r_list)
        pct = (cnt / n) * 100
        stats_str = get_stats_str(r_list)
        print(f" {end_type:<15} | {cnt:<7} | {pct:>5.1f}% | {stats_str:<25}")

    # Compact single line for cross-difficulty comparison
    col_strs = []
    for et in end_types:
        r_list = rounds_by_type[et]
        pct = (len(r_list) / n) * 100
        if r_list:
            avg = statistics.mean(r_list)
            std = statistics.stdev(r_list) if len(r_list) > 1 else 0.0
            col_strs.append(f"{pct:4.1f}% ({avg:4.1f}±{std:<4.1f})")
        else:
            col_strs.append(f"{pct:4.1f}% (N/A)")
    
    return difficulty_name, col_strs

def parse_args():
    parser = argparse.ArgumentParser(description="Run Cursed Tomb difficulty sweep across all 4 difficulties.")
    parser.add_argument("-c", "--campaigns", type=int, default=100, help="Campaigns to run per difficulty (default: 100)")
    parser.add_argument("-r", "--max-rounds", type=int, default=300, help="Max rounds allowed per campaign (default: 300)")
    parser.add_argument("-d", "--deadlock-limit", type=str, default="0.10",
                        help="Deadlock threshold (either float fraction of max-rounds e.g. 0.10 or int round count e.g. 30) (default: 0.10)")
    parser.add_argument("-s", "--seed", type=int, default=42, help="Random seed (default: 42)")
    parser.add_argument("--no-volatile", action="store_true", help="Disable Volatile Collapse variant rule (default: Volatile Collapse is ENABLED)")
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    
    # Parse deadlock-limit string into float or int
    dl_val = float(args.deadlock_limit) if '.' in args.deadlock_limit else int(args.deadlock_limit)
    volatile_enabled = not args.no_volatile
    
    dl_desc = f"{dl_val:.0%}" if isinstance(dl_val, float) and dl_val < 1.0 else f"{dl_val} rounds"
    print(f"Running difficulty sweep: campaigns/diff={args.campaigns}, max_rounds={args.max_rounds}, deadlock_limit={dl_desc}, volatile_collapse={volatile_enabled}, seed={args.seed}")
    
    summary_rows = []
    for diff in ["novice", "explorer", "archaeologist", "survivalist"]:
        d_name, cols = run_batch(args.campaigns, args.seed, diff, args.max_rounds, dl_val, volatile_collapse=volatile_enabled)
        summary_rows.append((d_name, cols))

    print(f"\n\n" + "="*165)
    print(f" CROSS-DIFFICULTY COMPARISON SUMMARY (Rate % and Mean ± Std Dev Rounds)")
    print("="*165)
    headers = ['difficulty', 'victory', 'sealed', 'starvation', 'volatile', 'all_immune', 'deadlock', 'round_cap']
    print(f" {headers[0]:<13} | {headers[1]:<18} | {headers[2]:<18} | {headers[3]:<18} | {headers[4]:<18} | {headers[5]:<18} | {headers[6]:<18} | {headers[7]:<18}")
    print(f" " + "-"*163)
    for d_name, cols in summary_rows:
        print(f" {d_name:<13} | {cols[0]:<18} | {cols[1]:<18} | {cols[2]:<18} | {cols[3]:<18} | {cols[4]:<18} | {cols[5]:<18} | {cols[6]:<18}")
    print("="*165)
