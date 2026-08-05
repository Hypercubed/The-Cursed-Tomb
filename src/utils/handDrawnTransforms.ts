export type InkMarkType = 'illustration' | 'scar' | 'modifiedValue' | 'anchor';

export interface HandDrawnTransform {
  rotateDeg: number;
  scale: number;
  translateX: number;
  translateY: number;
}

/**
 * Generates a deterministic float [0, 1) from suit, rank, markType, and seedIndex/seed.
 */
function hashSeed(suit: string, rank: number, markType: InkMarkType, seedIndex: string | number = 0): number {
  const str = `${suit}_${rank}_${markType}_${seedIndex}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 10007;
  }
  return hash / 10007;
}

/**
 * Returns deterministic transform properties for organic hand-drawn card ink marks.
 * Optional `seed` (e.g. expedition ID/seed) generates distinct hand-drawn tweaks per expedition.
 */
export function getHandDrawnTransform(
  suit: string,
  rank: number,
  markType: InkMarkType,
  seed?: string | number
): HandDrawnTransform {
  const safeRank = rank || 1;
  const safeSuit = suit || '♥';
  const prefix = seed !== undefined && seed !== null ? `${seed}:` : '';

  const val0 = hashSeed(safeSuit, safeRank, markType, `${prefix}0`);
  const val1 = hashSeed(safeSuit, safeRank, markType, `${prefix}1`);
  const val2 = hashSeed(safeSuit, safeRank, markType, `${prefix}2`);
  const val3 = hashSeed(safeSuit, safeRank, markType, `${prefix}3`);

  switch (markType) {
    case 'illustration': {
      return {
        rotateDeg: Number((-3.0 + val0 * 6.0).toFixed(2)),
        scale: Number((0.95 + val1 * 0.10).toFixed(3)),
        translateX: Number((-2.5 + val2 * 5.0).toFixed(2)),
        translateY: Number((-2.5 + val3 * 5.0).toFixed(2)),
      };
    }
    case 'scar': {
      return {
        rotateDeg: Number((-2.0 + val0 * 4.0).toFixed(2)),
        scale: Number((0.95 + val1 * 0.10).toFixed(3)),
        translateX: Number((-1.0 + val2 * 2.0).toFixed(2)),
        translateY: Number((-1.0 + val3 * 2.0).toFixed(2)),
      };
    }
    case 'modifiedValue': {
      return {
        rotateDeg: Number((-7.0 + val0 * 6.0).toFixed(2)),
        scale: Number((0.92 + val1 * 0.16).toFixed(3)),
        translateX: Number((-1.5 + val2 * 3.0).toFixed(2)),
        translateY: Number((-1.5 + val3 * 3.0).toFixed(2)),
      };
    }
    case 'anchor': {
      return {
        rotateDeg: Number((-4.0 + val0 * 8.0).toFixed(2)),
        scale: Number((0.95 + val1 * 0.10).toFixed(3)),
        translateX: Number((-1.0 + val2 * 2.0).toFixed(2)),
        translateY: Number((-1.0 + val3 * 2.0).toFixed(2)),
      };
    }
  }
}
