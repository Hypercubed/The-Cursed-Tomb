import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PyramidBoard } from './PyramidBoard';
import { Card } from '../game';

describe('PyramidBoard Component', () => {
  const dummyPyramid: Card[][] = [
    [
      {
        id: '♠A',
        suit: '♠',
        rank: 1,
        removed: false,
        selected: false,
        attritionStage: 0,
        rewardStage: 0,
        blessed: false,
      },
    ],
  ];

  it('renders reserved banner slot container with aria-live in normal mode without text', () => {
    const { container } = render(
      <PyramidBoard
        pyramid={dummyPyramid}
        selectedCardId={null}
        status="in-progress"
        interactionMode="normal"
        onCardClick={vi.fn()}
      />
    );

    const bannerSlot = container.querySelector('[aria-live="polite"]');
    expect(bannerSlot).not.toBeNull();
    expect(bannerSlot?.className).toContain('min-h-[32px]');
    expect(bannerSlot?.textContent).toBe('');
  });

  it('renders Spades Tunnel prompt inside reserved banner slot when targeting-spades mode active', () => {
    render(
      <PyramidBoard
        pyramid={dummyPyramid}
        selectedCardId={null}
        status="in-progress"
        interactionMode="targeting-spades"
        onCardClick={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Spades Tunnel: Click one exposed pyramid card to move it to the Waste pile!/)
    ).toBeDefined();
  });
});
