import React from 'react';
import { Card, GameState, isBlocked } from '../game';
import { PlayingCard } from './PlayingCard';

interface PyramidBoardProps {
  pyramid: Card[][];
  selectedCardId: string | null;
  status: GameState['status'];
  onCardClick: (cardId: string) => void;
}

export function PyramidBoard({
  pyramid,
  selectedCardId,
  status,
  onCardClick,
}: PyramidBoardProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 items-center py-4">
      {pyramid.map((row, rowIndex) => (
        <div className="flex gap-2 justify-center" key={rowIndex}>
          {row.map((card) => {
            const blocked = isBlocked(card.id, pyramid);
            const isPlayable = !card.removed && !blocked && status === 'in-progress';

            return (
              <PlayingCard
                key={card.id}
                rank={card.rank}
                suit={card.suit}
                removed={card.removed}
                selected={card.id === selectedCardId}
                blocked={blocked && !card.removed}
                disabled={!isPlayable}
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
