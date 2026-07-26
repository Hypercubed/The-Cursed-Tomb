## Context

The Pyramid Solitaire game currently includes an autoplay feature driven by a greedy move finder (`findNextGreedyMove` in `src/solver.ts`). The greedy solver evaluates immediate candidates without lookahead or deck search, succeeding on ~20% of random deals. To support richer simulation and perfect play verification, we are introducing a pluggable strategy framework (Greedy, Smart, Perfect).

## Goals / Non-Goals

**Goals:**
- Implement a graph-search solver (DFS with state memoization) capable of finding optimal winning paths and determining deal winnability in $<20\text{ms}$.
- Implement a smart heuristic single-step evaluator that prioritizes unblocking pyramid nodes and preserving bottleneck ranks.
- Expose a strategy selection dropdown (`Greedy`, `Smart`, `Perfect`) and winnability indicator (`Winnable`, `Unwinnable`) in the Debug & Autoplay UI panel.
- Ensure seamless integration with the existing autoplay loop in `App.tsx`.

**Non-Goals:**
- Modifying core game rules or card match validation in `src/game.ts`.
- Complex multi-threaded Web Workers (in-memory memoized search on 52-card states is fast enough on main thread).

## Decisions

### 1. State Hashing and DFS Graph Search for Perfect Solver
- **Decision**: Represent game state in the solver as a compact bitmask string `"{pyramidMask}:{drawIndex}:{topDiscardCardId}:{redrawsRemaining}"`. Perform depth-first search with memoization to find a winning move sequence.
- **Rationale**: A 52-card deal has at most 28 pyramid cards (28-bit mask) and 24 stock cards. State space size per deal is bounded (typically $<5,000$ unique visited states), running in milliseconds.
- **Alternatives Considered**:
  - *Full BFS / A*: Higher memory overhead storing open queues. DFS with path recording finds a winning sequence faster for winnability checking.

### 2. Heuristic Scoring Function for Smart Solver
- **Decision**: Score legal candidate moves by calculating:
  $$\text{Score} = (\text{Children Unblocked} \times 10) + (\text{Pyramid Pair Bonus}) - (\text{Bottleneck Rank Waste Penalty})$$
- **Rationale**: Clearing pyramid cards earlier exposes more decision branches, while preserving rare rank matches (e.g. matching Queens when Aces are blocked) prevents early deadlocks.

### 3. Solver Dispatcher Architecture
- **Decision**: Define a standard solver signature `findNextMove(state: GameState, strategy: SolverStrategy): GameState | null`.
- **Rationale**: Keeps `useAutoplay` and UI step handlers completely decoupled from specific solver implementations.

## Risks / Trade-offs

- **[Risk]**: Deep DFS recursion on un-winnable deals could hit max stack depth or cause slight frame drops ($>50\text{ms}$).
  - **Mitigation**: Cap maximum search depth to 200 state steps and cap visited set size at 10,000 states; return `unwinnable` if limit is reached.
- **[Risk]**: State mutations in search algorithm breaking React state immutability.
  - **Mitigation**: Reuse pure functions from `src/game.ts` (`playCard`, `drawCard`, `cyclePile`) to spawn new `GameState` objects during graph traversal.
