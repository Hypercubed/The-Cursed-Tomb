## 1. Core Solver Enhancements

- [x] 1.1 Define `SolverStrategy` type (`greedy` | `smart` | `perfect`) and dispatcher interface in `src/solver.ts`
- [x] 1.2 Implement heuristic scoring function for smart solver in `src/solver.ts`
- [x] 1.3 Implement depth-first search graph solver with state hashing memoization in `src/solver.ts`
- [x] 1.4 Implement deal winnability evaluation function `evaluateWinnability(state: GameState)` in `src/solver.ts`
- [x] 1.5 Add comprehensive unit tests in `src/solver.test.ts` for all strategy modes and winnability checks

## 2. Autoplay Controller & UI Integration

- [x] 2.1 Update autoplay state hook/controller in `App.tsx` or `useAutoplay` to store and apply active `SolverStrategy`
- [x] 2.2 Add Strategy Selector dropdown (`Greedy`, `Smart`, `Perfect`) to Debug & Autoplay UI panel
- [x] 2.3 Add Winnability Status indicator (`Winnable`, `Unwinnable`, `Deadlocked`) to Debug UI panel
- [x] 2.4 Verify manual step execution and continuous autoplay function across selected strategies
