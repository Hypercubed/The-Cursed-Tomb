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

function SuitIcon({ suit, className = 'w-4 h-4' }: { suit: string; className?: string }) {
  if (suit === '♥') {
    // Ankh (Heart)
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 2 1.3 3.7 3.1 4.3L11 12H8v2h3v6c0 .6.4 1 1 1s1-.4 1-1v-6h3v-2h-3v-1.2c1.8-.6 3.1-2.3 3.1-4.3C16.5 4 14.5 2 12 2zm0 7c-1.4 0-2.5-1.1-2.5-2.5S10.6 4 12 4s2.5 1.1 2.5 2.5S13.4 9 12 9z" />
      </svg>
    );
  }
  if (suit === '♦') {
    // Scarab (Diamond)
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2c-2 0-3.6 1.4-3.9 3.2C6.8 5.6 5.8 7 5.3 8.8L5 10c0 3.3 2.2 6 5 6.8V21c0 .6.4 1 1 1s1-.4 1-1v-4.2c2.8-.8 5-3.5 5-6.8l-.3-1.2c-.5-1.8-1.5-3.2-2.8-3.6C15.6 3.4 14 2 12 2zm0 2.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm-5 6.3c0-2.5 1.8-4.5 4.1-4.9v9.8C8.8 15 7 13 7 10.5zm10 0c0 2.5-1.8 4.5-4.1 4.9V5.6c2.3.4 4.1 2.4 4.1 4.9z" />
      </svg>
    );
  }
  if (suit === '♠') {
    // Khopesh (Spade)
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.5 3c-.8 0-1.8.3-2.5.9-2 1.7-3 4.2-3 6.8V12h-1v-2H9v4h3v5h-1v2h4v-2h-1v-5c0-1.8.8-3.6 2-4.8.5-.4 1.1-.6 1.6-.6.6 0 1.2.3 1.2.8 0 .8-.6 1.4-1.3 1.9L16 12.5l1.4 1.4 1.7-1.7C20.4 11 21 9.5 21 8c0-2.8-1.5-5-3.5-5z" />
      </svg>
    );
  }
  // Was Scepter (Club)
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.5 2h5l2.5 3.5-1.5 2.5h-2.5v10H14v4l-2 2-2-2v-4h2V8h-1.5V6L9 4.5 8.5 2zm2.5 4.5h2v-2h-2v2z" />
    </svg>
  );
}

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
    // Base colors (Weathered Basalt Slate)
    'bg-game-card-bg disabled:bg-game-card-bg',
    // Inner border simulation
    'before:absolute before:inset-[3px] before:border before:border-game-border/30 before:rounded-[8px] before:pointer-events-none',
    // Transition
    'transition-[border-color,box-shadow,transform] duration-[120ms] ease-in-out',
    // Button reset
    'appearance-none font-[inherit] cursor-pointer select-none',
    // Generic disabled
    'disabled:opacity-100 disabled:cursor-not-allowed',
    // Focus-visible ring
    'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-game-accent-light focus-visible:outline-offset-[3px]',
    // Suit colour — applied to the whole card so all text/SVGs inherit
    red ? 'text-game-red' : 'text-game-card-text',
    // Border: selected vs default
    selected
      ? 'border-game-accent shadow-[0_0_12px_rgba(217,119,6,0.45),inset_0_0_6px_rgba(251,191,36,0.15)] scale-[1.03]'
      : 'border-game-border disabled:border-game-border',
    // Hover
    'hover:border-game-accent hover:shadow-[0_0_8px_rgba(217,119,6,0.2)]',
    // Positioning and stacking
    'relative',
    selected ? 'z-20' : 'hover:z-10 z-0',
    // Blocked state (when not removed) - retains 100% opacity per specs, but uses darker styling
    blocked && !removed ? 'opacity-100 cursor-not-allowed brightness-[0.65]' : '',
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
      <div className="flex flex-col items-start leading-none text-[0.65rem] font-bold z-10">
        <span>{label}</span>
        <SuitIcon suit={suit} className="w-[10px] h-[10px] mt-0.5" />
      </div>

      {/* Centre row: large suit symbol for visual richness */}
      <div className="flex items-center justify-center select-none z-10">
        <SuitIcon suit={suit} className="w-[26px] h-[26px] opacity-85" />
      </div>

      {/* Bottom-right corner: rank + suit, small, stacked, right-aligned, upright */}
      <div className="flex flex-col items-end leading-none text-[0.65rem] font-bold z-10">
        <span>{label}</span>
        <SuitIcon suit={suit} className="w-[10px] h-[10px] mt-0.5" />
      </div>
    </button>
  );
}

export default PlayingCard;
