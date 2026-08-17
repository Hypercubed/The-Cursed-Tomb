import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createDeck } from '../game';
import { MatchedCardsModal } from './MatchedCardsModal';

describe('MatchedCardsModal deck matrix visuals', () => {
  it('keeps removed outlines independent from status interiors', () => {
    const masterDeck = createDeck();
    const blessedRemoved = masterDeck.find((card) => card.id === '♥1')!;
    blessedRemoved.blessed = true;

    const cursedRemoved = masterDeck.find((card) => card.id === '♠2')!;
    cursedRemoved.attritionStage = 4;

    const cursedActive = masterDeck.find((card) => card.id === '♠3')!;
    cursedActive.attritionStage = 4;

    const scarredRemoved = masterDeck.find((card) => card.id === '♣4')!;
    scarredRemoved.attritionStage = 2;

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set(['♥1', '♠2', '♣4'])}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    const cellFor = (prefix: string): HTMLElement => {
      const cell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
        element.title.startsWith(prefix)
      );
      expect(cell).toBeDefined();
      return cell!;
    };

    const blessedCell = cellFor('♥A');
    expect(blessedCell.className).toContain('bg-[#18130e]');
    expect(blessedCell.className).toContain('text-game-muted/60');
    expect(blessedCell.className).toContain('border-[#251e16]');
    expect(blessedCell.className).not.toContain('border-blue-500/80');
    expect(blessedCell.className).not.toContain('ring-blue-400/60');

    const cursedRemovedCell = cellFor('♠2');
    expect(cursedRemovedCell.className).toContain('bg-[#18130e]');
    expect(cursedRemovedCell.className).toContain('text-game-muted/60');
    expect(cursedRemovedCell.className).toContain('border-[#251e16]');
    expect(cursedRemovedCell.className).not.toContain('border-red-600/80');
    expect(cursedRemovedCell.className).not.toContain('ring-red-500/60');

    const scarredRemovedCell = cellFor('♣4');
    expect(scarredRemovedCell.className).toContain('bg-[#18130e]');
    expect(scarredRemovedCell.className).toContain('border-[#251e16]');
    expect(scarredRemovedCell.className).not.toContain('border-blue-600/70');

    const cursedActiveCell = cellFor('♠3');
    expect(cursedActiveCell.className).toContain('bg-[#2a2016]');
    expect(cursedActiveCell.className).not.toContain('border-red-600/80');
    expect(cursedActiveCell.className).not.toContain('ring-red-500/60');
    expect(cursedActiveCell.className).not.toContain('shadow-[0_0_8px_rgba(220,38,38,0.25)]');
    expect(cursedActiveCell.className).toContain('border-game-accent');

    const blessedActive = masterDeck.find((card) => card.id === '♦5')!;
    blessedActive.blessed = true;

    const blessedScarred = masterDeck.find((card) => card.id === '♣6')!;
    blessedScarred.blessed = true;
    blessedScarred.attritionStage = 2;

    // Blessed status is communicated by its blue icon/interior, not a competing outline.
    const { container: activeBlessedContainer } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );
    const blessedActiveCell = Array.from(activeBlessedContainer.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♦5')
    );
    expect(blessedActiveCell?.className).toContain('bg-[#2a2016]');
    expect(blessedActiveCell?.className).not.toContain('border-blue-500/80');
    expect(blessedActiveCell?.className).not.toContain('ring-blue-400/60');

    const blessedScarredCell = Array.from(activeBlessedContainer.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♣6')
    );
    expect(blessedScarredCell?.className).toContain('bg-[#2a2016]');
    expect(blessedScarredCell?.className).not.toContain('border-blue-600/70');
    expect(blessedScarredCell?.className).toContain('border-game-accent');
  });

  it.each([0, 1, 2, 3, 4])('uses the active lifecycle surface for Blessed cards at attrition stage %s', (attritionStage) => {
    const masterDeck = createDeck();
    const blessedCard = masterDeck.find((card) => card.id === '♥1')!;
    blessedCard.blessed = true;
    blessedCard.attritionStage = attritionStage as typeof blessedCard.attritionStage;

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    const cell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♥A')
    );
    expect(cell?.className).not.toContain('border-blue-500/80');
    expect(cell?.className).not.toContain('border-blue-600/70');
    expect(cell?.className).not.toContain('ring-blue-400/60');
    expect(cell?.className).toContain('bg-[#2a2016]');
    expect(cell?.className).toContain('border-game-accent');
  });

  it.each([0, 1, 2, 3, 4])('uses the removed lifecycle surface for Blessed cards at attrition stage %s', (attritionStage) => {
    const masterDeck = createDeck();
    const blessedCard = masterDeck.find((card) => card.id === '♥1')!;
    blessedCard.blessed = true;
    blessedCard.attritionStage = attritionStage as typeof blessedCard.attritionStage;

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set(['♥1'])}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    const cell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♥A')
    );
    expect(cell?.className).toContain('bg-[#18130e]');
    expect(cell?.className).toContain('border-[#251e16]');
    expect(cell?.className).not.toContain('border-blue-500/80');
    expect(cell?.className).not.toContain('border-blue-600/70');
    expect(cell?.className).not.toContain('ring-blue-400/60');
  });

  it('uses the entombed lifecycle surface and neutral outline', () => {
    const masterDeck = createDeck();
    masterDeck.find((card) => card.id === '♣1')!.attritionStage = 5;

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    const entombedCell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♣A')
    );
    expect(entombedCell?.className).toContain('bg-stone-950');
    expect(entombedCell?.className).toContain('border-[#251e16]');
    expect(entombedCell?.className).not.toContain('border-game-accent');
  });

  it('limits every matrix cell outline to neutral active or gold removed styling', () => {
    const masterDeck = createDeck();
    masterDeck.find((card) => card.id === '♥1')!.blessed = true;
    masterDeck.find((card) => card.id === '♦2')!.attritionStage = 4;
    masterDeck.find((card) => card.id === '♠3')!.attritionStage = 2;
    masterDeck.find((card) => card.id === '♣4')!.attritionStage = 5;

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set(['♥1', '♦2'])}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    const cells = Array.from(container.querySelectorAll<HTMLElement>('[title]')).filter((element) =>
      element.title.includes('Active') || element.title.includes('Removed') || element.title.includes('Entombed')
    );
    expect(cells).toHaveLength(52);

    for (const cell of cells) {
      expect(cell.className).not.toMatch(/border-(blue|red)-/);
      expect(cell.className).not.toMatch(/ring-(blue|red)-/);
      expect(cell.className).not.toMatch(/shadow-.*rgba\((37,99,235|220,38,38)/);

      if (cell.title.includes('Entombed')) {
        expect(cell.className).toContain('bg-stone-950');
        expect(cell.className).toContain('border-[#251e16]');
        expect(cell.className).not.toContain('border-game-accent');
      } else if (cell.title.includes('Removed')) {
        expect(cell.className).toContain('bg-[#18130e]');
        expect(cell.className).toContain('border-[#251e16]');
        expect(cell.className).not.toContain('border-game-accent');
      } else {
        expect(cell.className).toContain('bg-[#2a2016]');
        expect(cell.className).toContain('border-game-accent');
      }
    }
  });

  it('renders suit-specific illustrations in matrix cells and the legend', () => {
    const masterDeck = createDeck();
    masterDeck.find((card) => card.id === '♥1')!.blessed = true;
    masterDeck.find((card) => card.id === '♠2')!.attritionStage = 4;

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    expect(container.querySelector('[aria-label="Blessed suit illustrations"]')?.querySelectorAll('svg')).toHaveLength(4);
    expect(container.querySelector('[aria-label="Cursed suit illustrations (3-4 Scars)"]')?.querySelectorAll('svg')).toHaveLength(2);

    const scarredLegend = container.querySelector('[aria-label="Scarred legend"]');
    expect(scarredLegend).not.toBeNull();
    expect(scarredLegend?.textContent).toContain('N');
    expect(scarredLegend?.textContent).toContain('Scarred');
    expect(scarredLegend?.className).toContain('text-red-400');
    const scarredMark = scarredLegend?.querySelector('svg');
    expect(scarredMark).not.toBeNull();
    expect(scarredMark?.querySelectorAll('line')).toHaveLength(2);
    expect(scarredMark?.querySelector('line:nth-child(1)')?.getAttribute('x1')).toBe('8');
    expect(scarredMark?.querySelector('line:nth-child(1)')?.getAttribute('x2')).toBe('8');
    expect(scarredMark?.querySelector('line:nth-child(1)')?.getAttribute('stroke')).toBe('#dc2626');
    expect(scarredMark?.querySelector('line:nth-child(2)')?.getAttribute('x1')).toBe('8');
    expect(scarredMark?.querySelector('line:nth-child(2)')?.getAttribute('x2')).toBe('92');
    expect(scarredMark?.querySelector('line:nth-child(2)')?.getAttribute('stroke')).toBe('#dc2626');
    expect(scarredMark?.querySelector('line')?.getAttribute('stroke-width')).toBe('20');

    for (const icon of container.querySelectorAll('[aria-label="Blessed suit illustrations"] svg, [aria-label="Cursed suit illustrations"] svg')) {
      expect(icon.querySelector('g')?.getAttribute('transform')).toBe('translate(0, 0) rotate(0 50 50) scale(1)');
      expect(icon.querySelector('path, polygon, rect')?.getAttribute('stroke-width')).toBe('2');
    }

    const blessedCell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♥A')
    );
    const cursedCell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
      element.title.startsWith('♠2')
    );

    expect(blessedCell?.querySelector('svg[viewBox="0 0 100 100"]')).not.toBeNull();
    expect(cursedCell?.querySelector('svg[viewBox="0 0 100 100"]')).not.toBeNull();
    expect(blessedCell?.querySelector('svg[viewBox="0 0 100 100"] g')?.getAttribute('transform')).toBe('translate(0, 0) rotate(0 50 50) scale(1)');
    expect(blessedCell?.querySelector('svg[viewBox="0 0 100 100"] path')?.getAttribute('stroke-width')).toBe('2');
    expect(cursedCell?.querySelector('svg[viewBox="0 0 100 100"] g')?.getAttribute('transform')).toBe('translate(0, 0) rotate(0 50 50) scale(1)');
    expect(cursedCell?.querySelector('svg[viewBox="0 0 100 100"] polygon')?.getAttribute('stroke-width')).toBe('2');
    expect(cursedCell?.querySelector('polygon')?.getAttribute('points')).toBe('32,30 68,30 82,80 18,80');
    expect(cursedCell?.querySelector('polygon')?.getAttribute('stroke')).toBe('#dc2626');
    expect(blessedCell?.querySelector('path')?.getAttribute('stroke')).toBe('#1d4ed8');
  });

  it('renders red scar lines (1-4 strokes) and shifted functional value in matrix cells', () => {
    const masterDeck = createDeck();
    masterDeck.find((card) => card.id === '♥2')!.attritionStage = 1;
    masterDeck.find((card) => card.id === '♥3')!.attritionStage = 2; // fVal = 4
    masterDeck.find((card) => card.id === '♠4')!.attritionStage = 3; // fVal = 3
    masterDeck.find((card) => card.id === '♠5')!.attritionStage = 4; // fVal = 4

    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );

    const cellFor = (prefix: string): HTMLElement => {
      const cell = Array.from(container.querySelectorAll<HTMLElement>('[title]')).find((element) =>
        element.title.startsWith(prefix)
      );
      expect(cell).toBeDefined();
      return cell!;
    };

    // Stage 1 (♥2): 1 red vertical line
    const stage1Cell = cellFor('♥2');
    const stage1Lines = stage1Cell.querySelectorAll('svg line[stroke="#dc2626"]');
    expect(stage1Lines).toHaveLength(1);
    expect(stage1Lines[0].getAttribute('x1')).toBe('8');
    expect(stage1Lines[0].getAttribute('x2')).toBe('8');
    expect(stage1Cell.textContent).not.toContain('3');

    // Stage 2 (♥3): 2 red lines (left line + backslash) and shifted functional value '4'
    const stage2Cell = cellFor('♥3');
    const stage2Lines = stage2Cell.querySelectorAll('svg line[stroke="#dc2626"]');
    expect(stage2Lines).toHaveLength(2);
    expect(stage2Lines[0].getAttribute('x1')).toBe('8');
    expect(stage2Lines[0].getAttribute('x2')).toBe('8');
    expect(stage2Lines[1].getAttribute('x1')).toBe('8');
    expect(stage2Lines[1].getAttribute('x2')).toBe('92');
    expect(stage2Cell.textContent).toContain('4'); // functional value for red +1

    // Stage 3 (♠4): 3 red lines (left line + backslash + forward slash) and shifted value '3'
    const stage3Cell = cellFor('♠4');
    const stage3Lines = stage3Cell.querySelectorAll('svg line[stroke="#dc2626"]');
    expect(stage3Lines).toHaveLength(3);
    expect(stage3Lines[2].getAttribute('x1')).toBe('8');
    expect(stage3Lines[2].getAttribute('x2')).toBe('92');
    expect(stage3Lines[2].getAttribute('y1')).toBe('95');
    expect(stage3Lines[2].getAttribute('y2')).toBe('5');
    expect(stage3Cell.textContent).toContain('3'); // functional value for black -1

    // Stage 4 (♠5): 4 red lines (left line + backslash + forward slash + right line) and shifted value '4'
    const stage4Cell = cellFor('♠5');
    const stage4Lines = stage4Cell.querySelectorAll('svg line[stroke="#dc2626"]');
    expect(stage4Lines).toHaveLength(4);
    expect(stage4Lines[3].getAttribute('x1')).toBe('92');
    expect(stage4Lines[3].getAttribute('x2')).toBe('92');
    expect(stage4Cell.textContent).toContain('4'); // functional value for black -1
  });
});

