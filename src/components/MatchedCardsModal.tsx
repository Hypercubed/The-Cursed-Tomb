import { useEffect } from 'react';
import { PairStat, Suit, Rank, CursedCard, GameMode, getFunctionalValue } from '../game';

interface MatchedCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  removedCardIds: Set<string>;
  pairStats: PairStat[];
  masterDeck?: CursedCard[];
  mode?: GameMode;
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
}: MatchedCardsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalRemoved = removedCardIds.size;
  const percentage = Math.round((totalRemoved / 52) * 100);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2319] bg-[#120e0a]">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-game-accent">📜</span>
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-game-text font-display tracking-wider uppercase m-0">
                Deck Codex
              </h2>
              <p className="text-xs text-game-muted m-0 mt-0.5">
                {mode === 'cursed-tomb'
                  ? 'Master campaign deck state, active mutations & remaining pair odds'
                  : 'Deck matrix overview & remaining strategic pair odds'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#251c14] border border-game-border rounded-full text-xs text-game-accent font-mono font-medium">
              {totalRemoved} / 52 Removed ({percentage}%)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-game-muted hover:text-game-text bg-transparent border-none text-xl font-bold cursor-pointer p-1 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Section 1: 4x13 Card Grid */}
          <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-semibold text-game-muted font-display tracking-wider uppercase mt-0 mb-3 flex items-center justify-between flex-wrap gap-2">
              <span>Deck Status Matrix (4 × 13)</span>
              <span className="text-[11px] font-normal normal-case opacity-90 flex items-center gap-2.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-game-accent/20 border border-game-accent"></span> Removed
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#18130e] border border-[#251e16]"></span> Active
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <span className="font-mono font-bold">(◯)</span> Blessed Hero
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <span className="font-mono font-bold">—</span> Fortifying
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <span className="font-mono font-bold">+</span> Anchored
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <span className="font-mono font-bold">|X|</span> Cursed
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <span className="font-mono font-bold">|#\|</span> Scarred
                </span>
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <span>💀</span> Entombed
                </span>
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
                      const attritionStage = cursedCard?.attritionStage ?? 0;
                      const isCursed = attritionStage === 4;
                      const isScarred = attritionStage > 0 && attritionStage < 4;
                      const isEntombed = attritionStage === 5;

                      const statusParts: string[] = [];
                      if (isBlessed) {
                        if (suit === '♥') statusParts.push('Blessed Hero (◯) (Hearts Resurrection: Revive from Graveyard)');
                        else if (suit === '♦') statusParts.push('Blessed Hero (◯) (Diamonds Vault: Store 1 Waste Card)');
                        else if (suit === '♠') statusParts.push('Blessed Hero (◯) (Spades Tunnel: Flip Face-Down Card)');
                        else if (suit === '♣') statusParts.push('Blessed Hero (◯) (Clubs Rally: Redraw Stock)');
                        else statusParts.push('Blessed Hero (◯)');
                      }
                      if (rewardStage === 1) statusParts.push('Fortifying Anchor (─)');
                      if (rewardStage === 2) statusParts.push('Anchored (✢)');
                      if (attritionStage === 1) statusParts.push(`Scar 1 (|${rLabel})`);
                      if (attritionStage === 2) statusParts.push(`Scar 2 (|${rLabel}|)`);
                      if (attritionStage === 3) statusParts.push(`Scar 3 (|${rLabel}\\|)`);
                      if (isCursed) {
                        if (suit === '♥' || suit === '♦') statusParts.push('Red Curse |X| (+1 Shift, Locks Cards Face-Down)');
                        else statusParts.push('Black Curse |X| (-1 Shift, Pyramid Pairing Only)');
                      }
                      if (isEntombed) statusParts.push('Entombed 💀');
                      if (fVal !== rank) statusParts.push(`Functional Value: ${fValLabel}`);
                      statusParts.push(isRemoved ? 'Removed' : 'Active');

                      const tooltipText = `${suit}${rLabel} (${statusParts.join(', ')})`;

                      let cardStyleClasses = 'bg-[#18130e] border-[#251e16] text-game-muted/60';
                      if (isEntombed) {
                        cardStyleClasses = 'bg-stone-950 border-red-950 text-red-700/60 opacity-60';
                      } else if (isBlessed) {
                        cardStyleClasses = 'bg-blue-950/40 border-blue-500/80 text-blue-200 ring-1 ring-blue-400/60 shadow-[0_0_8px_rgba(37,99,235,0.25)]';
                      } else if (isCursed) {
                        cardStyleClasses = 'bg-blue-950/40 border-blue-600/80 text-blue-200 ring-1 ring-blue-500/60 shadow-[0_0_8px_rgba(37,99,235,0.25)]';
                      } else if (isScarred) {
                        cardStyleClasses = 'bg-blue-950/30 border-blue-600/70 text-blue-200';
                      } else if (isRemoved) {
                        cardStyleClasses = 'bg-[#2a2016] border-game-accent text-game-accent shadow-[0_0_6px_rgba(212,175,55,0.2)]';
                      }

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
                                <svg className="w-2.5 h-2.5" viewBox="0 0 100 100">
                                  <line x1="10" y1="50" x2="90" y2="50" stroke="#3b82f6" strokeWidth="24" strokeLinecap="round" />
                                  <line x1="50" y1="10" x2="50" y2="90" stroke="#3b82f6" strokeWidth="24" strokeLinecap="round" />
                                </svg>
                              )}
                            </div>
                          )}

                          {/* Rank Row with Blue Slashed Scar Overlay */}
                          <div className="flex items-center justify-center w-full leading-none relative">
                            {isEntombed ? (
                              <span className="text-xs">💀</span>
                            ) : (
                              <span className="relative inline-block leading-none">
                                <span>{rLabel}</span>
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

                          {/* Suit Row with Blessing ring */}
                          <div className="relative inline-flex items-center justify-center text-[9px] leading-none">
                            <span className={`relative flex items-center justify-center ${isRedSuit(suit) ? 'text-game-red' : 'text-game-text'}`}>
                              <span>{symbol}</span>
                              {isBlessed && (
                                <svg
                                  aria-hidden="true"
                                  className="absolute -inset-[40%] w-[180%] h-[180%] pointer-events-none overflow-visible z-10"
                                  viewBox="0 0 100 100"
                                >
                                  <circle cx="50" cy="50" r="46" stroke="#2563eb" strokeWidth="18" fill="none" />
                                </svg>
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
            <h3 className="text-xs font-semibold text-game-muted font-display tracking-wider uppercase mt-0 mb-3">
              Remaining Complement Pairs (Sums to 13)
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#2d2319] bg-[#120e0a] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-5 py-1.5 hover:border-game-accent transition-colors"
          >
            Close Deck Codex
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchedCardsModal;
