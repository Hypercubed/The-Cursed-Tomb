import { describe, it, expect } from 'vitest';
import { getHandDrawnTransform, InkMarkType } from './handDrawnTransforms';

describe('getHandDrawnTransform', () => {
  const suits = ['♥', '♦', '♠', '♣'];
  const ranks = [1, 5, 7, 10, 13];
  const markTypes: InkMarkType[] = ['illustration', 'scar', 'modifiedValue', 'anchor'];

  it('is strictly deterministic (same inputs return identical transforms)', () => {
    for (const suit of suits) {
      for (const rank of ranks) {
        for (const markType of markTypes) {
          const t1 = getHandDrawnTransform(suit, rank, markType);
          const t2 = getHandDrawnTransform(suit, rank, markType);
          expect(t1).toEqual(t2);
        }
      }
    }
  });

  it('produces bounded outputs within specified ranges', () => {
    for (const suit of suits) {
      for (const rank of ranks) {
        const ill = getHandDrawnTransform(suit, rank, 'illustration');
        expect(ill.rotateDeg).toBeGreaterThanOrEqual(-3.0);
        expect(ill.rotateDeg).toBeLessThanOrEqual(3.0);
        expect(ill.scale).toBeGreaterThanOrEqual(0.95);
        expect(ill.scale).toBeLessThanOrEqual(1.05);
        expect(ill.translateX).toBeGreaterThanOrEqual(-2.5);
        expect(ill.translateX).toBeLessThanOrEqual(2.5);
        expect(ill.translateY).toBeGreaterThanOrEqual(-2.5);
        expect(ill.translateY).toBeLessThanOrEqual(2.5);

        const scar = getHandDrawnTransform(suit, rank, 'scar');
        expect(scar.rotateDeg).toBeGreaterThanOrEqual(-2.0);
        expect(scar.rotateDeg).toBeLessThanOrEqual(2.0);

        const modVal = getHandDrawnTransform(suit, rank, 'modifiedValue');
        expect(modVal.rotateDeg).toBeGreaterThanOrEqual(-7.0);
        expect(modVal.rotateDeg).toBeLessThanOrEqual(-1.0);
        expect(modVal.scale).toBeGreaterThanOrEqual(0.92);
        expect(modVal.scale).toBeLessThanOrEqual(1.08);

        const anchor = getHandDrawnTransform(suit, rank, 'anchor');
        expect(anchor.rotateDeg).toBeGreaterThanOrEqual(-4.0);
        expect(anchor.rotateDeg).toBeLessThanOrEqual(4.0);
      }
    }
  });

  it('produces different transforms for different card ranks/suits', () => {
    const t1 = getHandDrawnTransform('♥', 7, 'illustration');
    const t2 = getHandDrawnTransform('♠', 7, 'illustration');
    const t3 = getHandDrawnTransform('♥', 8, 'illustration');

    expect(t1).not.toEqual(t2);
    expect(t1).not.toEqual(t3);
  });

  it('supports per-expedition seed values (same within expedition, unique across expeditions)', () => {
    const expA_1 = getHandDrawnTransform('♥', 7, 'illustration', 'expedition_1');
    const expA_2 = getHandDrawnTransform('♥', 7, 'illustration', 'expedition_1');
    const expB = getHandDrawnTransform('♥', 7, 'illustration', 'expedition_2');

    expect(expA_1).toEqual(expA_2);
    expect(expA_1).not.toEqual(expB);
  });
});
