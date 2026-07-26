import { GameState } from '../game';

const redrawOptions = [
  { label: 'Survivalist (Hard) — 0 Redeals', value: 0 },
  { label: 'Archaeologist (Normal) — 1 Redeal', value: 1 },
  { label: 'Explorer (Easy) — 2 Redeals', value: 2 },
  { label: 'Novice (Sandbox) — Unlimited', value: null },
] as const;

interface GameSidebarProps {
  // Setup controls
  selectedRedraw: number | null;
  gameStatus: GameState['status'];
  onRedrawChange: (value: number | null) => void;
  onStart: () => void;
  onRestart: () => void;
  onResign: () => void;
  // Progress & Stats panel
  removedCardsCount?: { count: number; total: number; percentage: number };
  stats?: {
    completeVictories: number;
    partialVictories: number;
    pyramidCollapses: number;
    currentStreak: number;
    bestStreak: number;
  };
  campaignStats?: {
    pyramidsExplored: number;
    pyramidsCollapsed: number;
    isVictory: boolean;
    totalAttempts: number;
  };
  onOpenMatchedCardsModal?: () => void;
}

const buttonClass =
  'appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-4 py-2 hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color] duration-[120ms]';

const selectClass =
  'mt-1 bg-game-bg border border-game-border rounded-lg px-2 py-1 text-game-text text-sm disabled:opacity-50 disabled:cursor-not-allowed';

const labelClass = 'flex flex-col gap-1 text-sm text-game-muted';

export function GameSidebar({
  selectedRedraw,
  gameStatus,
  onRedrawChange,
  onStart,
  onRestart,
  onResign,
  removedCardsCount,
  stats,
  campaignStats,
  onOpenMatchedCardsModal,
}: GameSidebarProps) {
  const isGameRunning = gameStatus === 'in-progress';
  const complete = stats?.completeVictories ?? 0;
  const partial = stats?.partialVictories ?? 0;
  const collapses = stats?.pyramidCollapses ?? 0;
  const totalVictories = complete + partial;
  const totalGames = totalVictories + collapses;
  const clearRate = totalGames > 0 ? Math.round((totalVictories / totalGames) * 100) : 0;

  return (
    <aside className="sticky top-6 flex flex-col gap-4 p-4 rounded-xl border-l-[14px] border-y-[6px] border-r-[6px] border-[#251b12] bg-[#120e0a] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_2px_0_4px_rgba(0,0,0,0.5)] overflow-hidden relative">
      {/* Spine line indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#100a06] opacity-80" />

      {/* Setup section */}
      <div className="bg-[#18130e] border border-[#2d2319] rounded-lg p-5 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] z-10">
        <h2 className="text-base font-semibold text-game-text font-display mt-0 mb-4 tracking-wider uppercase border-b border-[#3d3124] pb-2 flex items-center gap-2">
          <span className="text-game-accent text-lg">📜</span> Setup
        </h2>
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            Difficulty
            <select
              className={selectClass}
              disabled={isGameRunning}
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
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            className={buttonClass}
            onClick={onStart}
            disabled={gameStatus === 'in-progress' || (campaignStats?.isVictory ?? false)}
          >
            Explore Pyramid
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
            New Campaign
          </button>
        </div>
      </div>

      {/* Progress & Stats section */}
      <div className="bg-[#18130e] border border-[#2d2319] rounded-lg p-5 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] z-10">
        <h2 className="text-base font-semibold text-game-text font-display mt-0 mb-4 tracking-wider uppercase border-b border-[#3d3124] pb-2 flex items-center gap-2">
          <span className="text-game-accent text-lg">📊</span> Progress & Stats
        </h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-game-muted">Cards Removed</dt>
            <dd className="text-game-text font-medium ml-0">
              {removedCardsCount ? `${removedCardsCount.count} / ${removedCardsCount.total} (${removedCardsCount.percentage}%)` : '0 / 52 (0%)'}
            </dd>
          </div>

          {/* Active Campaign Stats */}
          <div className="border-t border-[#2d2319] pt-2.5 mt-1">
            <dt className="text-game-accent font-semibold font-display tracking-wider uppercase text-xs mb-1.5 flex items-center justify-between">
              <span>Active Campaign</span>
              <span className={campaignStats?.isVictory ? 'text-emerald-400 font-bold font-mono' : 'text-amber-400 font-medium'}>
                {campaignStats?.isVictory ? '👑 Victory!' : '🟢 Active'}
              </span>
            </dt>
            <dd className="text-game-text font-medium ml-0 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                <span className="text-game-muted">🔍 Pyramids Explored</span>
                <span className="font-mono font-semibold text-amber-400">{campaignStats?.pyramidsExplored ?? 0}</span>
              </div>
              <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                <span className="text-game-muted">🏺 Pyramids Collapsed</span>
                <span className="font-mono font-semibold text-red-400">{campaignStats?.pyramidsCollapsed ?? 0}</span>
              </div>
              <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                <span className="text-game-muted">🂡 Total Attempts</span>
                <span className="font-mono font-semibold text-game-accent">{campaignStats?.totalAttempts ?? 0}</span>
              </div>
            </dd>
          </div>
        </dl>
        {onOpenMatchedCardsModal && (
          <button
            type="button"
            className="mt-4 w-full appearance-none bg-[#231b13] border border-[#3d3124] hover:border-game-accent text-game-accent rounded-lg text-sm font-semibold font-display tracking-wide py-2 px-3 cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm"
            onClick={onOpenMatchedCardsModal}
          >
            <span>📜</span> View Matched Vault
          </button>
        )}
      </div>
    </aside>
  );
}

export default GameSidebar;
