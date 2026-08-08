---
name: run-simulations
description: Run simulation benchmarks for Cursed Tomb (single-round, base campaign, full rules campaign, endurance sweeps, vault comparisons, solver comparisons) and update RESULTS.md.
allowed-tools: Bash(python3 sim/*)
license: MIT
metadata:
  author: Cursed Tomb Team
  version: "1.0"
---

Run simulations across the Cursed Tomb simulation suite and update `sim/RESULTS.md` with accurate benchmark data.

## Capabilities

1. **Execute Simulation Suite**:
   - **Part 1**: Single-Game Win & Collapse Rates (`sim/base_game_sim.py`)
   - **Part 2**: Base-Game Campaign Rounds to Perfect Win (`sim/campaign_rounds_sim.py`)
   - **Part 3**: Full Rules Campaign with Attrition, Scars, Curses, Blessings (`sim/cursed_tomb_sim.py`)
   - **Part 4**: Endless Campaign Endurance Sweep (`sim/sweep_thresholds.py`)
   - **Part 5**: FILO Vault Rule Comparison (`sim/compare_vault_sim.py`)
   - **Part 6**: Solver Comparison Benchmark (`sim/test_solvers.py`)

2. **Automated & Manual Orchestration**:
   - Run individual simulation scripts or run the full suite via `sim/run_simulations.py`.
   - Update `sim/RESULTS.md` directly with `--update-results`.

---

## Quick Usage

### 1. Fast Verification (Quick Mode)
To test and verify simulation scripts rapidly without waiting for long benchmark runs:
```bash
python3 sim/run_simulations.py --quick --seed 42 --workers 4
```

### 2. Full Benchmark Sweep & Update RESULTS.md
To run the full suite and update `sim/RESULTS.md`:
```bash
python3 sim/run_simulations.py --full --seed 42 --workers 4 --update-results
```

### 3. Run Specific Parts
To run specific parts (e.g. Part 1 and Part 6):
```bash
python3 sim/run_simulations.py --parts 1 6 --quick --update-results
```

---

## Individual Simulation Commands

If running scripts individually, use the standard reproducible commands:

- **Part 1 (Single Game)**:
  `python3 sim/base_game_sim.py --games 10000 --seed 42 --solver heuristic --workers 4`
- **Part 2 (Base Campaign)**:
  `python3 sim/campaign_rounds_sim.py --campaigns 1000 --difficulty explorer --max-rounds 500 --solver heuristic --seed 42 --workers 4`
- **Part 3 (Full Rules Campaign)**:
  `python3 sim/cursed_tomb_sim.py --campaigns 1000 --seed 42 --difficulty explorer --solver heuristic --volatile-collapse --max-rounds 500 --workers 4`
- **Part 4 (Endurance Sweep)**:
  `python3 sim/sweep_thresholds.py --campaigns 1000 --max-rounds 300 --solver heuristic --seed 42 --workers 4`
- **Part 5 (Vault Comparison)**:
  `python3 sim/compare_vault_sim.py --campaigns 1000 --seed 42 --workers 4`
- **Part 6 (Solver Comparison)**:
  `python3 sim/test_solvers.py --games 50 --redraws 3 --seed 42`

---

## Workflow Steps for Updating RESULTS.md

1. **Verify Python Scripts Compile & Pass Basic Checks**:
   ```bash
   python3 -m py_compile sim/cursed_tomb_sim.py sim/compare_vault_sim.py sim/base_game_sim.py sim/campaign_rounds_sim.py sim/sweep_thresholds.py sim/test_solvers.py sim/run_simulations.py
   python3 sim/test_solvers.py --games 5 --seed 42
   ```

2. **Execute Simulation Suite**:
   Run `python3 sim/run_simulations.py --full --seed 42 --workers 4 --update-results` or run individual scripts.

3. **Verify Markdown Formatting**:
   Inspect `sim/RESULTS.md` to ensure all markdown tables, alignment indicators, observations, and commands are intact and properly formatted.
