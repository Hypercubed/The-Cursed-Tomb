import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DrawZone } from './DrawZone';
import { Card } from '../game';

describe('DrawZone Component', () => {
  const dummyStockCard: Card = {
    id: '♠10',
    suit: '♠',
    rank: 10,
    removed: false,
    selected: false,
    attritionStage: 0,
    rewardStage: 0,
    blessed: false,
    faceDown: true,
  };

  const dummyDiscardCard: Card = {
    id: '♥5',
    suit: '♥',
    rank: 5,
    removed: false,
    selected: false,
    attritionStage: 0,
    rewardStage: 0,
    blessed: false,
  };

  const dummyVaultCard: Card = {
    id: '♦A',
    suit: '♦',
    rank: 1,
    removed: false,
    selected: false,
    attritionStage: 0,
    rewardStage: 0,
    blessed: true,
  };

  it('renders card count indicators for Stock, Waste, and Vault in Cursed Tomb mode', () => {
    render(
      <DrawZone
        drawPileCount={18}
        discardPileCount={7}
        topStock={dummyStockCard}
        topDiscard={dummyDiscardCard}
        vaultCards={[dummyVaultCard]}
        selectedCardId={null}
        redrawsRemaining={1}
        canDraw={true}
        canCycle={false}
        gameActive={true}
        mode="cursed-tomb"
        onDraw={vi.fn()}
        onCardClick={vi.fn()}
      />
    );

    expect(screen.getByText('18')).toBeDefined();
    expect(screen.getByText('7')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
  });

  it('renders 0 for empty vault slot in Cursed Tomb mode', () => {
    render(
      <DrawZone
        drawPileCount={24}
        discardPileCount={0}
        topStock={dummyStockCard}
        topDiscard={null}
        vaultCards={[]}
        selectedCardId={null}
        redrawsRemaining={1}
        canDraw={true}
        canCycle={false}
        gameActive={true}
        mode="cursed-tomb"
        onDraw={vi.fn()}
        onCardClick={vi.fn()}
      />
    );

    expect(screen.getByText('24')).toBeDefined();
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  it('hides vault slot in Standard Solitaire mode', () => {
    render(
      <DrawZone
        drawPileCount={10}
        discardPileCount={4}
        topStock={dummyStockCard}
        topDiscard={dummyDiscardCard}
        vaultCards={[]}
        selectedCardId={null}
        redrawsRemaining={null}
        canDraw={true}
        canCycle={false}
        gameActive={true}
        mode="standard"
        onDraw={vi.fn()}
        onCardClick={vi.fn()}
      />
    );

    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.queryByText('0')).toBeNull();
  });
});
