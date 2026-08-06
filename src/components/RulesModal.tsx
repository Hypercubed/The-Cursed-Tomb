import { useEffect, useState, useRef } from 'react';
import { PlayingCard, InkBleedFilterDef } from './PlayingCard';

export type RulesTab = 'core-rules' | 'web-guide' | 'card-anatomy';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: RulesTab;
}

function RealRankMark({
  rank = '7',
  stage = 0,
  funcVal,
  color = 'blue',
  isSunCross = false,
}: {
  rank?: string;
  stage?: number;
  funcVal?: string;
  color?: 'blue' | 'red' | 'amber';
  isSunCross?: boolean;
}) {
  const strokeColor =
    color === 'red' ? '#ef4444' : color === 'amber' ? '#f59e0b' : '#3b82f6';

  if (stage === 5) {
    return <span className="text-zinc-400 font-bold font-mono">🪦 Entombed</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 font-mono select-none px-1.5 py-0.5 rounded bg-[#120e0a] border border-[#251e16]">
      <span className="relative inline-block font-bold leading-none text-game-text text-sm sm:text-base px-1">
        <span>{rank}</span>

        {(stage > 0 || isSunCross) && (
          <svg
            aria-hidden="true"
            className="absolute -inset-x-1.5 -inset-y-1 w-[calc(100%+12px)] h-[calc(100%+8px)] pointer-events-none overflow-visible z-10"
            viewBox="-15 -5 130 110"
            preserveAspectRatio="none"
          >
            {isSunCross && (
              <>
                <path
                  d="M 12 12 Q 50 50 88 88"
                  stroke="#3b82f6"
                  strokeWidth="18"
                  strokeLinecap="round"
                  filter="url(#ink-bleed)"
                />
                <path
                  d="M 12 88 Q 50 50 88 12"
                  stroke="#3b82f6"
                  strokeWidth="18"
                  strokeLinecap="round"
                  filter="url(#ink-bleed)"
                />
              </>
            )}

            {/* Stage 1: Left vertical line framing rank */}
            {stage >= 1 && (
              <path
                d="M 12 5 Q 6 50 10 95"
                stroke={strokeColor}
                strokeWidth="18"
                strokeLinecap="round"
                filter="url(#ink-bleed)"
              />
            )}

            {/* Stage 2: Right vertical line framing rank */}
            {stage >= 2 && (
              <path
                d="M 88 5 Q 94 50 90 95"
                stroke={strokeColor}
                strokeWidth="18"
                strokeLinecap="round"
                filter="url(#ink-bleed)"
              />
            )}

            {/* Stage 3: Backslash \ directly overlapping rank */}
            {stage >= 3 && (
              <path
                d="M 12 4 C 36 32 64 65 88 96"
                stroke={strokeColor}
                strokeWidth="18"
                strokeLinecap="round"
                filter="url(#ink-bleed)"
              />
            )}

            {/* Stage 4: Forward slash / forming X directly overlapping rank */}
            {stage >= 4 && (
              <path
                d="M 10 96 C 34 66 66 34 90 4"
                stroke={strokeColor}
                strokeWidth="18"
                strokeLinecap="round"
                filter="url(#ink-bleed)"
              />
            )}
          </svg>
        )}
      </span>

      {stage >= 3 && funcVal && (
        <span
          className="text-xs sm:text-sm font-black leading-none ml-1 font-mono text-amber-300"
          style={{
            fontFamily: '"Caveat", "Architects Daughter", cursive, sans-serif',
            transform: 'rotate(-4deg)',
          }}
        >
          {funcVal}
        </span>
      )}
    </span>
  );
}

const VALID_TABS: RulesTab[] = ['core-rules', 'web-guide', 'card-anatomy'];

function sanitizeTab(tab?: unknown): RulesTab {
  if (typeof tab === 'string' && (VALID_TABS as string[]).includes(tab)) {
    return tab as RulesTab;
  }
  return 'core-rules';
}

export function RulesModal({ isOpen, onClose, initialTab = 'core-rules' }: RulesModalProps) {
  const [activeTab, setActiveTab] = useState<RulesTab>(() => sanitizeTab(initialTab));
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setActiveTab(sanitizeTab(initialTab));
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-5 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-4xl w-full max-h-[calc(100svh-1rem)] sm:max-h-[90vh] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d2319] bg-[#120e0a] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-game-accent">📜</span>
            <div>
              <h2 id="rules-modal-title" className="text-lg font-semibold text-game-text font-display tracking-wider uppercase m-0">
                Expedition Rules & Compendium
              </h2>
              <p className="text-xs text-game-muted m-0">
                The Cursed Tomb • Official Physical Ruleset & Web Game Digital Interaction Guide
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-game-muted hover:text-game-text bg-transparent border-none text-xl font-bold cursor-pointer p-1 transition-colors"
            aria-label="Close rules modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Bar Navigation */}
        <div className="flex border-b border-[#2d2319] bg-[#140f0a] px-4 pt-3 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('core-rules')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'core-rules'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>📜</span> Core Physical Ruleset
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('web-guide')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'web-guide'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>🌐</span> Web Controls & Guide
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card-anatomy')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'card-anatomy'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>🂡</span> Card Anatomy & Ink
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 text-sm text-game-muted space-y-4 sm:space-y-6">
          {/* TAB 1: CORE PHYSICAL RULESET */}
          {activeTab === 'core-rules' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#120e0a] border border-amber-900/40 p-4 rounded-lg text-amber-200/90 text-xs leading-relaxed flex items-start gap-3">
                <span className="text-xl">𓋹</span>
                <div>
                  <strong className="text-amber-300 font-display uppercase tracking-wider block mb-1">
                    Official Board Game Manual Reference
                  </strong>
                  This document presents the official physical ruleset for playing <em>The Cursed Tomb</em> using a standard 52-card deck and a permanent fine-tip marker.
                </div>
              </div>

              {/* Section 1 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 1.</span> Expedition Objective & Defeat Conditions
                </h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed">
                  <p className="m-0 text-game-text">
                    Your ultimate goal is to achieve a single <strong>Perfect Win</strong>—completely moving all 52 cards of the deck into the face-up <strong>Foundation pile</strong> across your campaign.
                  </p>
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-1.5">
                    <span className="font-semibold text-red-400 font-display uppercase tracking-wide block">
                      The Tomb Collapses (Campaign Defeat Condition)
                    </span>
                    <p className="m-0 text-game-muted leading-relaxed">
                      <strong className="text-game-text">Starvation Condition:</strong> The campaign ends in instant defeat if, at the start of a new round, you do not have enough active cards remaining in your deck pool to deal a full 28-card pyramid layout.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 2.</span> Core Definitions & Terminology
                </h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-0.5">Printed Rank</strong>
                    Immutable original value printed on the card face (A, 2–10, J, Q, K). Used for Tomb Collapse auditing.
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-0.5">Functional Value</strong>
                    Temporary mathematical value used during gameplay, altered by Scars (+1 Red, -1 Black).
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-0.5">Exposed Card</strong>
                    A card in the pyramid with no cards physically overlapping or underpinning it from the row below.
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-0.5">Stock & Waste</strong>
                    The face-down draw pile (Stock) and the face-up pile where drawn cards land (Waste).
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-0.5">The Vault <span className="text-xs font-normal text-game-muted">(♦ Diamond Blessing)</span></strong>
                    A separate holding area distinct from the Foundation. Blessed ♦ Diamond cards may be freely placed here without spending an action — unblocking cards beneath them. Vaulted cards survive Redeals and can be paired normally at any time.
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-0.5">Graveyard Box</strong>
                    Separate physical container for dead (entombed) cards, permanently removed from active deck pool.
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 3.</span> Campaign Difficulty Modes
                </h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-emerald-400">Novice (Sandbox):</strong> 5 Redeals (6 Passes). Relaxed learning mode.
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-blue-400">Explorer (Easy):</strong> 3 Redeals allowed (4 total passes through Stock).
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-amber-400">Archaeologist (Normal):</strong> 1 Redeal allowed (2 total passes through Stock).
                  </div>
                  <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                    <strong className="text-red-400">Survivalist (Hard):</strong> 0 Redeals allowed (1 single pass through Stock).
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 4.</span> Live-Play Architecture & Traps
                </h3>
                <div className="mt-3 space-y-2.5 text-xs leading-relaxed">
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                    <strong className="text-game-text block mb-1">1. Target Sum & Value Shifts</strong>
                    Pair exposed cards adding to Functional Value <strong>13</strong>. Functional values wrap circularly: a -1 shift on a Black Ace wraps to 13 (clears solo as King), and a +1 shift on a Red King wraps to 1 (pairs with Queen).
                  </div>
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                    <strong className="text-red-300 block mb-1">2. Red Curses [ |X| ] (The Trap) — ▼ Downward Triangle</strong>
                    When dealing the pyramid layout, overlapping cards dealt in the next row beneath a Red Curse must be dealt face-down.
                  </div>
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                    <strong className="text-amber-300 block mb-1">3. Black Curses [ |X| ] (The Recycled Weight) — ⏍ Weight</strong>
                    When paired with a matching partner card, the Black Cursed card moves to Foundation, but its partner card is shuffled back into the Stock pile.
                  </div>
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                    <strong className="text-blue-300 block mb-1">4. Blessing & Curse Mutual Exclusivity</strong>
                    Cards possess a single visual identity: either a Blessing drawing OR a Curse drawing, never both. Blessed cards taking Stage 4 Attrition retain their Blessing drawing and skip Curse trap mechanics. Cursed cards cleared as Heroes skip Blessing awards.
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 5.</span> The Attrition Track (Rank Pip Ink Marks)
                </h3>
                <div className="mt-3 space-y-2 text-xs">
                  <p className="m-0 text-game-muted leading-relaxed">
                    When a game freezes with no legal moves remaining, all completely exposed <strong>Bottleneck cards</strong> at the lowest remaining pyramid tiers suffer failure ink marks drawn directly across their rank number:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center mt-3">
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={1} color="blue" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 1: Vulnerable</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={2} color="blue" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 2: Doubtful</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={3} funcVal="8" color="blue" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 3: Scar (+1 / -1)</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={4} funcVal="8" color="blue" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 4: Curse (Trap/Weight)</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5 justify-center">
                      <RealRankMark stage={5} />
                      <span className="text-[10px] text-game-muted font-medium">Stage 5: Graveyard Box</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 6.</span> Survival Rewards (Suit Pip Blessings & Anchors)
                </h3>
                <div className="mt-3 space-y-2 text-xs">
                  <p className="m-0 text-game-muted">
                    When you completely clear all 28 pyramid cards, the final two matching cards award legacy suit blessings (with hand-drawn center face illustrations) and anchor immunities:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                      <strong className="text-red-400 font-display block mb-0.5">♥ Hearts (Stock Reshuffle) — ∩ Tomb Archway</strong>
                      Clearing this card immediately shuffles all cards in the Waste pile back into the Stock draw pile without consuming a redeal.
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                      <strong className="text-cyan-300 font-display block mb-0.5">♦ Diamonds (The Vault) — □ Vault Box</strong>
                      Exposed Diamond cards can be moved into the Vault slot for free without consuming a turn.
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                      <strong className="text-indigo-300 font-display block mb-0.5">♠ Spades (The Tunnel) — Tunnel Shovel</strong>
                      Clearing this card allows you to select 1 exposed pyramid card and move it directly to the Waste pile.
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16]">
                      <strong className="text-emerald-300 font-display block mb-0.5">♣ Clubs (Universal Wildcard) — ⊕ Sun Cross</strong>
                      Cross out rank digit in blue ink (<RealRankMark rank="7" isSunCross={true} color="blue" />). Can pair legally with ANY exposed card regardless of value sum.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: WEB CONTROLS & DIGITAL GUIDE */}
          {activeTab === 'web-guide' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#120e0a] border border-blue-900/40 p-4 rounded-lg text-blue-200/90 text-xs leading-relaxed flex items-start gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <strong className="text-blue-300 font-display uppercase tracking-wider block mb-1">
                    Digital Web Application User Guide
                  </strong>
                  Learn how physical board game rules map to mouse clicks, interactive modes, and automated web features.
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Interaction 1 */}
                <div className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-game-accent font-display m-0 flex items-center gap-2">
                    <span>🂠</span> Basic Card Pairing & Solo Clears
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                      <span className="text-game-muted block text-[11px] uppercase tracking-wider font-semibold mb-1">Physical Rule</span>
                      Pair any 2 exposed cards whose functional values sum to 13, or clear Kings solo.
                    </div>
                    <div className="bg-[#18130e] p-3 rounded border border-amber-900/30">
                      <span className="text-amber-400 block text-[11px] uppercase tracking-wider font-semibold mb-1">Web UI Interaction</span>
                      Click an exposed card to select it (amber outline), then click its matching pair partner. Cards with functional value 13 clear instantly on a single click.
                    </div>
                  </div>
                </div>

                {/* Interaction 2 */}
                <div className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-indigo-300 font-display m-0 flex items-center gap-2">
                    <span>♠</span> Spades Tunnel Targeting Mode
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                      <span className="text-game-muted block text-[11px] uppercase tracking-wider font-semibold mb-1">Physical Rule</span>
                      When a Spades Hero is cleared, move 1 exposed pyramid card to the Waste pile.
                    </div>
                    <div className="bg-[#18130e] p-3 rounded border border-indigo-900/30">
                      <span className="text-indigo-300 block text-[11px] uppercase tracking-wider font-semibold mb-1">Web UI Interaction</span>
                      Clearing a Spades Hero activates <strong>Targeting Mode</strong>. The layout pulses softly. Click any exposed pyramid card to transfer it to the Waste pile.
                    </div>
                  </div>
                </div>

                {/* Interaction 3 */}
                <div className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-cyan-300 font-display m-0 flex items-center gap-2">
                    <span>♦</span> Diamond Vault Action
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                      <span className="text-game-muted block text-[11px] uppercase tracking-wider font-semibold mb-1">Physical Rule</span>
                      Exposed Diamond cards can be placed into a separate Vault slot on the table for free.
                    </div>
                    <div className="bg-[#18130e] p-3 rounded border border-cyan-900/30">
                      <span className="text-cyan-300 block text-[11px] uppercase tracking-wider font-semibold mb-1">Web UI Interaction</span>
                      Select an exposed Diamond card (from pyramid or waste pile) and click the glowing <strong>Vault Slot</strong> in the Draw Zone to vault it without losing your turn.
                    </div>
                  </div>
                </div>

                {/* Interaction 4 */}
                <div className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-emerald-300 font-display m-0 flex items-center gap-2">
                    <span>♣</span> Clubs Wildcard & Black Curse Restrictions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                      <span className="text-emerald-400 font-semibold block mb-1">Clubs Wildcard</span>
                      Selecting a Clubs Hero allows pairing with <em>any</em> exposed card on the board regardless of functional value sum.
                    </div>
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                      <span className="text-amber-400 font-semibold block mb-1">Black Curse Weight</span>
                      Clearing a Black Cursed card automatically shuffles its paired partner card back into the face-down Stock pile instead of moving it to Foundation.
                    </div>
                  </div>
                </div>

                {/* Interaction 5 */}
                <div className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-amber-300 font-display m-0 flex items-center gap-2">
                    <span>🏺</span> Automated Post-Round Lifecycle & Attrition
                  </h4>
                  <p className="m-0 text-game-muted leading-relaxed">
                    When a round ends in defeat (pyramid freeze), the game engine automatically scans the layout, identifies exposed bottleneck cards, applies failure ink marks (Vulnerable → Doubtful → Scar → Curse → Entombed), updates campaign persistence, and displays exact results in the <strong>Round Summary Modal</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARD ANATOMY & INK MARKINGS */}
          {activeTab === 'card-anatomy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#120e0a] border border-amber-900/40 p-4 rounded-lg text-amber-200/90 text-xs leading-relaxed flex items-start gap-3">
                <span className="text-xl">🂡</span>
                <div>
                  <strong className="text-amber-300 font-display uppercase tracking-wider block mb-1">
                    Playing Card Ink Zone Map
                  </strong>
                  Understand where failure pen strokes and hero blessings are marked on physical cards versus how they are rendered on digital cards.
                </div>
              </div>

              {/* Visual Card Diagram Mockup */}
              <div className="bg-[#120e0a] border border-[#2d2319] p-5 rounded-lg flex flex-col items-center">
                <div className="w-44 sm:w-48 h-60 sm:h-64 shadow-2xl rounded-xl">
                  <PlayingCard
                    rank={7}
                    suit="♦"
                    attritionStage={3}
                    rewardStage={2}
                    blessed={true}
                    functionalValue={8}
                  />
                </div>
                <span className="text-xs text-game-muted mt-3 font-medium">Anatomy of a Blessed & Scarred Hero Card (Real SVG Ink Overlays)</span>
              </div>

              {/* Zone Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-1.5">
                  <strong className="text-amber-300 block font-display">Top-Left Index Zone</strong>
                  <p className="m-0 text-game-muted leading-relaxed">
                    Reserved for Attrition Marks, Scars, Curses, and Sun Cross wildcard rank cross-outs (<RealRankMark rank="7" isSunCross={true} color="blue" />) over the rank number pip. Vertical lines frame the rank digit, Scar backslash strokes <RealRankMark rank="7" stage={3} funcVal="8" color="blue" /> overlap the rank, and Sun Cross wildcards feature a blue crossed-out rank number.
                  </p>
                </div>
                <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-1.5">
                  <strong className="text-amber-300 block font-display">Center Card Face Zone</strong>
                  <p className="m-0 text-game-muted leading-relaxed">
                    Reserved for hand-drawn center face illustrations: suit blessings (<strong className="text-blue-300 font-mono">∩</strong>, <strong className="text-blue-300 font-mono">□</strong>, shovel, <strong className="text-blue-300 font-mono">⊕</strong>) or stage 4 curses (<strong className="text-red-400 font-mono">▼</strong>, <strong className="text-red-400 font-mono">⏍</strong>).
                  </p>
                </div>
                <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-1.5">
                  <strong className="text-amber-300 block font-display">Top-Right Margin Zone</strong>
                  <p className="m-0 text-game-muted leading-relaxed">
                    Reserved exclusively for defensive Immunity Anchors (<code className="text-amber-200 font-mono">—</code> for Fortifying, <code className="text-amber-200 font-mono">+</code> for Anchored). Shields card from future rank loss ink marks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <InkBleedFilterDef />

        {/* Modal Footer */}
        <div className="safe-area-toolbar px-3 sm:px-5 py-3 border-t border-[#2d2319] bg-[#120e0a] flex justify-end shrink-0">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="appearance-none bg-amber-950/80 border border-amber-800 text-amber-300 rounded-lg text-xs sm:text-sm cursor-pointer font-[inherit] px-5 py-2 hover:bg-amber-900 hover:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors font-medium flex items-center gap-1.5"
          >
            <span>📜</span> Close Compendium
          </button>
        </div>
      </div>
    </div>
  );
}

export default RulesModal;
