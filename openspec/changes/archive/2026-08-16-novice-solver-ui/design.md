## Context

The TypeScript solver in `src/solver.ts` currently provides three solver strategies: `greedy`, `smart`, and `perfect`. The Python simulation engine (`sim/solvers/novice.py`) implements a stochastic `NoviceSolver` to model novice human playstyles with realistic blind spots. We need to implement this solver strategy in TypeScript and integrate it into the browser UI's debug and autoplay system.

## Goals / Non-Goals

**Goals:**
- Add `'novice'` to `SolverStrategy` union in `src/solver.ts`.
- Implement `findNextNoviceMove(state: GameState)` replicating the Python NoviceSolver's behavioral heuristics and error rates.
- Add `Novice (Stochastic Beginner)` to the Strategy selector in `src/components/DebugPanel.tsx`.
- Support `'novice'` strategy in `useAutoplay` hook and ensure smooth step and continuous autoplay without stalls or infinite no-op loops.
- Add test coverage in `src/solver.test.ts`.

**Non-Goals:**
- Adding UI sliders to customize individual error probabilities (default calibrated values matching Python sim will be used).
- Modifying the campaign difficulty system or other game modes.

## Decisions

### 1. Structure of `findNextNoviceMove`
- Extract all legal candidate removal moves:
  - King single removals
  - Unblocked pyramid pair removals
  - Pyramid-Waste / Pyramid-Stock pair removals
  - Waste-to-Vault and Stock-to-Vault moves
- Apply probabilistic filters (mirroring Python `NoviceSolver`):
  - 30% chance to miss King removals
  - 30% chance to miss Stock/Waste pair removals
  - 50% chance to ignore Diamond Vault moves
  - 30% chance to miss isolated / lone single removals
- If filtered visible moves exist:
  - 20% chance to pick a uniformly random visible move
  - Otherwise, evaluate moves with heuristic score plus random jitter ($[-1.0, 1.0]$) and select the top move
- If no removal move is visible/selected:
  - Attempt Draw, or Cycle if draw is empty and redraws remain.
  - If no draw/cycle move is possible, fall back to unfiltered legal moves to prevent artificial stall before declaring no move.

### 2. UI Integration in `DebugPanel.tsx`
- Add `<option value="novice">Novice (Stochastic Beginner)</option>` to the `Solver Strategy` `<select>` element.
- The winnability oracle analysis badge continues to use the DFS graph oracle (winnability of deal is independent of the player strategy chosen for autoplay).

## Risks / Trade-offs

- **[Risk] Stochastic rejection causing repetitive no-op cycles** → **Mitigation**: When novice chooses to draw or cycle, the game state advances. If a board has no draw/cycle available, the solver executes remaining legal moves or cleanly returns `null` so autoplay handles game conclusion without infinite loops.
