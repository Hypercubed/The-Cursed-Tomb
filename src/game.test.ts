import { describe, expect, it } from 'vitest';
import type { GameState } from './game';
import {
  canAnyMove,
  checkForWin,
  createDeck,
  cyclePile,
  dealPyramid,
  drawCard,
  getActiveRankCounts,
  getRemainingPairStats,
  getRemovedCardIds,
  getRemovedCardsCount,
  initializeGame,
  isBlocked,
  playCard,
  resignGame,
  startGame,
  visibleCards,
} from './game';

function createDeterministicGameState(redraws: number | null): GameState {
  const deck = createDeck();
  const pyramid = dealPyramid(deck);
  const remaining = deck.slice(28).map((card) => ({ ...card }));
  return {
    deck: deck.map((card) => ({ ...card })),
    pyramid,
    drawPile: remaining,
    discardPile: [],
    selectedCardId: null,
    redrawsRemaining: redraws,
    status: 'in-progress',
  };
}

describe('game model', () => {
  it('creates a full 52-card deck', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    const ids = deck.map((card) => card.id);
    expect(new Set(ids)).toHaveLength(52);
  });

  it('deals 28 cards into a 7-row pyramid', () => {
    const deck = createDeck();
    const pyramid = dealPyramid(deck);
    expect(pyramid).toHaveLength(7);
    const count = pyramid.reduce((sum, row) => sum + row.length, 0);
    expect(count).toBe(28);
  });

  it('detects blocked cards that have supporters', () => {
    const deck = createDeck();
    const pyramid = dealPyramid(deck);
    const card = pyramid[0][0];
    expect(isBlocked(card.id, pyramid)).toBe(true);
  });

  it('allows redraws to move cards into discard without decrementing cycle count while draw pile remains', () => {
    const state = initializeGame(2);
    const after = drawCard(state);
    expect(after.drawPile.length).toBe(state.drawPile.length - 1);
    expect(after.discardPile.length).toBe(1);
    expect(after.redrawsRemaining).toBe(2);
  });

  it('allows multiple redraw draws when redraw limit is 2', () => {
    const state = initializeGame(2);
    const afterFirst = drawCard(state);
    const afterSecond = drawCard(afterFirst);
    expect(afterSecond.drawPile.length).toBe(state.drawPile.length - 2);
    expect(afterSecond.discardPile.length).toBe(2);
    expect(afterSecond.redrawsRemaining).toBe(2);
  });

  it('resets the discard pile back into draw pile after cycling', () => {
    const state = initializeGame(1);
    let current = state;
    for (let i = 0; i < state.drawPile.length; i += 1) {
      current = drawCard(current);
    }
    expect(current.drawPile.length).toBe(0);
    expect(current.discardPile.length).toBe(24);
    const cycled = cyclePile(current);
    expect(cycled.drawPile.length).toBe(24);
    expect(cycled.discardPile.length).toBe(0);
    expect(cycled.redrawsRemaining).toBe(0);
  });

  it('allows selecting the top discard card after redraw', () => {
    const state = createDeterministicGameState(1);
    const afterRedraw = drawCard(state);
    const topDiscard = afterRedraw.discardPile[0];
    const nextState = playCard(afterRedraw, topDiscard.id);
    expect(nextState.selectedCardId).toBe(topDiscard.id);
  });

  it('removes discard card when used with a visible pyramid pair', () => {
    const state = createDeterministicGameState(1);
    const afterRedraw = drawCard(state);
    const topDiscard = afterRedraw.discardPile[0];
    const visible = visibleCards(afterRedraw.pyramid);
    const match = visible.find((card) => card.rank + topDiscard.rank === 13);
    expect(match).toBeDefined();

    const selected = playCard(afterRedraw, topDiscard.id);
    const result = playCard(selected, match!.id);
    expect(result.discardPile.some((card) => card.id === topDiscard.id)).toBe(false);
  });

  it('playCard pair validation uses live removed state - selecting a removed card then clicking a valid partner does not remove the partner', () => {
    const state = createDeterministicGameState(1);
    
    // Create a custom state with known cards that sum to 13 (6 and 7)
    const customState = {
      ...state,
      pyramid: state.pyramid.map((row, rowIndex) => 
        row.map((card, cardIndex) => {
          // Set the last row cards to 6 and 7 (they're visible)
          if (rowIndex === 6 && cardIndex === 0) return { ...card, rank: 6 as const, id: 'test6', removed: false };
          if (rowIndex === 6 && cardIndex === 1) return { ...card, rank: 7 as const, id: 'test7', removed: false };
          return card;
        })
      ),
    };
    
    const customVisible = visibleCards(customState.pyramid);
    const card6 = customVisible.find((c) => c.rank === 6);
    const card7 = customVisible.find((c) => c.rank === 7);
    expect(card6).toBeDefined();
    expect(card7).toBeDefined();

    // Select card 6
    let currentState = playCard(customState, card6!.id);
    expect(currentState.selectedCardId).toBe(card6!.id);

    // Select card 7 to form a pair - both should be removed
    currentState = playCard(currentState, card7!.id);
    expect(currentState.pyramid.flat().find((c) => c.id === card6!.id)?.removed).toBe(true);
    expect(currentState.pyramid.flat().find((c) => c.id === card7!.id)?.removed).toBe(true);

    // Now try to select card 6 again (which is now removed) - should not work
    currentState = playCard(currentState, card6!.id);
    expect(currentState.selectedCardId).toBeNull();
  });

  it('declares partial victory when pyramid is cleared but deck has cards remaining', () => {
    const state = startGame(1);
    const doneState = { ...state, pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))) };
    expect(checkForWin(doneState)).toBe('partial-victory');
  });

  it('declares complete victory when both pyramid and deck are cleared', () => {
    const state = startGame(1);
    const fullyCleared = {
      ...state,
      pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))),
      drawPile: [],
      discardPile: [],
    };
    expect(checkForWin(fullyCleared)).toBe('complete-victory');
  });

  it('loss detection for finite-redraw exhaustion - checkForWin returns pyramid-collapse when draw pile is empty, redraws are 0, and no moves available', () => {
    const state = startGame(0);
    const noMovesState = {
      ...state,
      drawPile: [],
      discardPile: [],
      pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, rank: 2 as const }))), // All 2s, no pairs sum to 13, no Kings
    };
    expect(checkForWin(noMovesState)).toBe('pyramid-collapse');
  });

  it('infinite-redraw deadlock loss - construct state with no valid moves across visible pyramid and full discard, draw pile empty, redraws null, verify checkForWin returns pyramid-collapse', () => {
    const state = startGame(null);
    const deadlockState = {
      ...state,
      drawPile: [],
      discardPile: state.discardPile.map((card) => ({ ...card, rank: 2 as const })), // All 2s in discard
      pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, rank: 2 as const }))), // All 2s in pyramid
    };
    expect(checkForWin(deadlockState)).toBe('pyramid-collapse');
  });

  it('drawCard moves top card to discard without decrementing redrawsRemaining', () => {
    const state = initializeGame(3);
    const after = drawCard(state);
    expect(after.drawPile.length).toBe(state.drawPile.length - 1);
    expect(after.discardPile.length).toBe(1);
    expect(after.redrawsRemaining).toBe(3);
  });

  it('cyclePile moves discard to draw pile and decrements finite redrawsRemaining', () => {
    const state = initializeGame(2);
    let current = state;
    for (let i = 0; i < state.drawPile.length; i += 1) {
      current = drawCard(current);
    }
    expect(current.drawPile.length).toBe(0);
    expect(current.discardPile.length).toBe(24);
    const cycled = cyclePile(current);
    expect(cycled.drawPile.length).toBe(24);
    expect(cycled.discardPile.length).toBe(0);
    expect(cycled.redrawsRemaining).toBe(1);
  });

  it('cyclePile with redrawsRemaining === null leaves counter as null', () => {
    const state = initializeGame(null);
    let current = state;
    for (let i = 0; i < state.drawPile.length; i += 1) {
      current = drawCard(current);
    }
    expect(current.drawPile.length).toBe(0);
    expect(current.discardPile.length).toBe(24);
    const cycled = cyclePile(current);
    expect(cycled.drawPile.length).toBe(24);
    expect(cycled.discardPile.length).toBe(0);
    expect(cycled.redrawsRemaining).toBeNull();
  });

  it('cyclePile with redrawsRemaining === 0 returns state unchanged', () => {
    const state = initializeGame(0);
    let current = state;
    for (let i = 0; i < state.drawPile.length; i += 1) {
      current = drawCard(current);
    }
    expect(current.drawPile.length).toBe(0);
    expect(current.discardPile.length).toBe(24);
    const cycled = cyclePile(current);
    expect(cycled.drawPile.length).toBe(0);
    expect(cycled.discardPile.length).toBe(24);
    expect(cycled.redrawsRemaining).toBe(0);
  });

  it('lone King removal from pyramid via playCard', () => {
    const state = createDeterministicGameState(1);
    const visible = visibleCards(state.pyramid);
    const king = visible.find((card) => card.rank === 13);
    expect(king).toBeDefined();

    const result = playCard(state, king!.id);
    const kingState = result.pyramid.flat().find((c) => c.id === king!.id);
    expect(kingState?.removed).toBe(true);
  });

  it('resigning ends the game as a pyramid collapse', () => {
    const state = startGame(null);
    expect(state.status).toBe('in-progress');
    const resigned = resignGame(state);
    expect(resigned.status).toBe('pyramid-collapse');
  });

  it('correctly tracks removed cards count and IDs', () => {
    const state = createDeterministicGameState(1);
    expect(getRemovedCardIds(state).size).toBe(0);
    expect(getRemovedCardsCount(state)).toEqual({ count: 0, total: 52, percentage: 0 });

    const visible = visibleCards(state.pyramid);
    const king = visible.find((card) => card.rank === 13);
    expect(king).toBeDefined();

    const afterKing = playCard(state, king!.id);
    expect(getRemovedCardIds(afterKing).has(king!.id)).toBe(true);
    expect(getRemovedCardsCount(afterKing)).toEqual({ count: 1, total: 52, percentage: 2 });
  });

  it('computes active rank counts and remaining pair stats', () => {
    const state = createDeterministicGameState(1);
    const rankCounts = getActiveRankCounts(state);
    for (let r = 1; r <= 13; r += 1) {
      expect(rankCounts[r as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13]).toBe(4);
    }

    const pairStats = getRemainingPairStats(state);
    expect(pairStats).toHaveLength(7);
    expect(pairStats[0]).toEqual({
      label: 'Kings (13)',
      rank1: 13,
      rank1Label: 'K',
      active1: 4,
      remainingPairs: 4,
    });
    expect(pairStats[1]).toEqual({
      label: 'Q + A',
      rank1: 12,
      rank1Label: 'Q',
      active1: 4,
      rank2: 1,
      rank2Label: 'A',
      active2: 4,
      remainingPairs: 4,
    });
  });
});

