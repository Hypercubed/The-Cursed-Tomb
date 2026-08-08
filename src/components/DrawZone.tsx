import React from 'react';
import { Card, GameMode } from '../game';
import { PlayingCard } from './PlayingCard';
import { hapticTap } from '../utils/haptics';

interface DrawZoneProps {
  drawPileCount: number;
  discardPileCount?: number;
  topStock?: Card | null;
  topDiscard: Card | null;
  vaultCards: Card[];
  selectedCardId: string | null;
  redrawsRemaining: number | null;
  canDraw: boolean;
  canCycle: boolean;
  gameActive: boolean;
  isVaultTargetActive?: boolean;
  animatingMatchIds?: string[];
  animatingErrorIds?: string[];
  mode?: GameMode;
  onDraw: () => void;
  onCardClick: (cardId: string) => void;
  onVaultSlotClick?: () => void;
}

export function DrawZone({
  drawPileCount,
  discardPileCount = 0,
  topStock = null,
  topDiscard,
  vaultCards,
  selectedCardId,
  redrawsRemaining,
  canDraw,
  canCycle,
  gameActive,
  isVaultTargetActive = false,
  animatingMatchIds = [],
  animatingErrorIds = [],
  mode = 'cursed-tomb',
  onDraw,
  onCardClick,
  onVaultSlotClick,
}: DrawZoneProps): React.ReactElement {
  const drawButtonLabel = canDraw
    ? `Pass to Waste (${drawPileCount})`
    : canCycle
      ? 'Cycle deck'
      : 'Empty';
  const drawButtonIcon = canDraw ? '→' : canCycle ? '↻' : '—';

  return (
    <div className="game-interactive-surface flex flex-row gap-2 sm:gap-5 lg:gap-8 items-start pt-2.5 overflow-x-auto pb-1">
      {/* Draw / Stock pile slot */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-game-muted uppercase tracking-wide mb-2 font-display h-6 flex items-center justify-between gap-1.5 w-full">
          <span>Stock</span>
          <span className="bg-[#18120c] border border-amber-900/40 text-amber-300 font-mono text-[0.65rem] px-1.5 py-0.5 rounded shadow-sm" title={`${drawPileCount} cards remaining in stock`}>
            {drawPileCount}
          </span>
        </div>
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
          <div className="playing-card-slot w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px] rounded-lg sm:rounded-xl border border-dashed border-game-border flex flex-col items-center justify-center text-game-muted text-[0.65rem] sm:text-xs bg-[#100c08] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative">
            <div className="absolute inset-1 border border-dashed border-game-border/20 rounded-lg pointer-events-none" />
            <span>Empty</span>
          </div>
        )}
        <div className="text-xs text-game-muted mt-1">
          Cycles: {redrawsRemaining === null ? '∞' : redrawsRemaining}
        </div>
      </div>

      {/* Pass / cycle action between Stock and Waste */}
      <button
        type="button"
        className="mt-[3.375rem] min-h-11 min-w-11 sm:mt-[3.625rem] lg:mt-[5.25rem] shrink-0 rounded-full border border-amber-900/60 bg-[#201912] text-amber-200 text-2xl leading-none shadow-sm transition-[border-color,background-color,transform] hover:border-game-accent hover:bg-[#2a2017] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-game-accent-light focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!gameActive || (!canDraw && !canCycle)}
        onClick={onDraw}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch' && gameActive && (canDraw || canCycle)) hapticTap();
        }}
        aria-label={drawButtonLabel}
        title={`${drawButtonLabel} (D or Space)`}
      >
        <span aria-hidden="true">{drawButtonIcon}</span>
      </button>

      {/* Discard / Waste pile slot */}
      <div>
        <div className="flex items-center justify-between mb-2 h-6 gap-1.5 w-full">
          <span className="text-xs text-game-muted uppercase tracking-wide font-display">Waste</span>
          <span className="bg-[#18120c] border border-amber-900/40 text-amber-300 font-mono text-[0.65rem] px-1.5 py-0.5 rounded shadow-sm" title={`${discardPileCount} cards in waste`}>
            {discardPileCount}
          </span>
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
          <div className="playing-card-slot w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px] rounded-lg sm:rounded-xl border border-dashed border-game-border flex flex-col items-center justify-center text-game-muted text-[0.65rem] sm:text-xs bg-[#100c08] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative">
            <div className="absolute inset-1 border border-dashed border-game-border/20 rounded-lg pointer-events-none" />
            <span>Empty</span>
          </div>
        )}
      </div>

      {/* Diamond Vault Slot - only in cursed-tomb mode */}
      {mode === 'cursed-tomb' && (
        <div>
          <div className="text-xs text-amber-400/80 uppercase tracking-wide mb-2 font-display flex items-center justify-between gap-1.5 h-6 w-full">
            <span className="flex items-center gap-1"><span>♦</span> Vault</span>
            <span className="bg-[#18120c] border border-amber-900/40 text-amber-300 font-mono text-[0.65rem] px-1.5 py-0.5 rounded shadow-sm" title={`${vaultCards.length} card${vaultCards.length === 1 ? '' : 's'} vaulted`}>
              {vaultCards.length}
            </span>
          </div>
          {vaultCards.length > 0 ? (
            <div
              className={`relative rounded-lg sm:rounded-xl transition-all duration-200 ${
                isVaultTargetActive
                  ? 'ring-2 ring-amber-400/80 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.6)] cursor-pointer'
                  : ''
              }`}
              onClick={() => {
                if (isVaultTargetActive && onVaultSlotClick) {
                  onVaultSlotClick();
                }
              }}
              onPointerDown={(event) => {
                if (event.pointerType === 'touch' && gameActive && isVaultTargetActive) {
                  hapticTap();
                }
              }}
            >
              <PlayingCard
                rank={vaultCards[vaultCards.length - 1].rank}
                suit={vaultCards[vaultCards.length - 1].suit}
                attritionStage={vaultCards[vaultCards.length - 1].attritionStage}
                rewardStage={vaultCards[vaultCards.length - 1].rewardStage}
                blessed={vaultCards[vaultCards.length - 1].blessed}
                faceDown={vaultCards[vaultCards.length - 1].faceDown}
                selected={vaultCards[vaultCards.length - 1].id === selectedCardId}
                disabled={!gameActive}
                animatingMatch={animatingMatchIds.includes(vaultCards[vaultCards.length - 1].id)}
                animatingError={animatingErrorIds.includes(vaultCards[vaultCards.length - 1].id)}
                onClick={() => onCardClick(vaultCards[vaultCards.length - 1].id)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={onVaultSlotClick}
              onPointerDown={(event) => {
                if (event.pointerType === 'touch' && gameActive) {
                  hapticTap();
                }
              }}
              disabled={!gameActive}
              className={`playing-card-slot w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px] rounded-lg sm:rounded-xl border border-dashed text-[0.6rem] sm:text-xs bg-[#120d09] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
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
      )}
    </div>
  );
}

export default DrawZone;
