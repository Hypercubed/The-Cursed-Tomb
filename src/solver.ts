import {
  GameState,
  Card,
  visibleCards,
  canRemovePair,
  playCard,
  drawCard,
  cyclePile,
  checkForWin,
  resignGame,
  getRemainingPyramidCards,
  getActiveRankCounts,
  Rank,
} from './game';

export type SolverStrategy = 'greedy' | 'smart' | 'perfect';
export type WinnabilityStatus = 'complete-victory' | 'partial-victory' | 'unwinnable' | 'deadlocked';

/**
 * Evaluates whether any playable card removal (King, pyramid pair, or pyramid/discard pair)
 * can be made either immediately or after cycling through the remaining draw and discard piles.
 */
export function isGamePlayable(state: GameState): boolean {
  if (state.status !== 'in-progress') return false;

  const remainingPyramid = getRemainingPyramidCards(state);
  if (remainingPyramid.length === 0) return true;

  const totalDeckCount = state.drawPile.length + state.discardPile.length;
  let simState = state;
  const maxSimulationSteps = Math.max(totalDeckCount + 2, 1);

  for (let step = 0; step < maxSimulationSteps; step += 1) {
    const visiblePyramid = visibleCards(simState.pyramid);
    const topDiscard = simState.discardPile[0] ?? null;

    // 1. Check King
    if (visiblePyramid.some((card) => card.rank === 13) || (topDiscard && topDiscard.rank === 13)) {
      return true;
    }

    // 2. Check Pyramid pairs
    for (let i = 0; i < visiblePyramid.length; i += 1) {
      for (let j = i + 1; j < visiblePyramid.length; j += 1) {
        if (canRemovePair(visiblePyramid[i], visiblePyramid[j])) {
          return true;
        }
      }
    }

    // 3. Check Pyramid + Discard pair
    if (topDiscard) {
      for (const card of visiblePyramid) {
        if (canRemovePair(topDiscard, card)) {
          return true;
        }
      }
    }

    // Advance simulation by drawing or cycling
    if (simState.drawPile.length > 0) {
      simState = drawCard({ ...simState, selectedCardId: null });
    } else if (
      simState.discardPile.length > 0 &&
      (simState.redrawsRemaining === null || simState.redrawsRemaining > 0)
    ) {
      simState = cyclePile({ ...simState, selectedCardId: null });
    } else {
      break;
    }
  }

  return false;
}

/**
 * Evaluates the current GameState and returns the next GameState after applying
 * one greedy legal move, or resigns the game (status: 'lost') if no moves are possible.
 */
export function findNextGreedyMove(state: GameState): GameState | null {
  if (state.status !== 'in-progress') {
    return null;
  }

  const visiblePyramid = visibleCards(state.pyramid);
  const topDiscard = state.discardPile[0] ?? null;

  // 1. Single King in Pyramid
  const pyramidKing = visiblePyramid.find((card) => card.rank === 13);
  if (pyramidKing) {
    const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
    return playCard(cleanState, pyramidKing.id);
  }

  // 1b. Single King on Discard
  if (topDiscard && topDiscard.rank === 13) {
    const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
    return playCard(cleanState, topDiscard.id);
  }

  // 2. Pyramid Pairs
  for (let i = 0; i < visiblePyramid.length; i += 1) {
    for (let j = i + 1; j < visiblePyramid.length; j += 1) {
      const cardA = visiblePyramid[i];
      const cardB = visiblePyramid[j];
      if (canRemovePair(cardA, cardB)) {
        const step1 = playCard({ ...state, selectedCardId: null }, cardA.id);
        const step2 = playCard(step1, cardB.id);
        return step2;
      }
    }
  }

  // 3. Pyramid + Discard Pair
  if (topDiscard) {
    for (const card of visiblePyramid) {
      if (canRemovePair(topDiscard, card)) {
        const step1 = playCard({ ...state, selectedCardId: null }, topDiscard.id);
        const step2 = playCard(step1, card.id);
        return step2;
      }
    }
  }

  // 4. Verify game is playable before drawing/cycling
  if (!isGamePlayable(state)) {
    return resignGame(state);
  }

  // 5. Draw / Cycle
  if (state.drawPile.length > 0) {
    const nextState = drawCard({ ...state, selectedCardId: null });
    return nextState;
  }

  const canCycle =
    state.discardPile.length > 0 &&
    (state.redrawsRemaining === null || state.redrawsRemaining > 0);

  if (canCycle) {
    const nextState = cyclePile({ ...state, selectedCardId: null });
    return nextState;
  }

  return resignGame(state);
}

