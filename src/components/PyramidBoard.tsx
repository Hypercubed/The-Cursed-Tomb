import React from 'react';
import { Card, GameState, isBlocked } from '../game';
import { PlayingCard } from './PlayingCard';

interface PyramidBoardProps {
  pyramid: Card[][];
  selectedCardId: string | null;
  status: GameState['status'];
  animatingMatchIds?: string[];
  animatingErrorIds?: string[];
  onCardClick: (cardId: string) => void;
}

const getCollapseStyle = (row: number, col: number): React.CSSProperties => {
  const index = (row * (row + 1)) / 2 + col;
  const delayMs = index * 45;
  const rotateDeg = ((index % 5) - 2) * 5;
  const endRotateDeg = rotateDeg + (index % 2 === 0 ? 22 : -22);
  return {
    '--collapse-delay': `${delayMs}ms`,
    '--collapse-rotate': `${rotateDeg}deg`,
    '--collapse-rotate-end': `${endRotateDeg}deg`,
  } as React.CSSProperties;
};

export function PyramidBoard({
  pyramid,
  selectedCardId,
  status,
  animatingMatchIds = [],
  animatingErrorIds = [],
  onCardClick,
}: PyramidBoardProps): React.ReactElement {
  return (
    <div className={`flex flex-col items-center py-2 sm:py-4 relative ${status === 'pyramid-collapse' ? 'overflow-hidden' : 'overflow-x-auto'}`}>
      {pyramid.map((row, rowIndex) => (
        <div
          className={`flex gap-1 sm:gap-2 justify-center ${
            rowIndex > 0 ? '-mt-8 sm:-mt-12 lg:-mt-14 xl:-mt-16 2xl:-mt-[72px]' : ''
          }`}
          key={rowIndex}
        >
          {row.map((card, colIndex) => {
            const blocked = isBlocked(card.id, pyramid);
            const isPlayable = !card.removed && !blocked && status === 'in-progress';
            const isAnimatingMatch = animatingMatchIds.includes(card.id);
            const isAnimatingError = animatingErrorIds.includes(card.id);
            const isCollapsing = status === 'pyramid-collapse' && !card.removed;

            return (
              <PlayingCard
                key={card.id}
                rank={card.rank}
                suit={card.suit}
                removed={card.removed}
                selected={card.id === selectedCardId}
                blocked={blocked && !card.removed}
                disabled={!isPlayable}
                animatingMatch={isAnimatingMatch}
                animatingError={isAnimatingError}
                animatingCollapse={isCollapsing}
                style={isCollapsing ? getCollapseStyle(rowIndex, colIndex) : undefined}
                onClick={() => onCardClick(card.id)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default PyramidBoard;
