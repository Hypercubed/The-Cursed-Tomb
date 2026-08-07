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

    expect(novice?.value).toBe(5);
    expect(explorer?.value).toBe(3);
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