/**
 * Returns all immediate legal successor states reachable from state in 1 move action.
 */
export function getLegalNextStates(state: GameState): GameState[] {
  if (state.status !== 'in-progress') return [];

  const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
  const visiblePyramid = visibleCards(cleanState.pyramid);
  const topDiscard = cleanState.discardPile[0] ?? null;
  const nextStates: GameState[] = [];

  // 1. Single Kings in Pyramid
  for (const card of visiblePyramid) {
    if (card.rank === 13) {
      nextStates.push(playCard(cleanState, card.id));
    }
  }

  // 1b. Single King on Discard
  if (topDiscard && topDiscard.rank === 13) {
    nextStates.push(playCard(cleanState, topDiscard.id));
  }

  // 2. Pyramid Pairs
  for (let i = 0; i < visiblePyramid.length; i += 1) {
    for (let j = i + 1; j < visiblePyramid.length; j += 1) {
      const cardA = visiblePyramid[i];
      const cardB = visiblePyramid[j];
      if (canRemovePair(cardA, cardB)) {
        const step1 = playCard(cleanState, cardA.id);
        const step2 = playCard(step1, cardB.id);
        nextStates.push(step2);
      }
    }
  }

  // 3. Pyramid + Discard Pairs
  if (topDiscard) {
    for (const card of visiblePyramid) {
      if (canRemovePair(topDiscard, card)) {
        const step1 = playCard(cleanState, topDiscard.id);
        const step2 = playCard(step1, card.id);
        nextStates.push(step2);
      }
    }
  }

  // 4. Draw card
  if (cleanState.drawPile.length > 0) {
    nextStates.push(drawCard(cleanState));
  } else if (
    cleanState.discardPile.length > 0 &&
    (cleanState.redrawsRemaining === null || cleanState.redrawsRemaining > 0)
  ) {
    nextStates.push(cyclePile(cleanState));
  }

  return nextStates;
}

/**
 * Calculates a heuristic score for candidate state transitions in Smart mode.
 */
function scoreCandidateState(prevState: GameState, candidateState: GameState): number {
  const prevVisible = visibleCards(prevState.pyramid).length;
  const nextVisible = visibleCards(candidateState.pyramid).length;
  const unblockedCount = Math.max(0, nextVisible - prevVisible);

  const prevPyramidCount = getRemainingPyramidCards(prevState).length;
  const nextPyramidCount = getRemainingPyramidCards(candidateState).length;
  const pyramidRemovedCount = prevPyramidCount - nextPyramidCount;

  const prevActiveCounts = getActiveRankCounts(prevState);

  let bottleneckBonus = 0;
  if (pyramidRemovedCount > 0) {
    for (let r = 1; r <= 12; r += 1) {
      const partnerRank = (13 - r) as Rank;
      const countR = prevActiveCounts[r as Rank];
      const countPartner = prevActiveCounts[partnerRank];
      if ((countR === 1 || countPartner === 1) && Math.abs(countR - countPartner) > 0) {
        bottleneckBonus += 5;
      }
    }
  }

  let score = 0;
  score += pyramidRemovedCount * 20;
  score += unblockedCount * 15;
  score += bottleneckBonus;

  if (candidateState.drawPile.length < prevState.drawPile.length && pyramidRemovedCount === 0) {
    score -= 10;
  }

  return score;
}

/**
 * Evaluates candidates using heuristic lookahead (Smart Strategy).
 */
export function findNextSmartMove(state: GameState): GameState | null {
  if (state.status !== 'in-progress') return null;

  if (!isGamePlayable(state)) {
    return resignGame(state);
  }

  const nextStates = getLegalNextStates(state);
  if (nextStates.length === 0) {
    return resignGame(state);
  }

  let bestState: GameState | null = null;
  let bestScore = -Infinity;

  for (const candidate of nextStates) {
    const score = scoreCandidateState(state, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestState = candidate;
    }
  }

  if (bestState) return bestState;

  return resignGame(state);
}

/**
 * Generates a unique state hash for solver search graph.
 */
export function getSolverHash(state: GameState): string {
  let pyramidMask = '';
  for (let r = 0; r < state.pyramid.length; r += 1) {
    for (let c = 0; c < state.pyramid[r].length; c += 1) {
      pyramidMask += state.pyramid[r][c].removed ? '0' : '1';
    }
  }
  const drawCount = state.drawPile.length;
  const discardTop = state.discardPile[0]?.id ?? '_';
  const discardCount = state.discardPile.length;
  const redraws = state.redrawsRemaining === null ? 'inf' : String(state.redrawsRemaining);

  return `${pyramidMask}:${drawCount}:${discardTop}:${discardCount}:${redraws}`;
}

