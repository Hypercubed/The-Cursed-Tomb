#!/usr/bin/env python3
"""
Compare automatic Stock-to-Vault Diamond vaulting vs. additional Pyramid Self-Vaulting.
"""

import copy
import random
import argparse
import statistics
from multiprocessing import Pool, cpu_count
from dataclasses import dataclass
from cursed_tomb_sim import (
    CardState, RuleFlags, RoundOutcome, SUITS, RANKS, RANK_VALUES,
    compute_layout, ROWS, N_PYR, exposed_slots, newly_exposed_after,
    pair_sum, TARGET, _apply_survival_reward
)

def play_round_compare(pool, rng, max_redeals, flags, allow_pyramid_vault=False, max_moves=4000):
    rng.shuffle(pool)
    pyr = pool[:N_PYR]
    stock = list(pool[N_PYR:])
    waste = []
    vault = []
    for c in pool:
        c.temp_immune = False

    removed = set()
    locks = {}
    for i, card in enumerate(pyr):
        if card.is_red_cursed(flags):
            for c in COVERS_LOCAL[i]:
                locks.setdefault(c, set()).add(i)

    redeals_left = max_redeals
    moves_played = 0
    progress_this_pass = False
    last_clear_cards = None
    last_clear_type = None

    def fire_on_clear(card):
        if not flags.blessings or not card.blessed:
            return
        if card.suit == 'H':
            exp = exposed_slots(removed, locks)
            candidates = [pyr[i] for i in exp if pyr[i] is not card]
            if candidates:
                target_card = max(candidates, key=lambda c: c.attrition_stage)
                target_card.temp_immune = True
        elif card.suit == 'S':
            for slot, lockers in list(locks.items()):
                if slot not in removed and any(l not in removed for l in lockers):
                    locks[slot] = set()
                    break

    while moves_played < max_moves:
        if len(removed) == N_PYR:
            if not stock and not waste and not vault:
                return RoundOutcome('perfect_win', moves_played, last_clear_type, last_clear_cards)
            return RoundOutcome('pyramid_clear', moves_played, last_clear_type, last_clear_cards)

        exp = exposed_slots(removed, locks)

        # Free Pyramid Self-Vault Action for ♦ Hero
        if allow_pyramid_vault and flags.blessings:
            vaulted_any = False
            for i in exp:
                card = pyr[i]
                if card.blessed and card.suit == 'D':
                    removed.add(i)
                    vault.append(card)
                    fire_on_clear(card)
                    moves_played += 1
                    progress_this_pass = True
                    vaulted_any = True
                    break
            if vaulted_any:
                continue

        candidates = []

        for i in range(len(exp)):
            for j in range(i + 1, len(exp)):
                a, b = exp[i], exp[j]
                if pair_sum(pyr[a], pyr[b], flags) == TARGET:
                    score = newly_exposed_after(removed, locks, (a, b))
                    candidates.append((score, 'pp', (a, b)))

        for a in exp:
            if pyr[a].functional_value(flags) == TARGET:
                score = newly_exposed_after(removed, locks, (a,))
                candidates.append((score, 'p', (a,)))

        singles = []
        if waste:
            singles.append(('waste', None))
        if vault:
            singles.append(('vault', None))

        for kind_s, vi in singles:
            single_card = waste[-1] if kind_s == 'waste' else vault[-1]
            if single_card.functional_value(flags) == TARGET:
                candidates.append((0, 'alone_single', (kind_s, vi)))
            for a in exp:
                pcard = pyr[a]
                if pcard.is_black_cursed(flags):
                    continue
                if pair_sum(pcard, single_card, flags) == TARGET:
                    score = newly_exposed_after(removed, locks, (a,))
                    candidates.append((score, 'pw', (a, kind_s, vi)))

        if flags.blessings:
            if stock and stock[0].blessed and stock[0].suit == 'D':
                candidates.append((1, 'vault_stock', ()))
            if waste and waste[-1].blessed and waste[-1].suit == 'D':
                candidates.append((1, 'vault_waste', ()))

        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            _, kind, payload = candidates[0]
            if kind == 'pp':
                a, b = payload
                removed.add(a); removed.add(b)
                fire_on_clear(pyr[a]); fire_on_clear(pyr[b])
                last_clear_type, last_clear_cards = 'pair', (pyr[a], pyr[b])
            elif kind == 'p':
                a, = payload
                removed.add(a)
                fire_on_clear(pyr[a])
                last_clear_type, last_clear_cards = 'solo', (pyr[a],)
            elif kind == 'alone_single':
                kind_s, vi = payload
                card = waste.pop() if kind_s == 'waste' else vault.pop()
                fire_on_clear(card)
                last_clear_type, last_clear_cards = 'solo', (card,)
            elif kind == 'pw':
                a, kind_s, vi = payload
                card = waste.pop() if kind_s == 'waste' else vault.pop()
                removed.add(a)
                fire_on_clear(pyr[a]); fire_on_clear(card)
                last_clear_type, last_clear_cards = 'pair', (pyr[a], card)
            elif kind == 'vault_stock':
                card = stock.pop(0)
                vault.append(card)
                fire_on_clear(card)
                last_clear_type, last_clear_cards = 'vault', (card,)
            elif kind == 'vault_waste':
                card = waste.pop()
                vault.append(card)
                fire_on_clear(card)
                last_clear_type, last_clear_cards = 'vault', (card,)
            moves_played += 1
            progress_this_pass = True
            continue

        if stock:
            drawn = stock.pop(0)
            waste.append(drawn)
            moves_played += 1
            continue

        if redeals_left > 0 and waste and progress_this_pass:
            stock = waste
            waste = []
            redeals_left -= 1
            moves_played += 1
            progress_this_pass = False
            continue

        break

    if flags.attrition:
        exp = exposed_slots(removed, locks)
        for i in exp:
            card = pyr[i]
            if card.is_anchored() or card.temp_immune:
                continue
            if card.attrition_stage < 5:
                card.attrition_stage += 1

    return RoundOutcome('freeze', moves_played)


