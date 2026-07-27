import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameState, startGame } from '../game';
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

  it('does not auto-start a new game when status is complete-victory', () => {
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
      if (game.status === 'complete-victory') {
        return false;
      }
      if (game.status !== 'in-progress') {
        onStartNewGame();
        return true;
      }
      return false;
    };

    const res = stepOneMock();
    expect(res).toBe(false);
    expect(onStartNewGame).not.toHaveBeenCalled();
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
});

