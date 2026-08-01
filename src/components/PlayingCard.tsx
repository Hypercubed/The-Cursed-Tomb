import React from 'react';

interface PlayingCardProps {
  rank: number;
  suit: string;
  attritionStage?: number;
  rewardStage?: number;
  blessed?: boolean;
  faceDown?: boolean;
  functionalValue?: number;
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
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  if (suit === '♦') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2L3.5 12 12 22l8.5-10L12 2z" />
      </svg>
    );
  }
  if (suit === '♠') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2C9.5 6.8 4 9 4 13.8C4 16.7 6.2 19 9.1 19C10.8 19 12 18 12 18C12 18 13.2 19 14.9 19C17.8 19 20 16.7 20 13.8C20 9 14.5 6.8 12 2ZM10.5 17.5L9.5 22H14.5L13.5 17.5H10.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C10.3 2 9 3.3 9 5C9 5.8 9.3 6.5 9.8 7C8.2 7.1 7 8.4 7 10C7 11.7 8.3 13 10 13C10.7 13 11.4 12.7 12 12.3C12.6 12.7 13.3 13 14 13C15.7 13 17 11.7 17 10C17 8.4 15.8 7.1 14.2 7C14.7 6.5 15 5.8 15 5C15 3.3 13.7 2 12 2ZM10.5 12.5L9.5 22H14.5L13.5 12.5H10.5Z" />
    </svg>
  );
}

function getUpperLeftTooltip(suit: string, blessed: boolean, rewardStage: number): string {
  if (blessed) {
    if (suit === '♥') return 'Blessed Fallen Hero [O]: Hearts Resurrection power (draws 1 random card from Graveyard Box as Cursed Stage 4 when cleared)';
    if (suit === '♦') return 'Blessed Fallen Hero [O]: Diamonds Vault power (can store 1 Waste card in Vault)';
    if (suit === '♠') return 'Blessed Fallen Hero [O]: Spades Tunnel power (flips 1 face-down card when cleared)';
    if (suit === '♣') return 'Blessed Fallen Hero [O]: Clubs Universal Wildcard power (pairs with ANY exposed card to total 13)';
    return 'Blessed Fallen Hero [O]: Unlocks Suit Blessing power when cleared';
  }
  if (rewardStage === 1) return 'Fortifying Anchor [—]: 1st stroke towards permanent Anchor immunity';
  if (rewardStage === 2) return 'Anchored Card [+]: Permanently immune to failure track degradation';
  return '';
}

function getUpperRightTooltip(suit: string, attritionStage: number, rank: number, functionalValue?: number): string {
  const isRed = isRedSuit(suit);
  const fVal = functionalValue ?? rank;
  const rLabel = rankLabel(rank);
  if (attritionStage === 1) return `Vulnerable (|${rLabel}): 1st Attrition line to the left of rank`;
  if (attritionStage === 2) return `Doubtful (|${rLabel}|): 2nd Attrition line to the right of rank`;
  if (attritionStage === 3) {
    return isRed
      ? `Red Scar (|${rLabel}\\|): Functional value shifted (+1). Effective value: ${rankLabel(fVal)}`
      : `Black Scar (|${rLabel}\\|): Functional value shifted (-1). Effective value: ${rankLabel(fVal)}`;
  }
  if (attritionStage === 4) {
    return isRed
      ? `Red Curse (|X|): Red Curse active (+1 value shift & locks next lower row cards face-down)`
      : `Black Curse (|X|): Black Curse active (-1 value shift & restricts pairing exclusively to Pyramid cards)`;
  }
  if (attritionStage === 5) return 'Entombed (💀): Permanently destroyed card';
  return '';
}

