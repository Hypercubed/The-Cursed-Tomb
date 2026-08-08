import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DIFFICULTY_OPTIONS, CampaignSetupModal } from './CampaignSetupModal';
import type { RulesTab } from './RulesModal';

describe('CampaignSetupModal difficulty options', () => {
  it('defines four distinct campaign difficulty levels', () => {
    expect(DIFFICULTY_OPTIONS).toHaveLength(4);
    const ids = DIFFICULTY_OPTIONS.map((opt) => opt.id);
    expect(ids).toEqual(['novice', 'explorer', 'archaeologist', 'survivalist']);
  });

  it('maps correct redeal values to each difficulty level', () => {
    const novice = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'novice');
    const explorer = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'explorer');
    const archaeologist = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'archaeologist');
    const survivalist = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'survivalist');

    expect(novice?.value).toBe(null);
    expect(explorer?.value).toBe(2);
    expect(archaeologist?.value).toBe(1);
    expect(survivalist?.value).toBe(0);
  });

  it('includes simulated single-game win rates for standard solitaire from Results.md and omits campaign win rates', () => {
    const novice = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'novice');
    const explorer = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'explorer');
    const archaeologist = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'archaeologist');
    const survivalist = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'survivalist');

    // Standard Solitaire Win Rates (Pyramid Clear) from sim/RESULTS.md Part 1
    expect(novice?.standardWinRate).toBe('34.57%');
    expect(explorer?.standardWinRate).toBe('34.37%');
    expect(archaeologist?.standardWinRate).toBe('14.91%');
    expect(survivalist?.standardWinRate).toBe('1.17%');

    // Campaign win rates are removed
    expect('campaignWinRate' in (novice || {})).toBe(false);
    expect('campaignWinRate' in (explorer || {})).toBe(false);
    expect('campaignWinRate' in (archaeologist || {})).toBe(false);
    expect('campaignWinRate' in (survivalist || {})).toBe(false);
  });
});

// Shared minimal props for rendering the modal open
const baseProps = {
  isOpen: true,
  onClose: vi.fn(),
  selectedDifficulty: null,
  onSelectDifficulty: vi.fn(),
  onStartCampaign: vi.fn(),
};

describe('CampaignSetupModal onOpenFullRules tab-argument behaviour', () => {
  it('calls onOpenFullRules with "core-rules" when mode is "cursed-tomb" (Campaign)', () => {
    const onOpenFullRules = vi.fn();
    render(
      <CampaignSetupModal
        {...baseProps}
        selectedMode="cursed-tomb"
        onOpenFullRules={onOpenFullRules}
      />
    );

    const button = screen.getByRole('button', { name: /Read Full Rules/i });
    button.click();

    expect(onOpenFullRules).toHaveBeenCalledTimes(1);
    expect(onOpenFullRules).toHaveBeenCalledWith<[RulesTab]>('core-rules');
  });

  it('calls onOpenFullRules with "standard-pyramid" when mode is "standard"', () => {
    const onOpenFullRules = vi.fn();
    render(
      <CampaignSetupModal
        {...baseProps}
        selectedMode="standard"
        onOpenFullRules={onOpenFullRules}
      />
    );

    const button = screen.getByRole('button', { name: /Read Full Rules/i });
    button.click();

    expect(onOpenFullRules).toHaveBeenCalledTimes(1);
    expect(onOpenFullRules).toHaveBeenCalledWith<[RulesTab]>('standard-pyramid');
  });

  it('"Read Full Rules" button is absent when onOpenFullRules is not provided', () => {
    render(<CampaignSetupModal {...baseProps} />);

    expect(screen.queryByRole('button', { name: /Read Full Rules/i })).toBeNull();
  });
});
