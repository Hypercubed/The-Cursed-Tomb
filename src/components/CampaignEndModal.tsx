import React from 'react';
import { CampaignState, RoundLifecycleEffects, getFunctionalValue } from '../game';
import { CampaignStats } from '../storage/persistence';
import { PlayingCard } from './PlayingCard';

interface CampaignEndModalProps {
  isOpen: boolean;
  mode: 'defeat' | 'victory';
  defeatReason?: 'starvation' | 'volatile-collapse';
  campaign: CampaignState | null;
  campaignStats: CampaignStats;
  roundNumber?: number;
  effects: RoundLifecycleEffects | null;
  onStartNewCampaign: () => void;
  onOpenVault: () => void;
}

export function CampaignEndModal({
  isOpen,
  mode,
  defeatReason,
  campaign,
  campaignStats,
  roundNumber,
  effects,
  onStartNewCampaign,
  onOpenVault,
}: CampaignEndModalProps): React.ReactElement | null {
  const primaryBtnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        primaryBtnRef.current?.focus();
      }, 0);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onStartNewCampaign();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onStartNewCampaign]);

  if (!isOpen || !campaign) return null;

  const isDefeat = mode === 'defeat';
  const effectiveRoundNumber = roundNumber ?? campaign.roundNumber;

  // Deck statistics derived from campaign.masterDeck
  const entombedCount = campaign.masterDeck.filter((c) => c.attritionStage === 5).length;
  const blessedCount = campaign.masterDeck.filter((c) => c.blessed).length;
  const anchoredCount = campaign.masterDeck.filter((c) => (c.rewardStage ?? 0) >= 1).length;

  // Attrition summary for defeat mode
  const hasScarred = (effects?.scarred?.length ?? 0) > 0;
  const hasCursed = (effects?.cursed?.length ?? 0) > 0;
  const hasEntombed = (effects?.entombed?.length ?? 0) > 0;
  const hasFinalRoundMarks = hasScarred || hasCursed || hasEntombed;

  const subMessage = isDefeat
    ? defeatReason === 'starvation'
      ? 'Starvation — not enough cards remain to deal a new pyramid'
      : defeatReason === 'volatile-collapse'
      ? 'Volatile Collapse — an entire rank has been entombed'
      : "The tomb's ancient curse has claimed all remaining cards"
    : 'Perfect Win — all 52 cards cleared to the Foundation';

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-end-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-lg w-full flex flex-col max-h-[90vh] shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 border-b border-[#2d2319] ${
            isDefeat
              ? 'bg-gradient-to-r from-red-950/80 to-[#120e0a]'
              : 'bg-gradient-to-r from-amber-950/80 to-[#120e0a]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{isDefeat ? '💀' : '👑'}</span>
            <div>
              <h2
                id="campaign-end-title"
                className={`text-xl font-bold font-display tracking-wider uppercase m-0 ${
                  isDefeat ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                {isDefeat ? 'The Tomb Collapsed' : 'The Tomb Has Been Conquered'}
              </h2>
              <p className="text-xs text-game-muted m-0 mt-1">{subMessage}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6 text-sm">
          {/* Campaign Run Statistics */}
          <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-amber-300/90 font-display uppercase tracking-wider m-0 flex items-center gap-2">
              <span>📜</span> Campaign Run Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col">
                <span className="text-game-muted">Rounds Survived</span>
                <span className="text-lg font-bold text-game-text font-display">{effectiveRoundNumber}</span>
              </div>
              <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col">
                <span className="text-game-muted">Pyramids Cleared</span>
                <span className="text-lg font-bold text-emerald-400 font-display">{campaignStats.pyramidsExplored}</span>
              </div>
              <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col">
                <span className="text-game-muted">Pyramids Collapsed</span>
                <span className="text-lg font-bold text-red-400 font-display">{campaignStats.pyramidsCollapsed}</span>
              </div>
              <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col">
                <span className="text-game-muted">Total Attempts</span>
                <span className="text-lg font-bold text-game-text font-display">{campaignStats.totalAttempts}</span>
              </div>
            </div>

            {/* Deck Composition Summary */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-[#251e16]">
              <div className="flex flex-col items-center p-2 rounded bg-[#18130e]/60 border border-[#251e16]">
                <span className="text-red-400 font-bold text-base">{entombedCount}</span>
                <span className="text-[11px] text-game-muted">Entombed</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-[#18130e]/60 border border-[#251e16]">
                <span className="text-amber-300 font-bold text-base">{blessedCount}</span>
                <span className="text-[11px] text-game-muted">Blessed</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-[#18130e]/60 border border-[#251e16]">
                <span className="text-blue-300 font-bold text-base">{anchoredCount}</span>
                <span className="text-[11px] text-game-muted">Anchored</span>
              </div>
            </div>
          </div>

          {/* Inline Attrition Summary (Defeat Mode only) */}
          {isDefeat && (
            <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-red-400 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                <span>⚱️</span> Final Round Attrition Summary
              </h3>

              {!hasFinalRoundMarks ? (
                <p className="text-xs text-game-muted italic m-0 bg-[#18130e] p-3 rounded border border-[#251e16]">
                  No new marks in the final round
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Entombed Cards */}
                  {hasEntombed && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">
                        Entombed Cards (Graveyard Box)
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {effects?.entombed.map((card) => (
                          <div
                            key={card.id}
                            className="flex items-center gap-3 bg-[#18130e] p-2 rounded border border-red-900/40"
                          >
                            <PlayingCard rank={card.rank} suit={card.suit} attritionStage={5} disabled={true} />
                            <span className="text-xs font-bold text-red-300">
                              {card.suit}
                              {card.rank === 1
                                ? 'A'
                                : card.rank === 11
                                ? 'J'
                                : card.rank === 12
                                ? 'Q'
                                : card.rank === 13
                                ? 'K'
                                : card.rank}{' '}
                              — Entombed to Graveyard
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cursed Cards */}
                  {hasCursed && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-purple-400/90 uppercase tracking-wider">
                        New Cursed Cards
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {effects?.cursed.map((card) => (
                          <div
                            key={card.id}
                            className="flex items-center gap-3 bg-[#18130e] p-2 rounded border border-purple-900/40"
                          >
                            <PlayingCard rank={card.rank} suit={card.suit} attritionStage={card.attritionStage} disabled={true} />
                            <span className="text-xs font-bold text-purple-300">
                              {card.suit}
                              {card.rank === 1
                                ? 'A'
                                : card.rank === 11
                                ? 'J'
                                : card.rank === 12
                                ? 'Q'
                                : card.rank === 13
                                ? 'K'
                                : card.rank}{' '}
                              — Cursed ⚡
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scarred Cards */}
                  {hasScarred && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">
                        New Attrition Marks
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {effects?.scarred.map((card) => {
                          const fVal = getFunctionalValue(card, 'cursed-tomb');
                          const rLabel =
                            card.rank === 1
                              ? 'A'
                              : card.rank === 11
                              ? 'J'
                              : card.rank === 12
                              ? 'Q'
                              : card.rank === 13
                              ? 'K'
                              : String(card.rank);
                          return (
                            <div
                              key={card.id}
                              className="flex items-center gap-3 bg-[#18130e] p-2 rounded border border-amber-900/40"
                            >
                              <PlayingCard rank={card.rank} suit={card.suit} attritionStage={card.attritionStage} disabled={true} />
                              <span className="text-xs font-bold text-amber-300">
                                {card.suit}
                                {rLabel} — Attrition Stage {card.attritionStage} (Value: {fVal})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 border-t border-[#2d2319] bg-[#120e0a] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenVault}
            className="px-4 py-2.5 rounded-lg bg-[#251e16] hover:bg-[#32281d] text-amber-200 border border-[#3d3124] text-xs font-semibold uppercase tracking-wider font-display transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>🎴</span> View Card Codex
          </button>
          <button
            ref={primaryBtnRef}
            type="button"
            onClick={onStartNewCampaign}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-display transition-colors cursor-pointer border focus:ring-2 focus:ring-amber-500 focus:outline-none ${
              isDefeat
                ? 'bg-red-900/80 hover:bg-red-800 text-red-100 border-red-700'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-400'
            }`}
          >
            Start New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
