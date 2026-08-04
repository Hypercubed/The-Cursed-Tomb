import { describe, it, expect } from 'vitest';
import { startGame, playCard, Card, GameState } from './game';
import {
  findNextGreedyMove,
  findNextSmartMove,
  findNextPerfectMove,
  findNextMove,
  getLegalNextStates,
  evaluateWinnability,
  solveBoard,
  forceWin,
  forceLoss,
} from './solver';

describe('solver', () => {
  it('identifies and plays single Kings', () => {
    const game = startGame(1);
    // Force a King into the bottom row of the pyramid
    const customPyramid = game.pyramid.map((row, rIdx) => {
      if (rIdx === 6) {
        return row.map((card, cIdx) => (cIdx === 0 ? { ...card, rank: 13 as const } : card));
      }
      return row;
    });
    const state: GameState = { ...game, pyramid: customPyramid };

    const nextState = findNextGreedyMove(state);
    expect(nextState).not.toBeNull();
    expect(nextState!.pyramid[6][0].removed).toBe(true);
  });

  it('identifies and plays pyramid pair summing to 13', () => {
    const game = startGame(1);
    // Set bottom row cards so there are no Kings and cards 0 & 1 sum to 13 (5 + 8)
    const customPyramid = game.pyramid.map((row, rIdx) => {
      if (rIdx === 6) {
        return row.map((card, cIdx) => {
          if (cIdx === 0) return { ...card, rank: 5 as const };
          if (cIdx === 1) return { ...card, rank: 8 as const };
          return { ...card, rank: 2 as const };
        });
      }
      return row;
    });
    const state: GameState = { ...game, pyramid: customPyramid, discardPile: [] };

    const nextState = findNextGreedyMove(state);
    expect(nextState).not.toBeNull();
    expect(nextState!.pyramid[6][0].removed).toBe(true);
    expect(nextState!.pyramid[6][1].removed).toBe(true);
  });

  it('draws a card when no visible move exists in pyramid', () => {
    const game = startGame(1);
    // Make bottom row cards non-pairs and non-Kings (e.g. all rank 1)
    const customPyramid = game.pyramid.map((row, rIdx) => {
      if (rIdx === 6) {
        return row.map((card) => ({ ...card, rank: 1 as const }));
      }
      return row;
    });
    const state: GameState = { ...game, pyramid: customPyramid, discardPile: [] };

    const initialDrawCount = state.drawPile.length;
    const nextState = findNextGreedyMove(state);
    expect(nextState).not.toBeNull();
    expect(nextState!.drawPile.length).toBe(initialDrawCount - 1);
    expect(nextState!.discardPile.length).toBe(1);
  });

  it('resigns (status pyramid-collapse) when deadlocked with 0 redraws', () => {
    const game = startGame(0);
    // Set pyramid to all 1s, draw empty, discard empty, redraws 0
    const customPyramid = game.pyramid.map((row) =>
      row.map((card) => ({ ...card, rank: 1 as const }))
    );
    const state: GameState = {
      ...game,
      pyramid: customPyramid,
      drawPile: [],
      discardPile: [],
      redrawsRemaining: 0,
    };

    const nextState = findNextGreedyMove(state);
    expect(nextState).not.toBeNull();
    expect(nextState!.status).toBe('pyramid-collapse');
  });

  it('forceWin clears pyramid and sets status to partial-victory when deck has cards', () => {
    const game = startGame(1);
    const wonState = forceWin(game);

    expect(wonState.status).toBe('partial-victory');
    const remainingCards = wonState.pyramid.flat().filter((card) => !card.removed);
    expect(remainingCards.length).toBe(0);
    expect(wonState.lastClearedPair).toBeDefined();
    expect(wonState.lastClearedPair!.length).toBeGreaterThanOrEqual(1);
    expect(wonState.lastClearedPair!.length).toBeLessThanOrEqual(2);
  });

  it('forceWin clears pyramid and deck setting status to complete-victory when complete option is true', () => {
    const game = startGame(1);
    const wonState = forceWin(game, true);

    expect(wonState.status).toBe('complete-victory');
    const remainingCards = wonState.pyramid.flat().filter((card) => !card.removed);
    expect(remainingCards.length).toBe(0);
    expect(wonState.drawPile.length).toBe(0);
    expect(wonState.discardPile.length).toBe(0);
  });

  it('forceLoss exhausts draw pile and sets status to pyramid-collapse', () => {
    const game = startGame(1);
    const lostState = forceLoss(game);

    expect(lostState.status).toBe('pyramid-collapse');
    expect(lostState.drawPile.length).toBe(0);
    expect(lostState.redrawsRemaining).toBe(0);
  });

  it('resigns game (status pyramid-collapse) during infinite redraws when no moves exist in remaining deck', () => {
    const game = startGame(null); // Infinite redraws
    // Set all pyramid cards to rank 1, discard/draw to all rank 1
    const customPyramid = game.pyramid.map((row) =>
      row.map((card) => ({ ...card, rank: 1 as const }))
    );
    const customDraw = game.drawPile.map((card) => ({ ...card, rank: 1 as const }));
    const state: GameState = {
      ...game,
      pyramid: customPyramid,
      drawPile: customDraw,
      discardPile: [],
      redrawsRemaining: null,
    };

    const nextState = findNextGreedyMove(state);
    expect(nextState).not.toBeNull();
    expect(nextState!.status).toBe('pyramid-collapse');
  });

  describe('multi-strategy solver', () => {
    it('executes smart heuristic moves', () => {
      const game = startGame(1);
      const nextState = findNextSmartMove(game);
      expect(nextState).not.toBeNull();
    });

    it('solves simple single-king board with perfect solver', () => {
      const game = startGame(1);
      // Create a pyramid where only apex is a King
      const customPyramid = game.pyramid.map((row, rIdx) => {
        return row.map((card) => ({
          ...card,
          rank: rIdx === 0 ? (13 as const) : (1 as const),
          removed: rIdx !== 0,
        }));
      });

      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        drawPile: [],
        discardPile: [],
      };

      const solution = solveBoard(state);
      expect(solution).not.toBeNull();
      expect(solution!.length).toBeGreaterThan(0);

      const nextState = findNextPerfectMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.status).toMatch(/victory/);
    });

    it('evaluates deal winnability status distinguishing complete-victory and partial-victory', () => {
      const game = startGame(0);

      // Deadlocked state
      const deadlockedState: GameState = {
        ...game,
        pyramid: game.pyramid.map((row) => row.map((card) => ({ ...card, rank: 1 as const }))),
        drawPile: [],
        discardPile: [],
        redrawsRemaining: 0,
      };
      expect(evaluateWinnability(deadlockedState)).toBe('deadlocked');

      // Complete Victory state (pyramid cleared + draw/discard empty, 1 King in apex)
      const completeState: GameState = {
        ...game,
        pyramid: game.pyramid.map((row, rIdx) =>
          row.map((card) => ({
            ...card,
            rank: rIdx === 0 ? (13 as const) : (1 as const),
            removed: rIdx !== 0,
          }))
        ),
        drawPile: [],
        discardPile: [],
      };
      expect(evaluateWinnability(completeState)).toBe('complete-victory');

      // Partial Victory state (pyramid cleared + draw pile has remaining non-matching cards)
      const partialState: GameState = {
        ...game,
        pyramid: game.pyramid.map((row, rIdx) =>
          row.map((card) => ({
            ...card,
            rank: rIdx === 0 ? (13 as const) : (1 as const),
            removed: rIdx !== 0,
          }))
        ),
        drawPile: [{ id: '♣1', suit: '♣', rank: 1, removed: false, selected: false, attritionStage: 0, rewardStage: 0, blessed: false }],
        discardPile: [{ id: '♦1', suit: '♦', rank: 1, removed: false, selected: false, attritionStage: 0, rewardStage: 0, blessed: false }],
      };
      expect(evaluateWinnability(partialState)).toBe('partial-victory');
    });

    it('dispatches moves correctly based on SolverStrategy parameter', () => {
      const game = startGame(1);
      const greedyMove = findNextMove(game, 'greedy');
      const smartMove = findNextMove(game, 'smart');
      const perfectMove = findNextMove(game, 'perfect');

      expect(greedyMove).not.toBeNull();
      expect(smartMove).not.toBeNull();
      expect(perfectMove).not.toBeNull();
    });

    it('resigns and detects deadlock during infinite redraws on unplayable deal', () => {
      const game = startGame(null); // Infinite redraws
      const deadlockedState: GameState = {
        ...game,
        pyramid: game.pyramid.map((row) => row.map((card) => ({ ...card, rank: 1 as const }))),
        drawPile: game.drawPile.map((card) => ({ ...card, rank: 1 as const })),
        discardPile: [],
        redrawsRemaining: null,
      };

      expect(evaluateWinnability(deadlockedState)).toBe('deadlocked');

      const smartNext = findNextSmartMove(deadlockedState);
      expect(smartNext).not.toBeNull();
      expect(smartNext!.status).toBe('pyramid-collapse');

      const perfectNext = findNextPerfectMove(deadlockedState);
      expect(perfectNext).not.toBeNull();
      expect(perfectNext!.status).toBe('pyramid-collapse');
    });

    it('findNextGreedyMove executes pyramid to vault move for exposed Diamond Hero', () => {
      const game = startGame(1);
      const customPyramid = game.pyramid.map((row, rIdx) => {
        if (rIdx === 6) {
          return row.map((card, cIdx) => {
            if (cIdx === 0) {
              return { ...card, suit: '♦' as const, rank: 5 as const, blessed: true };
            }
            return { ...card, rank: 1 as const };
          });
        }
        return row;
      });
      const state: GameState = { ...game, pyramid: customPyramid, vaultCard: null };

      const nextState = findNextGreedyMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.vaultCard).toBeDefined();
      expect(nextState!.vaultCard?.suit).toBe('♦');
      expect(nextState!.pyramid[6][0].removed).toBe(true);
    });
  });

  describe('hero power targeting mode resolution', () => {
    it('greedy solver auto-resolves targeting-spades without resigning', () => {
      const game = startGame(1, 'cursed-tomb');
      // Inject a face-down card in the pyramid and set targeting-spades mode
      const customPyramid = game.pyramid.map((row, rIdx) =>
        row.map((card, cIdx) =>
          rIdx === 5 && cIdx === 0 ? { ...card, faceDown: true } : card
        )
      );
      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        interactionMode: 'targeting-spades',
        pendingHeroCardId: '♠A',
      };

      const nextState = findNextGreedyMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.status).not.toBe('pyramid-collapse');
      expect(nextState!.interactionMode).toBe('normal');
    });

    it('smart solver auto-resolves targeting-spades without resigning', () => {
      const game = startGame(1, 'cursed-tomb');
      const customPyramid = game.pyramid.map((row, rIdx) =>
        row.map((card, cIdx) =>
          rIdx === 5 && cIdx === 0 ? { ...card, faceDown: true } : card
        )
      );
      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        interactionMode: 'targeting-spades',
        pendingHeroCardId: '♠A',
      };

      const nextState = findNextSmartMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.status).not.toBe('pyramid-collapse');
      expect(nextState!.interactionMode).toBe('normal');
    });

    it('perfect solver auto-resolves targeting-spades without resigning', () => {
      const game = startGame(1, 'cursed-tomb');
      const customPyramid = game.pyramid.map((row, rIdx) =>
        row.map((card, cIdx) =>
          rIdx === 5 && cIdx === 0 ? { ...card, faceDown: true } : card
        )
      );
      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        interactionMode: 'targeting-spades',
        pendingHeroCardId: '♠A',
      };

      const nextState = findNextPerfectMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.status).not.toBe('pyramid-collapse');
      expect(nextState!.interactionMode).toBe('normal');
    });

    it('executes Hearts Stock Reshuffle when clearing a Blessed Hearts Hero', () => {
      let game = startGame(1, 'cursed-tomb');
      const heartsHero = { id: '♥8', suit: '♥' as const, rank: 8 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: true };
      const partnerFive = { id: '♣5', suit: '♣' as const, rank: 5 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };
      const extraWaste = { id: '♠3', suit: '♠' as const, rank: 3 as const, removed: false, selected: false, attritionStage: 0 as const, rewardStage: 0 as const, blessed: false };

      const existingId = game.pyramid[6][0].id;
      game.pyramid[6][0] = { ...heartsHero, id: existingId };
      const partnerId = game.pyramid[6][1].id;
      game.pyramid[6][1] = { ...partnerFive, id: partnerId };
      game.drawPile = game.drawPile.filter((c) => c.id !== '♠3');
      game.discardPile = [{ ...extraWaste }];

      game = playCard(game, partnerId);
      expect(game.selectedCardId).toBe(partnerId);

      const nextState = playCard(game, existingId);
      // Extra waste card (♠3) should now be in drawPile, and discardPile empty
      expect(nextState.discardPile.length).toBe(0);
      expect(nextState.drawPile.some((c: Card) => c.id === '♠3')).toBe(true);
    });

    it('getLegalNextStates returns only the targeting resolution when mode is active', () => {
      const game = startGame(1, 'cursed-tomb');
      const customPyramid = game.pyramid.map((row, rIdx) =>
        row.map((card, cIdx) =>
          rIdx === 5 && cIdx === 0 ? { ...card, faceDown: true } : card
        )
      );
      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        interactionMode: 'targeting-spades',
        pendingHeroCardId: '♠A',
      };
      const nexts = getLegalNextStates(state);
      expect(nexts.length).toBe(1);
      expect(nexts[0].interactionMode).toBe('normal');
    });
  });

  describe('solver Stock-to-Waste pairing handling', () => {
    it('evaluates and plays in-flight Stock-to-Pyramid pair before passing to waste', () => {
      const game = startGame(1);
      const topStock = game.drawPile[0];
      topStock.rank = 6;

      const customPyramid = game.pyramid.map((row, rIdx) => {
        if (rIdx === 6) {
          return row.map((card, cIdx) => (cIdx === 0 ? { ...card, rank: 7 as const } : { ...card, rank: 2 as const }));
        }
        return row;
      });

      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        discardPile: [],
      };

      const nextState = findNextGreedyMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.drawPile.some((c) => c.id === topStock.id)).toBe(false);
      expect(nextState!.pyramid[6][0].removed).toBe(true);
    });

    it('evaluates and plays in-flight Stock-to-Waste pair', () => {
      const game = startGame(1);
      const topStock = game.drawPile[0];
      topStock.rank = 9;

      const wasteCard = { ...game.drawPile[1], rank: 4 as const };

      const customPyramid = game.pyramid.map((row) =>
        row.map((card) => ({ ...card, rank: 2 as const }))
      );

      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        drawPile: game.drawPile.filter((c) => c.id !== wasteCard.id),
        discardPile: [wasteCard],
      };

      const nextState = findNextGreedyMove(state);
      expect(nextState).not.toBeNull();
      expect(nextState!.drawPile.some((c) => c.id === topStock.id)).toBe(false);
      expect(nextState!.discardPile.some((c) => c.id === wasteCard.id)).toBe(false);
    });

    it('includes Stock pairing moves in getLegalNextStates', () => {
      const game = startGame(1);
      const topStock = game.drawPile[0];
      topStock.rank = 5;

      const customPyramid = game.pyramid.map((row, rIdx) => {
        if (rIdx === 6) {
          return row.map((card, cIdx) => (cIdx === 0 ? { ...card, rank: 8 as const } : { ...card, rank: 2 as const }));
        }
        return row;
      });

      const state: GameState = {
        ...game,
        pyramid: customPyramid,
        discardPile: [],
      };

      const legalNext = getLegalNextStates(state);
      const pairedState = legalNext.find(
        (s) => s.pyramid[6][0].removed && !s.drawPile.some((c) => c.id === topStock.id)
      );
      expect(pairedState).toBeDefined();
    });
  });
});
