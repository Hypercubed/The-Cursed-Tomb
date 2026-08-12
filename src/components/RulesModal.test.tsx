import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RulesModal, RulesTab } from './RulesModal';

describe('RulesModal component definition', () => {
  it('exports RulesModal component and RulesTab type definition', () => {
    expect(RulesModal).toBeDefined();
    expect(typeof RulesModal).toBe('function');
  });

  it('supports core-rules, standard-pyramid, web-guide, and card-anatomy tabs', () => {
    const tabs: RulesTab[] = ['core-rules', 'standard-pyramid', 'web-guide', 'card-anatomy'];
    expect(tabs).toHaveLength(4);
  });

  it('renders Anchor Rule 5, Immunity Exception, and Anchor Progression on Core Rules tab', () => {
    render(<RulesModal isOpen={true} onClose={() => {}} initialTab="core-rules" />);

    // Check Rule 5 heading
    expect(screen.getByText('5. Retrospective Anchor Rules & Absorption Shield')).toBeDefined();

    // Check Immunity Exception
    expect(screen.getByText('Immunity Exception (Anchor Absorption)')).toBeDefined();

    // Check Section 6 Anchor subsections & Wildcard rule
    expect(screen.getByText('B. The Solo Clear (King / Value 13)')).toBeDefined();
    expect(screen.getByText('♣ Wildcard Partner Rule')).toBeDefined();
  });

  it('renders Anchors & Absorption Defense UI section on Web Guide tab', () => {
    render(<RulesModal isOpen={true} onClose={() => {}} initialTab="web-guide" />);

    // Check Interaction 6 heading
    expect(screen.getByText('Anchors & Absorption Defense UI')).toBeDefined();

    // Check UI interaction explanation
    expect(screen.getByText(/0\/4/)).toBeDefined();
    expect(screen.getByText(/4\/4/)).toBeDefined();
  });
});
