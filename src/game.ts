export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  removed: boolean;
  selected: boolean;
}

export type GameStatus =
  | 'ready'
  | 'in-progress'
  | 'complete-victory'
  | 'partial-victory'
  | 'pyramid-collapse';

export interface GameState {
  deck: Card[];
  pyramid: Card[][];
  drawPile: Card[];
  discardPile: Card[];
  selectedCardId: string | null;
  redrawsRemaining: number | null;
  status: GameStatus;
}

const suits: Suit[] = ['♠', '♥', '♦', '♣'];
const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function createDeck(): Card[] {
  const cards: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      cards.push({
        id: `${suit}${rank}`,
        suit,
        rank,
        removed: false,
        selected: false,
      });
    }
  }
  return cards;
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function dealPyramid(deck: Card[]): Card[][] {
  const pyramid: Card[][] = [];
  let offset = 0;
  for (let row = 0; row < 7; row += 1) {
    const rowCards = deck.slice(offset, offset + row + 1).map((card) => ({ ...card }));
    pyramid.push(rowCards);
    offset += row + 1;
  }
  return pyramid;
}

export function isBlocked(cardId: string, pyramid: Card[][]): boolean {
  for (let row = 0; row < pyramid.length - 1; row += 1) {
    const index = pyramid[row].findIndex((card) => card.id === cardId);
    if (index !== -1) {
      const lowerRow = pyramid[row + 1];
      const left = lowerRow[index];
      const right = lowerRow[index + 1];
      return !left.removed || !right.removed;
    }
  }
  return false;
}

export function visibleCards(pyramid: Card[][]): Card[] {
  const visible: Card[] = [];
  for (let row = 0; row < pyramid.length; row += 1) {
    const cards = pyramid[row].filter((card) => !card.removed && !isBlocked(card.id, pyramid));
    visible.push(...cards);
  }
  return visible;
}

export function getCardById(cardId: string, state: GameState): Card | undefined {
  const pyramidCard = state.pyramid.flat().find((card) => card.id === cardId);
  if (pyramidCard) return pyramidCard;
  const drawCard = state.drawPile.find((card) => card.id === cardId);
  if (drawCard) return drawCard;
  return state.discardPile.find((card) => card.id === cardId);
}

export function canRemovePair(first: Card, second: Card): boolean {
  if (first.removed || second.removed) return false;
  if (first.id === second.id) return false;
  return first.rank + second.rank === 13;
}

export function canRemoveSingle(card: Card): boolean {
  return !card.removed && card.rank === 13;
}

export function initializeGame(redraws: number | null): GameState {
  const shuffledDeck = shuffle(createDeck());
  const pyramid = dealPyramid(shuffledDeck);
  const remaining = shuffledDeck.slice(28).map((card) => ({ ...card }));
  return {
    deck: shuffledDeck.map((card) => ({ ...card })),
    pyramid,
    drawPile: remaining,
    discardPile: [],
    selectedCardId: null,
    redrawsRemaining: redraws,
    status: 'ready',
  };
}

export function getCardLocation(cardId: string, state: GameState): { zone: 'pyramid' | 'draw' | 'discard' | 'none'; row?: number; index?: number } {
  for (let row = 0; row < state.pyramid.length; row += 1) {
    const index = state.pyramid[row].findIndex((card) => card.id === cardId);
    if (index !== -1) return { zone: 'pyramid', row, index };
  }
  const drawIndex = state.drawPile.findIndex((card) => card.id === cardId);
  if (drawIndex !== -1) return { zone: 'draw', index: drawIndex };
  const discardIndex = state.discardPile.findIndex((card) => card.id === cardId);
  if (discardIndex !== -1) return { zone: 'discard', index: discardIndex };
  return { zone: 'none' };
}

export function moveCardToDiscard(state: GameState): GameState {
  if (state.drawPile.length === 0) return state;
  const [nextCard, ...rest] = state.drawPile;
  return {
    ...state,
    drawPile: rest,
    discardPile: [nextCard, ...state.discardPile],
  };
}

export function drawCard(state: GameState): GameState {
  const nextState = moveCardToDiscard(state);
  return {
    ...nextState,
    status: checkForWin(nextState),
  };
}

