import { useEffect, useState, useRef } from 'react';
import { GameMode } from '../game';

export interface DifficultyOption {
  id: string;
  label: string;
  value: number | null;
  tag: string;
  redealsText: string;
  description: string;
  icon: string;
  winRate: string;
  standardWinRate: string;
  campaignWinRate: string;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    id: 'novice',
    label: 'Novice',
    value: null,
    tag: 'Sandbox',
    redealsText: 'Unlimited Redeals',
    description: 'Unlimited stock pile passes. Ideal for casual exploration & learning.',
    icon: '📜',
    winRate: '25.2%',
    standardWinRate: '25.2%',
    campaignWinRate: '10.5%',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    value: 2,
    tag: 'Easy',
    redealsText: '2 Redeals (3 Passes)',
    description: '2 stock redeals per attempt. Balanced entry-level campaign mode.',
    icon: '🧭',
    winRate: '21.2%',
    standardWinRate: '21.2%',
    campaignWinRate: '7.8%',
  },
  {
    id: 'archaeologist',
    label: 'Archaeologist',
    value: 1,
    tag: 'Normal',
    redealsText: '1 Redeal (2 Passes)',
    description: '1 stock redeal per attempt. Standard Egyptian expedition challenge.',
    icon: '🔍',
    winRate: '6.4%',
    standardWinRate: '6.4%',
    campaignWinRate: '2.6%',
  },
  {
    id: 'survivalist',
    label: 'Survivalist',
    value: 0,
    tag: 'Hard',
    redealsText: '0 Redeals (1 Pass)',
    description: '0 stock redeals (single pass). Unforgiving curse of the Pharaohs!',
    icon: '💀',
    winRate: '0.0%',
    standardWinRate: '0.0%',
    campaignWinRate: '0.0%',
  },
];

interface CampaignSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDifficulty: number | null;
  onSelectDifficulty: (difficulty: number | null) => void;
  selectedMode?: GameMode;
  onSelectMode?: (mode: GameMode) => void;
  volatileCollapse?: boolean;
  onToggleVolatileCollapse?: (enabled: boolean) => void;
  onStartCampaign: (difficulty: number | null, mode?: GameMode, volatileCollapse?: boolean) => void;
  onOpenFullRules?: () => void;
}