/**
 * Graph search solver (DFS with memoization) that finds a solution path to victory.
 */
export function solveBoard(
  state: GameState,
  target: 'any' | 'complete' | 'partial' = 'any',
  maxVisited: number = 8000
): GameState[] | null {
  if (target === 'complete' && state.status === 'complete-victory') {
    return [state];
  }
  if (target === 'partial' && (state.status === 'partial-victory' || state.status === 'complete-victory')) {
    return [state];
  }
  if (target === 'any' && (state.status === 'complete-victory' || state.status === 'partial-victory')) {
    return [state];
  }
  if (state.status === 'pyramid-collapse' || !isGamePlayable(state)) {
    return null;
  }

  const visited = new Set<string>();

  function dfs(curr: GameState): GameState[] | null {
    if (target === 'complete' && curr.status === 'complete-victory') {
      return [curr];
    }
    if (target === 'partial' && (curr.status === 'partial-victory' || curr.status === 'complete-victory')) {
      return [curr];
    }
    if (target === 'any' && (curr.status === 'complete-victory' || curr.status === 'partial-victory')) {
      return [curr];
    }
    if (curr.status === 'pyramid-collapse') {
      return null;
    }

    const key = getSolverHash(curr);
    if (visited.has(key)) return null;
    visited.add(key);

    if (visited.size > maxVisited) return null;

    const nextCandidates = getLegalNextStates(curr);
    for (const nextCandidate of nextCandidates) {
      const path = dfs(nextCandidate);
      if (path) {
        return [nextCandidate, ...path];
      }
    }

    return null;
  }

  return dfs(state);
}

/**
 * Perfect solver: returns the next state along a winning solution path if one exists
 * (prioritizing Complete Victory over Partial Victory), or falls back to Smart heuristic move.
 */
export function findNextPerfectMove(state: GameState): GameState | null {
  if (state.status !== 'in-progress') return null;

  if (!isGamePlayable(state)) {
    return resignGame(state);
  }

  const completePath = solveBoard(state, 'complete');
  if (completePath && completePath.length > 0) {
    return completePath[0];
  }

  const partialPath = solveBoard(state, 'partial');
  if (partialPath && partialPath.length > 0) {
    return partialPath[0];
  }

  return findNextSmartMove(state);
}

/**
 * Evaluates deal winnability status for current GameState, distinguishing between Complete Win and Pyramid Clear.
 */
export function evaluateWinnability(state: GameState): WinnabilityStatus {
  if (state.status === 'pyramid-collapse' || !isGamePlayable(state)) return 'deadlocked';
  if (state.status === 'complete-victory') return 'complete-victory';
  if (state.status === 'partial-victory') return 'partial-victory';

  const completeSolution = solveBoard(state, 'complete');
  if (completeSolution !== null && completeSolution.length > 0) {
    return 'complete-victory';
  }

  const partialSolution = solveBoard(state, 'partial');
  if (partialSolution !== null && partialSolution.length > 0) {
    return 'partial-victory';
  }

  return 'unwinnable';
}

/**
 * Dispatcher function executing step moves according to selected strategy.
 */
export function findNextMove(state: GameState, strategy: SolverStrategy = 'greedy'): GameState | null {
  if (strategy === 'smart') {
    return findNextSmartMove(state);
  }
  if (strategy === 'perfect') {
    return findNextPerfectMove(state);
  }
  return findNextGreedyMove(state);
}

/**
 * Instantly transitions the game to a victory state by removing all pyramid cards
 * (and clearing draw/discard piles if complete victory is requested).
 */
export function forceWin(state: GameState, complete: boolean = false): GameState {
  const clearedPyramid = state.pyramid.map((row) =>
    row.map((card) => ({ ...card, removed: true, selected: false }))
  );

  const nextState: GameState = {
    ...state,
    pyramid: clearedPyramid,
    drawPile: complete ? [] : state.drawPile,
    discardPile: complete ? [] : state.discardPile,
    selectedCardId: null,
    status: 'in-progress',
  };

  return {
    ...nextState,
    status: checkForWin(nextState),
  };
}

/**
 * Instantly transitions the game to a pyramid collapse state.
 */
export function forceLoss(state: GameState): GameState {
  return {
    ...state,
    drawPile: [],
    redrawsRemaining: 0,
    selectedCardId: null,
    status: 'pyramid-collapse',
  };
}
