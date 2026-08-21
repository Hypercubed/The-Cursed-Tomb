import { describe, expect, it } from 'vitest';
import type { GameState, CursedCard, Card, Suit, Rank } from './game';
import {
  canAnyMove,
  canRemovePair,
  canRemoveSingle,
  checkForWin,
  createCampaign,
  computeRoundLifecycleEffects,
  createDeck,
  cyclePile,
  dealPyramid,
  discardStockCard,
  drawCard,
  getActiveRankCounts,
  getFunctionalValue,
  determineHeroAndAnchor,
  getRemainingPairStats,
  getRemovedCardIds,
  getRemovedCardsCount,
  applyEndOfWeekLifecycle,
  advanceCampaignRound,
  initializeGame,
  isBlocked,
  isPyramidCleared,
  movePyramidToVault,
  moveStockToVault,
  playCard,
  removePair,
  resignGame,
  startGame,
  updateRedCurseFaceDownState,
  visibleCards,
} from './game';
import { forceWin } from './solver';

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
    mode: 'standard',
    vaultCards: [],
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
    expect(cycled.drawPile[0].faceDown).toBe(false);
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

  it('allows continued play when pyramid is cleared but deck has playable cards/redeals remaining', () => {
    const state = startGame(1);
    const doneState = { ...state, pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))) };
    expect(isPyramidCleared(doneState)).toBe(true);
    expect(checkForWin(doneState)).toBe('in-progress');
  });

  it('declares partial victory when pyramid is cleared and no moves/draws/redeals remain', () => {
    const state = startGame(0);
    const exhaustedState: GameState = {
      ...state,
      pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))),
      drawPile: [],
      discardPile: [{ id: 'S2', suit: '♠', rank: 2, removed: false, selected: false, attritionStage: 0, rewardStage: 0, blessed: false }],
      redrawsRemaining: 0,
    };
    expect(isPyramidCleared(exhaustedState)).toBe(true);
    expect(checkForWin(exhaustedState)).toBe('partial-victory');
  });

  it('resignGame returns partial-victory if pyramid is cleared', () => {
    const state = startGame(1);
    const clearedState = { ...state, pyramid: state.pyramid.map((row) => row.map((card) => ({ ...card, removed: true }))) };
    expect(resignGame(clearedState).status).toBe('partial-victory');
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

  it('cyclePile preserves original card order so that each cycle passes through cards in the same order', () => {
    const state = initializeGame(2);
    const initialOrder = state.drawPile.map((c) => c.id);
    let current = state;
    for (let i = 0; i < state.drawPile.length; i += 1) {
      current = drawCard(current);
    }
    const cycled = cyclePile(current);
    const cycledOrder = cycled.drawPile.map((c) => c.id);
    expect(cycledOrder).toEqual(initialOrder);
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

describe('Cursed Tomb campaign mechanics', () => {
  it('calculates functional value based on scars and game mode', () => {
    const redQueen = { id: '♥12', suit: '♥' as const, rank: 12 as const, removed: false, selected: false, attritionStage: 3 as const, rewardStage: 0 as const, blessed: false };
    const blackTen = { id: '♠10', suit: '♠' as const, rank: 10 as const, removed: false, selected: false, attritionStage: 3 as const, rewardStage: 0 as const, blessed: false };
    const normalFive = { id: '♦5', suit: '♦' as const, rank: 5 as const, removed: false, selected: false, attritionStage: 1 as const, rewardStage: 0 as const, blessed: false };

    // Standard mode ignores scars
    expect(getFunctionalValue(redQueen, 'standard')).toBe(12);
    expect(getFunctionalValue(blackTen, 'standard')).toBe(10);

    // Cursed tomb mode applies scar shifts
    expect(getFunctionalValue(redQueen, 'cursed-tomb')).toBe(13); // +1 Red Scar
    expect(getFunctionalValue(blackTen, 'cursed-tomb')).toBe(9);  // -1 Black Scar
    expect(getFunctionalValue(normalFive, 'cursed-tomb')).toBe(5);

    // Circular modulo wrapping between 1 and 13
    const blackAceScarred = { id: '♠1', suit: '♠' as const, rank: 1 as const, removed: false, selected: false, attritionStage: 3 as const, rewardStage: 0 as const, blessed: false };
    const redKingScarred = { id: '♥13', suit: '♥' as const, rank: 13 as const, removed: false, selected: false, attritionStage: 3 as const, rewardStage: 0 as const, blessed: false };
    const normalQueen = { id: '♦12', suit: '♦' as const, rank: 12 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };

    expect(getFunctionalValue(blackAceScarred, 'cursed-tomb')).toBe(13); // 1 - 1 wraps to 13
    expect(getFunctionalValue(redKingScarred, 'cursed-tomb')).toBe(1);   // 13 + 1 wraps to 1

    // Black Ace -1 wraps to 13 (clears solo as a King)
    expect(canRemoveSingle(blackAceScarred, 'cursed-tomb')).toBe(true);
    // Red King +1 wraps to 1 (pairs with Queen 12)
    expect(canRemovePair(redKingScarred, normalQueen, 'cursed-tomb')).toBe(true);
  });

  it('allows solo King removal for Red Scarred Queen (Functional Value 13)', () => {
    const redQueen = { id: '♥12', suit: '♥' as const, rank: 12 as const, removed: false, selected: false, attritionStage: 4 as const, rewardStage: 0 as const, blessed: false };
    expect(canRemoveSingle(redQueen, 'cursed-tomb')).toBe(true);
  });

  it('treats Clubs Hero cards as Universal Wildcards matching any exposed card', () => {
    const clubsHero = { id: '♣5', suit: '♣' as const, rank: 5 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: true };
    const randomCard = { id: '♦4', suit: '♦' as const, rank: 4 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };
    expect(canRemovePair(clubsHero, randomCard, 'cursed-tomb')).toBe(true);
  });

  it('allows Black Cursed cards to pair with Stock, Waste, or Vault, and shuffles partner into Stock', () => {
    const blackCurseTen = { id: '♠10', suit: '♠' as const, rank: 10 as const, removed: false, selected: false, attritionStage: 4 as const, rewardStage: 0 as const, blessed: false };
    const partnerFour = { id: '♦4', suit: '♦' as const, rank: 4 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };

    // Pyramid to Pyramid pairing is allowed
    expect(canRemovePair(blackCurseTen, partnerFour, 'cursed-tomb', 'pyramid', 'pyramid')).toBe(true);
    // Pyramid to Waste pairing is also allowed now
    expect(canRemovePair(blackCurseTen, partnerFour, 'cursed-tomb', 'discard', 'pyramid')).toBe(true);

    let game = startGame(1, 'cursed-tomb');
    const replacedId = game.pyramid[6][0].id;
    const existingCardId = '♠10';
    game.pyramid[6][0] = { ...blackCurseTen, id: existingCardId };
    game.drawPile = game.drawPile.filter((c) => c.id !== '♦4' && c.id !== existingCardId).map((c) => (c.id === existingCardId ? { ...c, id: replacedId } : c));
    game.pyramid = game.pyramid.map((row, r) =>
      row.map((c, col) => (r === 6 && col === 0 ? c : c.id === '♦4' || c.id === existingCardId ? { ...c, id: `dummy_${c.id}` } : c))
    );
    game.discardPile = [{ ...partnerFour }];
    
    game = playCard(game, '♦4');
    expect(game.selectedCardId).toBe('♦4');

    const nextGame = playCard(game, existingCardId);
    // Partner card (♦4) should now be in drawPile, faceDown, removed: false
    const recycledCardInDraw = nextGame.drawPile.find((c) => c.id === '♦4');
    expect(recycledCardInDraw).toBeDefined();
    expect(recycledCardInDraw?.faceDown).toBe(false);
    expect(recycledCardInDraw?.removed).toBe(false);
    expect(nextGame.discardPile.find((c) => c.id === '♦4')).toBeUndefined();
  });

  it('resolves dual Black Curse pairing by moving the higher value card to Foundation and reshuffling lower to Stock', () => {
    const blackTen = { id: '♠10', suit: '♠' as const, rank: 10 as const, removed: false, selected: false, attritionStage: 4 as const, rewardStage: 0 as const, blessed: false }; // fVal = 9
    const blackFive = { id: '♣5', suit: '♣' as const, rank: 5 as const, removed: false, selected: false, attritionStage: 3 as const, rewardStage: 0 as const, blessed: false }; // fVal = 4

    expect(canRemovePair(blackTen, blackFive, 'cursed-tomb', 'pyramid', 'pyramid')).toBe(true);

    let game = startGame(1, 'cursed-tomb');
    const id1 = game.pyramid[6][0].id;
    const id2 = game.pyramid[6][1].id;
    game.pyramid = game.pyramid.map((row, r) =>
      row.map((c, col) => {
        if (r === 6 && col === 0) return { ...blackTen, id: id1 };
        if (r === 6 && col === 1) return { ...blackFive, id: id2 };
        return c;
      })
    );
    game.drawPile = game.drawPile.filter((c) => c.id !== id1 && c.id !== id2);

    game = playCard(game, id1);
    expect(game.selectedCardId).toBe(id1);

    const nextGame = playCard(game, id2);

    // Higher card (♠10 / id1, fVal 9) should move to Foundation (not in drawPile, marked removed in pyramid)
    expect(nextGame.drawPile.some((c) => c.id === id1)).toBe(false);
    expect(nextGame.pyramid[6][0].removed).toBe(true);

    // Lower card (♣5 / id2, fVal 4) should be reshuffled into drawPile with removed: false
    const recycledInDraw = nextGame.drawPile.find((c) => c.id === id2);
    expect(recycledInDraw).toBeDefined();
    expect(recycledInDraw?.removed).toBe(false);
    expect(recycledInDraw?.faceDown).toBe(false);
  });

  it('triggers Spades Tunnel targeting mode to move an exposed pyramid card to Waste', () => {
    let game = startGame(1, 'cursed-tomb');
    const spadesHero = { id: '♠8', suit: '♠' as const, rank: 8 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: true };
    const partnerFive = { id: '♦5', suit: '♦' as const, rank: 5 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };

    const heroId = game.pyramid[6][0].id;
    const partnerId = game.pyramid[6][1].id;
    const targetExposedId = game.pyramid[6][2].id;

    game.pyramid[6][0] = { ...spadesHero, id: heroId };
    game.pyramid[6][1] = { ...partnerFive, id: partnerId };

    // Select partner and pair with Spades Hero
    game = playCard(game, partnerId);
    game = playCard(game, heroId);

    // Spades Tunnel should activate targeting-spades mode
    expect(game.interactionMode).toBe('targeting-spades');

    // Click exposed card to move it to Waste
    const afterTarget = playCard(game, targetExposedId);
    expect(afterTarget.interactionMode).toBe('normal');
    expect(afterTarget.discardPile[0].id).toBe(targetExposedId);
  });

  it('applies Attrition Phase to exposed pyramid bottlenecks on collapse', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    campaign.currentRound.status = 'pyramid-collapse';

    const updated = applyEndOfWeekLifecycle(campaign);
    const exposedCards = visibleCards(campaign.currentRound.pyramid);
    expect(exposedCards.length).toBeGreaterThan(0);

    const firstExposed = exposedCards[0];
    const updatedCard = updated.masterDeck.find((c: CursedCard) => c.id === firstExposed.id);
    expect(updatedCard?.attritionStage).toBe(1);
  });

  it('ensures applyEndOfWeekLifecycle and advanceCampaignRound apply attrition exactly once per failed round', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    campaign.currentRound.status = 'pyramid-collapse';

    const exposedCards = visibleCards(campaign.currentRound.pyramid);
    const targetCardId = exposedCards[0].id;

    // 1st call: when game ends, UI updates campaign state
    const processedCampaign = applyEndOfWeekLifecycle(campaign);
    const cardAfterFirst = processedCampaign.masterDeck.find((c: CursedCard) => c.id === targetCardId);
    expect(cardAfterFirst?.attritionStage).toBe(1);

    // 2nd call: when user advances to next round
    const nextRoundCampaign = advanceCampaignRound(processedCampaign);
    const cardAfterAdvance = nextRoundCampaign.masterDeck.find((c: CursedCard) => c.id === targetCardId);
    expect(cardAfterAdvance?.attritionStage).toBe(1);
    expect(nextRoundCampaign.roundNumber).toBe(2);
  });

  it('applies Reward Phase to cleared final pair', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    const cardHigh = { id: '♥8', suit: '♥' as const, rank: 8 as const, removed: true, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };
    const cardLow = { id: '♦5', suit: '♦' as const, rank: 5 as const, removed: true, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };

    campaign.currentRound.status = 'partial-victory';
    campaign.currentRound.lastClearedPair = [cardHigh, cardLow];

    const updated = applyEndOfWeekLifecycle(campaign);
    const updatedHigh = updated.masterDeck.find((c: CursedCard) => c.id === cardHigh.id);
    // Blessing with fallback: higher gets blessed; lower gets 1B+1A Anchor (The Descent)
    expect(updatedHigh?.blessed).toBe(true);
    // Lower automatically Anchored (1B+1A); post-pyramid Stock cards both get Anchored in The Descent
    const anchored = updated.masterDeck.filter((c) => c.rewardStage > 0);
    expect(anchored.length).toBeGreaterThanOrEqual(1);
    expect(anchored.length).toBeLessThanOrEqual(3);
  });

  it('allows active cards at all stages (including Stage 3+ Scarred/Cursed) to receive Anchor rewards until entombed', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    const cardHigh = campaign.masterDeck.find((c) => c.rank === 10)!; // 10
    const cardLowStage1 = campaign.masterDeck.find((c) => c.rank === 2 && c.suit === '♥')!; // 2 of Hearts
    cardLowStage1.attritionStage = 1;

    const beforeDeck1 = campaign.masterDeck.map((c) => ({ ...c }));
    campaign.currentRound.status = 'partial-victory';
    campaign.currentRound.lastClearedPair = [cardHigh, cardLowStage1];

    const updatedStage1 = applyEndOfWeekLifecycle(campaign);
    // The Descent: lower Anchor + both cards per post-pyramid pair. Verify lower got anchored.
    const anchored1 = updatedStage1.masterDeck.filter((c) => !beforeDeck1.find((b) => b.id === c.id && b.rewardStage === c.rewardStage) && c.rewardStage > 0);
    expect(anchored1.length).toBeGreaterThanOrEqual(1);

    const effects1 = computeRoundLifecycleEffects(beforeDeck1, updatedStage1.masterDeck, campaign.currentRound);
    expect(effects1.clearDetails?.anchorBlockedByScar).toBe(false);

    // Now test Stage 3 card (Scarred) - should also allow Anchors via The Descent (lower) even at 3 Scars
    const campaignStage3 = createCampaign('cursed-tomb', 1);
    const cardHigh3 = campaignStage3.masterDeck.find((c) => c.rank === 10)!;
    const cardLowStage3 = campaignStage3.masterDeck.find((c) => c.rank === 2 && c.suit === '♥')!;
    cardLowStage3.attritionStage = 3;

    const beforeDeck3 = campaignStage3.masterDeck.map((c) => ({ ...c }));
    campaignStage3.currentRound.status = 'partial-victory';
    campaignStage3.currentRound.lastClearedPair = [cardHigh3, cardLowStage3];

    const updatedStage3 = applyEndOfWeekLifecycle(campaignStage3);
    const anchored3 = updatedStage3.masterDeck.filter((c) => !beforeDeck3.find((b) => b.id === c.id && b.rewardStage === c.rewardStage) && c.rewardStage > 0);
    expect(anchored3.length).toBeGreaterThanOrEqual(1); // Still Anchors at 3 Scars via 1B+1A lower

    const effects3 = computeRoundLifecycleEffects(beforeDeck3, updatedStage3.masterDeck, campaignStage3.currentRound);
    expect(effects3.clearDetails?.anchorBlockedByScar).toBe(false);
  });

  it('applies Hero Blessing and Anchor Reward when forceWin is called in campaign mode', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    campaign.currentRound.pyramid[0][0] = { ...campaign.currentRound.pyramid[0][0], rank: 7, suit: '♠', attritionStage: 0 };
    campaign.currentRound.pyramid[6][0] = { ...campaign.currentRound.pyramid[6][0], rank: 6, suit: '♦', attritionStage: 0 };
    campaign.currentRound = forceWin(campaign.currentRound, true);

    const updated = applyEndOfWeekLifecycle(campaign);
    const blessedCard = updated.masterDeck.find((c: CursedCard) => c.blessed);
    expect(blessedCard).toBeDefined();
    const rewardedCard = updated.masterDeck.find((c: CursedCard) => c.rewardStage > 0);
    expect(rewardedCard).toBeDefined();
  });

  it('assigns existing Wildcard in final pair as Anchor and partner as Hero candidate', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    const wildcard = campaign.masterDeck.find((c) => c.suit === '♣' && c.rank === 3)!;
    wildcard.blessed = true; // Sun Cross Universal Wildcard
    const partner = campaign.masterDeck.find((c) => c.suit === '♥' && c.rank === 2)!;

    // determineHeroAndAnchor is retained for legacy; Wildcard Blessing fallback: higher non-wild gets Blessing, lower wildcard is fallback only
    const pairResult = determineHeroAndAnchor(wildcard, partner, 'cursed-tomb');
    expect(pairResult.heroCard.id).toBe(partner.id);
    expect(pairResult.anchorCard.id).toBe(wildcard.id);

    // applyEndOfWeekLifecycle check: Wildcard is ineligible as primary (blessed), but partner should get Blessing; Anchor via 1B+1A lower
    campaign.currentRound.status = 'partial-victory';
    campaign.currentRound.lastClearedPair = [wildcard, partner];

    const updated = applyEndOfWeekLifecycle(campaign);
    const updatedPartner = updated.masterDeck.find((c: CursedCard) => c.id === partner.id);

    expect(updatedPartner?.blessed).toBe(true); // Partner becomes Blessed Hero (fallback from wildcard primary)
    // Wildcard: lower partner Anchored (1B+1A); post-pyramid both if cleared
    const anchored = updated.masterDeck.filter((c) => c.rewardStage > 0);
    expect(anchored.length).toBeGreaterThanOrEqual(1);
  });

  it('offers Blessing fallback to lower card when higher is already blessed', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    const cardHigh = campaign.masterDeck.find((c) => c.rank === 8)!;
    const cardLow = campaign.masterDeck.find((c) => c.rank === 5)!;
    // Make higher already blessed so fallback should bless lower
    cardHigh.blessed = true;
    cardHigh.attritionStage = 0;
    cardLow.attritionStage = 0;
    cardLow.blessed = false;

    campaign.currentRound.status = 'partial-victory';
    campaign.currentRound.lastClearedPair = [
      { ...cardHigh, removed: true, selected: false },
      { ...cardLow, removed: true, selected: false },
    ];

    const updated = applyEndOfWeekLifecycle(campaign);
    const updatedLow = updated.masterDeck.find((c) => c.id === cardLow.id);
    const updatedHigh = updated.masterDeck.find((c) => c.id === cardHigh.id);
    expect(updatedLow?.blessed).toBe(true);
    expect(updatedHigh?.blessed).toBe(true); // stays blessed
  });

  it('grants Anchor on solo King clear (no Blessing) — 1B+1A lower', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    const kCard = campaign.masterDeck.find((c) => c.rank === 13)!;
    kCard.attritionStage = 0;
    const beforeAnchored = campaign.masterDeck.filter((c) => c.rewardStage >= 1).length;

    campaign.currentRound.status = 'partial-victory';
    campaign.currentRound.lastClearedPair = [{ ...kCard, removed: true, selected: false }];
    campaign.currentRound.drawPile = []; // force Stock piles empty for solo 1B+1A
    campaign.currentRound.discardPile = [];
    campaign.currentRound.vaultCards = [];

    const updated = applyEndOfWeekLifecycle(campaign);
    // Solo gives no Blessing but still 1 Anchor (1B+1A) + post both if cleared
    expect(updated.masterDeck.find((c) => c.id === kCard.id)?.blessed).toBe(false);
    const afterAnchored = updated.masterDeck.filter((c) => c.rewardStage >= 1).length;
    expect(afterAnchored).toBeGreaterThanOrEqual(beforeAnchored + 1);
    expect(afterAnchored).toBeLessThanOrEqual(beforeAnchored + 3);
  });

  it('triggers Starvation defeat when fewer than 28 active cards remain', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    // Entomb 25 cards so only 27 active cards remain
    for (let i = 0; i < 25; i += 1) {
      campaign.masterDeck[i].attritionStage = 5;
    }

    const updated = applyEndOfWeekLifecycle(campaign);
    expect(updated.status).toBe('defeat');
    expect(updated.defeatReason).toBe('starvation');
  });

  it('allows campaign to continue past Perfect Win with achievements updated', () => {
    const campaign = createCampaign('cursed-tomb', 1);
    campaign.currentRound.status = 'complete-victory';

    const updated = applyEndOfWeekLifecycle(campaign);
    expect(updated.status).toBe('active');
    expect(updated.achievements.perfectWins).toBe(1);
    expect(updated.achievements.pyramidsCleared).toBe(1);
    expect(updated.achievements.roundsSurvived).toBe(1);
    expect(updated.achievements.unlockedBadges).toContain('Perfect Win');
  });

  it('locks next lower row cards face-down when parent has Red Curse and reveals them when exposed', () => {
    const deck = createDeck();
    const pyramid = dealPyramid(deck);
    // Mark row 4 card (index 0) as Red Curse (Stage 4, Hearts)
    pyramid[4][0].attritionStage = 4;
    pyramid[4][0].suit = '♥';

    const lockedPyramid = updateRedCurseFaceDownState(pyramid, 'cursed-tomb');
    // Card at row 5 index 0 should be locked face-down while covered by row 6
    expect(lockedPyramid[5][0].faceDown).toBe(true);

    // Remove row 6 cards covering row 5 index 0
    lockedPyramid[6][0].removed = true;
    lockedPyramid[6][1].removed = true;
    const unlockedPyramid = updateRedCurseFaceDownState(lockedPyramid, 'cursed-tomb');
    // Once exposed (playable), card at row 5 index 0 flips face-up
    expect(unlockedPyramid[5][0].faceDown).toBe(false);
  });

  describe('movePyramidToVault', () => {
    it('moves an exposed Blessed Diamond card from the pyramid to the vault', () => {
      const state = createDeterministicGameState(2);
      // Row 6 index 0 is exposed at the bottom of the pyramid
      const exposedCard = state.pyramid[6][0];
      exposedCard.blessed = true;
      exposedCard.suit = '♦';

      const nextState = movePyramidToVault(state, exposedCard.id);
      expect(nextState.vaultCards).toEqual([exposedCard]);
      expect(nextState.pyramid[6][0].removed).toBe(true);
    });

    it('rejects moving blocked cards or non-diamond / unblessed cards to vault', () => {
      const state = createDeterministicGameState(2);
      // Row 0 index 0 is blocked by lower rows
      const blockedCard = state.pyramid[0][0];
      blockedCard.blessed = true;
      blockedCard.suit = '♦';

      const stateBlocked = movePyramidToVault(state, blockedCard.id);
      expect(stateBlocked.vaultCards).toEqual([]);

      // Exposed card but unblessed
      const exposedCard = state.pyramid[6][1];
      exposedCard.blessed = false;
      exposedCard.suit = '♦';
      const stateUnblessed = movePyramidToVault(state, exposedCard.id);
      expect(stateUnblessed.vaultCards).toEqual([]);
    });

    it('stacks multiple Blessed Diamond cards and pops them in FILO order', () => {
      const state = createDeterministicGameState(2);
      const first = state.pyramid[6][0];
      first.rank = 4;
      first.blessed = true;
      first.suit = '♦';
      const afterFirst = movePyramidToVault(state, first.id);

      const second = afterFirst.pyramid[6][1];
      second.rank = 5;
      second.blessed = true;
      second.suit = '♦';
      const stacked = movePyramidToVault(afterFirst, second.id);

      expect(stacked.vaultCards.map((card) => card.id)).toEqual([first.id, second.id]);
      expect(stacked.vaultCards[stacked.vaultCards.length - 1].id).toBe(second.id);

      const partner = { ...stacked.pyramid[6][2], rank: 8 as Rank };
      stacked.pyramid[6][2] = partner;
      const firstClick = playCard(stacked, second.id);
      const popped = playCard(firstClick, partner.id);
      expect(popped.vaultCards.map((card) => card.id)).toEqual([first.id]);
    });

    it('only considers the top Vault card when checking move availability', () => {
      const state = createDeterministicGameState(0);
      state.pyramid = state.pyramid.map((row) => row.map((card) => ({ ...card, rank: 1 as const })));
      state.drawPile = [];
      state.discardPile = [];
      state.vaultCards = [
        { ...state.pyramid[6][0], id: 'vault-bottom', rank: 12 as const },
        { ...state.pyramid[6][1], id: 'vault-top', rank: 1 as const },
      ];

      expect(canAnyMove(state)).toBe(false);
      expect(canAnyMove({ ...state, vaultCards: [state.vaultCards[0], { ...state.vaultCards[1], rank: 13 as const }] })).toBe(true);
    });

    it('allows adding to a non-empty vault and keeps the existing card when the move is rejected', () => {
      const state = createDeterministicGameState(2);
      state.vaultCards = [{ ...state.pyramid[6][2] }];
      const exposedCard = state.pyramid[6][0];
      exposedCard.blessed = true;
      exposedCard.suit = '♣';

      const nextState = movePyramidToVault(state, exposedCard.id);
      expect(nextState.vaultCards).toEqual(state.vaultCards);
      expect(nextState.pyramid[6][0].removed).toBe(false);
    });
  });

  describe('playCard discard King clearing', () => {
    it('resets selectedCardId to null when single-clearing a King from the discard pile', () => {
      const state = startGame(1);
      const kingCard: Card = {
        id: 'test-discard-king-13',
        suit: '♠',
        rank: 13,
        removed: false,
        selected: false,
        attritionStage: 0,
        rewardStage: 0,
        blessed: false,
        faceDown: false,
      };
      const stateWithKing: GameState = {
        ...state,
        discardPile: [kingCard, ...state.discardPile],
        selectedCardId: state.pyramid[6][0].id,
      };

      const nextState = playCard(stateWithKing, kingCard.id);
      expect(nextState.discardPile.some((c) => c.id === kingCard.id)).toBe(false);
      expect(nextState.selectedCardId).toBeNull();
    });
  });

  describe('Stock-to-Waste in-flight pairing and discard', () => {
    it('allows pairing top Stock card with an exposed Pyramid card', () => {
      const state = createDeterministicGameState(1);
      const topStock = state.drawPile[0];
      topStock.rank = 5;

      const exposedPyramid = state.pyramid[6][0];
      exposedPyramid.rank = 8;

      let nextState = playCard(state, topStock.id);
      expect(nextState.selectedCardId).toBe(topStock.id);

      nextState = playCard(nextState, exposedPyramid.id);
      expect(nextState.drawPile.some((c) => c.id === topStock.id)).toBe(false);
      expect(nextState.pyramid[6][0].removed).toBe(true);
      expect(nextState.selectedCardId).toBeNull();
    });

    it('allows pairing top Stock card with top Waste card', () => {
      const state = createDeterministicGameState(1);
      const withWaste = discardStockCard(state);
      const topWaste = withWaste.discardPile[0];
      topWaste.rank = 4;

      const topStock = withWaste.drawPile[0];
      topStock.rank = 9;

      let nextState = playCard(withWaste, topStock.id);
      expect(nextState.selectedCardId).toBe(topStock.id);

      nextState = playCard(nextState, topWaste.id);
      expect(nextState.drawPile.some((c) => c.id === topStock.id)).toBe(false);
      expect(nextState.discardPile.some((c) => c.id === topWaste.id)).toBe(false);
      expect(nextState.selectedCardId).toBeNull();
    });

    it('clears single King directly from top Stock card', () => {
      const state = createDeterministicGameState(1);
      const topStock = state.drawPile[0];
      topStock.rank = 13;

      const nextState = playCard(state, topStock.id);
      expect(nextState.drawPile.some((c) => c.id === topStock.id)).toBe(false);
      expect(nextState.selectedCardId).toBeNull();
    });

    it('moves top Stock card to Waste when discardStockCard is called', () => {
      const state = createDeterministicGameState(1);
      const topStock = state.drawPile[0];

      const nextState = discardStockCard(state);
      expect(nextState.drawPile.some((c) => c.id === topStock.id)).toBe(false);
      expect(nextState.discardPile[0].id).toBe(topStock.id);
    });
  });

  describe('Blessing and Curse mutual exclusivity', () => {
    it('skips Blessing award if hero card has attritionStage === 4 (Cursed)', () => {
      const campaign = createCampaign('cursed-tomb', 1);
      campaign.currentRound.status = 'complete-victory';
      // Setup masterDeck[0] as Cursed (Stage 4) and masterDeck[1] as non-cursed
      campaign.masterDeck[0].attritionStage = 4;
      campaign.masterDeck[0].rank = 10;
      campaign.masterDeck[0].suit = '♥';
      campaign.masterDeck[0].blessed = false;

      campaign.masterDeck[1].attritionStage = 0;
      campaign.masterDeck[1].rank = 3;
      campaign.masterDeck[1].suit = '♠';
      campaign.masterDeck[1].blessed = false;

      campaign.currentRound.lastClearedPair = [campaign.masterDeck[0], campaign.masterDeck[1]];

      const updated = applyEndOfWeekLifecycle(campaign);
      const updatedHero = updated.masterDeck.find((c) => c.id === campaign.masterDeck[0].id);
      expect(updatedHero?.blessed).toBe(false);
    });

    it('suppresses Red Curse face-down lock on Stage 4 Blessed cards', () => {
      const deck = createDeck();
      const pyramid = dealPyramid(deck);
      // Mark row 4 card (index 0) as Blessed and Stage 4 Attrition
      pyramid[4][0].attritionStage = 4;
      pyramid[4][0].suit = '♥';
      pyramid[4][0].blessed = true;

      const lockedPyramid = updateRedCurseFaceDownState(pyramid, 'cursed-tomb');
      // Card at row 5 index 0 should NOT be locked face-down because parent is Blessed
      expect(lockedPyramid[5][0].faceDown).toBe(false);
    });

    it('suppresses Black Curse partner reshuffle on Stage 4 Blessed cards', () => {
      const state = createDeterministicGameState(1);
      const card1: Card = { ...state.pyramid[6][0], suit: '♠', rank: 6, attritionStage: 4, blessed: true };
      const card2: Card = { ...state.pyramid[6][1], suit: '♦', rank: 7, attritionStage: 0, blessed: false };

      const nextState = removePair(state, card1, card2);
      // Partner card2 should NOT be reshuffled into drawPile because card1 is Blessed
      expect(nextState.drawPile.some((c: Card) => c.id === card2.id)).toBe(false);
    });
  });

  describe('Expedition Mode functional pair statistics', () => {
    function setCardStage(state: GameState, cardId: string, stage: 0 | 1 | 2 | 3 | 4 | 5, blessed?: boolean) {
      for (const row of state.pyramid) {
        for (const card of row) {
          if (card.id === cardId) {
            card.attritionStage = stage;
            if (blessed !== undefined) card.blessed = blessed;
            return;
          }
        }
      }
      for (const card of state.drawPile) {
        if (card.id === cardId) {
          card.attritionStage = stage;
          if (blessed !== undefined) card.blessed = blessed;
          return;
        }
      }
      for (const card of state.discardPile) {
        if (card.id === cardId) {
          card.attritionStage = stage;
          if (blessed !== undefined) card.blessed = blessed;
          return;
        }
      }
      const vaultCard = state.vaultCards.find((card) => card.id === cardId);
      if (vaultCard) {
        vaultCard.attritionStage = stage;
        if (blessed !== undefined) vaultCard.blessed = blessed;
      }
    }

    it('calculates Red scar +1 functional values correctly for pair odds', () => {
      const state = createDeterministicGameState(1);
      state.mode = 'cursed-tomb';
      setCardStage(state, '♥12', 3);
      const counts = getActiveRankCounts(state, 'cursed-tomb');
      expect(counts[12]).toBe(3);
      expect(counts[13]).toBe(5);
      const stats = getRemainingPairStats(state, 'cursed-tomb');
      const kings = stats.find((s) => s.label === 'Kings (13)')!;
      expect(kings.active1).toBe(5);
      expect(kings.functionalModifications1).toBeDefined();
      expect(kings.functionalModifications1!.join(' ')).toContain('➔');
      expect(kings.functionalModifications1!.some((m) => m.includes('Red') && m.includes('Q') && m.includes('K'))).toBe(true);
      const queenAce = stats.find((s) => s.label === 'Q + A')!;
      expect(queenAce.active1).toBe(3);
      expect(queenAce.remainingPairs).toBe(3);
    });

    it('calculates Black scar -1 functional values correctly for pair odds', () => {
      const state = createDeterministicGameState(1);
      state.mode = 'cursed-tomb';
      setCardStage(state, '♠10', 3);
      const counts = getActiveRankCounts(state, 'cursed-tomb');
      expect(counts[10]).toBe(3);
      expect(counts[9]).toBe(5);
      const stats = getRemainingPairStats(state, 'cursed-tomb');
      const nineFour = stats.find((s) => s.label === '9 + 4')!;
      expect(nineFour.active1).toBe(5);
      expect(nineFour.functionalModifications1!.some((m) => m.includes('Black') && m.includes('10') && m.includes('9') && m.includes('➔'))).toBe(true);
      const tenThree = stats.find((s) => s.label === '10 + 3')!;
      expect(tenThree.active1).toBe(3);
    });

    it('preserves standard mode counts when Red scar present but mode is standard', () => {
      const state = createDeterministicGameState(1);
      state.mode = 'cursed-tomb';
      setCardStage(state, '♥12', 3);
      const standardCounts = getActiveRankCounts(state, 'standard');
      expect(standardCounts[12]).toBe(4);
      expect(standardCounts[13]).toBe(4);
      const standardStats = getRemainingPairStats(state, 'standard');
      const kingsStd = standardStats.find((s) => s.label === 'Kings (13)')!;
      expect(kingsStd.active1).toBe(4);
      expect(kingsStd.functionalModifications1).toBeUndefined();
      expect(kingsStd.hasWildcard).toBeUndefined();
    });

    it('detects Clubs Rally wildcard blessing as functional pair modifier', () => {
      const state = createDeterministicGameState(1);
      state.mode = 'cursed-tomb';
      setCardStage(state, '♣5', 0, true);
      const stats = getRemainingPairStats(state, 'cursed-tomb');
      expect(stats.every((s) => s.hasWildcard === true)).toBe(true);
      const masterDeck = createDeck() as CursedCard[];
      const clubsCard = masterDeck.find((c) => c.id === '♣5')!;
      clubsCard.blessed = true;
      clubsCard.attritionStage = 0;
      const statsMaster = getRemainingPairStats(state, 'cursed-tomb', masterDeck);
      expect(statsMaster[0].hasWildcard).toBe(true);
    });

    it('verifies no wildcard in standard mode or when Clubs not blessed', () => {
      const state = createDeterministicGameState(1);
      state.mode = 'standard';
      const stats = getRemainingPairStats(state, 'standard');
      expect(stats[0].hasWildcard).toBeUndefined();
      const expState = createDeterministicGameState(1);
      expState.mode = 'cursed-tomb';
      const expStats = getRemainingPairStats(expState, 'cursed-tomb');
      expect(expStats[0].hasWildcard).toBe(false);
    });

    it('applies wrapping functional values for rank shifts (Ace -1 to King, King +1 to Ace)', () => {
      const state = createDeterministicGameState(1);
      state.mode = 'cursed-tomb';
      setCardStage(state, '♠1', 3);
      setCardStage(state, '♥13', 3);
      const counts = getActiveRankCounts(state, 'cursed-tomb');
      expect(counts[1]).toBe(4);
      expect(counts[13]).toBe(4);
      const stats = getRemainingPairStats(state, 'cursed-tomb');
      const kings = stats.find((s) => s.label === 'Kings (13)')!;
      expect(kings.functionalModifications1!.some((m) => m.includes('Black') && m.includes('A') && m.includes('K'))).toBe(true);
      const queenAce = stats.find((s) => s.label === 'Q + A')!;
      expect(queenAce.functionalModifications2!.some((m) => m.includes('Red') && m.includes('K') && m.includes('A'))).toBe(true);
    });

    it('allows moving an exposed Blessed Diamond card from top of Stock to Vault', () => {
      const state = initializeGame(1, 'cursed-tomb');
      const blessedDiamond: Card = {
        id: '♦7',
        suit: '♦',
        rank: 7,
        removed: false,
        selected: false,
        attritionStage: 0,
        rewardStage: 0,
        blessed: true,
      };
      const testState: GameState = {
        ...state,
        drawPile: [blessedDiamond, ...state.drawPile.filter((c) => c.id !== '♦7')],
        vaultCards: [],
      };
      const result = moveStockToVault(testState);
      expect(result.vaultCards.length).toBe(1);
      expect(result.vaultCards[0].id).toBe('♦7');
      expect(result.drawPile.some((c) => c.id === '♦7')).toBe(false);
    });

    it('absorbs up to 4 freeze attrition hits on Anchored cards (rewardStage === 2) before anchor shield breaks', () => {
      const campaign = createCampaign('cursed-tomb', 1);
      const anchoredCard = campaign.masterDeck.find((c) => c.rank === 7 && c.suit === '♠')!;
      anchoredCard.attritionStage = 3;
      anchoredCard.rewardStage = 2;
      anchoredCard.anchorAbsorption = 0;
      anchoredCard.tempImmune = false;

      campaign.currentRound.pyramid.flat().forEach((c) => {
        c.tempImmune = false;
      });

      let origPos = { r: -1, c: -1 };
      for (let r = 0; r < campaign.currentRound.pyramid.length; r++) {
        for (let c = 0; c < campaign.currentRound.pyramid[r].length; c++) {
          if (campaign.currentRound.pyramid[r][c].id === anchoredCard.id) {
            origPos = { r, c };
          }
        }
      }
      if (origPos.r !== -1) {
        const row6Card = campaign.currentRound.pyramid[6][0];
        campaign.currentRound.pyramid[origPos.r][origPos.c] = row6Card;
        campaign.currentRound.pyramid[6][0] = { ...anchoredCard, removed: false, faceDown: false };
      } else {
        campaign.currentRound.pyramid[6][0] = { ...anchoredCard, removed: false, faceDown: false };
      }

      campaign.currentRound.status = 'pyramid-collapse';

      let state = campaign;
      for (let expectedAbs = 1; expectedAbs <= 3; expectedAbs++) {
        state = {
          ...state,
          currentRound: { ...state.currentRound, lifecycleProcessed: false },
        };
        state = applyEndOfWeekLifecycle(state);
        const card = state.masterDeck.find((c) => c.id === anchoredCard.id)!;
        expect(card.anchorAbsorption).toBe(expectedAbs);
        expect(card.rewardStage).toBe(2);
        expect(card.attritionStage).toBe(3);
      }

      state = {
        ...state,
        currentRound: { ...state.currentRound, lifecycleProcessed: false },
      };
      state = applyEndOfWeekLifecycle(state);
      const cardHit4 = state.masterDeck.find((c) => c.id === anchoredCard.id)!;
      expect(cardHit4.anchorAbsorption).toBe(4);
      expect(cardHit4.rewardStage).toBe(0);
      expect(cardHit4.attritionStage).toBe(3);

      state = {
        ...state,
        currentRound: { ...state.currentRound, lifecycleProcessed: false },
      };
      state = applyEndOfWeekLifecycle(state);
      const cardHit5 = state.masterDeck.find((c) => c.id === anchoredCard.id)!;
      expect(cardHit5.attritionStage).toBe(4);
    });
  });
});

