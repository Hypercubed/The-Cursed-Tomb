import { useEffect, useRef } from 'react';
import { PairStat, Suit, Rank, CursedCard, GameMode, getFunctionalValue, CampaignAchievements } from '../game';
import { StoredCampaignStats, StoredStats } from '../storage/persistence';
import { CardFaceIllustration } from './CardFaceIllustration';
import { InkBleedFilterDef } from './PlayingCard';

interface MatchedCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  removedCardIds: Set<string>;
  pairStats: PairStat[];
  masterDeck?: CursedCard[];
  mode?: GameMode;
  stats?: StoredStats;
  campaignStats?: StoredCampaignStats;
  achievements?: CampaignAchievements;
}

const suits: Array<{ suit: Suit; label: string; symbol: string }> = [
  { suit: '♠', label: 'Spades', symbol: '♠' },
  { suit: '♥', label: 'Hearts', symbol: '♥' },
  { suit: '♦', label: 'Diamonds', symbol: '♦' },
  { suit: '♣', label: 'Clubs', symbol: '♣' },
];

const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const rankLabel = (rank: Rank): string => {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
};

const isRedSuit = (suit: Suit): boolean => suit === '♥' || suit === '♦';

export function MatchedCardsModal({
  isOpen,
  onClose,
  removedCardIds,
  pairStats,
  masterDeck,
  mode = 'standard',
  stats,
  campaignStats,
  achievements,
}: MatchedCardsModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalRemoved = removedCardIds.size;
  const percentage = Math.round((totalRemoved / 52) * 100);
  const entombedCount = masterDeck ? masterDeck.filter((c) => c.attritionStage === 5).length : 0;
  const remainingCount = Math.max(0, 52 - totalRemoved);

  const totalVictories = stats ? stats.completeVictories + stats.partialVictories : 0;
  const totalGames = stats ? totalVictories + stats.pyramidCollapses : 0;
  const clearRate = totalGames > 0 ? Math.round((totalVictories / totalGames) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-4xl w-full max-h-[calc(100svh-1rem)] sm:max-h-[90vh] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <InkBleedFilterDef />
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2319] bg-[#120e0a]">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-game-accent">📊</span>
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-game-text font-display tracking-wider uppercase m-0">
                {mode === 'standard' ? 'Deck Matrix & Strategic Pair Odds' : 'Expedition Deck & Stats'}
              </h2>
              <p className="text-xs text-game-muted m-0 mt-0.5">
                {mode === 'cursed-tomb'
                  ? 'Expedition run progress, achievements, master deck state & strategic pair odds'
                  : 'Deck matrix overview & remaining strategic pair odds'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#251c14] border border-game-border rounded-full text-xs text-game-accent font-mono font-medium">
              {remainingCount} Remaining
            </span>
            <span className="px-3 py-1 bg-[#251c14] border border-game-border rounded-full text-xs text-game-accent font-mono font-medium">
              {totalRemoved} / 52 Removed ({percentage}%)
            </span>
            {mode === 'cursed-tomb' && (
              <span className="px-3 py-1 bg-[#251c14] border border-game-border rounded-full text-xs text-game-accent font-mono font-medium">
                {entombedCount} Entombed 💀
              </span>
            )}
            <button
              type="button"
              ref={closeBtnRef}
              onClick={onClose}
              className="text-game-muted hover:text-game-text bg-transparent border-none text-xl font-bold cursor-pointer p-1 transition-colors"
              aria-label="Close Expedition Deck & Stats modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col gap-4 sm:gap-6">
          {/* Standard Solitaire Career Metrics Section */}
          {mode === 'standard' && stats && (
            <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-semibold text-game-muted font-display tracking-wider uppercase mt-0 mb-3 flex items-center justify-between">
                <span>🂡 Standard Solitaire Career Metrics</span>
                <span className="text-amber-400 text-[11px] font-mono">{clearRate}% Win Rate</span>
              </h3>

              {/* Metric Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🂡 Total Games</span>
                  <span className="font-mono font-bold text-game-accent text-base">{totalGames}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">👑 Victories</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">{totalVictories}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🏺 Collapses</span>
                  <span className="font-mono font-bold text-red-400 text-base">{stats.pyramidCollapses}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🔥 Current Streak</span>
                  <span className="font-mono font-bold text-amber-400 text-base">{stats.currentStreak}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🏆 Best Streak</span>
                  <span className="font-mono font-bold text-amber-300 text-base">{stats.bestStreak}</span>
                </div>
              </div>
            </div>
          )}

          {/* Expedition Run Metrics & Achievements Section */}
          {mode === 'cursed-tomb' && (campaignStats || achievements) && (
            <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-semibold text-game-muted font-display tracking-wider uppercase mt-0 mb-3 flex items-center justify-between">
                <span>🏛️ Expedition Metrics & Accomplishments</span>
                <span className="text-amber-400 text-[11px] font-mono">🟢 Active Campaign</span>
              </h3>

              {/* Metric Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🔍 Explored</span>
                  <span className="font-mono font-bold text-amber-400 text-base">{campaignStats?.pyramidsExplored ?? 0}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">👑 Conquered</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">{campaignStats?.pyramidsConquered ?? achievements?.pyramidsCleared ?? 0}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🏺 Collapsed</span>
                  <span className="font-mono font-bold text-red-400 text-base">{campaignStats?.pyramidsCollapsed ?? 0}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🂡 Total Attempts</span>
                  <span className="font-mono font-bold text-game-accent text-base">{campaignStats?.totalAttempts ?? 0}</span>
                </div>
                <div className="bg-[#18130e] border border-[#251e16] rounded-md p-2.5 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-game-muted font-medium mb-1">🟢 Deck Health</span>
                  <span className="font-mono font-bold text-emerald-300 text-base">
                    {masterDeck ? `${Math.max(0, 52 - entombedCount)}/52 (${Math.round(((52 - entombedCount) / 52) * 100)}%)` : '100%'}
                  </span>
                </div>
              </div>

              {/* Achievements & Badges */}
              <div className="border-t border-[#251e16] pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-game-accent font-display uppercase tracking-wide flex items-center gap-1.5">
                    <span>🏆</span> Badges & Accomplishments:
                  </span>
                  <span className="px-2.5 py-1 bg-[#18130e] border border-amber-900/40 rounded text-amber-300 font-mono text-[11px]">
                    🌟 Perfect Wins: <strong className="text-amber-200">{achievements?.perfectWins ?? 0}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-[#18130e] border border-blue-900/40 rounded text-blue-300 font-mono text-[11px]">
                    ⚓ Rank-Anchor: <strong className={achievements?.rankAnchorUnlocked ? 'text-emerald-400' : 'text-game-muted'}>
                      {achievements?.rankAnchorUnlocked ? 'Unlocked ✓' : 'Locked'}
                    </strong>
                  </span>
                  {achievements?.unlockedBadges && achievements.unlockedBadges.length > 0 && (
                    achievements.unlockedBadges.map((badge) => (
                      <span key={badge} className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-700/50 rounded-full text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                        <span>🏅</span> {badge}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Section 1: 4x13 Card Grid */}
          <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-semibold text-game-muted font-display tracking-wider uppercase mt-0 mb-3 flex items-center justify-between flex-wrap gap-2">
              <span>Deck Status Matrix (4 × 13)</span>
              <span className="text-[11px] font-normal normal-case opacity-90 flex items-center gap-2.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#18130e] border border-[#251e16]"></span> Removed
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#2a2016] border border-game-accent"></span> Active
                </span>
                {mode === 'cursed-tomb' && (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2.5 h-2.5 rounded-sm bg-stone-950 border border-[#251e16]"></span> Entombed
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-medium" aria-label="Blessed Hero legend">
                      <span className="inline-flex items-center gap-0.5" aria-label="Blessed suit illustrations">
                        <span title="Hearts Archway"><CardFaceIllustration suit="♥" blessed className="w-4 h-4" randomizeTransform={false} strokeWidth={2} /></span>
                        <span title="Diamonds Vault Box"><CardFaceIllustration suit="♦" blessed className="w-4 h-4" randomizeTransform={false} strokeWidth={2} /></span>
                        <span title="Spades Tunnel Shovel"><CardFaceIllustration suit="♠" blessed className="w-4 h-4" randomizeTransform={false} strokeWidth={2} /></span>
                        <span title="Clubs Sun Cross"><CardFaceIllustration suit="♣" blessed className="w-4 h-4" randomizeTransform={false} strokeWidth={2} /></span>
                      </span>
                      Blessed Hero
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-medium">
                      <span className="font-mono font-bold">—</span> Fortifying
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-medium">
                      <span className="font-mono font-bold">+</span> Anchored (red corner dots = absorbed hits)
                    </span>
                    <span className="flex items-center gap-1 text-red-400 font-medium" aria-label="Cursed legend">
                      <span className="inline-flex items-center gap-0.5" aria-label="Cursed suit illustrations">
                        <span title="Red Curse Downward Triangle"><CardFaceIllustration suit="♥" attritionStage={4} className="w-4 h-4" randomizeTransform={false} strokeWidth={2} /></span>
                        <span title="Black Curse Trapezoid Weight"><CardFaceIllustration suit="♠" attritionStage={4} className="w-4 h-4" randomizeTransform={false} strokeWidth={2} /></span>
                      </span>
                      Cursed
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-medium" aria-label="Scarred legend">
                      <span
                        role="img"
                        aria-label="Scarred rank N with side marks and diagonal slash"
                        className="relative inline-block leading-none font-mono font-bold px-0.5"
                      >
                        <span>N</span>
                        <svg
                          aria-hidden="true"
                          className="absolute -inset-x-0.5 -inset-y-0.5 w-[calc(100%+4px)] h-[calc(100%+4px)] pointer-events-none overflow-visible z-20"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <line x1="8" y1="5" x2="8" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                          <line x1="92" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                          <line x1="8" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                        </svg>
                      </span>
                      Scarred
                    </span>
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <span>💀</span> Entombed
                    </span>
                  </>
                )}
              </span>
            </h3>

            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* Column Headers (Ranks) */}
                <div className="grid grid-cols-[50px_repeat(13,minmax(0,1fr))] gap-1.5 mb-2 text-center text-xs font-bold text-game-muted font-display">
                  <div>Suit</div>
                  {ranks.map((r) => (
                    <div key={r}>{rankLabel(r)}</div>
                  ))}
                </div>

                {/* Suit Rows */}
                {suits.map(({ suit, symbol }) => (
                  <div key={suit} className="grid grid-cols-[50px_repeat(13,minmax(0,1fr))] gap-1.5 mb-1.5 items-center">
                    <div className={`text-center font-bold text-sm ${isRedSuit(suit) ? 'text-game-red' : 'text-game-text'}`}>
                      {symbol}
                    </div>

                    {ranks.map((rank) => {
                      const cardId = `${suit}${rank}`;
                      const isRemoved = removedCardIds.has(cardId);
                      const rLabel = rankLabel(rank);

                      const cursedCard = masterDeck?.find((c) => c.id === cardId);
                      const fVal = cursedCard ? getFunctionalValue(cursedCard, mode) : rank;
                      const fValLabel = rankLabel(fVal as Rank);

                      const isBlessed = Boolean(cursedCard?.blessed);
                      const rewardStage = cursedCard?.rewardStage ?? 0;
                      const anchorAbsorption = cursedCard?.anchorAbsorption ?? 0;
                      const attritionStage = cursedCard?.attritionStage ?? 0;
                      const isCursed = !isBlessed && attritionStage === 4;
                      const isEntombed = attritionStage === 5;

                      const statusParts: string[] = [];
                      if (isBlessed) {
                        if (suit === '♥') statusParts.push('Blessed Hero (◯) (Hearts Stock Reshuffle)');
                        else if (suit === '♦') statusParts.push('Blessed Hero (◯) (Diamonds Vault: Store 1 Waste Card)');
                        else if (suit === '♠') statusParts.push('Blessed Hero (◯) (Spades Tunnel: Move Exposed Card to Waste)');
                        else if (suit === '♣') statusParts.push('Blessed Hero (◯) (Clubs Rally: Redraw Stock)');
                        else statusParts.push('Blessed Hero (◯)');
                      }
                      if (rewardStage === 1) statusParts.push('Fortifying Anchor (─)');
                      if (rewardStage === 2) statusParts.push(anchorAbsorption > 0 ? `Anchored (✢) (${anchorAbsorption}/4 Freeze Hits Absorbed)` : 'Anchored (✢)');
                      if (attritionStage === 1) statusParts.push(`Scar 1 (|${rLabel})`);
                      if (attritionStage === 2) statusParts.push(`Scar 2 (|${rLabel}|)`);
                      if (attritionStage === 3) statusParts.push(`Scar 3 (|${rLabel}\\|)`);
                      if (isCursed) {
                        if (suit === '♥' || suit === '♦') statusParts.push('Red Curse |X| (+1 Shift, Locks Cards Face-Down)');
                        else statusParts.push('Black Curse |X| (-1 Shift, Pyramid Pairing Only)');
                      }
                      if (isEntombed) statusParts.push('Entombed 💀');
                      if (fVal !== rank) statusParts.push(`Functional Value: ${fValLabel}`);
                      statusParts.push(isEntombed ? 'Entombed' : isRemoved ? 'Removed' : 'Active');

                      const tooltipText = `${suit}${rLabel} (${statusParts.join(', ')})`;

                      // Lifecycle owns the cell surface and outline. Status identities are shown by icons/overlays.
                      const lifecycleBackgroundClasses = isEntombed
                        ? 'bg-stone-950 text-game-muted/60 opacity-60'
                        : isRemoved
                          ? 'bg-[#18130e] text-game-muted/60'
                          : 'bg-[#2a2016] text-game-muted/60';
                      const borderStatusClasses = isRemoved || isEntombed
                        ? 'border-[#251e16]'
                        : 'border-game-accent shadow-[0_0_6px_rgba(212,175,55,0.25)]';

                      const cardStyleClasses = `${lifecycleBackgroundClasses} ${borderStatusClasses}`;

                      return (
                        <div
                          key={cardId}
                          title={tooltipText}
                          className={`h-12 rounded-md border flex flex-col items-center justify-between p-1 text-[10px] font-bold transition-all relative ${cardStyleClasses}`}
                        >
                          {/* Top-Right Anchor Badge */}
                          {rewardStage > 0 && (
                            <div className="absolute top-0.5 right-0.5 pointer-events-none z-30">
                              {rewardStage === 1 && (
                                <svg className="w-2.5 h-2.5" viewBox="0 0 100 100">
                                  <line x1="10" y1="50" x2="90" y2="50" stroke="#3b82f6" strokeWidth="24" strokeLinecap="round" />
                                </svg>
                              )}
                              {rewardStage >= 2 && (
                                <svg className="w-2.5 h-2.5 overflow-visible" viewBox="0 0 100 100">
                                  <line x1="10" y1="50" x2="90" y2="50" stroke="#3b82f6" strokeWidth="24" strokeLinecap="round" />
                                  <line x1="50" y1="10" x2="50" y2="90" stroke="#3b82f6" strokeWidth="24" strokeLinecap="round" />
                                  {anchorAbsorption >= 1 && <circle cx="20" cy="20" r="14" fill="#dc2626" />}
                                  {anchorAbsorption >= 2 && <circle cx="80" cy="20" r="14" fill="#dc2626" />}
                                  {anchorAbsorption >= 3 && <circle cx="20" cy="80" r="14" fill="#dc2626" />}
                                  {anchorAbsorption >= 4 && <circle cx="80" cy="80" r="14" fill="#dc2626" />}
                                </svg>
                              )}
                            </div>
                          )}

                          {/* Rank Row with Blue Slashed Scar Overlay / Sun Cross Wildcard Cross-Out */}
                          <div className="flex items-center justify-center w-full leading-none relative">
                            {isEntombed ? (
                              <span className="text-xs">💀</span>
                            ) : (
                              <span className="relative inline-block leading-none">
                                <span>{rLabel}</span>
                                {isBlessed && suit === '♣' && (
                                  <svg
                                    aria-hidden="true"
                                    className="absolute -inset-x-0.5 -inset-y-0.5 w-[calc(100%+4px)] h-[calc(100%+4px)] pointer-events-none overflow-visible z-20"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                  >
                                    <line x1="8" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                                    <line x1="8" y1="95" x2="92" y2="5" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                                  </svg>
                                )}
                                {attritionStage >= 1 && (
                                  <svg
                                    aria-hidden="true"
                                    className="absolute -inset-x-0.5 -inset-y-0.5 w-[calc(100%+4px)] h-[calc(100%+4px)] pointer-events-none overflow-visible z-20"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                  >
                                    <line x1="8" y1="5" x2="8" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                                    {attritionStage >= 2 && (
                                      <line x1="92" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                                    )}
                                    {attritionStage >= 3 && (
                                      <line x1="8" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                                    )}
                                    {attritionStage >= 4 && (
                                      <line x1="8" y1="95" x2="92" y2="5" stroke="#2563eb" strokeWidth="20" strokeLinecap="round" />
                                    )}
                                  </svg>
                                )}
                                {attritionStage >= 3 && (
                                  <span
                                    className="absolute left-full ml-1 top-[-2px] text-[9px] text-blue-400 font-black font-mono leading-none whitespace-nowrap"
                                    style={{ fontFamily: '"Caveat", "Architects Daughter", "Comic Sans MS", cursive, sans-serif' }}
                                  >
                                    {fValLabel}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>

                          {/* Suit Row with compact suit-specific status illustration */}
                          <div className="relative inline-flex items-center justify-center text-[9px] leading-none">
                            <span className={`relative flex items-center justify-center ${isRedSuit(suit) ? 'text-game-red' : 'text-game-text'}`}>
                              <span>{symbol}</span>
                              {(isBlessed || isCursed) && (
                                <span className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                                  <CardFaceIllustration
                                    suit={suit}
                                    rank={rank}
                                    blessed={isBlessed}
                                    attritionStage={attritionStage}
                                    className="w-5 h-5"
                                    randomizeTransform={false}
                                    strokeWidth={2}
                                  />
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Remaining Pair Statistics */}
          <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-semibold text-game-muted font-display tracking-wider uppercase mt-0 mb-3 flex items-center justify-between flex-wrap gap-2">
              <span>Remaining Complement Pairs (Sums to 13)</span>
              <span className="flex items-center gap-2">
                {mode === 'cursed-tomb' && (
                  <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-700/50 rounded-full text-amber-300 text-[11px] font-bold font-mono normal-case tracking-normal">
                    ⚡ Functional Pair Odds
                  </span>
                )}
                {(pairStats.some((s) => s.hasWildcard) || (mode === 'cursed-tomb' && (masterDeck?.some((c) => c.blessed && c.suit === '♣' && c.attritionStage < 5) ?? false))) && (
                  <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-700/50 rounded-full text-emerald-300 text-[11px] font-bold font-mono normal-case tracking-normal">
                    ♣ Wildcard Active
                  </span>
                )}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pairStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#18130e] border border-[#2d2319] rounded-lg p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-game-text font-display">
                      {stat.label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                        stat.remainingPairs > 0
                          ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-400'
                          : 'bg-red-950/40 border border-red-900/30 text-red-400 opacity-60'
                      }`}
                    >
                      {stat.remainingPairs} {stat.remainingPairs === 1 ? 'pair' : 'pairs'}
                    </span>
                  </div>

                  <div className="text-[11px] text-game-muted flex items-center justify-between border-t border-[#231b14] pt-1.5 mt-1">
                    {stat.rank2 !== undefined ? (
                      <>
                        <span>
                          <strong className="text-game-text">{stat.rank1Label}</strong>: {stat.active1} left
                        </span>
                        <span>
                          <strong className="text-game-text">{stat.rank2Label}</strong>: {stat.active2} left
                        </span>
                      </>
                    ) : (
                      <span>
                        <strong className="text-game-text">Kings</strong>: {stat.active1} active in deck
                      </span>
                    )}
                  </div>
                  {(stat.functionalModifications1?.length || stat.functionalModifications2?.length) ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(() => {
                        const grouped = new Map<string, number>();
                        for (const m of stat.functionalModifications1 ?? []) grouped.set(m, (grouped.get(m) ?? 0) + 1);
                        for (const m of stat.functionalModifications2 ?? []) grouped.set(m, (grouped.get(m) ?? 0) + 1);
                        return Array.from(grouped.entries()).map(([mod, count]) => (
                          <span key={mod} className="px-1.5 py-0.5 bg-amber-950/60 border border-amber-700/50 rounded text-amber-300 text-[10px] font-mono">
                            ⚡ {count > 1 ? `${count}× ` : ''}{mod}
                          </span>
                        ));
                      })()}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="safe-area-toolbar px-3 sm:px-6 py-3 border-t border-[#2d2319] bg-[#120e0a] flex justify-end">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-5 py-1.5 hover:border-game-accent focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors"
          >
            Close Expedition Deck & Stats
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchedCardsModal;
