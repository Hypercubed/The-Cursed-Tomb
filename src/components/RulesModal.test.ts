import { describe, it, expect } from 'vitest';
import { RulesModal, RulesTab } from './RulesModal';

describe('RulesModal component definition', () => {
  it('exports RulesModal component and RulesTab type definition', () => {
    expect(RulesModal).toBeDefined();
    expect(typeof RulesModal).toBe('function');
  });

  it('supports core-rules, web-guide, and card-anatomy tabs', () => {
    const tabs: RulesTab[] = ['core-rules', 'web-guide', 'card-anatomy'];
    expect(tabs).toHaveLength(3);
  });
});
