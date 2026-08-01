export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type AttritionStage = 0 | 1 | 2 | 3 | 4 | 5;
export type RewardStage = 0 | 1 | 2;
export type GameMode = 'standard' | 'cursed-tomb';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  removed: boolean;
  selected: boolean;
  attritionStage: AttritionStage;
  rewardStage: RewardStage;
  blessed: boolean;
  faceDown?: boolean;
  spadesRevealed?: boolean;
  tempImmune?: boolean;
}

export type CursedCard = Card;

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
  mode: GameMode;
  vaultCard?: Card | null;
  interactionMode?: 'normal' | 'targeting-spades' | 'targeting-hearts';
  pendingHeroCardId?: string | null;
  lastClearedPair?: Card[];
  lifecycleProcessed?: boolean;
}

export interface CampaignState {
  mode: GameMode;
  difficulty: number | null;
  volatileCollapse: boolean;
  masterDeck: CursedCard[];
  graveyard: CursedCard[];
  currentRound: GameState;
  roundNumber: number;
  status: 'active' | 'defeat';
  defeatReason?: 'starvation' | 'volatile-collapse';
}

const suits: Suit[] = ['♠', '♥', '♦', '♣'];
const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function getFunctionalValue(card: Card, mode: GameMode = 'standard'): number {
  if (mode !== 'cursed-tomb') return card.rank;
  if (card.attritionStage < 3) return card.rank;
  const shift = card.suit === '♥' || card.suit === '♦' ? 1 : -1;
  return ((card.rank + shift - 1 + 13) % 13) + 1;
}

export function getEffectiveValueForPair(card: Card, partner: Card, mode: GameMode = 'standard'): number {
  if (mode === 'cursed-tomb' && ((card.blessed && card.suit === '♣') || (partner.blessed && partner.suit === '♣'))) {
    return 13;
  }
  return getFunctionalValue(card, mode);
}

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
        attritionStage: 0,
        rewardStage: 0,
        blessed: false,
        faceDown: false,
        tempImmune: false,
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

export function updateRedCurseFaceDownState(pyramid: Card[][], mode: GameMode = 'standard'): Card[][] {
  if (mode !== 'cursed-tomb') return pyramid;

  return pyramid.map((row, r) => {
    return row.map((card, c) => {
      if (r === 0) return { ...card, faceDown: false };

      const parentRow = pyramid[r - 1];
      const parent1 = c > 0 ? parentRow[c - 1] : null;
      const parent2 = c < parentRow.length ? parentRow[c] : null;

      const parent1RedCurse =
        parent1 && !parent1.removed && parent1.attritionStage === 4 && (parent1.suit === '♥' || parent1.suit === '♦');
      const parent2RedCurse =
        parent2 && !parent2.removed && parent2.attritionStage === 4 && (parent2.suit === '♥' || parent2.suit === '♦');

      if (parent1RedCurse || parent2RedCurse) {
        // Face-down card is revealed as soon as it becomes exposed (playable) or if manually revealed by Spades Tunnel
        const blocked = isBlocked(card.id, pyramid);
        if (!blocked || card.spadesRevealed) {
          return { ...card, faceDown: false };
        }
        return { ...card, faceDown: true };
      } else {
        return { ...card, faceDown: false };
      }
    });
  });
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
    const cards = pyramid[row].filter((card) => !card.removed && !card.faceDown && !isBlocked(card.id, pyramid));
    visible.push(...cards);
  }
  return visible;
}

export function getCardById(cardId: string, state: GameState): Card | undefined {
  const pyramidCard = state.pyramid.flat().find((card) => card.id === cardId);
  if (pyramidCard) return pyramidCard;
  const drawCard = state.drawPile.find((card) => card.id === cardId);
  if (drawCard) return drawCard;
  if (state.vaultCard && state.vaultCard.id === cardId) return state.vaultCard;
  return state.discardPile.find((card) => card.id === cardId);
}