export function cyclePile(state: GameState): GameState {
  if (state.discardPile.length === 0) {
    return state;
  }

  if (state.redrawsRemaining === 0) {
    return state;
  }

  const nextState = {
    ...state,
    drawPile: state.discardPile,
    discardPile: [],
    redrawsRemaining: state.redrawsRemaining === null ? null : state.redrawsRemaining - 1,
  };

  return {
    ...nextState,
    status: checkForWin(nextState),
  };
}

export function cardIsVisible(card: Card, state: GameState): boolean {
  if (card.removed) return false;
  const location = getCardLocation(card.id, state);
  if (location.zone === 'pyramid') {
    return !isBlocked(card.id, state.pyramid);
  }
  if (location.zone === 'discard') {
    return location.index === 0;
  }
  if (location.zone === 'draw') {
    return card.rank === 13;
  }
  return false;
}

export function getRemainingPyramidCards(state: GameState): Card[] {
  return state.pyramid.flat().filter((card) => !card.removed);
}

export function checkForWin(state: GameState): GameStatus {
  const remainingPyramid = getRemainingPyramidCards(state).length;
  const hasPyramidCards = remainingPyramid > 0;

  if (!hasPyramidCards) {
    const discardEmpty = state.discardPile.length === 0;
    const drawEmpty = state.drawPile.length === 0;
    if (drawEmpty && discardEmpty) {
      return 'complete-victory';
    }
    return 'partial-victory';
  }

  const canMove = canAnyMove(state);
  if (!canMove && state.drawPile.length === 0 && state.redrawsRemaining === 0) {
    return 'pyramid-collapse';
  }

  if (state.redrawsRemaining === null && state.drawPile.length === 0) {
    const canMoveWithFullDiscard = canAnyMove(state, state.discardPile);
    if (!canMoveWithFullDiscard) {
      return 'pyramid-collapse';
    }
  }

  return 'in-progress';
}

export function canAnyMove(state: GameState, extraCards: Card[] = []): boolean {
  const visible = visibleCards(state.pyramid);
  const available = [...visible, ...state.discardPile.slice(0, 1), ...extraCards];
  for (let i = 0; i < available.length; i += 1) {
    if (available[i].rank === 13) return true;
    for (let j = i + 1; j < available.length; j += 1) {
      if (canRemovePair(available[i], available[j])) return true;
    }
  }
  return false;
}

export function selectCard(state: GameState, cardId: string): GameState {
  const card = getCardById(cardId, state);
  if (!card || card.removed) return state;
  if (!cardIsVisible(card, state)) return state;

  const selected = state.selectedCardId === cardId ? null : cardId;
  return {
    ...state,
    selectedCardId: selected,
  };
}

function removeCard(state: GameState, cardId: string): GameState {
  return {
    ...state,
    pyramid: state.pyramid.map((row) => row.map((card) => (card.id === cardId ? { ...card, removed: true, selected: false } : card))),
    discardPile: state.discardPile.filter((card) => card.id !== cardId),
    drawPile: state.drawPile.filter((card) => card.id !== cardId),
    selectedCardId: null,
  };
}

export function playCard(state: GameState, cardId: string): GameState {
  const located = getCardLocation(cardId, state);
  if (located.zone === 'pyramid') {
    const card = state.pyramid[located.row!][located.index!];
    if (isBlocked(card.id, state.pyramid)) return state;
    if (card.rank === 13) {
      const nextState = removeCard(state, card.id);
      return { ...nextState, status: checkForWin(nextState) };
    }
    if (!state.selectedCardId || state.selectedCardId === card.id) {
      return selectCard(state, cardId);
    }
    const selectedCard = getCardById(state.selectedCardId, state);
    if (!selectedCard || !canRemovePair(card, selectedCard)) return state;
    let nextState = removeCard(state, card.id);
    nextState = removeCard(nextState, selectedCard.id);
    nextState.status = checkForWin(nextState);
    return nextState;
  }

  if (located.zone === 'draw') {
    return selectCard(state, cardId);
  }

  if (located.zone === 'discard') {
    const discardCard = state.discardPile.find((item) => item.id === cardId);
    if (!discardCard) return state;
    if (discardCard.rank === 13) {
      return { ...state, discardPile: state.discardPile.filter((card) => card.id !== cardId), status: checkForWin(state) };
    }
    if (!state.selectedCardId || state.selectedCardId === cardId) {
      return selectCard(state, cardId);
    }
    const selectedCard = getCardById(state.selectedCardId, state);
    if (!selectedCard || !canRemovePair(discardCard, selectedCard)) return state;
    let nextState = removeCard(state, selectedCard.id);
    nextState = {
      ...nextState,
      discardPile: nextState.discardPile.filter((card) => card.id !== cardId),
      status: checkForWin(nextState),
    };
    return nextState;
  }

  return state;
}

