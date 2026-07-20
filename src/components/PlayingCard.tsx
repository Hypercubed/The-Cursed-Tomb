import React from 'react';

interface PlayingCardProps {
  rank: number;
  suit: string;
  removed?: boolean;
  selected?: boolean;
  blocked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const rankLabel = (rank: number): string => {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
};

const isRedSuit = (suit: string): boolean => suit === '♥' || suit === '♦';

export function PlayingCard({
  rank,
  suit,
  removed = false,
  selected = false,
  blocked = false,
  disabled = false,
  onClick,
}: PlayingCardProps): React.ReactElement {
  const red = isRedSuit(suit);
  const label = rankLabel(rank);

  const classes = [
    // Base layout + sizing
    'w-[72px] min-h-[96px] rounded-xl border p-2',
    'grid grid-rows-[auto_1fr_auto] overflow-hidden',
    // Base colors
    'bg-gradient-to-b from-game-bg to-game-panel',
    // Transition
    'transition-[border-color,box-shadow] duration-[120ms] ease-in-out',
    // Button reset
    'appearance-none font-[inherit] cursor-pointer select-none',
    // Generic disabled
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Focus-visible ring
    'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-game-accent-light focus-visible:outline-offset-[3px]',
    // Suit colour — applied to the whole card so all text inherits
    red ? 'text-game-red' : 'text-game-card-text',
    // Border: selected vs default
    selected
      ? 'border-game-accent shadow-[0_0_0_3px_rgba(217,119,6,0.35)]'
      : 'border-game-border',
    // Hover (only meaningful on interactive cards, but safe to always include)
    'hover:border-game-accent',
    // Blocked state (when not removed)
    blocked && !removed ? 'opacity-50 cursor-not-allowed' : '',
    // Removed state — invisible but keeps layout space
    removed ? 'invisible' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || blocked || removed}
      onClick={onClick}
      aria-pressed={selected}
    >
      {/* Top-left corner: rank + suit, small, stacked, left-aligned */}
      <div className="flex flex-col items-start leading-none text-[0.65rem] font-bold">
        <span>{label}</span>
        <span>{suit}</span>
      </div>

      {/* Centre row: large suit symbol for visual richness */}
      <div className="flex items-center justify-center text-2xl leading-none select-none">
        {suit}
      </div>

      {/* Bottom-right corner: rank + suit, small, stacked, right-aligned, rotated 180° */}
      <div className="flex flex-col items-end leading-none text-[0.65rem] font-bold rotate-180">
        <span>{label}</span>
        <span>{suit}</span>
      </div>
    </button>
  );
}

export default PlayingCard;
