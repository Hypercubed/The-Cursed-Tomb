import React from 'react';
import { getHandDrawnTransform } from '../utils/handDrawnTransforms';

interface CardFaceIllustrationProps {
  suit: string;
  rank?: number;
  blessed?: boolean;
  attritionStage?: number;
  className?: string;
  seed?: string | number;
}

const isRedSuit = (suit: string): boolean => suit === '♥' || suit === '♦';

export function CardFaceIllustration({
  suit,
  rank = 1,
  blessed = false,
  attritionStage = 0,
  className = 'w-[34px] h-[34px] sm:w-[52px] sm:h-[52px] lg:w-[64px] lg:h-[64px] xl:w-[72px] xl:h-[72px] 2xl:w-[82px] 2xl:h-[82px]',
  seed,
}: CardFaceIllustrationProps): React.ReactElement | null {
  // Enforce single-identity rendering:
  // If blessed (regardless of attrition stage), show suit blessing.
  // Else if stage 4 (and not blessed), show curse.
  // Otherwise, return null.

  const isCursedStage4 = !blessed && attritionStage === 4;

  if (!blessed && !isCursedStage4) {
    return null;
  }

  const { rotateDeg, scale, translateX, translateY } = getHandDrawnTransform(suit, rank, 'illustration', seed);

  // Common SVG stroke attributes for hand-drawn organic blue ink styling (Blessings)
  const blessingStrokeProps = {
    stroke: '#1d4ed8',
    strokeWidth: '4.5',
    vectorEffect: 'non-scaling-stroke' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
    filter: 'url(#ink-bleed)',
    className: 'drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]',
  };

  // Common SVG stroke attributes for hand-drawn organic scarlet red gel ink styling (Curses)
  const curseStrokeProps = {
    stroke: '#dc2626',
    strokeWidth: '4.5',
    vectorEffect: 'non-scaling-stroke' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
    filter: 'url(#ink-bleed)',
    className: 'drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} pointer-events-none overflow-visible`}
      aria-hidden="true"
    >
      <g
        transform={`translate(${translateX}, ${translateY}) rotate(${rotateDeg} 50 50) scale(${scale})`}
        style={{ transformOrigin: '50px 50px' }}
      >
      {blessed && suit === '♥' && (
        /* Hearts Blessing: Tomb archway (∩) */
        <g>
          {/* Archway ∩ with organic hand-drawn curvature */}
          <path d="M 28 74 Q 25 49 28 38 C 29 15, 71 15, 72 38 Q 75 49 72 74" {...blessingStrokeProps} />
        </g>
      )}

      {blessed && suit === '♦' && (
        /* Diamonds Blessing: Vault Box (□) */
        <g>
          {/* Vault box □ with organic rounded corners */}
          <rect x="18" y="18" width="64" height="64" rx="6" ry="6" {...blessingStrokeProps} />
        </g>
      )}

      {blessed && suit === '♠' && (
        /* Spades Blessing: Tunnel Shovel (U-shaped blade pointing DOWN, shaft extending UP) */
        <g>
          {/* Shovel blade: hand-drawn top edge and organic U-curved bottom */}
          <path d="M 22 14 H 78 Q 79 32 76 61 C 72 77, 60 86, 50 86 C 40 86, 28 77, 24 61 Q 21 32 22 14 Z" {...blessingStrokeProps} />
          {/* Shovel handle shaft with organic pen stroke extending up */}
          <path d="M 49.5 14 Q 51 8 50 4" {...blessingStrokeProps} />
        </g>
      )}

      {blessed && suit === '♣' && (
        /* Clubs Blessing: Circled Sun Cross ⊕ */
        <g>
          {/* Organic hand-drawn outer circle halo */}
          <path
            d="M 50 14 C 28 12, 12 28, 14 50 C 12 72, 28 88, 50 86 C 72 88, 88 72, 86 50 C 88 28, 72 12, 50 14 Z"
            {...blessingStrokeProps}
          />
          {/* Horizontal crosshair stroke */}
          <path d="M 18 50 Q 50 49.5 82 50" {...blessingStrokeProps} />
          {/* Vertical crosshair stroke */}
          <path d="M 50 18 Q 49.5 50 50 82" {...blessingStrokeProps} />
        </g>
      )}

      {isCursedStage4 && isRedSuit(suit) && (
        /* Red Curse: Downward-pointing triangle ▼ */
        <g>
          <polygon points="20,25 80,25 50,80" {...curseStrokeProps} />
        </g>
      )}

      {isCursedStage4 && !isRedSuit(suit) && (
        /* Black Curse: Trapezoid weight ⏍ with top handle loop */
        <g>
          {/* Top handle loop with organic curve */}
          <path d="M 37 31 C 36 13, 64 13, 63 31" {...curseStrokeProps} />
          {/* Trapezoid body */}
          <polygon points="32,30 68,30 82,80 18,80" {...curseStrokeProps} />
        </g>
      )}
      </g>
    </svg>
  );
}

export default CardFaceIllustration;