export function CampaignSetupModal({
  isOpen,
  onClose,
  selectedDifficulty,
  onSelectDifficulty,
  selectedMode: propMode,
  onSelectMode,
  volatileCollapse: propVolatile,
  onToggleVolatileCollapse,
  onStartCampaign,
  onOpenFullRules,
}: CampaignSetupModalProps) {
  const [internalMode, setInternalMode] = useState<GameMode>('cursed-tomb');
  const [internalVolatile, setInternalVolatile] = useState<boolean>(false);

  const mode = propMode ?? internalMode;
  const volatile = propVolatile ?? internalVolatile;

  const handleModeChange = (newMode: GameMode) => {
    setInternalMode(newMode);
    onSelectMode?.(newMode);
  };

  const handleVolatileChange = (val: boolean) => {
    setInternalVolatile(val);
    onToggleVolatileCollapse?.(val);
  };

  const startCampaignBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      startCampaignBtnRef.current?.focus();
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
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-setup-modal-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2319] bg-[#120e0a]">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-game-accent">𓋹</span>
            <div>
              <h2
                id="campaign-setup-modal-title"
                className="text-lg font-semibold text-game-text font-display tracking-wider uppercase m-0"
              >
                Campaign Setup & Rules
              </h2>
              <p className="text-xs text-game-muted m-0">
                Prepare your expedition into the ancient tomb
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-game-muted hover:text-game-text bg-transparent border-none text-xl font-bold cursor-pointer p-1 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 text-sm text-game-muted">
          {/* Game Mode Selection */}
          <section className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-game-text font-display tracking-wider uppercase">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleModeChange('cursed-tomb')}
                className={`p-3 rounded-lg border text-left font-display tracking-wide flex flex-col gap-1 transition-all cursor-pointer ${
                  mode === 'cursed-tomb'
                    ? 'bg-[#251d14] border-game-accent text-amber-200 ring-1 ring-game-accent'
                    : 'bg-[#120e0a] border-[#2d2319] text-game-muted hover:text-game-text'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <span>𓋹</span> Cursed Tomb Campaign
                </div>
                <span className="text-[11px] text-game-muted font-sans leading-normal">
                  Persistent 52-card legacy deck with Scars, Curses, Blessings & Tomb Collapse.
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('standard')}
                className={`p-3 rounded-lg border text-left font-display tracking-wide flex flex-col gap-1 transition-all cursor-pointer ${
                  mode === 'standard'
                    ? 'bg-[#251d14] border-game-accent text-amber-200 ring-1 ring-game-accent'
                    : 'bg-[#120e0a] border-[#2d2319] text-game-muted hover:text-game-text'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <span>🂡</span> Standard Solitaire
                </div>
                <span className="text-[11px] text-game-muted font-sans leading-normal">
                  Classic Pyramid Solitaire with single-round reset and fixed printed ranks.
                </span>
              </button>
            </div>
          </section>

          {/* Rules Overview Section */}
          <section className="bg-[#120e0a] border border-[#2d2319] rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#251e16] pb-2">
              <h3 className="text-sm font-semibold text-game-accent font-display tracking-wider uppercase m-0 flex items-center gap-2">
                <span>📜</span> Expedition Rules Overview ({mode === 'cursed-tomb' ? 'Cursed Tomb' : 'Standard'})
              </h3>
              {onOpenFullRules && (
                <button
                  type="button"
                  onClick={onOpenFullRules}
                  className="text-xs text-amber-400 hover:text-amber-200 hover:underline bg-transparent border-none cursor-pointer font-medium flex items-center gap-1 transition-colors"
                >
                  <span>📖</span> Read Full Rules
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#18130e] p-3 rounded border border-[#251e16] flex flex-col gap-1">
                <span className="font-semibold text-game-text flex items-center gap-1.5">
                  <span>𓂠</span> Target Sum: 13
                </span>
                <p className="m-0 text-game-muted/90 leading-relaxed">
                  Pair any 2 exposed cards whose functional values sum to <strong>13</strong> to remove them.
                </p>
              </div>

              <div className="bg-[#18130e] p-3 rounded border border-[#251e16] flex flex-col gap-1">
                <span className="font-semibold text-game-text flex items-center gap-1.5">
                  <span>👑</span> Solo King Clears
                </span>
                <p className="m-0 text-game-muted/90 leading-relaxed">
                  Cards with functional value 13 are removed individually with a single click.
                </p>
              </div>

              {mode === 'cursed-tomb' ? (
                <>
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16] flex flex-col gap-1">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <span>🩸</span> Functional Value Scars
                    </span>
                    <p className="m-0 text-game-muted/90 leading-relaxed">
                      Red Scars shift value <strong>+1</strong>, Black Scars shift value <strong>-1</strong>.
                    </p>
                  </div>

                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16] flex flex-col gap-1">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <span>🔒</span> Traps & Hero Blessings
                    </span>
                    <p className="m-0 text-game-muted/90 leading-relaxed">
                      Red Curses lock cards face-down; Black Curses restrict pairing; Suit Heroes grant powers.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16] flex flex-col gap-1">
                    <span className="font-semibold text-game-text flex items-center gap-1.5">
                      <span>🂡</span> Card Rank Values
                    </span>
                    <p className="m-0 text-game-muted/90 leading-relaxed">
                      Ace = 1, Jack = 11, Queen = 12, King = 13. Number cards (2–10) equal face value.
                    </p>
                  </div>

                  <div className="bg-[#18130e] p-3 rounded border border-[#251e16] flex flex-col gap-1">
                    <span className="font-semibold text-game-text flex items-center gap-1.5">
                      <span>🃏</span> Stock & Waste Deck
                    </span>
                    <p className="m-0 text-game-muted/90 leading-relaxed">
                      Draw cards from stock to find pairs with exposed pyramid cards or top waste card.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Difficulty Selection Section */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#2d2319] pb-2">
              <h3 className="text-sm font-semibold text-game-text font-display tracking-wider uppercase m-0 flex items-center gap-2">
                <span>🏺</span> Select Campaign Difficulty
              </h3>
              <span className="text-[11px] text-game-muted/80">
                {mode === 'cursed-tomb'
                  ? 'Estimated Full Campaign Victory Rate'
                  : 'Estimated 200-Round Victory Rate'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIFFICULTY_OPTIONS.map((option) => {
                const isSelected = selectedDifficulty === option.value;
                const winRateText = mode === 'cursed-tomb' ? option.campaignWinRate : option.standardWinRate;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelectDifficulty(option.value)}
                    className={`text-left p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#251d14] border-game-accent text-amber-200 ring-1 ring-game-accent shadow-[0_0_12px_rgba(217,119,6,0.2)]'
                        : 'bg-[#120e0a] border-[#2d2319] hover:border-[#3d3124] text-game-muted hover:text-game-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.icon}</span>
                        <span className="font-semibold font-display tracking-wide text-sm text-game-text">
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          isSelected
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-[#18130e] text-game-muted border border-[#2d2319]'
                        }`}
                      >
                        {option.tag}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-game-accent font-medium">{option.redealsText}</span>
                      <span
                        className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'bg-[#18130e] text-emerald-300 border-amber-800/60'
                            : 'bg-[#18130e] text-emerald-400/90 border-[#251e16]'
                        }`}
                        title={
                          mode === 'cursed-tomb'
                            ? 'Simulated campaign victory rate under full rules with scars, curses & attrition'
                            : 'Simulated chance of complete victory within 200 rounds (base rules without attrition)'
                        }
                      >
                        🎯 {winRateText} <span className="text-[9px] opacity-75 font-sans">({mode === 'cursed-tomb' ? 'Full Campaign' : '200 Rounds'})</span>
                      </span>
                    </div>

                    <p className="m-0 text-xs text-game-muted/80 leading-relaxed">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2d2319] bg-[#120e0a] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-4 py-2 hover:border-game-accent focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors"
          >
            Cancel
          </button>
          <button
            ref={startCampaignBtnRef}
            type="button"
            onClick={() => onStartCampaign(selectedDifficulty, mode, volatile)}
            className="appearance-none bg-amber-950/80 border border-amber-800 text-amber-300 rounded-lg text-sm cursor-pointer font-[inherit] px-6 py-2.5 hover:bg-amber-900 hover:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors font-semibold tracking-wide flex items-center gap-2 shadow-md"
          >
            <span>𓋹</span> Start Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampaignSetupModal;