describe('MatchedCardsModal expedition pair odds', () => {
  it('renders Functional Pair Odds badge in expedition mode and hides in standard mode', () => {
    const masterDeck = createDeck();
    const { container: expContainer } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );
    expect(expContainer.textContent).toContain('⚡ Functional Pair Odds');
    const { container: stdContainer } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={[]}
        masterDeck={masterDeck}
        mode="standard"
      />
    );
    expect(stdContainer.textContent).not.toContain('⚡ Functional Pair Odds');
  });

  it('renders wildcard pill when Clubs blessed card is active', () => {
    const masterDeck = createDeck();
    masterDeck.find((c) => c.id === '♣5')!.blessed = true;
    const pairStatsWithWildcard = [
      { label: 'Kings (13)', rank1: 13 as const, rank1Label: 'K', active1: 4, remainingPairs: 4, hasWildcard: true },
      { label: 'Q + A', rank1: 12 as const, rank1Label: 'Q', active1: 4, rank2: 1 as const, rank2Label: 'A', active2: 4, remainingPairs: 4, hasWildcard: true },
    ];
    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={pairStatsWithWildcard}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );
    expect(container.textContent).toContain('♣ Wildcard Active');
  });

  it('does not render wildcard pill when no wildcard is active', () => {
    const masterDeck = createDeck();
    const pairStatsNoWildcard = [
      { label: 'Kings (13)', rank1: 13 as const, rank1Label: 'K', active1: 4, remainingPairs: 4, hasWildcard: false },
    ];
    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={pairStatsNoWildcard}
        masterDeck={masterDeck}
        mode="cursed-tomb"
      />
    );
    expect(container.textContent).not.toContain('♣ Wildcard Active');
  });

  it('renders functional shift annotation chips inside pair cards', () => {
    const pairStats = [
      {
        label: 'Kings (13)',
        rank1: 13 as const,
        rank1Label: 'K',
        active1: 5,
        remainingPairs: 5,
        functionalModifications1: ['+1 Red Q ➔ K'],
        hasWildcard: false,
      },
      {
        label: 'Q + A',
        rank1: 12 as const,
        rank1Label: 'Q',
        active1: 3,
        rank2: 1 as const,
        rank2Label: 'A',
        active2: 4,
        remainingPairs: 3,
        functionalModifications1: ['-1 Black 10 ➔ 9'],
        hasWildcard: false,
      },
    ];
    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={pairStats}
        mode="cursed-tomb"
      />
    );
    expect(container.textContent).toContain('⚡');
    expect(container.textContent).toContain('➔');
    expect(container.textContent).toContain('Red Q');
    expect(container.textContent).toContain('Black 10');
  });

  it('groups duplicate modifications with count prefix', () => {
    const pairStats = [
      {
        label: 'Kings (13)',
        rank1: 13 as const,
        rank1Label: 'K',
        active1: 6,
        remainingPairs: 6,
        functionalModifications1: ['+1 Red Q ➔ K', '+1 Red Q ➔ K'],
        hasWildcard: false,
      },
    ];
    const { container } = render(
      <MatchedCardsModal
        isOpen
        onClose={() => undefined}
        removedCardIds={new Set()}
        pairStats={pairStats}
        mode="cursed-tomb"
      />
    );
    expect(container.textContent).toContain('2×');
    expect(container.textContent).toContain('Red Q ➔ K');
  });
});
