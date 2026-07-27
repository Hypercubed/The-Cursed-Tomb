import React from 'react';
import { Card, GameState, isBlocked } from '../game';
import { PlayingCard } from './PlayingCard';

interface PyramidBoardProps {
  pyramid: Card[][];
  selectedCardId: string | null;
  status: GameState['status'];
  vaultCard?: Card | null;
  interactionMode?: 'normal' | 'targeting-spades' | 'targeting-hearts';
  mode?: GameState['mode'];
  animatingMatchIds?: string[];
  animatingErrorIds?: string[];
  onCardClick: (cardId: string) => void;
  onMovePyramidToVault?: (cardId: string) => void;
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
  vaultCard,
  interactionMode = 'normal',
  mode = 'standard',
  animatingMatchIds = [],
  animatingErrorIds = [],
  onCardClick,
  onMovePyramidToVault,
}: PyramidBoardProps): React.ReactElement {
  return (
    <div className={`flex flex-col items-center py-2 sm:py-4 relative ${status === 'pyramid-collapse' ? 'overflow-hidden' : 'overflow-x-auto'}`}>
      {interactionMode === 'targeting-hearts' && (
        <div className="mb-2 px-3 py-1 bg-red-950/90 border border-red-700 text-red-200 text-xs font-semibold rounded-full animate-bounce">
          ♥ Hearts Martyr: Click one exposed pyramid card to grant temporary Anchor immunity!
        </div>
      )}

      {interactionMode === 'targeting-spades' && (
        <div className="mb-2 px-3 py-1 bg-blue-950/90 border border-blue-700 text-blue-200 text-xs font-semibold rounded-full animate-bounce">
          ♠ Spades Tunnel: Click one face-down card to reveal it!
        </div>
      )}

      {pyramid.map((row, rowIndex) => (
        <div
          className={`flex gap-1 sm:gap-2 justify-center ${
            rowIndex > 0 ? '-mt-8 sm:-mt-12 lg:-mt-14 xl:-mt-16 2xl:-mt-[72px]' : ''
          }`}
          key={rowIndex}
        >
          {row.map((card, colIndex) => {
            const blocked = isBlocked(card.id, pyramid);
            let isTargetable = false;

            if (interactionMode === 'targeting-hearts') {
              isTargetable = !card.removed && !blocked && !card.faceDown;
            } else if (interactionMode === 'targeting-spades') {
              isTargetable = !card.removed && Boolean(card.faceDown);
            }

            const isPlayable = isTargetable || (!card.removed && !blocked && !card.faceDown && status === 'in-progress' && interactionMode === 'normal');
            const isAnimatingMatch = animatingMatchIds.includes(card.id);
            const isAnimatingError = animatingErrorIds.includes(card.id);
            const isCollapsing = status === 'pyramid-collapse' && !card.removed;
            const canVaultPyramidCard =
              !card.removed &&
              !blocked &&
              !card.faceDown &&
              card.blessed &&
              card.suit === '♦' &&
              !vaultCard &&
              status === 'in-progress' &&
              interactionMode === 'normal';

            return (
              <div
                key={card.id}
                className={`relative ${isTargetable ? 'ring-2 ring-amber-400 rounded-lg sm:rounded-xl shadow-[0_0_12px_rgba(251,191,36,0.8)]' : ''}`}
              >
                {canVaultPyramidCard && onMovePyramidToVault && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePyramidToVault(card.id);
                    }}
                    className="absolute -top-3 -right-2 z-30 text-[10px] bg-amber-950 border border-amber-600 text-amber-300 rounded px-1.5 py-0.5 hover:bg-amber-900 cursor-pointer font-mono shadow-md animate-pulse"
                    title="Move ♦ Hero card to Diamond Vault"
                  >
                    Vault ♦
                  </button>
                )}
                <PlayingCard
                  rank={card.rank}
                  suit={card.suit}
                  attritionStage={card.attritionStage}
                  rewardStage={card.rewardStage}
                  blessed={card.blessed}
                  faceDown={card.faceDown}
                  removed={card.removed}
                  selected={card.id === selectedCardId}
                  blocked={blocked && !card.removed && interactionMode === 'normal'}
                  disabled={!isPlayable}
                  animatingMatch={isAnimatingMatch}
                  animatingError={isAnimatingError}
                  animatingCollapse={isCollapsing}
                  style={isCollapsing ? getCollapseStyle(rowIndex, colIndex) : undefined}
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
