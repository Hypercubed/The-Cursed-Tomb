import React from 'react';
import { Card, GameState, isBlocked } from '../game';
import { PlayingCard } from './PlayingCard';

interface PyramidBoardProps {
  pyramid: Card[][];
  selectedCardId: string | null;
  status: GameState['status'];
  vaultCards?: Card[];
  interactionMode?: 'normal' | 'targeting-spades';
  mode?: GameState['mode'];
  animatingMatchIds?: string[];
  animatingErrorIds?: string[];
  onCardClick: (cardId: string) => void;
  onMovePyramidToVault?: (cardId: string) => void;
}

const getCardTiltStyle = (row: number, col: number): React.CSSProperties => {
  const index = (row * (row + 1)) / 2 + col;
  const tiltDeg = ((((index * 7 + row * 3 + col * 13) % 9) - 4) * 0.35).toFixed(2);
  return {
    '--card-deal-tilt': `${tiltDeg}deg`,
  } as React.CSSProperties;
};

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
  vaultCards,
  interactionMode = 'normal',
  mode = 'standard',
  animatingMatchIds = [],
  animatingErrorIds = [],
  onCardClick,
  onMovePyramidToVault,
}: PyramidBoardProps): React.ReactElement {
  return (
    <div className={`game-interactive-surface flex flex-col items-center py-1 sm:py-2 relative ${status === 'pyramid-collapse' ? 'overflow-hidden' : 'overflow-x-auto'}`}>
      <div className="min-h-[32px] mb-2 flex items-center justify-center pointer-events-none" aria-live="polite">
        {interactionMode === 'targeting-spades' && (
          <div className="px-3 py-1 bg-blue-950/90 border border-blue-700 text-blue-200 text-xs font-semibold rounded-full animate-bounce shadow-md pointer-events-auto">
            ♠ Spades Tunnel: Click one exposed pyramid card to move it to the Waste pile!
          </div>
        )}
      </div>

      {pyramid.map((row, rowIndex) => (
        <div
          className={`pyramid-row flex gap-1 sm:gap-2 justify-center pointer-events-none ${
            rowIndex > 0 ? '-mt-8 sm:-mt-12 lg:-mt-14 xl:-mt-16 2xl:-mt-[72px]' : ''
          }`}
          key={rowIndex}
        >
          {row.map((card, colIndex) => {
            const blocked = isBlocked(card.id, pyramid);
            let isTargetable = false;

            if (interactionMode === 'targeting-spades') {
              isTargetable = !card.removed && !blocked && !card.faceDown;
            }

            const isPlayable = isTargetable || (!card.removed && !blocked && !card.faceDown && status === 'in-progress' && interactionMode === 'normal');
            const isAnimatingMatch = animatingMatchIds.includes(card.id);
            const isAnimatingError = animatingErrorIds.includes(card.id);
            const isCollapsing = status === 'pyramid-collapse' && !card.removed;
            const cardStyle: React.CSSProperties = {
              ...getCardTiltStyle(rowIndex, colIndex),
              ...(isCollapsing ? getCollapseStyle(rowIndex, colIndex) : {}),
            };

            return (
              <div
                key={card.id}
                className={`relative pointer-events-none ${isTargetable ? 'ring-2 ring-amber-400 rounded-lg sm:rounded-xl shadow-[0_0_12px_rgba(251,191,36,0.8)]' : ''}`}
              >
                <PlayingCard
                  rank={card.rank}
                  suit={card.suit}
                  attritionStage={card.attritionStage}
                  rewardStage={card.rewardStage}
                  anchorAbsorption={card.anchorAbsorption}
                  blessed={card.blessed}
                  faceDown={card.faceDown}
                  removed={card.removed}
                  selected={card.id === selectedCardId}
                  blocked={blocked && !card.removed && interactionMode === 'normal'}
                  disabled={!isPlayable}
                  animatingMatch={isAnimatingMatch}
                  animatingError={isAnimatingError}
                  animatingCollapse={isCollapsing}
                  style={cardStyle}
                  onClick={() => onCardClick(card.id)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default PyramidBoard;
