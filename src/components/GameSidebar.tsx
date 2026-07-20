import { WinCondition, GameState } from '../game';

const redrawOptions = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: 'Infinite', value: null },
] as const;

const winConditions: Array<{ label: string; value: WinCondition }> = [
  { label: 'Pyramid-only', value: 'pyramid-only' },
  { label: 'Complete victory', value: 'complete-victory' },
];

interface GameSidebarProps {
  // Setup controls
  selectedRedraw: number | null;
  selectedWinCondition: WinCondition;
  gameStatus: GameState['status'];
  onRedrawChange: (value: number | null) => void;
  onWinConditionChange: (value: WinCondition) => void;
  onStart: () => void;
  onRestart: () => void;
  onResign: () => void;
  // Status panel
  statusLabel: string;
  redrawsRemaining: number | null;
  drawPileCount: number;
  topDiscardLabel: string;
  selectedCardLabel: string;
}

const buttonClass =
  'appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-4 py-2 hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color] duration-[120ms]';

const selectClass =
  'mt-1 bg-game-bg border border-game-border rounded-lg px-2 py-1 text-game-text text-sm';

const labelClass = 'flex flex-col gap-1 text-sm text-game-muted';

export function GameSidebar({
  selectedRedraw,
  selectedWinCondition,
  gameStatus,
  onRedrawChange,
  onWinConditionChange,
  onStart,
  onRestart,
  onResign,
  statusLabel,
  redrawsRemaining,
  drawPileCount,
  topDiscardLabel,
  selectedCardLabel,
}: GameSidebarProps) {
  return (
    <aside className="sticky top-6 flex flex-col gap-4">
      {/* Setup section */}
      <div className="bg-game-panel border border-game-border rounded-2xl p-5">
        <h2 className="text-base font-semibold text-game-text mt-0 mb-4">Setup</h2>
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            Redraw cycles
            <select
              className={selectClass}
              value={selectedRedraw === null ? 'infinite' : String(selectedRedraw)}
              onChange={(e) =>
                onRedrawChange(e.target.value === 'infinite' ? null : Number(e.target.value))
              }
            >
              {redrawOptions.map((option) => (
                <option
                  key={option.label}
                  value={option.value === null ? 'infinite' : String(option.value)}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Win condition
            <select
              className={selectClass}
              value={selectedWinCondition}
              onChange={(e) => onWinConditionChange(e.target.value as WinCondition)}
            >
              {winConditions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            className={buttonClass}
            onClick={onStart}
            disabled={gameStatus === 'in-progress'}
          >
            Start game
          </button>
          {gameStatus === 'in-progress' && (
            <button
              type="button"
              className="appearance-none bg-transparent border border-red-900/50 hover:border-game-red hover:text-game-red text-red-400 rounded-lg text-sm cursor-pointer font-[inherit] px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color,color] duration-[120ms]"
              onClick={onResign}
            >
              Resign
            </button>
          )}
          <button type="button" className={buttonClass} onClick={onRestart}>
            Reset
          </button>
        </div>
      </div>

      {/* Status section */}
      <div className="bg-game-panel border border-game-border rounded-2xl p-5">
        <h2 className="text-base font-semibold text-game-text mt-0 mb-4">Status</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-game-muted">Status</dt>
            <dd className="text-game-text font-medium ml-0">{statusLabel}</dd>
          </div>
          <div>
            <dt className="text-game-muted">Redraws</dt>
            <dd className="text-game-text font-medium ml-0">
              {redrawsRemaining === null ? '∞' : redrawsRemaining}
            </dd>
          </div>
          <div>
            <dt className="text-game-muted">Draw pile</dt>
            <dd className="text-game-text font-medium ml-0">{drawPileCount}</dd>
          </div>
          <div>
            <dt className="text-game-muted">Discard top</dt>
            <dd className="text-game-text font-medium ml-0">{topDiscardLabel}</dd>
          </div>
          <div>
            <dt className="text-game-muted">Selected</dt>
            <dd className="text-game-text font-medium ml-0">{selectedCardLabel}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

export default GameSidebar;
