import {
  GameState,
  Card,
  visibleCards,
  canRemovePair,
  canRemoveSingle,
  playCard,
  drawCard,
  cyclePile,
  moveWasteToVault,
  movePyramidToVault,
  applyTargetingAction,
  checkForWin,
  resignGame,
  getRemainingPyramidCards,
  getActiveRankCounts,
  Rank,
  getFunctionalValue,
} from './game';

export type SolverStrategy = 'greedy' | 'smart' | 'perfect';
export type WinnabilityStatus = 'complete-victory' | 'partial-victory' | 'unwinnable' | 'deadlocked';

/**
 * If the game is waiting on a hero-power targeting action (Spades Tunnel),
 * automatically selects a valid target card and resolves the interaction mode.
 * Returns null if no valid target exists (should not happen in a well-formed game state).
 */
function resolveTargetingMode(state: GameState): GameState | null {
  if (state.interactionMode === 'targeting-spades') {
    const exposed = visibleCards(state.pyramid);
    if (exposed.length > 0) {
      return applyTargetingAction(state, exposed[0].id);
    }
    return { ...state, interactionMode: 'normal', pendingHeroCardId: null };
  }

  return null;
}

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
    const topStock = simState.drawPile[0] ?? null;

    // 0. Check Vault moves
    if (!simState.vaultCard) {
      if (topDiscard && topDiscard.blessed && topDiscard.suit === '♦') return true;
      if (visiblePyramid.some((card) => card.blessed && card.suit === '♦')) return true;
    }

    // 1. Check King / Functional 13
    if (
      visiblePyramid.some((card) => canRemoveSingle(card, simState.mode)) ||
      (topDiscard && canRemoveSingle(topDiscard, simState.mode)) ||
      (topStock && canRemoveSingle(topStock, simState.mode))
    ) {
      return true;
    }

    // 2. Check Pyramid pairs
    for (let i = 0; i < visiblePyramid.length; i += 1) {
      for (let j = i + 1; j < visiblePyramid.length; j += 1) {
        if (canRemovePair(visiblePyramid[i], visiblePyramid[j], simState.mode, 'pyramid', 'pyramid')) {
          return true;
        }
      }
    }

    // 3. Check Pyramid + Discard pair
    if (topDiscard) {
      for (const card of visiblePyramid) {
        if (canRemovePair(topDiscard, card, simState.mode, 'discard', 'pyramid')) {
          return true;
        }
      }
    }

    // 4. Check Stock pairs
    if (topStock) {
      for (const card of visiblePyramid) {
        if (canRemovePair(topStock, card, simState.mode, 'draw', 'pyramid')) {
          return true;
        }
      }
      if (topDiscard && canRemovePair(topStock, topDiscard, simState.mode, 'draw', 'discard')) {
        return true;
      }
      if (simState.vaultCard && canRemovePair(topStock, simState.vaultCard, simState.mode, 'draw', 'vault')) {
        return true;
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

  // Resolve any pending hero power targeting before continuing normal move selection
  if (state.interactionMode && state.interactionMode !== 'normal') {
    return resolveTargetingMode(state);
  }

  const visiblePyramid = visibleCards(state.pyramid);
  const topDiscard = state.discardPile[0] ?? null;
  const topStock = state.drawPile[0] ?? null;

  // 0. Waste to Vault
  if (!state.vaultCard && topDiscard && topDiscard.blessed && topDiscard.suit === '♦') {
    return moveWasteToVault({ ...state, selectedCardId: null });
  }

  // 1. Single King in Pyramid
  const pyramidKing = visiblePyramid.find((card) => canRemoveSingle(card, state.mode));
  if (pyramidKing) {
    const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
    return playCard(cleanState, pyramidKing.id);
  }

  // 1b. Single King on Discard
  if (topDiscard && canRemoveSingle(topDiscard, state.mode)) {
    const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
    return playCard(cleanState, topDiscard.id);
  }

  // 1c. Single King on Stock
  if (topStock && canRemoveSingle(topStock, state.mode)) {
    const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
    return playCard(cleanState, topStock.id);
  }

  // 2. Pyramid Pairs
  for (let i = 0; i < visiblePyramid.length; i += 1) {
    for (let j = i + 1; j < visiblePyramid.length; j += 1) {
      const cardA = visiblePyramid[i];
      const cardB = visiblePyramid[j];
      if (canRemovePair(cardA, cardB, state.mode, 'pyramid', 'pyramid')) {
        const step1 = playCard({ ...state, selectedCardId: null }, cardA.id);
        const step2 = playCard(step1, cardB.id);
        return step2;
      }
    }
  }

  // 2b. Pyramid to Vault
  if (!state.vaultCard) {
    const pyramidDiamond = visiblePyramid.find((card) => card.blessed && card.suit === '♦');
    if (pyramidDiamond) {
      return movePyramidToVault({ ...state, selectedCardId: null }, pyramidDiamond.id);
    }
  }

  // 3. Pyramid + Discard Pair
  if (topDiscard) {
    for (const card of visiblePyramid) {
      if (canRemovePair(topDiscard, card, state.mode, 'discard', 'pyramid')) {
        const step1 = playCard({ ...state, selectedCardId: null }, topDiscard.id);
        const step2 = playCard(step1, card.id);
        return step2;
      }
    }
  }

  // 3b. Stock Pairs (Stock + Pyramid, Stock + Waste)
  if (topStock) {
    for (const card of visiblePyramid) {
      if (canRemovePair(topStock, card, state.mode, 'draw', 'pyramid')) {
        const step1 = playCard({ ...state, selectedCardId: null }, topStock.id);
        const step2 = playCard(step1, card.id);
        return step2;
      }
    }
    if (topDiscard && canRemovePair(topStock, topDiscard, state.mode, 'draw', 'discard')) {
      const step1 = playCard({ ...state, selectedCardId: null }, topStock.id);
      const step2 = playCard(step1, topDiscard.id);
      return step2;
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

  // When a hero targeting action is pending, only the resolved targeting state is a legal next state
  if (state.interactionMode && state.interactionMode !== 'normal') {
    const resolved = resolveTargetingMode(state);
    return resolved ? [resolved] : [];
  }

  const cleanState = state.selectedCardId ? { ...state, selectedCardId: null } : state;
  const visiblePyramid = visibleCards(cleanState.pyramid);
  const topDiscard = cleanState.discardPile[0] ?? null;
  const topStock = cleanState.drawPile[0] ?? null;
  const vaultCard = cleanState.vaultCard ?? null;
  const nextStates: GameState[] = [];

  // 0. Vault moves
  if (!cleanState.vaultCard) {
    if (topDiscard && topDiscard.blessed && topDiscard.suit === '♦') {
      nextStates.push(moveWasteToVault(cleanState));
    }
    for (const card of visiblePyramid) {
      if (card.blessed && card.suit === '♦') {
        nextStates.push(movePyramidToVault(cleanState, card.id));
      }
    }
  }

  // 1. Single Kings in Pyramid
  for (const card of visiblePyramid) {
    if (canRemoveSingle(card, cleanState.mode)) {
      nextStates.push(playCard(cleanState, card.id));
    }
  }

  // 1b. Single King on Discard
  if (topDiscard && canRemoveSingle(topDiscard, cleanState.mode)) {
    nextStates.push(playCard(cleanState, topDiscard.id));
  }

  // 1c. Single King on Stock
  if (topStock && canRemoveSingle(topStock, cleanState.mode)) {
    nextStates.push(playCard(cleanState, topStock.id));
  }

  // 2. Pyramid Pairs
  for (let i = 0; i < visiblePyramid.length; i += 1) {
    for (let j = i + 1; j < visiblePyramid.length; j += 1) {
      const cardA = visiblePyramid[i];
      const cardB = visiblePyramid[j];
      if (canRemovePair(cardA, cardB, cleanState.mode, 'pyramid', 'pyramid')) {
        const step1 = playCard(cleanState, cardA.id);
        const step2 = playCard(step1, cardB.id);
        nextStates.push(step2);
      }
    }
  }

  // 3. Pyramid + Discard Pairs
  if (topDiscard) {
    for (const card of visiblePyramid) {
      if (canRemovePair(topDiscard, card, cleanState.mode, 'discard', 'pyramid')) {
        const step1 = playCard(cleanState, topDiscard.id);
        const step2 = playCard(step1, card.id);
        nextStates.push(step2);
      }
    }
  }

  // 3b. Stock Pairs (Stock + Pyramid, Stock + Waste, Stock + Vault)
  if (topStock) {
    for (const card of visiblePyramid) {
      if (canRemovePair(topStock, card, cleanState.mode, 'draw', 'pyramid')) {
        const step1 = playCard(cleanState, topStock.id);
        const step2 = playCard(step1, card.id);
        nextStates.push(step2);
      }
    }
    if (topDiscard && canRemovePair(topStock, topDiscard, cleanState.mode, 'draw', 'discard')) {
      const step1 = playCard(cleanState, topStock.id);
      const step2 = playCard(step1, topDiscard.id);
      nextStates.push(step2);
    }
    if (vaultCard && canRemovePair(topStock, vaultCard, cleanState.mode, 'draw', 'vault')) {
      const step1 = playCard(cleanState, topStock.id);
      const step2 = playCard(step1, vaultCard.id);
      nextStates.push(step2);
    }
  }

  // 4. Draw card / Pass to Waste or Cycle
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

  // Bonus for clearing cards from discard pile or vault without drawing
  if (prevState.discardPile.length > candidateState.discardPile.length && pyramidRemovedCount === 0) {
    score += 10;
  }

  if (prevState.vaultCard && !candidateState.vaultCard && pyramidRemovedCount === 0) {
    score += 10;
  }

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

  // Resolve any pending hero power targeting before continuing normal move selection
  if (state.interactionMode && state.interactionMode !== 'normal') {
    return resolveTargetingMode(state);
  }

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
  const drawTop = state.drawPile[0]?.id ?? '_';
  const drawCount = state.drawPile.length;
  const discardTop = state.discardPile[0]?.id ?? '_';
  const discardCount = state.discardPile.length;
  const redraws = state.redrawsRemaining === null ? 'inf' : String(state.redrawsRemaining);

  return `${pyramidMask}:${drawTop}:${drawCount}:${discardTop}:${discardCount}:${redraws}`;
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

  // Resolve any pending hero power targeting before running the graph search
  if (state.interactionMode && state.interactionMode !== 'normal') {
    return resolveTargetingMode(state);
  }

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
 * Synthetically sets lastClearedPair so end-of-round lifecycle blessings/rewards apply.
 */
export function forceWin(state: GameState, complete: boolean = false): GameState {
  const unremovedPyramidCards = state.pyramid.flat().filter((card) => !card.removed);

  let lastClearedPair = state.lastClearedPair;

  if (unremovedPyramidCards.length === 1) {
    lastClearedPair = [unremovedPyramidCards[0]];
  } else if (unremovedPyramidCards.length >= 2) {
    const blessedCard = unremovedPyramidCards.find((c) => c.blessed);
    const lowRankCard = unremovedPyramidCards.find((c) => c.rank <= 6 && c.id !== blessedCard?.id);
    if (blessedCard && lowRankCard) {
      lastClearedPair = [blessedCard, lowRankCard];
    } else {
      let foundPair: Card[] | null = null;

      for (let i = 0; i < unremovedPyramidCards.length; i += 1) {
        const c1 = unremovedPyramidCards[i];
        if (canRemoveSingle(c1, state.mode)) {
          foundPair = [c1];
          break;
        }
        for (let j = i + 1; j < unremovedPyramidCards.length; j += 1) {
          const c2 = unremovedPyramidCards[j];
          if (canRemovePair(c1, c2, state.mode)) {
            foundPair = [c1, c2];
            break;
          }
        }
        if (foundPair) break;
      }

      if (foundPair) {
        lastClearedPair = foundPair;
      } else {
        const sorted = [...unremovedPyramidCards].sort(
          (a, b) => getFunctionalValue(b, state.mode) - getFunctionalValue(a, state.mode)
        );
        lastClearedPair = [sorted[0], sorted[1]];
      }
    }
  }

  const clearedPyramid = state.pyramid.map((row) =>
    row.map((card) => ({ ...card, removed: true, selected: false }))
  );

  const nextState: GameState = {
    ...state,
    pyramid: clearedPyramid,
    drawPile: complete ? [] : state.drawPile,
    discardPile: complete ? [] : state.discardPile,
    selectedCardId: null,
    lastClearedPair,
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
