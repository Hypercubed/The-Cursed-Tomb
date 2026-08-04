import React from 'react';
import { Card } from '../game';
import { PlayingCard } from './PlayingCard';

interface DrawZoneProps {
  drawPileCount: number;
  topStock?: Card | null;
  topDiscard: Card | null;
  vaultCard?: Card | null;
  selectedCardId: string | null;
  redrawsRemaining: number | null;
  canDraw: boolean;
  canCycle: boolean;
  gameActive: boolean;
  isVaultTargetActive?: boolean;
  animatingMatchIds?: string[];
  animatingErrorIds?: string[];
  onDraw: () => void;
  onCardClick: (cardId: string) => void;
  onVaultSlotClick?: () => void;
}

export function DrawZone({
  drawPileCount,
  topStock = null,
  topDiscard,
  vaultCard = null,
  selectedCardId,
  redrawsRemaining,
  canDraw,
  canCycle,
  gameActive,
  isVaultTargetActive = false,
  animatingMatchIds = [],
  animatingErrorIds = [],
  onDraw,
  onCardClick,
  onVaultSlotClick,
}: DrawZoneProps): React.ReactElement {
  const drawButtonLabel = canDraw
    ? `Pass to Waste (${drawPileCount})`
    : canCycle
      ? 'Cycle deck'
      : 'Empty';

  return (
    <div className="flex flex-row gap-6 sm:gap-8 items-start pt-4">
      {/* Draw / Stock pile slot */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-game-muted uppercase tracking-wide mb-2 font-display h-6 flex items-center">Stock top</div>
        {topStock !== null && drawPileCount > 0 ? (
          <div>
            <PlayingCard
              rank={topStock.rank}
              suit={topStock.suit}
              attritionStage={topStock.attritionStage}
              rewardStage={topStock.rewardStage}
              blessed={topStock.blessed}
              faceDown={topStock.faceDown}
              selected={topStock.id === selectedCardId}
              disabled={!gameActive}
              animatingMatch={animatingMatchIds.includes(topStock.id)}
              animatingError={animatingErrorIds.includes(topStock.id)}
              onClick={() => onCardClick(topStock.id)}
            />
          </div>
        ) : (
          <div className="w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px] rounded-lg sm:rounded-xl border border-dashed border-game-border flex flex-col items-center justify-center text-game-muted text-[0.65rem] sm:text-xs bg-[#100c08] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative">
            <div className="absolute inset-1 border border-dashed border-game-border/20 rounded-lg pointer-events-none" />
            <span>Empty</span>
          </div>
        )}

        <button
          type="button"
          className="mt-2 w-full px-2 py-1 bg-[#201912] border border-amber-900/40 hover:border-game-accent text-amber-200 text-[0.65rem] sm:text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          disabled={!gameActive || (!canDraw && !canCycle)}
          onClick={onDraw}
          title={canDraw ? 'Pass exposed Stock card to Waste pile (D or Space)' : canCycle ? 'Cycle Waste pile to Stock' : 'Stock empty'}
        >
          <span>{drawButtonLabel}</span>
          {(canDraw || canCycle) && (
            <span className="text-[0.55rem] text-game-muted font-mono bg-amber-900/30 px-1 py-0.5 rounded">[Space]</span>
          )}
        </button>

        <div className="text-xs text-game-muted mt-1">
          Cycles: {redrawsRemaining === null ? '∞' : redrawsRemaining}
        </div>
      </div>

      {/* Discard / Waste pile slot */}
      <div>
        <div className="flex items-center justify-between mb-2 h-6">
          <span className="text-xs text-game-muted uppercase tracking-wide font-display">Waste top</span>
        </div>
        {topDiscard !== null ? (
          <div>
            <PlayingCard
              rank={topDiscard.rank}
              suit={topDiscard.suit}
              attritionStage={topDiscard.attritionStage}
              rewardStage={topDiscard.rewardStage}
              blessed={topDiscard.blessed}
              faceDown={topDiscard.faceDown}
              selected={topDiscard.id === selectedCardId}
              disabled={!gameActive}
              animatingMatch={animatingMatchIds.includes(topDiscard.id)}
              animatingError={animatingErrorIds.includes(topDiscard.id)}
              onClick={() => onCardClick(topDiscard.id)}
            />
          </div>
        ) : (
          <div className="w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px] rounded-lg sm:rounded-xl border border-dashed border-game-border flex flex-col items-center justify-center text-game-muted text-[0.65rem] sm:text-xs bg-[#100c08] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative">
            <div className="absolute inset-1 border border-dashed border-game-border/20 rounded-lg pointer-events-none" />
            <span>Empty</span>
          </div>
        )}
      </div>

      {/* Diamond Vault Slot */}
      <div>
        <div className="text-xs text-amber-400/80 uppercase tracking-wide mb-2 font-display flex items-center gap-1 h-6">
          <span>♦</span> Vault
        </div>
        {vaultCard ? (
          <div>
            <PlayingCard
              rank={vaultCard.rank}
              suit={vaultCard.suit}
              attritionStage={vaultCard.attritionStage}
              rewardStage={vaultCard.rewardStage}
              blessed={vaultCard.blessed}
              faceDown={vaultCard.faceDown}
              selected={vaultCard.id === selectedCardId}
              disabled={!gameActive}
              animatingMatch={animatingMatchIds.includes(vaultCard.id)}
              animatingError={animatingErrorIds.includes(vaultCard.id)}
              onClick={() => onCardClick(vaultCard.id)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={onVaultSlotClick}
            disabled={!gameActive}
            className={`w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px] rounded-lg sm:rounded-xl border border-dashed text-[0.6rem] sm:text-xs bg-[#120d09] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
              isVaultTargetActive
                ? 'border-amber-400 ring-2 ring-amber-400/80 animate-pulse text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                : 'border-amber-900/40 text-amber-700/60 hover:border-amber-700/60'
            }`}
            title={isVaultTargetActive ? 'Click to Vault selected Blessed Diamond card' : 'Select a Blessed Diamond card, then click here to Vault'}
          >
            <div className="absolute inset-1 border border-dashed border-amber-900/20 rounded-lg pointer-events-none" />
            <span>♦ Vault</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default DrawZone;