function SlashedRank({ label, stage, funcValLabel }: { label: string; stage: number; funcValLabel: string | null }) {
  if (stage === 5) {
    return <span title="Entombed (💀)">💀</span>;
  }

  return (
    <span className="relative inline-block leading-none select-none">
      {/* Base rank number - stays in exact fixed position */}
      <span>{label}</span>

      {/* Unified Blue SVG Scar Overlay for Stages 1-4 */}
      {stage >= 1 && (
        <svg
          aria-hidden="true"
          className="absolute -inset-x-1 -inset-y-0.5 w-[calc(100%+8px)] h-[calc(100%+4px)] pointer-events-none overflow-visible z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Stage 1: Left vertical line */}
          <line x1="8" y1="5" x2="8" y2="95" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" />

          {/* Stage 2: Right vertical line */}
          {stage >= 2 && (
            <line x1="92" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" />
          )}

          {/* Stage 3: Backslash \ connecting top-left (8,5) to bottom-right (92,95) forming 'N' */}
          {stage >= 3 && (
            <line x1="8" y1="5" x2="92" y2="95" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" />
          )}

          {/* Stage 4: Forward slash / connecting bottom-left (8,95) to top-right (92,5) forming '|X|' */}
          {stage >= 4 && (
            <line x1="8" y1="95" x2="92" y2="5" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" />
          )}
        </svg>
      )}

      {/* Modified value written in blue ink to the right of the scar box (handwritten style, aligned even with top of base rank) */}
      {stage >= 3 && funcValLabel && (
        <span
          className="absolute left-full ml-1.5 sm:ml-2 top-[-2px] text-[0.825rem] sm:text-sm lg:text-base text-blue-600 font-black leading-none whitespace-nowrap"
          style={{ fontFamily: '"Caveat", "Architects Daughter", "Comic Sans MS", cursive, sans-serif' }}
          title={`Modified Effective Value: ${funcValLabel}`}
        >
          {funcValLabel}
        </span>
      )}
    </span>
  );
}

function SuitPip({
  suit,
  blessed,
  leftTooltip,
}: {
  suit: string;
  blessed: boolean;
  leftTooltip: string;
}) {
  return (
    <div
      className="relative inline-flex items-center justify-center mt-0.5"
      title={leftTooltip || undefined}
    >
      <span className="text-[0.65rem] sm:text-xs font-normal leading-none relative flex items-center justify-center">
        <span>{suit}</span>

        {/* Blessed Hero Mark: Unified Blue Circle Ring */}
        {blessed && (
          <svg
            aria-hidden="true"
            className="absolute -inset-[40%] w-[180%] h-[180%] pointer-events-none overflow-visible z-10"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="#2563eb"
              strokeWidth="18"
              fill="none"
              className="drop-shadow-[0_0_3px_rgba(37,99,235,0.6)]"
            />
          </svg>
        )}
      </span>
    </div>
  );
}

function AnchorBadge({
  rewardStage,
  className = '',
}: {
  rewardStage: number;
  className?: string;
}) {
  if (rewardStage <= 0) return null;

  const isFortifying = rewardStage === 1;
  const badgeTitle = isFortifying
    ? 'Fortifying Anchor [—]: 1st stroke towards permanent Anchor immunity'
    : 'Anchored Card [+]: Permanently immune to failure track degradation';

  return (
    <div
      className={`relative inline-flex items-center justify-center p-0.5 z-10 select-none ${className}`}
      title={badgeTitle}
      aria-label={badgeTitle}
    >
      <span className="text-[0.65rem] sm:text-xs font-black leading-none relative flex items-center justify-center text-blue-600">
        {/* Stage 1: Fortifying Horizontal Stroke */}
        {isFortifying && (
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
          >
            <line
              x1="10"
              y1="50"
              x2="90"
              y2="50"
              stroke="#2563eb"
              strokeWidth="20"
              strokeLinecap="round"
              className="drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]"
            />
          </svg>
        )}

        {/* Stage 2: Anchored Cross (+) */}
        {rewardStage >= 2 && (
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
          >
            <line
              x1="10"
              y1="50"
              x2="90"
              y2="50"
              stroke="#2563eb"
              strokeWidth="20"
              strokeLinecap="round"
              className="drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]"
            />
            <line
              x1="50"
              y1="10"
              x2="50"
              y2="90"
              stroke="#2563eb"
              strokeWidth="20"
              strokeLinecap="round"
              className="drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]"
            />
          </svg>
        )}
      </span>
    </div>
  );
}

interface CornerIndexProps {
  rank: number;
  suit: string;
  attritionStage: number;
  blessed: boolean;
  functionalValue?: number;
  leftTooltip: string;
  rightTooltip: string;
  className?: string;
}

function CornerIndex({
  rank,
  suit,
  attritionStage,
  blessed,
  functionalValue,
  leftTooltip,
  rightTooltip,
  className = '',
}: CornerIndexProps) {
  const label = rankLabel(rank);
  const red = isRedSuit(suit);
  const effectiveValue = functionalValue !== undefined
    ? functionalValue
    : (attritionStage >= 3 ? Math.max(1, Math.min(13, rank + (red ? 1 : -1))) : rank);
  const funcValLabel = rankLabel(effectiveValue);

  return (
    <div className={`flex flex-col items-start leading-none text-[0.65rem] sm:text-xs lg:text-sm font-black z-10 select-none ${className}`}>
      {/* Rank row with Scars & Curses overlay */}
      <div className="flex items-center leading-none relative" title={rightTooltip || undefined}>
        <SlashedRank label={label} stage={attritionStage} funcValLabel={funcValLabel} />
      </div>

      {/* Suit row with Blessings overlay */}
      <SuitPip suit={suit} blessed={blessed} leftTooltip={leftTooltip} />
    </div>
  );
}

