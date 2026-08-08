import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoundSummaryModal } from './RoundSummaryModal';
import { Card } from '../game';

describe('RoundSummaryModal', () => {
  it('displays correct Clubs blessing description matching rules', () => {
    const blessedCard: Card = {
      id: 'c1',
      suit: '♣',
      rank: 7,
      removed: false,
      selected: false,
      blessed: true,
      attritionStage: 0,
      rewardStage: 0,
    };

    render(
      <RoundSummaryModal
        isOpen={true}
        status="complete-victory"
        onClose={() => {}}
        onNextRound={() => {}}
        effects={{
          blessed: [blessedCard],
          anchored: [],
          cursed: [],
          scarred: [],
          entombed: [],
        }}
      />
    );

    expect(
      screen.getByText('♣ Equalizer: Pairs with ANY exposed card regardless of value sum')
    ).toBeDefined();
  });
});