_, COVERS_LOCAL = compute_layout(ROWS)

def run_campaign_compare(rng, max_redeals, flags, max_rounds, allow_pyramid_vault):
    registry = [CardState(rank=r, suit=s) for s in SUITS for r in RANKS]
    rounds_played = 0

    while rounds_played < max_rounds:
        active_pool = [c for c in registry if c.attrition_stage < 5]
        if len(active_pool) < 28:
            return 'collapse', rounds_played

        outcome = play_round_compare(active_pool, rng, max_redeals, flags, allow_pyramid_vault)
        rounds_played += 1

        if outcome.kind == 'perfect_win':
            return 'win', rounds_played

        if outcome.kind == 'pyramid_clear':
            _apply_survival_reward(outcome.last_clear_type, outcome.last_clear_cards, flags)

    return 'timeout', rounds_played


def _run_campaign_compare_worker(args):
    camp_seed, redeals, flags, max_rounds, allow_pyramid_vault = args
    rng = random.Random(camp_seed)
    return run_campaign_compare(rng, redeals, flags, max_rounds=max_rounds, allow_pyramid_vault=allow_pyramid_vault)


def run_experiment(num_campaigns=1000, seed=42, n_workers=None):
    if n_workers is None:
        n_workers = cpu_count() or 1

    difficulties = [
        ('Survivalist', 0),
        ('Archaeologist', 1),
        ('Explorer', 3),
        ('Novice', 5)
    ]

    print(f"=== Running Vault Rule Comparison ({num_campaigns} campaigns per setting, seed={seed}, workers={n_workers}) ===\n")
    print(f"{'Difficulty':<20} | {'Mode':<18} | {'Victory Rate':<14} | {'Collapse Rate':<14} | {'Avg Rounds':<12}")
    print("-" * 88)

    for diff_name, redeals in difficulties:
        for allow_pyr, mode_name in [(False, "Stock Auto-Vault"), (True, "Pyramid Self-Vault")]:

            base_rng = random.Random(seed)
            flags = RuleFlags(scars=True, curses=True, blessings=True, attrition=True)
            worker_args = [(base_rng.randint(0, 1_000_000_000), redeals, flags, 500, allow_pyr) for _ in range(num_campaigns)]

            wins = 0
            collapses = 0
            timeouts = 0
            rounds_list = []

            if n_workers > 1 and num_campaigns >= 10:
                chunk = max(1, num_campaigns // (n_workers * 4))
                with Pool(processes=n_workers) as pool:
                    for res, rds in pool.imap_unordered(_run_campaign_compare_worker, worker_args, chunksize=chunk):
                        rounds_list.append(rds)
                        if res == 'win':
                            wins += 1
                        elif res == 'collapse':
                            collapses += 1
                        else:
                            timeouts += 1
            else:
                for args_item in worker_args:
                    res, rds = _run_campaign_compare_worker(args_item)
                    rounds_list.append(rds)
                    if res == 'win':
                        wins += 1
                    elif res == 'collapse':
                        collapses += 1
                    else:
                        timeouts += 1

            win_pct = (wins / num_campaigns) * 100
            col_pct = (collapses / num_campaigns) * 100
            avg_rds = statistics.mean(rounds_list)
            print(f"{diff_name:<20} | {mode_name:<18} | {win_pct:>12.2f}% | {col_pct:>12.2f}% | {avg_rds:>10.1f}")
        print("-" * 88)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--campaigns', type=int, default=1000)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--workers', type=int, default=cpu_count(), help="number of parallel worker processes")
    args = parser.parse_args()
    run_experiment(num_campaigns=args.campaigns, seed=args.seed, n_workers=args.workers)
