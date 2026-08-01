import { describe, it, expect } from 'vitest';
import { DIFFICULTY_OPTIONS } from './CampaignSetupModal';

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

    expect(novice?.value).toBeNull();
    expect(explorer?.value).toBe(2);
    expect(archaeologist?.value).toBe(1);
    expect(survivalist?.value).toBe(0);
  });

  it('includes simulated win rates for standard (Part 2) and full campaign (Part 3) results', () => {
    const novice = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'novice');
    const explorer = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'explorer');
    const archaeologist = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'archaeologist');
    const survivalist = DIFFICULTY_OPTIONS.find((opt) => opt.id === 'survivalist');

    // Part 2 (Standard Solitaire)
    expect(novice?.standardWinRate).toBe('25.2%');
    expect(explorer?.standardWinRate).toBe('21.2%');
    expect(archaeologist?.standardWinRate).toBe('6.4%');
    expect(survivalist?.standardWinRate).toBe('0.0%');

    // Part 3 (Cursed Tomb Full Rules Campaign)
    expect(novice?.campaignWinRate).toBe('2.9%');
    expect(explorer?.campaignWinRate).toBe('2.4%');
    expect(archaeologist?.campaignWinRate).toBe('0.9%');
    expect(survivalist?.campaignWinRate).toBe('0.0%');
  });
});
