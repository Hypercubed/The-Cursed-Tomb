## Why

The current autoplay mechanism relies solely on a basic greedy solver strategy. While fast, the greedy strategy fails on complex deals (~20% win rate) because it selects matches naively without analyzing pyramid unblock depth or stock deck structure. Users and testers need higher-level solver strategies, including smart heuristic decision-making and a perfect graph-search solver that guarantees optimal play and determines deal winnability.

## What Changes

- Introduce a **Multi-Strategy Solver Framework** supporting three player intelligence modes:
  - **Greedy**: Current priority-based single-step solver.
  - **Smart Heuristic**: Evaluates moves based on unblocking depth, rank bottleneck counts, and deck cycle economy.
  - **Perfect (Oracle Graph Search)**: Full DFS/A* search engine with state memoization that finds optimal winning paths and determines if a deal is winnable.
- Update the **Autoplay Controller** to execute step moves according to the selected strategy mode.
- Add a **Strategy Selector** and **Winnability Indicator** ("Winnable" / "Unwinnable" / "Analyzing") to the Debug & Autoplay UI panel.
- Add an **Instant Solve / Hint** capability to auto-play or preview the optimal move sequence.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `debug-autoplay-panel`: Expand solver requirements to support multiple strategy engines (Greedy, Smart, Perfect), strategy selection controls in the UI, deal winnability analysis, and solution path execution.

## Impact

- `src/solver.ts`: Extend with heuristic scoring functions, state hashing memoized search solver (`solveBoard`), and strategy dispatcher.
- `src/components/DebugPanel.tsx` (or Autoplay panel): Add UI selector for solver strategies and winnability indicator display.
- Autoplay integration hooks/controllers in `App.tsx` / `useAutoplay`.