export function PlayingCard({
  rank,
  suit,
  attritionStage = 0,
  rewardStage = 0,
  blessed = false,
  faceDown = false,
  functionalValue,
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
  const funcValLabel = functionalValue !== undefined && functionalValue !== rank ? rankLabel(functionalValue) : null;

  const leftTooltip = getUpperLeftTooltip(suit, blessed, rewardStage);
  const rightTooltip = getUpperRightTooltip(suit, attritionStage, rank, functionalValue);

  const cardTitle = [
    `${rankLabel(rank)}${suit}`,
    funcValLabel ? `Functional Value: ${funcValLabel}` : null,
    leftTooltip,
    rightTooltip,
  ]
    .filter(Boolean)
    .join('\n');

  const classes = [
    'w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px]',
    'rounded-lg sm:rounded-xl border p-1 sm:p-2 lg:p-2.5',
    'grid grid-rows-[auto_1fr_auto] overflow-hidden',
    faceDown ? 'bg-[#1a1510] border-[#3a2d1d]' : 'bg-game-card-bg disabled:bg-game-card-bg',
    'before:absolute before:inset-[2px] sm:before:inset-[3px] before:border before:border-amber-900/20 before:rounded-[6px] sm:before:rounded-[8px] before:pointer-events-none',
    'transition-[border-color,box-shadow,transform] duration-[120ms] ease-in-out',
    'appearance-none font-[inherit] cursor-pointer select-none',
    'disabled:opacity-100 disabled:cursor-not-allowed',
    'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-game-accent-light focus-visible:outline-offset-[3px]',
    red ? 'text-game-red' : 'text-game-card-text',
    selected
      ? 'border-game-accent animate-card-pulse shadow-[0_0_14px_rgba(217,119,6,0.55),inset_0_0_6px_rgba(251,191,36,0.2)] scale-[1.03]'
      : 'border-amber-900/30 disabled:border-amber-900/20',
    animatingMatch ? 'animate-card-dissolve pointer-events-none z-30' : '',
    animatingError ? 'animate-card-shake border-red-500/80 z-20' : '',
    animatingCollapse ? 'animate-pyramid-collapse pointer-events-none' : '',
    'hover:border-game-accent hover:shadow-[0_0_10px_rgba(217,119,6,0.3)]',
    'relative',
    selected || animatingMatch || animatingError ? 'z-20' : 'z-0',
    blocked && !removed ? 'cursor-not-allowed' : '',
    removed && !animatingMatch ? 'invisible' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (faceDown) {
    return (
      <button
        type="button"
        className={classes}
        disabled={disabled || blocked || removed}
        onClick={onClick}
        style={style}
        title="Red Curse Trap: Card is face-down until exposed or revealed"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-[#15100b] rounded-lg sm:rounded-xl border border-[#3d2e1c]">
          <span className="text-amber-700/80 text-xl sm:text-2xl font-serif select-none">𓋹</span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || blocked || removed}
      onClick={onClick}
      style={style}
      aria-pressed={selected}
      title={cardTitle}
    >
      {blocked && !removed && (
        <div className="absolute inset-0 bg-stone-900/30 rounded-lg sm:rounded-xl pointer-events-none z-30" />
      )}

      {/* Top row: Top-left corner index & Top-right immunity badge */}
      <div className="flex justify-between items-start">
        <CornerIndex
          rank={rank}
          suit={suit}
          attritionStage={attritionStage}
          blessed={blessed}
          functionalValue={functionalValue}
          leftTooltip={leftTooltip}
          rightTooltip={rightTooltip}
        />
        <AnchorBadge rewardStage={rewardStage} />
      </div>

      {/* Centre row: SVG Icon */}
      <div className="flex items-center justify-center select-none z-10">
        <SuitIcon suit={suit} className="w-3.5 h-3.5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 opacity-90" />
      </div>

      {/* Bottom row: Bottom-left immunity badge & Bottom-right corner index (rotated 180°) */}
      <div className="flex justify-between items-end">
        <AnchorBadge rewardStage={rewardStage} className="rotate-180" />
        <CornerIndex
          rank={rank}
          suit={suit}
          attritionStage={attritionStage}
          blessed={blessed}
          functionalValue={functionalValue}
          leftTooltip={leftTooltip}
          rightTooltip={rightTooltip}
          className="rotate-180 ml-auto"
        />
      </div>
    </button>
  );
}

export default PlayingCard;
