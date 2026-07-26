import React from 'react';
import { Card } from '../game';
import { PlayingCard } from './PlayingCard';

interface DrawZoneProps {
  drawPileCount: number;
  topDiscard: Card | null;
  selectedCardId: string | null;
  redrawsRemaining: number | null;
  canDraw: boolean;
  canCycle: boolean;
  gameActive: boolean;
  animatingMatchIds?: string[];
  animatingErrorIds?: string[];
  onDraw: () => void;
  onCardClick: (cardId: string) => void;
}

export function DrawZone({
  drawPileCount,
  topDiscard,
  selectedCardId,
  redrawsRemaining,
  canDraw,
  canCycle,
  gameActive,
  animatingMatchIds = [],
  animatingErrorIds = [],
  onDraw,
  onCardClick,
}: DrawZoneProps): React.ReactElement {
  const drawButtonLabel = canDraw
    ? `Draw (${drawPileCount})`
    : canCycle
      ? 'Cycle deck'
      : 'Empty';

  return (
    <div className="flex flex-row gap-8 items-start pt-4">
      {/* Draw pile slot */}
      <div>
        <div className="text-xs text-game-muted uppercase tracking-wide mb-2 font-display">Draw pile</div>
        <button
          type="button"
          className="w-12 min-h-[64px] sm:w-[72px] sm:min-h-[96px] lg:w-[88px] lg:min-h-[116px] xl:w-[96px] xl:min-h-[128px] 2xl:w-[108px] 2xl:min-h-[144px] rounded-lg sm:rounded-xl border border-amber-900/40 p-1 sm:p-2 bg-[#201912] text-amber-200 text-xs text-center leading-tight appearance-none font-[inherit] cursor-pointer hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color,box-shadow,transform] duration-[120ms] relative overflow-hidden flex flex-col items-center justify-between shadow-[inset_0_0_8px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4)] active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_10px_rgba(217,119,6,0.15)]"
          disabled={!gameActive || (!canDraw && !canCycle)}
          onClick={onDraw}
        >
          {/* Stone-carved golden scarab emblem */}
          <div className="w-5 h-5 sm:w-8 sm:h-8 text-game-accent opacity-85 mt-1 sm:mt-2 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
              <path d="M12 2c-2 0-3.6 1.4-3.9 3.2C6.8 5.6 5.8 7 5.3 8.8L5 10c0 3.3 2.2 6 5 6.8V21c0 .6.4 1 1 1s1-.4 1-1v-4.2c2.8-.8 5-3.5 5-6.8l-.3-1.2c-.5-1.8-1.5-3.2-2.8-3.6C15.6 3.4 14 2 12 2zm0 2.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm-5 6.3c0-2.5 1.8-4.5 4.1-4.9v9.8C8.8 15 7 13 7 10.5zm10 0c0 2.5-1.8 4.5-4.1 4.9V5.6c2.3.4 4.1 2.4 4.1 4.9z" />
            </svg>
          </div>
          <span className="font-bold text-[0.55rem] sm:text-[0.6rem] tracking-wider uppercase mb-1">{drawButtonLabel}</span>
        </button>
        <div className="text-xs text-game-muted mt-2">
          Cycles: {redrawsRemaining === null ? '∞' : redrawsRemaining}
        </div>
      </div>

      {/* Discard pile slot */}
      <div>
        <div className="text-xs text-game-muted uppercase tracking-wide mb-2 font-display">Discard top</div>
        {topDiscard !== null ? (
          <div className={`rounded-lg sm:rounded-xl transition-all duration-[120ms] ${selectedCardId === topDiscard.id ? 'p-[2px] bg-gradient-to-r from-game-accent to-game-accent-light shadow-[0_0_12px_rgba(217,119,6,0.35)]' : ''}`}>
            <PlayingCard
              rank={topDiscard.rank}
              suit={topDiscard.suit}
              selected={topDiscard.id === selectedCardId}
              disabled={!gameActive}
              animatingMatch={animatingMatchIds.includes(topDiscard.id)}
              animatingError={animatingErrorIds.includes(topDiscard.id)}
              onClick={() => onCardClick(topDiscard.id)}
            />
          </div>
        ) : (
          <div className="w-12 min-h-[64px] sm:w-[72px] sm:min-h-[96px] lg:w-[88px] lg:min-h-[116px] xl:w-[96px] xl:min-h-[128px] 2xl:w-[108px] 2xl:min-h-[144px] rounded-lg sm:rounded-xl border border-dashed border-game-border flex flex-col items-center justify-center text-game-muted text-[0.65rem] sm:text-xs bg-[#100c08] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative">
            {/* Sandstone altar inner border */}
            <div className="absolute inset-1 border border-dashed border-game-border/20 rounded-lg pointer-events-none" />
            <span>Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DrawZone;
