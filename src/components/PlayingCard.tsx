import React from 'react';
import { CardFaceIllustration } from './CardFaceIllustration';
import { getHandDrawnTransform } from '../utils/handDrawnTransforms';
import { hapticTap } from '../utils/haptics';

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
  seed?: string | number;
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
    if (suit === '♥') return 'Blessed Hero (∩ Archway): Hearts Stock Reshuffle power (shuffles Waste back into Stock when cleared)';
    if (suit === '♦') return 'Blessed Hero (□ Vault Box): Diamonds Vault power (can be freely stacked in the FILO Vault; only the top card is playable)';
    if (suit === '♠') return 'Blessed Hero (Tunnel Shovel): Spades Tunnel power (moves 1 exposed pyramid card to Waste when cleared)';
    if (suit === '♣') return 'Blessed Hero (⊕ Sun Cross): Clubs Universal Wildcard power (pairs with ANY exposed card to total 13)';
    return 'Blessed Hero: Unlocks Suit Blessing power when cleared';
  }
  if (rewardStage === 1) return 'Fortifying Anchor [—]: 1st stroke towards permanent Anchor immunity';
  if (rewardStage === 2) return 'Anchored Card [+]: Permanently immune to failure track degradation';
  return '';
}

function getUpperRightTooltip(suit: string, attritionStage: number, rank: number, functionalValue?: number, blessed?: boolean): string {
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
    if (blessed) {
      return `Stage 4 Attrition (|X|): Card is Blessed. Curse trap skipped (Blessed card: Curse trap skipped).`;
    }
    return isRed
      ? `Red Curse (|X|) (▼ Downward Triangle): Red Curse active (+1 value shift & locks next lower row cards face-down)`
      : `Black Curse (|X|) (⏍ Weight): Black Curse active (-1 value shift & shuffles paired partner into Stock pile)`;
  }
  if (attritionStage === 5) return 'Entombed (💀): Permanently destroyed card';
  return '';
}

