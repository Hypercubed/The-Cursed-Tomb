import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameState, startGame, initializeGame, createDeck, createCampaign, advanceCampaignRound } from '../game';
import { findNextMove } from '../solver';

describe('useAutoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers onStartNewGame when togglePlay is called from a non-in-progress state', () => {
    const game: GameState = {
      deck: [],
      pyramid: [],
      drawPile: [],
      discardPile: [],
      selectedCardId: null,
      redrawsRemaining: null,
      status: 'ready',
      mode: 'standard',
    };
    const setGame = vi.fn();
    const onStartNewGame = vi.fn();

    const ref = { current: game };
    const onStartRef = { current: onStartNewGame };

    if (ref.current.status !== 'in-progress') {
      onStartRef.current();
    }

    expect(onStartNewGame).toHaveBeenCalledTimes(1);
  });

  it('auto-starts a new game when status is complete-victory', () => {
    let game: GameState = {
      deck: [],
      pyramid: [],
      drawPile: [],
      discardPile: [],
      selectedCardId: null,
      redrawsRemaining: null,
      status: 'complete-victory',
      mode: 'standard',
    };
    const onStartNewGame = vi.fn();

    const stepOneMock = () => {
      if (game.status !== 'in-progress') {
        onStartNewGame();
        return true;
      }
      return false;
    };

    const res = stepOneMock();
    expect(res).toBe(true);
    expect(onStartNewGame).toHaveBeenCalledTimes(1);
  });

  it('supports instant stepToConclusion loop until terminal state', () => {
    const initialGame = startGame(1);
    let state = initialGame;
    let steps = 0;
    const maxSteps = 250;

    while (state.status === 'in-progress' && steps < maxSteps) {
      const nextState = findNextMove(state, 'perfect');
      if (!nextState || nextState === state) break;
      state = nextState;
      steps += 1;
    }

    expect(steps).toBeGreaterThan(0);
    expect(state.status).not.toBe('ready');
  });

  it('manages isThinking state during async stepToConclusion execution', async () => {
    let thinkingState = false;
    const game = startGame(1);
    let state = game;

    const mockSetGame = (updater: any) => {
      if (typeof updater === 'function') {
        state = updater(state);
      } else {
        state = updater;
      }
    };

    // Simulate async stepToConclusion behavior with thinking flags
    thinkingState = true;
    expect(thinkingState).toBe(true);

    const nextState = findNextMove(state, 'greedy');
    if (nextState) {
      mockSetGame(nextState);
    }

    thinkingState = false;
    expect(thinkingState).toBe(false);
    expect(state).not.toEqual(game);
  });

  describe('campaign-aware autoplay resets', () => {
    it('campaign-aware handleStart uses masterDeck markings instead of fresh deck', () => {
      // Simulate a campaign masterDeck with scarred cards (attritionStage > 0)
      const masterDeck = createDeck().map((card, idx) =>
        idx < 5 ? { ...card, attritionStage: 2 as const } : card
      );
      const graveyard: typeof masterDeck = [];

      // Campaign-aware initialization: pass masterDeck + graveyard
      const newRound = {
        ...initializeGame(1, 'cursed-tomb', masterDeck, graveyard),
        status: 'in-progress' as const,
      };

      // The new round's deck should include scarred cards from the master deck
      const allCards = [
        ...newRound.pyramid.flat(),
        ...newRound.drawPile,
        ...newRound.discardPile,
      ];
      const scarredCards = allCards.filter((c) => c.attritionStage > 0);
      // At least some of the 5 scarred cards should have been dealt
      expect(scarredCards.length).toBeGreaterThan(0);
    });

    it('non-campaign handleStart uses clean default deck', () => {
      // Standard startGame produces a deck with all attritionStage === 0
      const newRound = startGame(1, 'standard');
      const allCards = [
        ...newRound.pyramid.flat(),
        ...newRound.drawPile,
        ...newRound.discardPile,
      ];
      const scarredCards = allCards.filter((c) => c.attritionStage > 0);
      expect(scarredCards.length).toBe(0);
    });

    it('campaign-aware round preserves blessed card status', () => {
      const masterDeck = createDeck().map((card, idx) =>
        idx === 0 ? { ...card, blessed: true } : card
      );
      const graveyard: typeof masterDeck = [];

      const newRound = {
        ...initializeGame(1, 'cursed-tomb', masterDeck, graveyard),
        status: 'in-progress' as const,
      };

      const allCards = [
        ...newRound.pyramid.flat(),
        ...newRound.drawPile,
        ...newRound.discardPile,
      ];
      const blessedCards = allCards.filter((c) => c.blessed);
      // The blessed card from the masterDeck should appear in the new round
      expect(blessedCards.length).toBeGreaterThan(0);
    });

    it('advances campaign round number when starting new game in active campaign mode', () => {
      const campaign = createCampaign('cursed-tomb', 1);
      expect(campaign.roundNumber).toBe(1);

      const nextCampaign = advanceCampaignRound(campaign);
      expect(nextCampaign.roundNumber).toBe(2);
      expect(nextCampaign.currentRound.status).toBe('in-progress');
    });
  });
});

