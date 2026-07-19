import { describe, expect, it } from 'vitest';
import type { GameState } from './game';
import {
  canAnyMove,
  checkForWin,
  createDeck,
  dealPyramid,
  initializeGame,
  isBlocked,
  playCard,
  redraw,
  startGame,
  visibleCards,
} from './game';

function createDeterministicGameState(winCondition: 'pyramid-only' | 'complete-victory', redraws: number | null): GameState {
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
    winCondition,
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
    const state = initializeGame('pyramid-only', 2);
    const after = redraw(state);
    expect(after.drawPile.length).toBe(state.drawPile.length - 1);
    expect(after.discardPile.length).toBe(1);
    expect(after.redrawsRemaining).toBe(2);
  });

  it('allows multiple redraw draws when redraw limit is 2', () => {
    const state = initializeGame('pyramid-only', 2);
    const afterFirst = redraw(state);
    const afterSecond = redraw(afterFirst);
    expect(afterSecond.drawPile.length).toBe(state.drawPile.length - 2);
    expect(afterSecond.discardPile.length).toBe(2);
    expect(afterSecond.redrawsRemaining).toBe(2);
  });

  it('resets the discard pile back into draw pile after cycling', () => {
    const state = initializeGame('pyramid-only', 1);
    let current = state;
    for (let i = 0; i < state.drawPile.length; i += 1) {
      current = redraw(current);
    }
    expect(current.drawPile.length).toBe(0);
    expect(current.discardPile.length).toBe(24);
    const cycled = redraw(current);
    expect(cycled.drawPile.length).toBe(24);
    expect(cycled.discardPile.length).toBe(0);
    expect(cycled.redrawsRemaining).toBe(0);
  });

  it('allows selecting the top discard card after redraw', () => {
    const state = initializeGame('pyramid-only', 1);
    const afterRedraw = redraw(state);
    const topDiscard = afterRedraw.discardPile[0];
    const nextState = playCard(afterRedraw, topDiscard.id);
    expect(nextState.selectedCardId).toBe(topDiscard.id);
  });

  it('removes discard card when used with a visible pyramid pair', () => {
    const state = createDeterministicGameState('pyramid-only', 1);
    const afterRedraw = redraw(state);
    const topDiscard = afterRedraw.discardPile[0];
    const visible = visibleCards(afterRedraw.pyramid);
    const match = visible.find((card) => card.rank + topDiscard.rank === 13);
    expect(match).toBeDefined();

    const selected = playCard(afterRedraw, topDiscard.id);
    const result = playCard(selected, match!.id);
    expect(result.discardPile.some((card) => card.id === topDiscard.id)).toBe(false);
  });

  it('does not win complete victory until draw and discard are also cleared', () => {
    const state = startGame('complete-victory', 1);
    const doneState = { ...state, pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))) };
    expect(checkForWin(doneState)).toBe('in-progress');
  });

  it('considers pyramid-only win only when pyramid is cleared', () => {
    const state = startGame('pyramid-only', 0);
    const blockedPyramid = { ...state, pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))) };
    expect(checkForWin(blockedPyramid)).toBe('won');

    const partialPyramid = { ...state, pyramid: state.pyramid.map((row, rowIndex) => row.map((card, cardIndex) => (rowIndex === 6 && cardIndex === 0 ? { ...card, removed: false } : { ...card, removed: true }))) };
    expect(checkForWin(partialPyramid)).toBe('in-progress');
  });

  it('requires complete victory to clear both pyramid and draw/discard piles', () => {
    const state = startGame('complete-victory', 1);
    const pyramidCleared = { ...state, pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))) };
    expect(checkForWin(pyramidCleared)).toBe('in-progress');

    const fullyCleared = { ...pyramidCleared, drawPile: [], discardPile: [] };
    expect(checkForWin(fullyCleared)).toBe('won');
  });
});
