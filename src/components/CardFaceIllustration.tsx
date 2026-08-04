import React from 'react';

interface CardFaceIllustrationProps {
  suit: string;
  blessed?: boolean;
  attritionStage?: number;
  className?: string;
}

const isRedSuit = (suit: string): boolean => suit === '♥' || suit === '♦';

export function CardFaceIllustration({
  suit,
  blessed = false,
  attritionStage = 0,
  className = 'w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14',
}: CardFaceIllustrationProps): React.ReactElement | null {
  // Enforce single-identity rendering:
  // If blessed (regardless of attrition stage), show suit blessing.
  // Else if stage 4 (and not blessed), show curse.
  // Otherwise, return null.

  const isCursedStage4 = !blessed && attritionStage === 4;

  if (!blessed && !isCursedStage4) {
    return null;
  }

  // Common SVG stroke attributes for hand-drawn organic blue ink styling
  const strokeProps = {
    stroke: '#1d4ed8',
    strokeWidth: '10',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
    filter: 'url(#ink-bleed)',
    className: 'drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} pointer-events-none overflow-visible`}
      aria-hidden="true"
    >
      {blessed && suit === '♥' && (
        /* Hearts Blessing: Tomb archway with upward rising arrow (∩ + ↑) */
        <g>
          {/* Archway ∩ */}
          <path d="M 28 80 V 45 C 28 20, 72 20, 72 45 V 80" {...strokeProps} />
          {/* Upward arrow shaft ↑ */}
          <path d="M 50 72 V 32" {...strokeProps} />
          {/* Arrowhead */}
          <path d="M 38 42 L 50 30 L 62 42" {...strokeProps} />
        </g>
      )}

      {blessed && suit === '♦' && (
        /* Diamonds Blessing: Vault safe box (□ with center keyhole circle o) */
        <g>
          {/* Outer safe box □ */}
          <rect x="22" y="22" width="56" height="56" rx="4" ry="4" {...strokeProps} />
          {/* Center keyhole circle o */}
          <circle cx="50" cy="50" r="10" {...strokeProps} />
        </g>
      )}

      {blessed && suit === '♠' && (
        /* Spades Blessing: Left-facing rounded capsule [ ⊃ ] */
        <g>
          {/* Rectangle with rounded left cap and flat right edge */}
          <path d="M 74 25 H 48 C 30 25, 30 75, 48 75 H 74 Z" {...strokeProps} />
        </g>
      )}

      {blessed && suit === '♣' && (
        /* Clubs Blessing: Infinity symbol ∞ */
        <g>
          {/* Hand-drawn infinity loops */}
          <path
            d="M 50 50 C 35 32, 18 32, 18 50 C 18 68, 35 68, 50 50 C 65 32, 82 32, 82 50 C 82 68, 65 68, 50 50 Z"
            {...strokeProps}
          />
        </g>
      )}

      {isCursedStage4 && isRedSuit(suit) && (
        /* Red Curse: Downward-pointing triangle ▼ */
        <g>
          <polygon points="20,25 80,25 50,80" {...strokeProps} />
        </g>
      )}

      {isCursedStage4 && !isRedSuit(suit) && (
        /* Black Curse: Trapezoid weight ⏍ with top handle loop */
        <g>
          {/* Top handle loop */}
          <path d="M 38 28 C 38 15, 62 15, 62 28" {...strokeProps} />
          {/* Trapezoid body */}
          <polygon points="32,30 68,30 82,80 18,80" {...strokeProps} />
        </g>
      )}
    </svg>
  );
}

export default CardFaceIllustration;
