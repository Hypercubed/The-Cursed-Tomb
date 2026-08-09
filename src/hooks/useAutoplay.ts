import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../game';
import { findNextMove, SolverStrategy } from '../solver';

const DEBUG_PANEL_STORAGE_KEY = 'debugPanelSettings';

function loadDebugPanelSettings(): { strategy: SolverStrategy; speedMs: number } {
  try {
    const stored = localStorage.getItem(DEBUG_PANEL_STORAGE_KEY);
    if (stored) {
      const { strategy, speedMs } = JSON.parse(stored);
      return {
        strategy: (strategy as SolverStrategy) ?? 'greedy',
        speedMs: typeof speedMs === 'number' ? speedMs : 200,
      };
    }
  } catch {}
  return { strategy: 'greedy', speedMs: 200 };
}

export function useAutoplay(
  game: GameState,
  setGame: React.Dispatch<React.SetStateAction<GameState>>,
  onStartNewGame: () => void
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [strategy, setStrategy] = useState<SolverStrategy>(() => loadDebugPanelSettings().strategy);
  const [speedMs, setSpeedMs] = useState<number>(() => loadDebugPanelSettings().speedMs);
  const [moveCount, setMoveCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const gameRef = useRef(game);
  gameRef.current = game;

  const strategyRef = useRef(strategy);
  strategyRef.current = strategy;

  const onStartNewGameRef = useRef(onStartNewGame);
  onStartNewGameRef.current = onStartNewGame;

  const cancelRef = useRef(false);
  const isThinkingRef = useRef(false);

  const startNewGame = useCallback(() => {
    setMoveCount(0);
    onStartNewGameRef.current();
  }, []);

  // Executes moves continuously until terminal state is reached asynchronously with yielding
  const stepToConclusion = useCallback(async () => {
    if (gameRef.current.status !== 'in-progress') {
      startNewGame();
      return true;
    }
    if (isThinkingRef.current) {
      return true;
    }

    cancelRef.current = false;
    isThinkingRef.current = true;
    setIsThinking(true);

    // Yield initial render frame so UI paints thinking state
    await new Promise((resolve) => setTimeout(resolve, 0));

    let steps = 0;
    const maxSteps = 250;

    try {
      while (
        !cancelRef.current &&
        gameRef.current.status === 'in-progress' &&
        steps < maxSteps
      ) {
        const nextState = findNextMove(gameRef.current, strategyRef.current);
        // No-op same-state return from perfect solver when pyramid is already
        // cleared (solveBoard target 'partial' => [state]) must not stall on
        // the banner. Greedy/Smart correctly yields a draw/cycle/resign, but
        // after the solver fix this branch also must not spin forever: fall
        // through to terminal-handling instead of tight-looping.
        if (!nextState) {
          if (gameRef.current.status === 'in-progress') {
            // Treat as terminal — cannot advance further, outer retry will
            // convert via checkForWin/resign inside solver; push to next round.
            break;
          }
          break;
        }
        if (nextState === gameRef.current) {
          break;
        }

        gameRef.current = nextState;
        setGame(nextState);
        setMoveCount((prev) => prev + 1);
        steps += 1;

        // If that move resolved the game (complete-victory / partial-victory /
        // pyramid-collapse), exit cleanly so interval/outer handler can start
        // the next round rather than continuing to probe a terminal state.
        if (nextState.status !== 'in-progress') break;

        // Yield to browser event loop every few moves to keep UI 60fps and allow cancellation
        if (steps % 3 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      // Reached loop bound while still in-progress with no actionable nextState
      // but pyramid cleared → we have exhausted stock while banner is up; signal
      // terminal handling to the interval caller by leaving status as-is and
      // letting the next tick / caller advance rounds. The critical path is
      // that we never return a same-state move that would spin.
    } finally {
      isThinkingRef.current = false;
      setIsThinking(false);
    }

    return true;
  }, [setGame, startNewGame]);

  // Execute solver move(s)
  const stepOne = useCallback(() => {
    if (speedMs === 0) {
      stepToConclusion();
      return true;
    }

    if (gameRef.current.status !== 'in-progress') {
      startNewGame();
      return true;
    }

    let moveMade = false;
    setGame((currentState) => {
      const nextState = findNextMove(currentState, strategyRef.current);
      if (nextState) {
        moveMade = true;
        setMoveCount((prev) => prev + 1);
        return nextState;
      }
      return currentState;
    });

    return moveMade;
  }, [speedMs, stepToConclusion, setGame, startNewGame]);

  // Continuous Autoplay interval loop
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const delay = Math.max(speedMs, 50);

    const intervalId = setInterval(() => {
      if (gameRef.current.status !== 'in-progress') {
        startNewGame();
        return;
      }

      if (speedMs === 0) {
        stepToConclusion();
      } else {
        const nextState = findNextMove(gameRef.current, strategyRef.current);
        if (nextState) {
          setGame(nextState);
          setMoveCount((prev) => prev + 1);
        } else {
          startNewGame();
        }
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [isPlaying, speedMs, setGame, startNewGame, stepToConclusion]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next) {
        cancelRef.current = true;
      } else {
        cancelRef.current = false;
        if (gameRef.current.status !== 'in-progress') {
          startNewGame();
        }
      }
      return next;
    });
  }, [startNewGame]);

  const stop = useCallback(() => {
    cancelRef.current = true;
    setIsPlaying(false);
  }, []);

  const resetCount = useCallback(() => {
    setMoveCount(0);
  }, []);

  return {
    isPlaying,
    isThinking,
    strategy,
    speedMs,
    moveCount,
    togglePlay,
    stepOne,
    stepToConclusion,
    stop,
    resetCount,
    setSpeedMs,
    setStrategy,
  };
}

