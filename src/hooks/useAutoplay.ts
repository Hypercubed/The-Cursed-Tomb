import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../game';
import { findNextMove, SolverStrategy } from '../solver';

export function useAutoplay(
  game: GameState,
  setGame: React.Dispatch<React.SetStateAction<GameState>>,
  onStartNewGame: () => void
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [strategy, setStrategy] = useState<SolverStrategy>('greedy');
  const [speedMs, setSpeedMs] = useState(200);
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
    if (gameRef.current.status === 'complete-victory') {
      return false;
    }
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
        if (!nextState || nextState === gameRef.current) break;

        setGame(nextState);
        setMoveCount((prev) => prev + 1);
        steps += 1;

        // Yield to browser event loop every few moves to keep UI 60fps and allow cancellation
        if (steps % 3 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
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

    if (gameRef.current.status === 'complete-victory') {
      return false;
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

  // Stop autoplay automatically if campaign victory is reached
  useEffect(() => {
    if (game.status === 'complete-victory') {
      setIsPlaying(false);
      cancelRef.current = true;
    }
  }, [game.status]);

  // Continuous Autoplay interval loop
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const delay = Math.max(speedMs, 50);

    const intervalId = setInterval(() => {
      if (gameRef.current.status === 'complete-victory') {
        setIsPlaying(false);
        cancelRef.current = true;
        return;
      }

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
        if (gameRef.current.status === 'complete-victory') {
          return false;
        }
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

