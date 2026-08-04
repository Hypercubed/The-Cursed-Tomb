import { describe, expect, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { CardFaceIllustration } from './CardFaceIllustration';
import PlayingCard from './PlayingCard';

describe('CardFaceIllustration Component', () => {
  it('renders Hearts blessing illustration (Tomb Archway with Upward Arrow)', () => {
    const { container } = render(<CardFaceIllustration suit="♥" blessed={true} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    // Check paths are rendered
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('renders Diamonds blessing illustration (Vault Safe Box)', () => {
    const { container } = render(<CardFaceIllustration suit="♦" blessed={true} />);
    const rect = container.querySelector('rect');
    const circle = container.querySelector('circle');
    expect(rect).not.toBeNull();
    expect(circle).not.toBeNull();
  });

  it('renders Spades blessing illustration (Tunnel Capsule)', () => {
    const { container } = render(<CardFaceIllustration suit="♠" blessed={true} />);
    const path = container.querySelector('path');
    expect(path).not.toBeNull();
  });

  it('renders Clubs blessing illustration (Infinity Symbol)', () => {
    const { container } = render(<CardFaceIllustration suit="♣" blessed={true} />);
    const path = container.querySelector('path');
    expect(path).not.toBeNull();
  });

  it('renders Red Curse illustration (Downward Triangle)', () => {
    const { container } = render(<CardFaceIllustration suit="♥" blessed={false} attritionStage={4} />);
    const polygon = container.querySelector('polygon');
    expect(polygon).not.toBeNull();
    expect(polygon?.getAttribute('points')).toBe('20,25 80,25 50,80');
  });

  it('renders Black Curse illustration (Trapezoid Weight)', () => {
    const { container } = render(<CardFaceIllustration suit="♠" blessed={false} attritionStage={4} />);
    const polygon = container.querySelector('polygon');
    const path = container.querySelector('path');
    expect(polygon).not.toBeNull();
    expect(path).not.toBeNull();
  });

  it('enforces single-identity: Stage 4 Blessed card renders Blessing illustration and NOT Curse triangle/polygon', () => {
    const { container } = render(<CardFaceIllustration suit="♥" blessed={true} attritionStage={4} />);
    // Blessed Hearts renders archway (path) and no polygon (Curse triangle)
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeNull();
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('returns null for unmutated cards (neither blessed nor stage 4 cursed)', () => {
    const { container } = render(<CardFaceIllustration suit="♥" blessed={false} attritionStage={0} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('PlayingCard Center Face Illustration Integration', () => {
  it('renders CardFaceIllustration on center face for Blessed card', () => {
    const { container } = render(<PlayingCard rank={10} suit="♣" blessed={true} />);
    const svg = container.querySelector('svg[viewBox="0 0 100 100"]');
    expect(svg).not.toBeNull();
  });

  it('renders CardFaceIllustration on center face for Stage 4 Cursed card', () => {
    const { container } = render(<PlayingCard rank={8} suit="♠" attritionStage={4} />);
    const svg = container.querySelector('svg[viewBox="0 0 100 100"]');
    expect(svg).not.toBeNull();
  });

  it('renders standard SuitIcon on center face for unmutated card', () => {
    const { container } = render(<PlayingCard rank={7} suit="♦" />);
    // CardFaceIllustration svg has viewBox "0 0 100 100"
    const illustrationSvg = container.querySelector('svg[viewBox="0 0 100 100"]');
    expect(illustrationSvg).toBeNull();
    // Standard SuitIcon for Diamond has viewBox "0 0 24 24"
    const suitSvg = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(suitSvg).not.toBeNull();
  });
});
