import { useEffect, useState, useRef } from 'react';
import { PlayingCard, InkBleedFilterDef } from './PlayingCard';

export type RulesTab = 'core-rules' | 'standard-pyramid' | 'web-guide' | 'card-anatomy';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: RulesTab;
}

function RealRankMark({
  rank = '7',
  stage = 0,
  funcVal,
  color = 'red',
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

const VALID_TABS: RulesTab[] = ['core-rules', 'standard-pyramid', 'web-guide', 'card-anatomy'];

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
        <div className="flex border-b border-[#2d2319] bg-[#140f0a] px-2 sm:px-4 pt-2.5 gap-1.5 sm:gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('standard-pyramid')}
            className={`flex-1 sm:flex-initial justify-center px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'standard-pyramid'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>🔺</span> Standard Pyramid
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('core-rules')}
            className={`flex-1 sm:flex-initial justify-center px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'core-rules'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>📜</span> Expedition Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('web-guide')}
            className={`flex-1 sm:flex-initial justify-center px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'web-guide'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>🌐</span> Web Guide
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card-anatomy')}
            className={`flex-1 sm:flex-initial justify-center px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-display tracking-wide rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'card-anatomy'
                ? 'bg-[#18130e] text-amber-300 border-[#3d3124] border-b-[#18130e] -mb-[1px]'
                : 'bg-[#100c08] text-game-muted border-transparent hover:text-game-text hover:bg-[#18130e]/50'
              }`}
          >
            <span>🂡</span> Card Anatomy
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
                    A separate holding area distinct from the Foundation. Multiple Blessed ♦ Diamond cards may be freely placed here without spending an action, forming a First-In, Last-Out (FILO) stack and unblocking cards beneath them. Only the top vaulted card is playable; vaulted cards survive Redeals.
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
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                    <strong className="text-blue-300 block mb-1">5. Retrospective Anchor Rules & Absorption Shield</strong>
                    An Anchor <code className="text-amber-200 font-mono">[ + ]</code> drawn in Cobalt Blue ink in the card's upper-right corner acts as a defensive shield absorbing up to 4 round-freeze attrition hits. Each absorbed freeze hit is recorded as a scarlet red mark (dot or small tick) in one of the 4 outer corner quadrants surrounding the blue <code className="text-amber-200 font-mono">+</code> cross. On absorbing the 4th freeze hit, the Anchor shield exhausts (returning to un-anchored status), after which the card resumes taking freeze attrition toward entombment. Pre-existing Scars and Curses remain active and are preserved when the Anchor shield exhausts.
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
                      <RealRankMark rank="7" stage={1} color="red" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 1: Vulnerable</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={2} color="red" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 2: Doubtful</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={3} funcVal="8" color="red" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 3: Scar (+1 / -1)</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5">
                      <RealRankMark rank="7" stage={4} funcVal="8" color="red" />
                      <span className="text-[10px] text-game-muted font-medium">Stage 4: Curse (Trap/Weight)</span>
                    </div>
                    <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] flex flex-col items-center gap-1.5 justify-center">
                      <RealRankMark stage={5} />
                      <span className="text-[10px] text-game-muted font-medium">Stage 5: Graveyard Box</span>
                    </div>
                  </div>
                  <div className="bg-[#18130e] p-3 rounded border border-blue-900/30 mt-3 space-y-1">
                    <span className="font-semibold text-blue-300 font-display uppercase tracking-wide block">
                      Immunity Exception (Anchor Absorption)
                    </span>
                    <p className="m-0 text-game-muted leading-relaxed">
                      If a card possesses a completed <strong className="text-amber-200 font-mono">Anchor [ + ]</strong> in its upper-right corner, it absorbs freeze hits with scarlet red quadrant marks (up to 4 absorbed hits) instead of advancing Attrition stages.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                  <span>── 6.</span> Survival Rewards (Hero Blessings & Anchors)
                </h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed">
                  <p className="m-0 text-game-muted">
                    When you completely clear all 28 pyramid cards, the final card play used to dismantle the board awards legacy unlocks:
                  </p>

                  {/* Subsection A: Final Pair Clear */}
                  <div className="space-y-2">
                    <strong className="text-amber-300 font-display block">A. The Final Pair Clear</strong>
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-2">
                      <p className="m-0 text-game-text">
                        <strong className="text-amber-400">1. Higher-Value Card (Blessed Hero):</strong> Receives its suit-specific blessing illustration drawn on the center card face:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                        <div className="bg-[#120e0a] p-2 rounded border border-[#251e16]">
                          <strong className="text-red-400 font-display block mb-0.5">♥ Hearts (Stock Reshuffle) — ∩ Tomb Archway</strong>
                          Shuffles Waste pile back into Stock without consuming a redeal.
                        </div>
                        <div className="bg-[#120e0a] p-2 rounded border border-[#251e16]">
                          <strong className="text-cyan-300 font-display block mb-0.5">♦ Diamonds (The Vault) — □ Vault Box</strong>
                          Freely vault exposed Diamonds into a FILO stack without using a turn.
                        </div>
                        <div className="bg-[#120e0a] p-2 rounded border border-[#251e16]">
                          <strong className="text-indigo-300 font-display block mb-0.5">♠ Spades (The Tunnel) — Tunnel Shovel</strong>
                          Move 1 exposed pyramid card directly to Waste.
                        </div>
                        <div className="bg-[#120e0a] p-2 rounded border border-[#251e16]">
                          <strong className="text-emerald-300 font-display block mb-0.5">♣ Clubs (Universal Wildcard) — ⊕ Sun Cross</strong>
                          Cross out rank digit (<RealRankMark rank="7" isSunCross={true} color="blue" />). Pairs legally with ANY exposed card.
                        </div>
                      </div>

                      <p className="m-0 text-game-text pt-1">
                        <strong className="text-blue-300">2. Lower-Value Card (Anchor Progression):</strong> Progresses its upper-right defensive Anchor track by 1 stroke:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                        <div className="bg-[#120e0a] p-2 rounded border border-[#251e16]">
                          <strong className="text-amber-200 font-mono block mb-0.5">1st Stroke [ — ] (Fortifying)</strong>
                          Single horizontal line in upper-right corner margin.
                        </div>
                        <div className="bg-[#120e0a] p-2 rounded border border-[#251e16]">
                          <strong className="text-amber-200 font-mono block mb-0.5">2nd Stroke [ + ] (Anchored)</strong>
                          Crossed vertically (<code className="text-amber-200 font-mono">+</code>). Card gains 4-hit absorption immunity.
                        </div>
                      </div>

                      <div className="bg-[#120e0a] p-2.5 rounded border border-emerald-900/30 text-game-muted">
                        <strong className="text-emerald-400 block mb-0.5">♣ Wildcard Partner Rule</strong>
                        If the final pair contains an existing ♣ Clubs Universal Wildcard, the Wildcard automatically takes the Anchor stroke (<code className="text-amber-200 font-mono">[ — ]</code> → <code className="text-amber-200 font-mono">[ + ]</code>), while its partner receives the Hero Blessing.
                      </div>
                    </div>
                  </div>

                  {/* Subsection B: Solo Clear */}
                  <div className="space-y-2">
                    <strong className="text-amber-300 font-display block">B. The Solo Clear (King / Value 13)</strong>
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-1.5">
                      <p className="m-0 text-game-text">
                        If the final card clearing the pyramid is played singly (a King or card with active Functional Value 13), it progresses its upper-right Anchor track by 1 stroke (<code className="text-amber-200 font-mono">[ — ]</code> or <code className="text-amber-200 font-mono">[ + ]</code>). No Hero Blessing is awarded.
                      </p>
                      <p className="m-0 text-game-muted text-[11px]">
                        <em>Anchor Progression for Mutated Cards:</em> Active cards accumulate Anchor strokes (<code className="text-amber-200 font-mono">[ — ]</code> and <code className="text-amber-200 font-mono">[ + ]</code>) at all active attrition stages (including Stage 3 Scarred and Stage 4 Cursed cards) up until Stage 5 Entombment.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* License Notice — matches docs/LICENSE + PDF p.2 colophon */}
              <section className="bg-[#18130e]/60 border border-[#2d2319] p-3 rounded-lg flex flex-col gap-2" aria-label="License notice">
                <h4 className="text-[11px] font-semibold text-game-muted font-display tracking-wider uppercase m-0 flex items-center gap-1.5">
                  <span>©</span> License — CC BY-SA 4.0
                </h4>
                <p className="m-0 text-[11px] leading-relaxed text-game-muted">
                  © 2026 Jayson Harshbarger. The Cursed Tomb original rulebook text on this tab (and{' '}
                  <span className="text-game-text">Parts II &amp; III</span> of the offline PDF) is licensed under{' '}
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline underline-offset-2">CC BY-SA 4.0</a>
                  {' '}— you may share and adapt it for any purpose, even commercially, with credit, a link to the license, and derivatives under the same license.{' '}
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" target="_blank" rel="noopener noreferrer" className="text-amber-300/80 hover:text-amber-200 underline underline-offset-2">Legal code</a>
                  {' · '}SPDX: CC-BY-SA-4.0 · Full text in <code className="text-[10px] bg-[#120e0a] px-1 py-0.5 rounded border border-[#251e16]">docs/LICENSE</code>.
                </p>
                <p className="m-0 text-[11px] leading-relaxed text-game-muted/80">
                  <strong className="text-game-muted font-semibold">Standard Pyramid</strong> rules (the “Standard Pyramid” tab / PDF Part I) are public domain — no copyright over the game; explanatory text waived via{' '}
                  <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="text-amber-300/70 hover:text-amber-200 underline underline-offset-2">CC0 1.0</a> (no attribution required).
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: STANDARD PYRAMID SOLITAIRE */}
          {activeTab === 'standard-pyramid' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#120e0a] border border-amber-900/40 p-4 rounded-lg text-amber-200/90 text-xs leading-relaxed flex items-start gap-3">
                <span className="text-xl">🔺</span>
                <div>
                  <strong className="text-amber-300 font-display uppercase tracking-wider block mb-1">
                    Classic Pyramid Solitaire Foundation
                  </strong>
                  <em>The Cursed Tomb</em> is built upon standard Pyramid Solitaire. Understanding standard rules helps you master campaign mechanics and persistent legacy ink modifications.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Objective & Layout */}
                <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                      <span>── 1.</span> Layout & Objective
                    </h3>
                    <div className="mt-3 space-y-2 text-xs leading-relaxed">
                      <p className="m-0 text-game-text">
                        <strong>Pyramid Layout:</strong> 28 cards are dealt face-up into 7 overlapping rows forming a pyramid (Row 1 has 1 card, Row 7 has 7 cards).
                      </p>
                      <p className="m-0 text-game-muted">
                        <strong>Exposed Cards:</strong> Only cards with no overlapping cards beneath them in lower rows are exposed and available to pair.
                      </p>
                      <p className="m-0 text-game-muted">
                        <strong>Win Condition:</strong> Dismantle the pyramid by clearing all 28 cards to the Foundation pile.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 2. Card Ranks & Pairing Sum */}
                <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                      <span>── 2.</span> Target Sum 13 Pairing Rules
                    </h3>
                    <div className="mt-3 space-y-2 text-xs leading-relaxed">
                      <p className="m-0 text-game-text">
                        Cards are cleared by selecting pairs of exposed cards whose values sum exactly to <strong>13</strong>:
                      </p>
                      <div className="bg-[#18130e] p-2.5 rounded border border-[#251e16] space-y-1 font-mono text-[11px]">
                        <div><strong className="text-amber-300">King (13):</strong> Clears solo (1 click)</div>
                        <div><strong className="text-amber-300">Queen (12) + Ace (1):</strong> Sums to 13</div>
                        <div><strong className="text-amber-300">Jack (11) + 2:</strong> Sums to 13</div>
                        <div><strong className="text-amber-300">10 + 3 | 9 + 4 | 8 + 5 | 7 + 6:</strong> Sums to 13</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Stock, Waste & Redeals */}
                <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                      <span>── 3.</span> Stock Draw & Waste Pile
                    </h3>
                    <div className="mt-3 space-y-2 text-xs leading-relaxed">
                      <p className="m-0 text-game-text">
                        <strong>Stock Draw:</strong> The remaining 24 cards form the face-down Stock pile. Turn cards 1-by-1 onto the Waste pile.
                      </p>
                      <p className="m-0 text-game-muted">
                        <strong>Eligible Cards:</strong> The top card of the Waste pile, current exposed Stock card, and exposed Pyramid cards can be paired together.
                      </p>
                      <p className="m-0 text-game-muted">
                        <strong>Redeals:</strong> Standard Pyramid allows resetting the Waste back to Stock up to 2 times (3 total passes through the deck).
                      </p>
                    </div>
                  </div>
                </section>

                {/* 4. Comparative Matrix */}
                <section className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 pb-2 border-b border-[#251e16] flex items-center gap-2">
                    <span>── 4.</span> Standard vs. Cursed Tomb
                  </h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#251e16] text-[11px] text-amber-300">
                          <th className="py-1 pr-2">Feature</th>
                          <th className="py-1 px-2">Standard Pyramid</th>
                          <th className="py-1 pl-2">The Cursed Tomb</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#251e16]/60 text-[11px]">
                        <tr>
                          <td className="py-1.5 pr-2 font-medium text-game-text">Card Values</td>
                          <td className="py-1.5 px-2 text-game-muted">Static (A–K)</td>
                          <td className="py-1.5 pl-2 text-amber-200">Dynamic Scars (+1/-1)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-2 font-medium text-game-text">Defeat Penalty</td>
                          <td className="py-1.5 px-2 text-game-muted">Game over / Reset</td>
                          <td className="py-1.5 pl-2 text-amber-200">Attrition Ink Marks</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-2 font-medium text-game-text">Special Powers</td>
                          <td className="py-1.5 px-2 text-game-muted">None</td>
                          <td className="py-1.5 pl-2 text-amber-200">Suit Hero Blessings</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-2 font-medium text-game-text">Traps & Extra</td>
                          <td className="py-1.5 px-2 text-game-muted">None</td>
                          <td className="py-1.5 pl-2 text-amber-200">Red Curses, Vault, etc.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: WEB CONTROLS & DIGITAL GUIDE */}
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
                      Multiple exposed Blessed Diamond cards can be placed into a separate Vault stack for free. Stack them in FILO order; only the top card is playable.
                    </div>
                    <div className="bg-[#18130e] p-3 rounded border border-cyan-900/30">
                      <span className="text-cyan-300 block text-[11px] uppercase tracking-wider font-semibold mb-1">Web UI Interaction</span>
                      Select an exposed Blessed Diamond card (from pyramid, stock, or waste pile) and click the glowing <strong>Vault Slot</strong> in the Draw Zone to add it to the FILO stack without losing your turn. The badge shows the total vaulted count.
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

                {/* Interaction 6 */}
                <div className="bg-[#120e0a] border border-[#2d2319] p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-blue-300 font-display m-0 flex items-center gap-2">
                    <span>🛡️</span> Anchors & Absorption Defense UI
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="bg-[#18130e] p-3 rounded border border-[#251e16]">
                      <span className="text-game-muted block text-[11px] uppercase tracking-wider font-semibold mb-1">Physical Rule</span>
                      Anchored cards (<code className="text-amber-200 font-mono">[ + ]</code>) absorb freeze hits with 4 corner quadrant red dots before shield breaks. Round clears upgrade final lower-value cards or solo Kings.
                    </div>
                    <div className="bg-[#18130e] p-3 rounded border border-blue-900/30">
                      <span className="text-blue-300 block text-[11px] uppercase tracking-wider font-semibold mb-1">Web UI Interaction</span>
                      Anchor progression upgrades (<code className="text-amber-200 font-mono">[ — ]</code> Fortifying or <code className="text-amber-200 font-mono">[ + ]</code> Anchored) display in the <strong>Round Summary Modal</strong>. Anchored cards show corner absorption charge indicators (<code className="text-amber-200 font-mono">0/4</code> to <code className="text-amber-200 font-mono">4/4</code> red dots) on the card badge.
                    </div>
                  </div>
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
                    anchorAbsorption={2}
                    blessed={true}
                    functionalValue={8}
                  />
                </div>
                <span className="text-xs text-game-muted mt-3 font-medium">Anatomy of a Blessed, Scarred & Anchored Hero Card (with 2/4 Red Absorption Corner Marks)</span>
              </div>

              {/* Zone Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#18130e] p-3 rounded border border-[#251e16] space-y-1.5">
                  <strong className="text-amber-300 block font-display">Top-Left Index Zone</strong>
                  <p className="m-0 text-game-muted leading-relaxed">
                    Reserved for Attrition Marks, Scars, Curses, and Sun Cross wildcard rank cross-outs (<RealRankMark rank="7" isSunCross={true} color="blue" />) over the rank number pip. Vertical lines frame the rank digit, Scar backslash strokes <RealRankMark rank="7" stage={3} funcVal="8" color="red" /> overlap the rank, and Sun Cross wildcards feature a blue crossed-out rank number.
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
                    Reserved exclusively for defensive Immunity Anchors (<code className="text-amber-200 font-mono">—</code> for Fortifying, <code className="text-amber-200 font-mono">+</code> for Anchored). Each absorbed freeze hit is recorded as a scarlet red dot in one of the 4 outer corner quadrants surrounding the blue <code className="text-amber-200 font-mono">+</code> cross (shown above with 2/4 red dots). Once all 4 red corners are filled, the shield breaks.
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