export function canRemovePair(
  first: Card,
  second: Card,
  mode: GameMode = 'standard',
  firstLoc?: 'pyramid' | 'draw' | 'discard' | 'vault',
  secondLoc?: 'pyramid' | 'draw' | 'discard' | 'vault'
): boolean {
  if (first.removed || second.removed) return false;
  if (first.id === second.id) return false;
  if (first.faceDown || second.faceDown) return false;

  if (mode === 'cursed-tomb') {
    if (first.attritionStage === 4 && (first.suit === '♠' || first.suit === '♣')) {
      if (firstLoc && firstLoc !== 'pyramid') return false;
      if (secondLoc && secondLoc !== 'pyramid') return false;
    }
    if (second.attritionStage === 4 && (second.suit === '♠' || second.suit === '♣')) {
      if (firstLoc && firstLoc !== 'pyramid') return false;
      if (secondLoc && secondLoc !== 'pyramid') return false;
    }

    if ((first.blessed && first.suit === '♣') || (second.blessed && second.suit === '♣')) {
      return true;
    }
  }

  const val1 = getEffectiveValueForPair(first, second, mode);
  const val2 = getEffectiveValueForPair(second, first, mode);

  return val1 + val2 === 13;
}

export function canRemoveSingle(card: Card, mode: GameMode = 'standard'): boolean {
  if (card.removed || card.faceDown) return false;
  return getFunctionalValue(card, mode) === 13;
}

export function initializeGame(
  redraws: number | null,
  mode: GameMode = 'standard',
  masterDeck?: CursedCard[],
  graveyard?: CursedCard[]
): GameState {
  const activeDeck = masterDeck
    ? masterDeck.filter((c) => c.attritionStage < 5 && (!graveyard || !graveyard.some((g) => g.id === c.id)))
    : createDeck();

  const shuffledDeck = shuffle(activeDeck);
  let pyramid = dealPyramid(shuffledDeck);
  if (mode === 'cursed-tomb') {
    pyramid = updateRedCurseFaceDownState(pyramid, mode);
  }
  const remaining = shuffledDeck.slice(28).map((card) => ({ ...card }));
  return {
    deck: shuffledDeck.map((card) => ({ ...card })),
    pyramid,
    drawPile: remaining,
    discardPile: [],
    selectedCardId: null,
    redrawsRemaining: redraws,
    status: 'ready',
    mode,
    vaultCard: null,
    interactionMode: 'normal',
    pendingHeroCardId: null,
    lastClearedPair: [],
  };
}