export function InkBleedFilterDef() {
  return (
    <svg className="sr-only pointer-events-none" aria-hidden="true" width="0" height="0">
      <defs>
        <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

function SlashedRank({
  label,
  stage,
  funcValLabel,
  suit = '♥',
  rank = 1,
  seed,
  isSunCross = false,
}: {
  label: string;
  stage: number;
  funcValLabel: string | null;
  suit?: string;
  rank?: number;
  seed?: string | number;
  isSunCross?: boolean;
}) {
  if (stage === 5) {
    return <span title="Entombed (💀)">💀</span>;
  }

  const scarTransform = getHandDrawnTransform(suit, rank, 'scar', seed);
  const modValTransform = getHandDrawnTransform(suit, rank, 'modifiedValue', seed);
  const sunCrossTransform = getHandDrawnTransform(suit, rank, 'wildcard', seed);

  return (
    <span className="relative inline-block leading-none select-none">
      {/* Base rank number - stays in exact fixed position */}
      <span>{label}</span>

      {/* Organic Blue Ink SVG Overlay for Sun Cross Wildcard (blessed Clubs) */}
      {isSunCross && (
        <svg
          aria-hidden="true"
          className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)] pointer-events-none overflow-visible z-20"
          viewBox="-15 -5 130 110"
          preserveAspectRatio="none"
        >
          <g
            transform={`translate(${sunCrossTransform.translateX}, ${sunCrossTransform.translateY}) rotate(${sunCrossTransform.rotateDeg} 50 50) scale(${sunCrossTransform.scale})`}
            style={{ transformOrigin: '50px 50px' }}
          >
            <path
              d="M 12 12 Q 50 50 88 88"
              stroke="#1d4ed8"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-bleed)"
              className="drop-shadow-[0_0_2px_rgba(37,99,235,0.45)]"
            />
            <path
              d="M 12 88 Q 50 50 88 12"
              stroke="#1d4ed8"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-bleed)"
              className="drop-shadow-[0_0_2px_rgba(37,99,235,0.45)]"
            />
          </g>
        </svg>
      )}

      {/* Organic Scarlet Red Gel Pen SVG Scar Overlay for Stages 1-4 */}
      {stage >= 1 && (
        <svg
          aria-hidden="true"
          className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)] pointer-events-none overflow-visible z-20"
          viewBox="-15 -5 130 110"
          preserveAspectRatio="none"
        >
          <g
            transform={`translate(${scarTransform.translateX}, ${scarTransform.translateY}) rotate(${scarTransform.rotateDeg} 50 50) scale(${scarTransform.scale})`}
            style={{ transformOrigin: '50px 50px' }}
          >
            {/* Stage 1: Left vertical line with organic stroke wobble */}
            <path
              d="M 14 5 Q 6 50 12 95"
              stroke="#dc2626"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-bleed)"
              className="drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]"
            />

            {/* Stage 2: Right vertical line with organic stroke wobble */}
            {stage >= 2 && (
              <path
                d="M 86 5 Q 94 50 88 95"
                stroke="#dc2626"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ink-bleed)"
                className="drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]"
              />
            )}

            {/* Stage 3: Backslash \ with organic curve */}
            {stage >= 3 && (
              <path
                d="M 12 4 C 36 32 64 65 88 96"
                stroke="#dc2626"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ink-bleed)"
                className="drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]"
              />
            )}

            {/* Stage 4: Forward slash / forming '|X|' */}
            {stage >= 4 && (
              <path
                d="M 10 96 C 34 66 66 34 90 4"
                stroke="#dc2626"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ink-bleed)"
                className="drop-shadow-[0_0_2px_rgba(220,38,38,0.45)]"
              />
            )}
          </g>
        </svg>
      )}

      {/* Modified value written in scarlet red gel ink to the right of the scar box */}
      {stage >= 3 && funcValLabel && (
        <span
          className="absolute left-full ml-1 sm:ml-1.5 top-[-6px] sm:top-[-8px] lg:top-[-9px] text-[0.95rem] sm:text-base lg:text-lg xl:text-xl font-black leading-none whitespace-nowrap"
          style={{
            fontFamily: '"Caveat", "Architects Daughter", "Comic Sans MS", cursive, sans-serif',
            color: '#be123c',
            WebkitTextStroke: '0.6px #dc2626',
            textShadow: '0 0 1px #dc2626, 0 0 2px rgba(220,38,38,0.8)',
            fontWeight: 900,
            transform: `rotate(${modValTransform.rotateDeg}deg) scale(${modValTransform.scale}) translate(${modValTransform.translateX}px, ${modValTransform.translateY}px)`,
            filter: 'url(#ink-bleed)',
          }}
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
  leftTooltip,
}: {
  suit: string;
  leftTooltip: string;
}) {
  return (
    <div
      className="relative inline-flex items-center justify-center mt-0.5"
      title={leftTooltip || undefined}
    >
      <span className="text-[0.65rem] sm:text-xs font-normal leading-none relative flex items-center justify-center">
        <span>{suit}</span>
      </span>
    </div>
  );
}

interface PlayingCardProps {
  rank: number;
  suit: string;
  attritionStage?: number;
  rewardStage?: number;
  anchorAbsorption?: number;
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
  seed?: string | number;
}