export function startGame(redraws: number | null): GameState {
  const nextState = initializeGame(redraws);
  return {
    ...nextState,
    status: 'in-progress',
  };
}

export function resignGame(state: GameState): GameState {
  if (state.status !== 'in-progress') return state;
  return {
    ...state,
    status: 'pyramid-collapse',
  };
}

export function getRemovedCardIds(state: GameState): Set<string> {
  const activeIds = new Set<string>();

  for (const row of state.pyramid) {
    for (const card of row) {
      if (!card.removed) {
        activeIds.add(card.id);
      }
    }
  }

  for (const card of state.drawPile) {
    activeIds.add(card.id);
  }

  for (const card of state.discardPile) {
    activeIds.add(card.id);
  }

  const removed = new Set<string>();
  const suitsList: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranksList: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  for (const suit of suitsList) {
    for (const rank of ranksList) {
      const id = `${suit}${rank}`;
      if (!activeIds.has(id)) {
        removed.add(id);
      }
    }
  }

  return removed;
}

export function getRemovedCardsCount(state: GameState): { count: number; total: number; percentage: number } {
  const count = getRemovedCardIds(state).size;
  const total = 52;
  const percentage = Math.round((count / total) * 100);
  return { count, total, percentage };
}

export function getActiveRankCounts(state: GameState): Record<Rank, number> {
  const activeIds = new Set<string>();
  for (const row of state.pyramid) {
    for (const card of row) {
      if (!card.removed) activeIds.add(card.id);
    }
  }
  for (const card of state.drawPile) activeIds.add(card.id);
  for (const card of state.discardPile) activeIds.add(card.id);

  const counts: Record<Rank, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0,
  };

  const suitsList: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranksList: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  for (const suit of suitsList) {
    for (const rank of ranksList) {
      const id = `${suit}${rank}`;
      if (activeIds.has(id)) {
        counts[rank] += 1;
      }
    }
  }

  return counts;
}

export interface PairStat {
  label: string;
  rank1: Rank;
  rank1Label: string;
  active1: number;
  rank2?: Rank;
  rank2Label?: string;
  active2?: number;
  remainingPairs: number;
}

export function getRemainingPairStats(state: GameState): PairStat[] {
  const counts = getActiveRankCounts(state);
  return [
    {
      label: 'Kings (13)',
      rank1: 13,
      rank1Label: 'K',
      active1: counts[13],
      remainingPairs: counts[13],
    },
    {
      label: 'Q + A',
      rank1: 12,
      rank1Label: 'Q',
      active1: counts[12],
      rank2: 1,
      rank2Label: 'A',
      active2: counts[1],
      remainingPairs: Math.min(counts[12], counts[1]),
    },
    {
      label: 'J + 2',
      rank1: 11,
      rank1Label: 'J',
      active1: counts[11],
      rank2: 2,
      rank2Label: '2',
      active2: counts[2],
      remainingPairs: Math.min(counts[11], counts[2]),
    },
    {
      label: '10 + 3',
      rank1: 10,
      rank1Label: '10',
      active1: counts[10],
      rank2: 3,
      rank2Label: '3',
      active2: counts[3],
      remainingPairs: Math.min(counts[10], counts[3]),
    },
    {
      label: '9 + 4',
      rank1: 9,
      rank1Label: '9',
      active1: counts[9],
      rank2: 4,
      rank2Label: '4',
      active2: counts[4],
      remainingPairs: Math.min(counts[9], counts[4]),
    },
    {
      label: '8 + 5',
      rank1: 8,
      rank1Label: '8',
      active1: counts[8],
      rank2: 5,
      rank2Label: '5',
      active2: counts[5],
      remainingPairs: Math.min(counts[8], counts[5]),
    },
    {
      label: '7 + 6',
      rank1: 7,
      rank1Label: '7',
      active1: counts[7],
      rank2: 6,
      rank2Label: '6',
      active2: counts[6],
      remainingPairs: Math.min(counts[7], counts[6]),
    },
  ];
}


