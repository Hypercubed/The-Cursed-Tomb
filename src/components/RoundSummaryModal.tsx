import React from 'react';
import { Card, GameStatus, GameMode, getFunctionalValue, RoundLifecycleEffects, FinalClearDetails } from '../game';
import { PlayingCard } from './PlayingCard';

interface RoundSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GameStatus;
  mode?: GameMode;
  roundNumber?: number;
  effects: RoundLifecycleEffects | null;
  onNextRound?: () => void;
  onOpenVault?: () => void;
}

export function RoundSummaryModal({
  isOpen,
  onClose,
  status,
  mode = 'cursed-tomb',
  roundNumber = 1,
  effects,
  onNextRound,
  onOpenVault,
}: RoundSummaryModalProps): React.ReactElement | null {
  const primaryBtnRef = React.useRef<HTMLButtonElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (onNextRound && primaryBtnRef.current) {
          primaryBtnRef.current.focus();
        } else if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        }
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
    }
  }, [isOpen, onNextRound, onClose]);

  if (!isOpen || !effects) return null;

  const isVictory = status === 'complete-victory' || status === 'partial-victory';
  const hasEffects =
    effects.blessed.length > 0 ||
    effects.anchored.length > 0 ||
    effects.cursed.length > 0 ||
    effects.scarred.length > 0 ||
    effects.entombed.length > 0;

  const getSuitBlessingDescription = (suit: string) => {
    switch (suit) {
      case '♥':
        return '♥ Stock Reshuffle: Shuffles all Waste pile cards back into Stock draw pile';
      case '♦':
        return '♦ Vault: Free move to Vault slot when top card of Waste pile';
      case '♠':
        return '♠ Tunnel: Move 1 exposed pyramid card to the Waste pile when cleared';
      case '♣':
        return '♣ Equalizer: Partner card ignores all active scar value shifts';
      default:
        return 'Hero Suit Blessing Unlocked!';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="round-summary-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-lg w-full flex flex-col max-h-[85vh] shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-[#2d2319] ${isVictory ? 'bg-gradient-to-r from-amber-950/80 to-[#120e0a]' : 'bg-gradient-to-r from-red-950/80 to-[#120e0a]'
            }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isVictory ? '🌟' : '🏺'}</span>
            <div>
              <h2 id="round-summary-title" className="text-lg font-semibold text-game-text font-display tracking-wider uppercase m-0">
                {isVictory ? 'Pyramid Clear — Legacy Unlocks' : 'Pyramid Collapse — Attrition Summary'}
              </h2>
              <p className="text-xs text-game-muted m-0">
                Round {roundNumber} End of Round Effects
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-game-muted hover:text-game-text bg-transparent border-none text-xl font-bold cursor-pointer p-1 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 text-sm">
          {/* Final Clear Transaction Details for Victory */}
          {isVictory && effects.clearDetails && (
            <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-amber-300 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                <span>𓂠</span> Final Pyramid Clear Transaction
              </h3>

              {effects.clearDetails.isSoloKing ? (
                <div className="text-xs text-game-muted flex flex-col gap-1.5 bg-[#18130e] p-3 rounded border border-[#251e16]">
                  <div className="font-semibold text-game-text">
                    Solo King Clear: {effects.clearDetails.anchorCard?.suit}{effects.clearDetails.anchorCard?.rank}
                  </div>
                  <p className="m-0 text-game-muted/90 leading-relaxed">
                    {effects.clearDetails.anchorBlockedByScar
                      ? 'Rule of Ink Overlap: Card already features upper-right scar marks, so defensive Anchor stroke could not be applied.'
                      : effects.clearDetails.anchorAlreadyMaxed
                        ? 'Card is already fully Anchored [+].'
                        : 'Defensive Anchor stroke added! (No Fallen Hero blessing is awarded for Solo King clears).'}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-game-muted flex flex-col gap-2 bg-[#18130e] p-3 rounded border border-[#251e16]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-game-text">Final Pair:</span>
                    <span className="font-mono text-amber-200 font-bold">
                      {effects.clearDetails.heroCard?.suit}{effects.clearDetails.heroCard?.rank} (Higher)
                    </span>
                    <span>&amp;</span>
                    <span className="font-mono text-amber-200 font-bold">
                      {effects.clearDetails.anchorCard?.suit}{effects.clearDetails.anchorCard?.rank} (Lower)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-[#251e16] pt-2">
                    <div className="text-emerald-300 font-medium flex items-start gap-1.5">
                      <span>👑</span>
                      <span>
                        <strong>Higher Card ({effects.clearDetails.heroCard?.suit}{effects.clearDetails.heroCard?.rank}):</strong>{' '}
                        {effects.clearDetails.heroAlreadyBlessed
                          ? 'Already a Blessed Fallen Hero [O] from a previous round.'
                          : 'Granted Fallen Hero Blessing [O]! Unlocked suit blessing for subsequent rounds.'}
                      </span>
                    </div>

                    <div className="text-blue-300 font-medium flex items-start gap-1.5">
                      <span>⚓</span>
                      <span>
                        <strong>Lower Card ({effects.clearDetails.anchorCard?.suit}{effects.clearDetails.anchorCard?.rank}):</strong>{' '}
                        {effects.clearDetails.anchorBlockedByScar
                          ? 'Rule of Ink Overlap: Card features upper-right scar marks, so defensive Anchor stroke [—] cannot be applied.'
                          : effects.clearDetails.anchorAlreadyMaxed
                            ? 'Already fully Anchored [+].'
                            : 'Defensive Anchor stroke applied!'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasEffects && !effects.clearDetails ? (
            <div className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-5 text-center text-game-muted">
              <p className="m-0">No new scars, curses, or blessings were acquired this round.</p>
            </div>
          ) : (
            <>
              {/* Blessed Heroes */}
              {effects.blessed.length > 0 && (
                <div className="bg-emerald-950/30 border border-emerald-700/60 rounded-lg p-4 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-emerald-300 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                    <span>👑</span> New Blessed Hero Cards ([O])
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {effects.blessed.map((card) => (
                      <div key={card.id} className="flex items-center gap-3 bg-[#120e0a]/80 p-2.5 rounded border border-emerald-900/50">
                        <PlayingCard
                          rank={card.rank}
                          suit={card.suit}
                          blessed={true}
                          disabled={true}
                        />
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-bold text-emerald-200">
                            {card.suit}{card.rank} — Fallen Hero Blessing
                          </span>
                          <span className="text-[11px] text-emerald-400/90 leading-tight">
                            {getSuitBlessingDescription(card.suit)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anchored / Fortifying Cards */}
              {effects.anchored.length > 0 && (
                <div className="bg-blue-950/30 border border-blue-700/60 rounded-lg p-4 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-blue-300 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                    <span>⚓</span> Anchored Defense Upgrades ([+] / [—])
                  </h3>
                  <div className="flex flex-col gap-2">
                    {effects.anchored.map((card) => (
                      <div key={card.id} className="flex items-center gap-3 bg-[#120e0a]/80 p-2 rounded border border-blue-900/50">
                        <PlayingCard
                          rank={card.rank}
                          suit={card.suit}
                          rewardStage={card.rewardStage}
                          disabled={true}
                        />
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-bold text-blue-200">
                            {card.suit}{card.rank} — {card.rewardStage === 2 ? 'Anchored [+]' : 'Fortifying [—]'}
                          </span>
                          <span className="text-[11px] text-blue-300/80 leading-tight">
                            {card.rewardStage === 2
                              ? 'Permanently immune to upper-right attrition scar marks!'
                              : 'First defensive stroke applied. One more to achieve full Anchor immunity.'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cursed Cards */}
              {effects.cursed.length > 0 && (
                <div className="bg-purple-950/40 border border-purple-700/70 rounded-lg p-4 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-purple-300 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                    <span>⚡</span> New Cursed Cards
                  </h3>
                  <div className="flex flex-col gap-2">
                    {effects.cursed.map((card) => {
                      const isRedCurse = card.suit === '♥' || card.suit === '♦';
                      return (
                        <div key={card.id} className="flex items-center gap-3 bg-[#120e0a]/80 p-2.5 rounded border border-purple-900/50">
                          <PlayingCard
                            rank={card.rank}
                            suit={card.suit}
                            attritionStage={card.attritionStage}
                            disabled={true}
                          />
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="font-bold text-purple-200">
                              {card.suit}{card.rank} — {isRedCurse ? 'Red Curse ⚡' : 'Black Curse ⚡'}
                            </span>
                            <span className="text-[11px] text-purple-300/90 leading-tight">
                              {isRedCurse
                                ? 'Red Curse: Locks cards beneath it face-down when dealt into the pyramid.'
                                : 'Black Curse: Shuffles its paired partner card back into the Stock pile.'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Scarred / Attrition Cards */}
              {effects.scarred.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-4 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-amber-300 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                    <span>🩸</span> New Attrition Marks
                  </h3>
                  <div className="flex flex-col gap-2">
                    {effects.scarred.map((card) => {
                      const fVal = getFunctionalValue(card, mode);
                      const isRed = card.suit === '♥' || card.suit === '♦';
                      const stage = card.attritionStage;
                      const rLabel = card.rank === 1 ? 'A' : card.rank === 11 ? 'J' : card.rank === 12 ? 'Q' : card.rank === 13 ? 'K' : String(card.rank);
                      const fValStr = fVal === 1 ? 'A' : fVal === 11 ? 'J' : fVal === 12 ? 'Q' : fVal === 13 ? 'K' : String(fVal);

                      let stageTitle = isRed ? `Red Scar (|${rLabel}\\|)` : `Black Scar (|${rLabel}\\|)`;
                      let description = isRed
                        ? `Functional Value shifted +1 (now acts as rank ${fValStr})`
                        : `Functional Value shifted -1 (now acts as rank ${fValStr})`;

                      if (stage === 1) {
                        stageTitle = `Vulnerable (|${rLabel})`;
                        description = '1st attrition line to the left of rank (No functional value shift yet)';
                      } else if (stage === 2) {
                        stageTitle = `Doubtful (|${rLabel}|)`;
                        description = '2nd attrition line framing rank (No functional value shift yet)';
                      } else if (stage === 3) {
                        stageTitle = isRed ? `Red Scar (|${rLabel}\\|)` : `Black Scar (|${rLabel}\\|)`;
                      }

                      return (
                        <div key={card.id} className="flex items-center gap-3 bg-[#120e0a]/80 p-2 rounded border border-amber-900/40">
                          <PlayingCard
                            rank={card.rank}
                            suit={card.suit}
                            attritionStage={card.attritionStage}
                            disabled={true}
                          />
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="font-bold text-amber-200">
                              {card.suit}{card.rank} — {stageTitle} {stage >= 3 ? `(FV: ${fValStr})` : ''}
                            </span>
                            <span className="text-[11px] text-amber-300/80 leading-tight">
                              {description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Entombed Cards */}
              {effects.entombed.length > 0 && (
                <div className="bg-red-950/40 border border-red-800/70 rounded-lg p-4 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-red-300 font-display uppercase tracking-wider m-0 flex items-center gap-2">
                    <span>💀</span> Cards Entombed to Graveyard
                  </h3>
                  <div className="flex flex-col gap-2">
                    {effects.entombed.map((card) => (
                      <div key={card.id} className="flex items-center gap-3 bg-[#120e0a]/80 p-2 rounded border border-red-900/50">
                        <PlayingCard
                          rank={card.rank}
                          suit={card.suit}
                          attritionStage={card.attritionStage}
                          disabled={true}
                        />
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-bold text-red-300">
                            {card.suit}{card.rank} — Entombed 💀
                          </span>
                          <span className="text-[11px] text-red-400/80 leading-tight">
                            5 attrition marks reached. Permanently removed to the Graveyard!
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2d2319] bg-[#120e0a] flex items-center justify-between gap-3">
          {onOpenVault && (
            <button
              type="button"
              onClick={onOpenVault}
              className="appearance-none bg-[#18130e] border border-[#3d3124] text-amber-300 rounded-lg text-xs cursor-pointer font-[inherit] px-3.5 py-2 hover:border-amber-700 transition-colors font-medium flex items-center gap-1.5"
            >
              <span>📜</span> View Deck Matrix
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {onNextRound && (
              <button
                ref={primaryBtnRef}
                type="button"
                onClick={onNextRound}
                className="appearance-none bg-amber-950/90 border border-amber-700 text-amber-200 rounded-lg text-xs cursor-pointer font-[inherit] px-4 py-2 hover:bg-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors font-semibold flex items-center gap-1.5"
              >
                <span>📜</span> Next Round
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-xs cursor-pointer font-[inherit] px-4 py-2 hover:border-game-accent focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoundSummaryModal;
