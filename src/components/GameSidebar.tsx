import { GameMode } from '../game';

const redrawOptions = [
  { label: 'Survivalist (Hard) — 0 Redeals', value: 0 },
  { label: 'Archaeologist (Normal) — 1 Redeal', value: 1 },
  { label: 'Explorer (Easy) — 2 Redeals', value: 2 },
  { label: 'Novice (Sandbox) — ∞ Redeals', value: null as unknown as number },
] as const;

interface GameSidebarProps {
  // Setup controls
  selectedRedraw: number | null;
  gameMode?: GameMode;
  onRestart: () => void;
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
    pyramidsConquered?: number;
    pyramidsCollapsed: number;
    isVictory: boolean;
    totalAttempts: number;
  };
  onOpenMatchedCardsModal?: () => void;
}

const buttonClass =
  'appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-4 py-2 hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color] duration-[120ms]';

const getDifficultyLabel = (value: number | null) => {
  if (value === null) return 'Novice (Sandbox)';
  if (value === 2) return 'Explorer (Easy)';
  if (value === 1) return 'Archaeologist (Normal)';
  if (value === 0) return 'Survivalist (Hard)';
  return `${value} Redeal(s)`;
};

export function GameSidebar({
  selectedRedraw,
  gameMode = 'cursed-tomb',
  onRestart,
  removedCardsCount,
  stats,
  campaignStats,
  onOpenMatchedCardsModal,
}: GameSidebarProps) {
  const complete = stats?.completeVictories ?? 0;
  const partial = stats?.partialVictories ?? 0;
  const collapses = stats?.pyramidCollapses ?? 0;
  const totalVictories = complete + partial;
  const totalGames = totalVictories + collapses;

  return (
    <aside className="flex flex-col gap-4 p-3 sm:p-4 rounded-xl border-l-[10px] sm:border-l-[14px] border-y-[4px] sm:border-y-[6px] border-r-[4px] sm:border-r-[6px] border-[#251b12] bg-[#120e0a] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_2px_0_4px_rgba(0,0,0,0.5)] overflow-hidden relative">
      {/* Spine line indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#100a06] opacity-80" />

      {/* Setup section */}
      <div className="bg-[#18130e] border border-[#2d2319] rounded-lg p-3 sm:p-5 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] z-10">
        <h2 className="text-base font-semibold text-game-text font-display mt-0 mb-4 tracking-wider uppercase border-b border-[#3d3124] pb-2 flex items-center gap-2">
          <span className="text-game-accent text-lg">📜</span> Setup
        </h2>
        
        <div className="flex flex-col gap-1.5 text-sm mb-4">
          <span className="text-game-muted text-xs">Selected Difficulty</span>
          <div className="flex items-center justify-between bg-[#120e0a] px-3 py-2 rounded border border-[#251e16] text-xs font-mono">
            <span className="text-amber-400 font-medium">{getDifficultyLabel(selectedRedraw)}</span>
            <span className="text-game-muted">
              {selectedRedraw === null ? '∞ Redeals' : `${selectedRedraw} Redeal${selectedRedraw === 1 ? '' : 's'}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button type="button" className={`${buttonClass} min-h-11`} onClick={onRestart}>
            <span className="flex items-center justify-between gap-2">
              <span>New Game</span>
              <span className="text-[0.65rem] text-game-muted/70 font-mono bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-900/30 whitespace-nowrap">[N]</span>
            </span>
          </button>
        </div>
      </div>

      {/* Progress & Stats section */}
      <div className="bg-[#18130e] border border-[#2d2319] rounded-lg p-3 sm:p-5 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] z-10">
        <h2 className="text-base font-semibold text-game-text font-display mt-0 mb-4 tracking-wider uppercase border-b border-[#3d3124] pb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-game-accent text-lg">📊</span> Progress & Stats
          </span>
        </h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-game-muted">Cards Removed</dt>
            <dd className="text-game-text font-medium ml-0">
              {removedCardsCount ? `${removedCardsCount.count} / ${removedCardsCount.total} (${removedCardsCount.percentage}%)` : '0 / 52 (0%)'}
            </dd>
          </div>

          {/* Active Campaign Stats - only in cursed-tomb mode */}
          {gameMode === 'cursed-tomb' && (
            <div className="border-t border-[#2d2319] pt-2.5 mt-1">
              <dt className="text-game-accent font-semibold font-display tracking-wider uppercase text-xs mb-1.5 flex items-center justify-between">
                <span>Active Campaign</span>
                <span className="text-amber-400 font-medium">🟢 Active</span>
              </dt>
              <dd className="text-game-text font-medium ml-0 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                  <span className="text-game-muted">🔍 Pyramids Explored</span>
                  <span className="font-mono font-semibold text-amber-400">{campaignStats?.pyramidsExplored ?? 0}</span>
                </div>
                <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                  <span className="text-game-muted">👑 Pyramids Conquered</span>
                  <span className="font-mono font-semibold text-emerald-400">{campaignStats?.pyramidsConquered ?? 0}</span>
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
          )}

          {/* Standard Solitaire Career Stats */}
          {gameMode === 'standard' && (
            <div className="border-t border-[#2d2319] pt-2.5 mt-1">
              <dt className="text-game-accent font-semibold font-display tracking-wider uppercase text-xs mb-1.5 flex items-center justify-between">
                <span>Standard Career</span>
                <span className="text-amber-400 font-medium font-mono text-[11px]">{totalGames > 0 ? `${Math.round((totalVictories / totalGames) * 100)}% Clear` : '0% Clear'}</span>
              </dt>
              <dd className="text-game-text font-medium ml-0 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                  <span className="text-game-muted">🂡 Total Games</span>
                  <span className="font-mono font-semibold text-game-accent">{totalGames}</span>
                </div>
                <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                  <span className="text-game-muted">👑 Victories</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {totalVictories} <span className="text-[10px] text-game-muted font-normal">({complete} complete)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                  <span className="text-game-muted">🏺 Pyramids Collapsed</span>
                  <span className="font-mono font-semibold text-red-400">{collapses}</span>
                </div>
                <div className="flex justify-between items-center bg-[#120e0a] px-2.5 py-1.5 rounded border border-[#251e16]">
                  <span className="text-game-muted">🔥 Win Streak</span>
                  <span className="font-mono font-semibold text-amber-300">
                    {stats?.currentStreak ?? 0} <span className="text-[10px] text-game-muted font-normal">(Best: {stats?.bestStreak ?? 0})</span>
                  </span>
                </div>
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-4 flex flex-col gap-2">
          {onOpenMatchedCardsModal && (
            <button
              type="button"
              className="w-full appearance-none bg-[#231b13] border border-[#3d3124] hover:border-game-accent text-game-accent rounded-lg text-sm font-semibold font-display tracking-wide py-2 px-3 cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm"
              onClick={onOpenMatchedCardsModal}
            >
              <span>📊</span> {gameMode === 'standard' ? 'Deck Matrix & Pair Odds' : 'Expedition Deck & Stats'}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default GameSidebar;
