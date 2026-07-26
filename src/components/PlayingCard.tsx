import React from 'react';

interface PlayingCardProps {
  rank: number;
  suit: string;
  removed?: boolean;
  selected?: boolean;
  blocked?: boolean;
  disabled?: boolean;
  animatingMatch?: boolean;
  animatingError?: boolean;
  animatingCollapse?: boolean;
  style?: React.CSSProperties;
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
  animatingMatch = false,
  animatingError = false,
  animatingCollapse = false,
  style,
  onClick,
}: PlayingCardProps): React.ReactElement {
  const red = isRedSuit(suit);
  const label = rankLabel(rank);

  const classes = [
    // Base layout + sizing
    'w-12 min-h-[64px] sm:w-[72px] sm:min-h-[96px] lg:w-[88px] lg:min-h-[116px] xl:w-[96px] xl:min-h-[128px] 2xl:w-[108px] 2xl:min-h-[144px]',
    'rounded-lg sm:rounded-xl border p-1 sm:p-2 lg:p-2.5',
    'grid grid-rows-[auto_1fr_auto] overflow-hidden',
    // Base colors (Weathered Basalt Slate)
    'bg-game-card-bg disabled:bg-game-card-bg',
    // Inner border simulation
    'before:absolute before:inset-[2px] sm:before:inset-[3px] before:border before:border-amber-900/20 before:rounded-[6px] sm:before:rounded-[8px] before:pointer-events-none',
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
      ? 'border-game-accent animate-card-pulse shadow-[0_0_14px_rgba(217,119,6,0.55),inset_0_0_6px_rgba(251,191,36,0.2)] scale-[1.03]'
      : 'border-amber-900/30 disabled:border-amber-900/20',
    // Animations
    animatingMatch ? 'animate-card-dissolve pointer-events-none z-30' : '',
    animatingError ? 'animate-card-shake border-red-500/80 z-20' : '',
    animatingCollapse ? 'animate-pyramid-collapse pointer-events-none' : '',
    // Hover
    'hover:border-game-accent hover:shadow-[0_0_10px_rgba(217,119,6,0.3)]',
    // Positioning and stacking
    'relative',
    selected || animatingMatch || animatingError ? 'z-20' : 'hover:z-10 z-0',
    // Blocked state (when not removed) - retains 100% opacity per specs, but uses translucent overlay
    blocked && !removed ? 'cursor-not-allowed' : '',
    // Removed state — invisible but keeps layout space
    removed && !animatingMatch ? 'invisible' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || blocked || removed}
      onClick={onClick}
      style={style}
      aria-pressed={selected}
    >
      {/* Blocked state translucent stone veil overlay */}
      {blocked && !removed && (
        <div className="absolute inset-0 bg-stone-900/30 rounded-lg sm:rounded-xl pointer-events-none z-30" />
      )}

      {/* Top-left corner index: rank + standard suit character */}
      <div className="flex flex-col items-start leading-none text-[0.65rem] sm:text-xs lg:text-sm font-black z-10 select-none">
        <span>{label}</span>
        <span className="text-[0.6rem] sm:text-xs mt-0.5 font-normal leading-none">{suit}</span>
      </div>

      {/* Centre row: large thematic Egyptian SVG icon */}
      <div className="flex items-center justify-center select-none z-10">
        <SuitIcon suit={suit} className="w-4 h-4 sm:w-[30px] sm:h-[30px] lg:w-9 lg:h-9 xl:w-10 xl:h-10 opacity-90" />
      </div>

      {/* Bottom-right corner index: rank + standard suit character, rotated 180 degrees */}
      <div className="flex flex-col items-start leading-none text-[0.65rem] sm:text-xs lg:text-sm font-black z-10 select-none rotate-180">
        <span>{label}</span>
        <span className="text-[0.6rem] sm:text-xs mt-0.5 font-normal leading-none">{suit}</span>
      </div>
    </button>
  );
}

export default PlayingCard;
