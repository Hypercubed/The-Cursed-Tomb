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
        <div className="text-xs text-game-muted uppercase tracking-wide mb-2">Draw pile</div>
        <button
          type="button"
          className="w-[72px] min-h-[96px] rounded-xl border border-game-border p-2 bg-gradient-to-b from-game-bg to-game-panel text-game-muted text-xs text-center leading-tight appearance-none font-[inherit] cursor-pointer hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color] duration-[120ms]"
          disabled={!gameActive || (!canDraw && !canCycle)}
          onClick={onDraw}
        >
          {drawButtonLabel}
        </button>
        <div className="text-xs text-game-muted mt-2">
          Cycles: {redrawsRemaining === null ? '∞' : redrawsRemaining}
        </div>
      </div>

      {/* Discard pile slot */}
      <div>
        <div className="text-xs text-game-muted uppercase tracking-wide mb-2">Discard top</div>
        {topDiscard !== null ? (
          <PlayingCard
            rank={topDiscard.rank}
            suit={topDiscard.suit}
            selected={topDiscard.id === selectedCardId}
            disabled={!gameActive}
            onClick={() => onCardClick(topDiscard.id)}
          />
        ) : (
          <div className="w-[72px] min-h-[96px] rounded-xl border border-dashed border-game-border flex items-center justify-center text-game-muted text-xs">
            Empty
          </div>
        )}
      </div>
    </div>
  );
}

export default DrawZone;
