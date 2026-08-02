import { useEffect, useMemo, useState } from 'react';
import { GameState } from '../game';
import { evaluateWinnability, SolverStrategy, WinnabilityStatus } from '../solver';

const DEBUG_PANEL_STORAGE_KEY = 'debugPanelSettings';
interface DebugPanelProps {
  game: GameState;
  isPlaying: boolean;
  isThinking?: boolean;
  strategy: SolverStrategy;
  speedMs: number;
  moveCount: number;
  onForceWin: () => void;
  onForceLoss: () => void;
  onStepOne: () => void;
  onAutoplayRound?: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onStrategyChange: (strategy: SolverStrategy) => void;
}

const buttonClass =
  'appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-3 py-1.5 hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color] duration-[120ms] text-center';

const dangerButtonClass =
  'appearance-none bg-transparent border border-red-900/50 hover:border-game-red hover:text-game-red text-red-400 rounded-lg text-sm cursor-pointer font-[inherit] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color,color] duration-[120ms] text-center';

const selectClass =
  'mt-1 bg-game-bg border border-game-border rounded-lg px-2 py-1 text-game-text text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full font-sans';

export function DebugPanel({
  game,
  isPlaying,
  isThinking = false,
  strategy,
  speedMs,
  moveCount,
  onForceWin,
  onForceLoss,
  onStepOne,
  onAutoplayRound,
  onTogglePlay,
  onSpeedChange,
  onStrategyChange,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [winnability, setWinnability] = useState<WinnabilityStatus | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const isGameRunning = game.status === 'in-progress';

  useEffect(() => {
    let isCancelled = false;
    if (game.status !== 'in-progress') {
      if (game.status === 'complete-victory') setWinnability('complete-victory');
      else if (game.status === 'partial-victory') setWinnability('partial-victory');
      else setWinnability('deadlocked');
      setIsEvaluating(false);
      return;
    }

    setIsEvaluating(true);
    const timerId = setTimeout(() => {
      const result = evaluateWinnability(game);
      if (!isCancelled) {
        setWinnability(result);
        setIsEvaluating(false);
      }
    }, 10);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [game]);


  const isBusy = isThinking || isEvaluating;
  const isActionsDisabled = !isGameRunning || isBusy;

  // Persist strategy and speed changes to localStorage
  useEffect(() => {
    const data = { strategy, speedMs };
    localStorage.setItem(DEBUG_PANEL_STORAGE_KEY, JSON.stringify(data));
  }, [strategy, speedMs]);

  const winnabilityBadge = useMemo(() => {
    if (isBusy && isGameRunning) {
      return (
        <span className="text-amber-300 font-medium bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded text-xs animate-pulse">
          🔮 Divining path...
        </span>
      );
    }

    if (!isGameRunning) {
      if (game.status === 'complete-victory') {
        return <span className="text-amber-300 font-medium bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded text-xs">🌟 Complete Victory</span>;
      }
      if (game.status === 'partial-victory') {
        return <span className="text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-xs">📜 Pyramid Cleared</span>;
      }
      if (game.status === 'pyramid-collapse') {
        return <span className="text-red-400 font-medium bg-red-950/60 border border-red-800/50 px-2 py-0.5 rounded text-xs">✕ Game Lost</span>;
      }
      return <span className="text-game-muted font-medium">— Idle</span>;
    }

    if (winnability === 'complete-victory') {
      return <span className="text-amber-300 font-medium bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded text-xs">🌟 Complete Win</span>;
    }
    if (winnability === 'partial-victory') {
      return <span className="text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-xs">📜 Pyramid Clear</span>;
    }
    if (winnability === 'unwinnable') {
      return <span className="text-amber-400 font-medium bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded text-xs">⚠️ Unwinnable</span>;
    }
    return <span className="text-red-400 font-medium bg-red-950/60 border border-red-800/50 px-2 py-0.5 rounded text-xs">✕ Deadlocked</span>;
  }, [isGameRunning, game.status, winnability, isBusy]);

  return (
    <div
      className={`fixed right-0 top-3 sm:top-6 lg:top-8 z-[60] flex items-start transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-44px)]'
      }`}
    >
      {/* Left tab trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#18130e] border border-r-0 border-[#2d2319] text-game-accent p-2.5 rounded-l-xl cursor-pointer shadow-xl hover:bg-[#251b12] flex items-center gap-1.5 font-display text-sm font-semibold tracking-wider uppercase transition-colors shrink-0"
        title={isOpen ? 'Collapse Debug Panel' : 'Expand Debug Panel'}
      >
        <span className="text-lg">🛠️</span>
        <span className="text-xs text-game-muted">{isOpen ? '►' : '◄'}</span>
      </button>

      {/* Panel contents */}
      <div className="bg-[#18130e] border border-r-0 border-[#2d2319] rounded-l-2xl p-5 shadow-2xl w-72 max-h-[80vh] overflow-y-auto text-game-text">
        <h3 className="text-base font-semibold text-game-text font-display mt-0 mb-4 tracking-wider uppercase border-b border-[#3d3124] pb-2 flex items-center justify-between">
          <span>🛠️ Debug & Autoplay</span>
        </h3>

        <div className="flex flex-col gap-4">
          {/* Instant Jump Controls */}
          <div>
            <div className="text-xs text-game-muted uppercase tracking-wider mb-2 font-medium">
              Instant Triggers
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={onForceWin}
                disabled={isActionsDisabled}
                title="Instantly clear pyramid and win game"
              >
                ⚡ Force Win
              </button>
              <button
                type="button"
                className={dangerButtonClass}
                onClick={onForceLoss}
                disabled={isActionsDisabled}
                title="Instantly exhaust draw pile and end game"
              >
                ⚡ Force Loss
              </button>
            </div>
          </div>

          {/* Autoplay & Strategy Controls */}
          <div>
            <div className="text-xs text-game-muted uppercase tracking-wider mb-2 font-medium flex items-center justify-between">
              <span>Autoplay Solver</span>
              <span className="text-[#a89078] text-xs font-normal">Moves: {moveCount}</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Strategy Selector & Winnability Badge */}
              <div className="bg-[#100d0a] border border-[#261d15] p-2.5 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-game-muted uppercase tracking-wider">Analysis</span>
                  {winnabilityBadge}
                </div>
                <label className="flex flex-col gap-1 text-xs text-game-muted">
                  Solver Strategy
                  <select
                    className={selectClass}
                    value={strategy}
                    disabled={isPlaying || isBusy}
                    onChange={(e) => onStrategyChange(e.target.value as SolverStrategy)}
                  >
                    <option value="greedy">Greedy (Naive Priority)</option>
                    <option value="smart">Smart (Heuristic Lookahead)</option>
                    <option value="perfect">Perfect (DFS Graph Oracle)</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={buttonClass}
                  onClick={onStepOne}
                  disabled={isPlaying || isBusy || !isGameRunning}
                  title="Execute exactly 1 move (or jump to game conclusion if Instant speed selected)"
                >
                  Step (1 Move)
                </button>
                <button
                  type="button"
                  className={isPlaying ? dangerButtonClass : buttonClass}
                  onClick={onTogglePlay}
                  disabled={!isGameRunning && !isPlaying}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Autoplay'}
                </button>
              </div>

              {onAutoplayRound && (
                <button
                  type="button"
                  className="w-full appearance-none bg-amber-950/80 border border-amber-800 text-amber-200 rounded-lg text-xs cursor-pointer font-[inherit] px-3 py-1.5 hover:bg-amber-900 transition-colors font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onAutoplayRound}
                  disabled={isPlaying || isBusy || !isGameRunning}
                  title="Autoplay and finish the current round without starting the next round"
                >
                  <span>⚡</span> Autoplay Round
                </button>
              )}

              <label className="flex flex-col gap-1 text-xs text-game-muted">
                Speed
                <select
                  className={selectClass}
                  value={speedMs}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                >
                  <option value={0}>Instant (0ms)</option>
                  <option value={50}>50ms (Fast)</option>
                  <option value={200}>200ms (Normal)</option>
                  <option value={500}>500ms (Slow)</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