export function getCardLocation(
  cardId: string,
  state: GameState
): { zone: 'pyramid' | 'draw' | 'discard' | 'vault' | 'none'; row?: number; index?: number } {
  for (let row = 0; row < state.pyramid.length; row += 1) {
    const index = state.pyramid[row].findIndex((card) => card.id === cardId);
    if (index !== -1) return { zone: 'pyramid', row, index };
  }
  const drawIndex = state.drawPile.findIndex((card) => card.id === cardId);
  if (drawIndex !== -1) return { zone: 'draw', index: drawIndex };
  if (state.vaultCard && state.vaultCard.id === cardId) return { zone: 'vault' };
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

export function moveWasteToVault(state: GameState): GameState {
  if (state.discardPile.length === 0) return state;
  const topDiscard = state.discardPile[0];
  if (!topDiscard.blessed || topDiscard.suit !== '♦' || state.vaultCard) {
    return state;
  }
  const [movedCard, ...remainingDiscard] = state.discardPile;
  return {
    ...state,
    discardPile: remainingDiscard,
    vaultCard: movedCard,
  };
}

export function movePyramidToVault(state: GameState, cardId: string): GameState {
  if (state.vaultCard) return state;

  const card = state.pyramid.flat().find((c) => c.id === cardId);
  if (!card || card.removed || card.faceDown || isBlocked(card.id, state.pyramid)) {
    return state;
  }

  if (!card.blessed || card.suit !== '♦') {
    return state;
  }

  const nextPyramid = state.pyramid.map((row) =>
    row.map((c) => (c.id === cardId ? { ...c, removed: true } : c))
  );

  const nextState: GameState = {
    ...state,
    pyramid: nextPyramid,
    vaultCard: card,
    selectedCardId: state.selectedCardId === cardId ? null : state.selectedCardId,
  };

  return {
    ...nextState,
    status: checkForWin(nextState),
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
  if (card.removed || card.faceDown) return false;
  const location = getCardLocation(card.id, state);
  if (location.zone === 'pyramid') {
    return !isBlocked(card.id, state.pyramid);
  }
  if (location.zone === 'discard') {
    return location.index === 0;
  }
  if (location.zone === 'draw') {
    return canRemoveSingle(card, state.mode);
  }
  if (location.zone === 'vault') {
    return true;
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
    const discardEmpty = state.discardPile.length === 0 && !state.vaultCard;
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
  const topDiscard = state.discardPile[0] ?? null;
  const vaultCard = state.vaultCard ?? null;

  const available: { card: Card; location: 'pyramid' | 'draw' | 'discard' | 'vault' }[] = [
    ...visible.map((card) => ({ card, location: 'pyramid' as const })),
  ];
  if (topDiscard) {
    available.push({ card: topDiscard, location: 'discard' });
  }
  if (vaultCard) {
    available.push({ card: vaultCard, location: 'vault' });
  }
  for (const card of extraCards) {
    available.push({ card, location: 'discard' });
  }

  for (let i = 0; i < available.length; i += 1) {
    if (canRemoveSingle(available[i].card, state.mode)) return true;
    for (let j = i + 1; j < available.length; j += 1) {
      if (
        canRemovePair(
          available[i].card,
          available[j].card,
          state.mode,
          available[i].location,
          available[j].location
        )
      ) {
        return true;
      }
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
    pyramid: state.pyramid.map((row) =>
      row.map((card) => (card.id === cardId ? { ...card, removed: true, selected: false } : card))
    ),
    discardPile: state.discardPile.filter((card) => card.id !== cardId),
    drawPile: state.drawPile.filter((card) => card.id !== cardId),
    vaultCard: state.vaultCard?.id === cardId ? null : state.vaultCard,
    selectedCardId: null,
  };
}

function handleHeroBlessings(state: GameState, clearedCards: Card[]): GameState {
  let interactionMode: 'normal' | 'targeting-spades' | 'targeting-hearts' = state.interactionMode || 'normal';
  let pendingHeroCardId: string | null = state.pendingHeroCardId || null;

  for (const card of clearedCards) {
    if (card.blessed) {
      if (card.suit === '♠') {
        const hasFaceDown = state.pyramid.flat().some((c) => !c.removed && c.faceDown);
        if (hasFaceDown) {
          interactionMode = 'targeting-spades';
          pendingHeroCardId = card.id;
        }
      }
    }
  }

  return {
    ...state,
    interactionMode,
    pendingHeroCardId,
  };
}

export function applyTargetingAction(state: GameState, targetCardId: string): GameState {
  if (state.interactionMode === 'targeting-hearts') {
    const updatedPyramid = state.pyramid.map((row) =>
      row.map((card) => (card.id === targetCardId ? { ...card, tempImmune: true } : card))
    );
    return {
      ...state,
      pyramid: updatedPyramid,
      interactionMode: 'normal',
      pendingHeroCardId: null,
    };
  }

  if (state.interactionMode === 'targeting-spades') {
    const updatedPyramid = state.pyramid.map((row) =>
      row.map((card) => (card.id === targetCardId ? { ...card, faceDown: false, spadesRevealed: true } : card))
    );
    return {
      ...state,
      pyramid: updatedPyramid,
      interactionMode: 'normal',
      pendingHeroCardId: null,
    };
  }

  return state;
}

export function playCard(state: GameState, cardId: string): GameState {
  if (state.interactionMode && state.interactionMode !== 'normal') {
    return applyTargetingAction(state, cardId);
  }

  const located = getCardLocation(cardId, state);

  if (located.zone === 'pyramid') {
    const card = state.pyramid[located.row!][located.index!];
    if (isBlocked(card.id, state.pyramid) || card.faceDown) return state;

    if (canRemoveSingle(card, state.mode)) {
      let nextState = removeCard(state, card.id);
      nextState.lastClearedPair = [card];
      nextState.pyramid = updateRedCurseFaceDownState(nextState.pyramid, state.mode);
      nextState = handleHeroBlessings(nextState, [card]);
      return { ...nextState, status: checkForWin(nextState) };
    }

    if (!state.selectedCardId || state.selectedCardId === card.id) {
      return selectCard(state, cardId);
    }

    const selectedCard = getCardById(state.selectedCardId, state);
    const selectedLoc = selectedCard ? getCardLocation(selectedCard.id, state).zone : 'none';
    if (!selectedCard || !canRemovePair(card, selectedCard, state.mode, 'pyramid', selectedLoc === 'none' ? undefined : selectedLoc)) {
      return state;
    }

    let nextState = removeCard(state, card.id);
    nextState = removeCard(nextState, selectedCard.id);
    nextState.lastClearedPair = [card, selectedCard];
    nextState.pyramid = updateRedCurseFaceDownState(nextState.pyramid, state.mode);
    nextState = handleHeroBlessings(nextState, [card, selectedCard]);
    nextState.status = checkForWin(nextState);
    return nextState;
  }

  if (located.zone === 'draw') {
    return selectCard(state, cardId);
  }

  if (located.zone === 'discard') {
    const discardCard = state.discardPile.find((item) => item.id === cardId);
    if (!discardCard) return state;

    if (canRemoveSingle(discardCard, state.mode)) {
      let nextState: GameState = {
        ...state,
        discardPile: state.discardPile.filter((card) => card.id !== cardId),
        lastClearedPair: [discardCard],
      };
      nextState = handleHeroBlessings(nextState, [discardCard]);
      return { ...nextState, status: checkForWin(nextState) };
    }

    if (!state.selectedCardId || state.selectedCardId === cardId) {
      return selectCard(state, cardId);
    }

    const selectedCard = getCardById(state.selectedCardId, state);
    const selectedLoc = selectedCard ? getCardLocation(selectedCard.id, state).zone : 'none';
    if (!selectedCard || !canRemovePair(discardCard, selectedCard, state.mode, 'discard', selectedLoc === 'none' ? undefined : selectedLoc)) {
      return state;
    }

    let nextState: GameState = removeCard(state, selectedCard.id);
    nextState = {
      ...nextState,
      discardPile: nextState.discardPile.filter((card) => card.id !== cardId),
      lastClearedPair: [discardCard, selectedCard],
    };
    nextState.pyramid = updateRedCurseFaceDownState(nextState.pyramid, state.mode);
    nextState = handleHeroBlessings(nextState, [discardCard, selectedCard]);
    nextState.status = checkForWin(nextState);
    return nextState;
  }

  if (located.zone === 'vault') {
    const vaultCard = state.vaultCard;
    if (!vaultCard) return state;

    if (canRemoveSingle(vaultCard, state.mode)) {
      let nextState: GameState = {
        ...state,
        vaultCard: null,
        lastClearedPair: [vaultCard],
      };
      nextState = handleHeroBlessings(nextState, [vaultCard]);
      return { ...nextState, status: checkForWin(nextState) };
    }

    if (!state.selectedCardId || state.selectedCardId === cardId) {
      return selectCard(state, cardId);
    }

    const selectedCard = getCardById(state.selectedCardId, state);
    const selectedLoc = selectedCard ? getCardLocation(selectedCard.id, state).zone : 'none';
    if (!selectedCard || !canRemovePair(vaultCard, selectedCard, state.mode, 'vault', selectedLoc === 'none' ? undefined : selectedLoc)) {
      return state;
    }

    let nextState: GameState = removeCard(state, selectedCard.id);
    nextState = {
      ...nextState,
      vaultCard: null,
      lastClearedPair: [vaultCard, selectedCard],
    };
    nextState.pyramid = updateRedCurseFaceDownState(nextState.pyramid, state.mode);
    nextState = handleHeroBlessings(nextState, [vaultCard, selectedCard]);
    nextState.status = checkForWin(nextState);
    return nextState;
  }

  return state;
}

export function startGame(redraws: number | null, mode: GameMode = 'standard'): GameState {
  const nextState = initializeGame(redraws, mode);
  return {
    ...nextState,
    status: 'in-progress',
  };
}

export function createCampaign(
  mode: GameMode = 'standard',
  difficulty: number | null = 1,
  volatileCollapse: boolean = false,
  existingMasterDeck?: CursedCard[],
  existingGraveyard?: CursedCard[],
  roundNumber: number = 1
): CampaignState {
  const masterDeck = existingMasterDeck ?? createDeck();
  const graveyard = existingGraveyard ?? [];
  const currentRound = startGame(difficulty, mode);
  
  let status: 'active' | 'defeat' = 'active';
  let defeatReason: 'starvation' | 'volatile-collapse' | undefined;

  if (mode === 'cursed-tomb') {
    const activeCount = masterDeck.filter((c) => c.attritionStage < 5 && !graveyard.some((g) => g.id === c.id)).length;
    if (activeCount < 28) {
      status = 'defeat';
      defeatReason = 'starvation';
    }
  }

  return {
    mode,
    difficulty,
    volatileCollapse,
    masterDeck,
    graveyard,
    currentRound,
    roundNumber,
    status,
    defeatReason,
  };
}

export function applyEndOfWeekLifecycle(campaign: CampaignState): CampaignState {
  const round = campaign.currentRound;
  const mode = campaign.mode;
  if (mode !== 'cursed-tomb') return campaign;
  if (round.lifecycleProcessed) return campaign;

  let masterDeck = campaign.masterDeck.map((c) => ({ ...c }));
  let graveyard = campaign.graveyard.map((c) => ({ ...c }));

  if (round.status === 'pyramid-collapse') {
    const bottleneckCards = visibleCards(round.pyramid);
    for (const bCard of bottleneckCards) {
      const idx = masterDeck.findIndex((c) => c.id === bCard.id);
      if (idx !== -1) {
        const target = masterDeck[idx];
        if (target.rewardStage !== 2 && !bCard.tempImmune) {
          target.attritionStage = Math.min(5, target.attritionStage + 1) as AttritionStage;
        }
      }
    }
  } else if (round.status === 'complete-victory' || round.status === 'partial-victory') {
    const lastPair = round.lastClearedPair ?? [];
    if (lastPair.length === 2) {
      const c1 = lastPair[0];
      const c2 = lastPair[1];
      const val1 = getFunctionalValue(c1, mode);
      const val2 = getFunctionalValue(c2, mode);

      let heroCard = c1;
      let anchorCard = c2;
      if (val2 > val1) {
        heroCard = c2;
        anchorCard = c1;
      }

      const hIdx = masterDeck.findIndex((c) => c.id === heroCard.id);
      if (hIdx !== -1) {
        masterDeck[hIdx].blessed = true;
      }

      const aIdx = masterDeck.findIndex((c) => c.id === anchorCard.id);
      if (aIdx !== -1) {
        if (masterDeck[aIdx].attritionStage === 0) {
          masterDeck[aIdx].rewardStage = Math.min(2, masterDeck[aIdx].rewardStage + 1) as RewardStage;
        }
      }
    } else if (lastPair.length === 1) {
      const kCard = lastPair[0];
      const kIdx = masterDeck.findIndex((c) => c.id === kCard.id);
      if (kIdx !== -1) {
        if (masterDeck[kIdx].attritionStage === 0) {
          masterDeck[kIdx].rewardStage = Math.min(2, masterDeck[kIdx].rewardStage + 1) as RewardStage;
        }
      }
    }
  }

  for (const card of masterDeck) {
    if (card.attritionStage === 5 && !graveyard.some((g) => g.id === card.id)) {
      graveyard.push({ ...card });
    }
  }

  // Hearts Resurrection: for each cleared Hearts Hero in the round, pull 1 random card from Graveyard Box as Stage 4
  const clearedCards = round.deck.filter((c) => {
    const inPyr = round.pyramid.flat().find((p) => p.id === c.id);
    return inPyr ? inPyr.removed : c.removed;
  });
  const clearedHeartsHeroes = clearedCards.filter((c) => c.blessed && c.suit === '♥');
  for (const _ of clearedHeartsHeroes) {
    const entombed = masterDeck.filter((c) => c.attritionStage === 5);
    if (entombed.length > 0) {
      const revived = entombed[Math.floor(Math.random() * entombed.length)];
      revived.attritionStage = 4;
      graveyard = graveyard.filter((g) => g.id !== revived.id);
    }
  }

  const activeDeck = masterDeck.filter((c) => c.attritionStage < 5);
  let status: 'active' | 'defeat' = campaign.status;
  let defeatReason = campaign.defeatReason;

  if (activeDeck.length < 28) {
    status = 'defeat';
    defeatReason = 'starvation';
  }

  if (campaign.volatileCollapse) {
    for (let r = 1; r <= 13; r += 1) {
      const entombedCount = graveyard.filter((c) => c.rank === r && c.attritionStage === 5).length;
      if (entombedCount === 4) {
        status = 'defeat';
        defeatReason = 'volatile-collapse';
        break;
      }
    }
  }

  return {
    ...campaign,
    masterDeck,
    graveyard,
    status,
    defeatReason,
    currentRound: {
      ...round,
      lifecycleProcessed: true,
    },
  };
}

export interface FinalClearDetails {
  lastClearedPair: Card[];
  heroCard?: Card;
  heroAlreadyBlessed?: boolean;
  anchorCard?: Card;
  anchorBlockedByScar?: boolean;
  anchorAlreadyMaxed?: boolean;
  isSoloKing?: boolean;
}

export interface RoundLifecycleEffects {
  blessed: Card[];
  anchored: Card[];
  cursed: Card[];
  scarred: Card[];
  entombed: Card[];
  clearDetails?: FinalClearDetails;
}

export function computeRoundLifecycleEffects(
  beforeDeck: Card[],
  afterDeck: Card[],
  round?: GameState,
  mode: GameMode = 'cursed-tomb'
): RoundLifecycleEffects {
  const blessed: Card[] = [];
  const anchored: Card[] = [];
  const cursed: Card[] = [];
  const scarred: Card[] = [];
  const entombed: Card[] = [];

  for (const afterCard of afterDeck) {
    const beforeCard = beforeDeck.find((c) => c.id === afterCard.id);
    if (!beforeCard) continue;

    if (!beforeCard.blessed && afterCard.blessed) {
      blessed.push(afterCard);
    }

    if (beforeCard.rewardStage < afterCard.rewardStage) {
      anchored.push(afterCard);
    }

    if (beforeCard.attritionStage < 4 && afterCard.attritionStage === 4) {
      cursed.push(afterCard);
    }

    if (afterCard.attritionStage > beforeCard.attritionStage && afterCard.attritionStage < 4) {
      scarred.push(afterCard);
    }

    if (beforeCard.attritionStage < 5 && afterCard.attritionStage === 5) {
      entombed.push(afterCard);
    }
  }

  let clearDetails: FinalClearDetails | undefined;
  if (round && (round.status === 'complete-victory' || round.status === 'partial-victory')) {
    const lastPair = round.lastClearedPair ?? [];
    if (lastPair.length === 2) {
      const c1 = lastPair[0];
      const c2 = lastPair[1];
      const val1 = getFunctionalValue(c1, mode);
      const val2 = getFunctionalValue(c2, mode);

      let heroCard = c1;
      let anchorCard = c2;
      if (val2 > val1) {
        heroCard = c2;
        anchorCard = c1;
      }

      const beforeHero = beforeDeck.find((c) => c.id === heroCard.id);
      const beforeAnchor = beforeDeck.find((c) => c.id === anchorCard.id);

      clearDetails = {
        lastClearedPair: lastPair,
        heroCard,
        heroAlreadyBlessed: Boolean(beforeHero?.blessed),
        anchorCard,
        anchorBlockedByScar: (beforeAnchor?.attritionStage ?? 0) > 0,
        anchorAlreadyMaxed: (beforeAnchor?.rewardStage ?? 0) >= 2,
        isSoloKing: false,
      };
    } else if (lastPair.length === 1) {
      const kCard = lastPair[0];
      const beforeKing = beforeDeck.find((c) => c.id === kCard.id);

      clearDetails = {
        lastClearedPair: lastPair,
        anchorCard: kCard,
        anchorBlockedByScar: (beforeKing?.attritionStage ?? 0) > 0,
        anchorAlreadyMaxed: (beforeKing?.rewardStage ?? 0) >= 2,
        isSoloKing: true,
      };
    }
  }

  return { blessed, anchored, cursed, scarred, entombed, clearDetails };
}

export function advanceCampaignRound(campaign: CampaignState): CampaignState {
  const updatedCampaign = applyEndOfWeekLifecycle(campaign);
  if (updatedCampaign.status === 'defeat') {
    return updatedCampaign;
  }

  const newRoundNumber = updatedCampaign.roundNumber + 1;
  const newRound = initializeGame(
    updatedCampaign.difficulty,
    updatedCampaign.mode,
    updatedCampaign.masterDeck,
    updatedCampaign.graveyard
  );

  return {
    ...updatedCampaign,
    roundNumber: newRoundNumber,
    currentRound: {
      ...newRound,
      status: 'in-progress',
    },
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