function AnchorBadge({
  rewardStage,
  anchorAbsorption = 0,
  suit = '♥',
  rank = 1,
  className = '',
  seed,
}: {
  rewardStage: number;
  anchorAbsorption?: number;
  suit?: string;
  rank?: number;
  className?: string;
  seed?: string | number;
}) {
  if (rewardStage <= 0) return null;

  const isFortifying = rewardStage === 1;
  const badgeTitle = isFortifying
    ? 'Fortifying Anchor [—]: 1st stroke towards permanent Anchor immunity'
    : anchorAbsorption > 0
    ? `Anchored Card [+]: Absorbed ${anchorAbsorption}/4 freeze attrition hits`
    : 'Anchored Card [+]: Immune to failure track degradation (absorbs up to 4 freeze hits)';

  const anchorTransform = getHandDrawnTransform(suit, rank, 'anchor', seed);

  return (
    <div
      className={`relative inline-flex items-center justify-center p-0.5 z-10 select-none ${className}`}
      title={badgeTitle}
      aria-label={badgeTitle}
    >
      <span className="text-[0.65rem] sm:text-xs font-black leading-none relative flex items-center justify-center text-blue-600">
        {/* Stage 1: Fortifying Horizontal Pen Stroke */}
        {isFortifying && (
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
          >
            <g
              transform={`translate(${anchorTransform.translateX}, ${anchorTransform.translateY}) rotate(${anchorTransform.rotateDeg} 50 50) scale(${anchorTransform.scale})`}
              style={{ transformOrigin: '50px 50px' }}
            >
              <path
                d="M 8 51 Q 50 47 92 53"
                stroke="#1d4ed8"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ink-bleed)"
                className="drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]"
              />
            </g>
          </svg>
        )}

        {/* Stage 2: Anchored Cross (+) Pen Strokes & Red Absorption Corner Marks */}
        {rewardStage >= 2 && (
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
          >
            <g
              transform={`translate(${anchorTransform.translateX}, ${anchorTransform.translateY}) rotate(${anchorTransform.rotateDeg} 50 50) scale(${anchorTransform.scale})`}
              style={{ transformOrigin: '50px 50px' }}
            >
              {/* Blue Anchor Cross (+) */}
              <path
                d="M 8 51 Q 50 47 92 53"
                stroke="#1d4ed8"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ink-bleed)"
                className="drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]"
              />
              <path
                d="M 49 8 Q 52 50 47 92"
                stroke="#1d4ed8"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ink-bleed)"
                className="drop-shadow-[0_0_2px_rgba(37,99,235,0.4)]"
              />

              {/* Red Absorption Corner Marks in 4 Quadrants around (+) */}
              {anchorAbsorption >= 1 && (
                <circle
                  cx="20"
                  cy="20"
                  r="9"
                  fill="#dc2626"
                  filter="url(#ink-bleed)"
                  className="drop-shadow-[0_0_2px_rgba(220,38,38,0.6)]"
                />
              )}
              {anchorAbsorption >= 2 && (
                <circle
                  cx="80"
                  cy="20"
                  r="9"
                  fill="#dc2626"
                  filter="url(#ink-bleed)"
                  className="drop-shadow-[0_0_2px_rgba(220,38,38,0.6)]"
                />
              )}
              {anchorAbsorption >= 3 && (
                <circle
                  cx="20"
                  cy="80"
                  r="9"
                  fill="#dc2626"
                  filter="url(#ink-bleed)"
                  className="drop-shadow-[0_0_2px_rgba(220,38,38,0.6)]"
                />
              )}
              {anchorAbsorption >= 4 && (
                <circle
                  cx="80"
                  cy="80"
                  r="9"
                  fill="#dc2626"
                  filter="url(#ink-bleed)"
                  className="drop-shadow-[0_0_2px_rgba(220,38,38,0.6)]"
                />
              )}
            </g>
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
  functionalValue?: number;
  leftTooltip: string;
  rightTooltip: string;
  className?: string;
  seed?: string | number;
  blessed?: boolean;
}

function CornerIndex({
  rank,
  suit,
  attritionStage,
  functionalValue,
  leftTooltip,
  rightTooltip,
  className = '',
  seed,
  blessed = false,
}: CornerIndexProps) {
  const label = rankLabel(rank);
  const red = isRedSuit(suit);
  const effectiveValue = functionalValue !== undefined
    ? functionalValue
    : (attritionStage >= 3 ? Math.max(1, Math.min(13, rank + (red ? 1 : -1))) : rank);
  const funcValLabel = rankLabel(effectiveValue);
  const isSunCross = blessed && suit === '♣';

  return (
    <div className={`flex flex-col items-start leading-none text-[0.65rem] sm:text-xs lg:text-sm font-black z-10 select-none ${className}`}>
      {/* Rank row with Scars & Curses overlay */}
      <div className="flex items-center leading-none relative" title={rightTooltip || undefined}>
        <SlashedRank
          label={label}
          stage={attritionStage}
          funcValLabel={funcValLabel}
          suit={suit}
          rank={rank}
          seed={seed}
          isSunCross={isSunCross}
        />
      </div>

      {/* Suit row */}
      <SuitPip suit={suit} leftTooltip={leftTooltip} />
    </div>
  );
}

