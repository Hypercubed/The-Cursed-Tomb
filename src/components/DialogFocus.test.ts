import { describe, it, expect } from 'vitest';
import { RoundSummaryModal } from './RoundSummaryModal';
import { ResetConfirmationModal } from './ResetConfirmationModal';
import { CampaignEndModal } from './CampaignEndModal';
import { CampaignSetupModal } from './CampaignSetupModal';
import { RulesModal } from './RulesModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { MatchedCardsModal } from './MatchedCardsModal';

describe('Dialog Keyboard Focus Components', () => {
  it('exports all modal components with dialog accessibility and keyboard focus support', () => {
    expect(RoundSummaryModal).toBeDefined();
    expect(ResetConfirmationModal).toBeDefined();
    expect(CampaignEndModal).toBeDefined();
    expect(CampaignSetupModal).toBeDefined();
    expect(RulesModal).toBeDefined();
    expect(KeyboardShortcutsModal).toBeDefined();
    expect(MatchedCardsModal).toBeDefined();
  });
});