export function PlayingCard({
  rank,
  suit,
  attritionStage = 0,
  rewardStage = 0,
  anchorAbsorption = 0,
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
  seed,
}: PlayingCardProps): React.ReactElement {
  const red = isRedSuit(suit);
  const funcValLabel = functionalValue !== undefined && functionalValue !== rank ? rankLabel(functionalValue) : null;

  const leftTooltip = getUpperLeftTooltip(suit, blessed, rewardStage);
  const rightTooltip = getUpperRightTooltip(suit, attritionStage, rank, functionalValue, blessed);

  const cardTitle = [
    `${rankLabel(rank)}${suit}`,
    funcValLabel ? `Functional Value: ${funcValLabel}` : null,
    leftTooltip,
    rightTooltip,
  ]
    .filter(Boolean)
    .join('\n');

  const classes = [
    'playing-card-responsive w-12 h-[64px] sm:w-[72px] sm:h-[96px] lg:w-[88px] lg:h-[116px] xl:w-[96px] xl:h-[128px] 2xl:w-[108px] 2xl:h-[144px]',
    'rounded-lg sm:rounded-xl border p-1 sm:p-2 lg:p-2.5',
    'relative flex flex-col justify-between overflow-hidden text-left',
    faceDown ? 'bg-[#1a1510] border-[#3a2d1d]' : 'card-paper-texture disabled:bg-game-card-bg',
    'before:absolute before:inset-[2px] sm:before:inset-[3px] before:border before:border-amber-900/20 before:rounded-[6px] sm:before:rounded-[8px] before:pointer-events-none',
    animatingCollapse ? '' : 'card-tabletop-tilt',
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
    removed && !animatingMatch ? 'invisible pointer-events-none' : animatingCollapse ? '' : 'pointer-events-auto',
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
        onPointerDown={(event) => {
          if (event.pointerType === 'touch' && !disabled && !blocked && !removed && onClick) hapticTap();
        }}
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
      onPointerDown={(event) => {
        if (event.pointerType === 'touch' && !disabled && !blocked && !removed && onClick) hapticTap();
      }}
      style={style}
      aria-pressed={selected}
      title={cardTitle}
    >
      {blocked && !removed && (
        <div className="absolute inset-0 bg-stone-900/30 rounded-lg sm:rounded-xl pointer-events-none z-30" />
      )}
      <InkBleedFilterDef />

      {/* Top row: Top-left corner index & Top-right immunity badge */}
      <div className="flex justify-between items-start w-full relative z-10">
        <CornerIndex
          rank={rank}
          suit={suit}
          attritionStage={attritionStage}
          functionalValue={functionalValue}
          leftTooltip={leftTooltip}
          rightTooltip={rightTooltip}
          seed={seed}
          blessed={blessed}
        />
        <AnchorBadge rewardStage={rewardStage} anchorAbsorption={anchorAbsorption} suit={suit} rank={rank} seed={seed} />
      </div>

      {/* Centre row: Suit pip always shown; illustration overlaid on top when applicable */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        <SuitIcon suit={suit} className="w-3.5 h-3.5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 opacity-90" />
        {(blessed || attritionStage === 4) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CardFaceIllustration suit={suit} rank={rank} blessed={blessed} attritionStage={attritionStage} seed={seed} />
          </div>
        )}
      </div>
    </button>
  );
}

export default PlayingCard;
