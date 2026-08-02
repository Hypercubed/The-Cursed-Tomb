import { useEffect, useRef } from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#18130e] border border-[#3d3124] rounded-xl p-6 max-w-md w-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-game-muted hover:text-game-text bg-transparent border-none cursor-pointer text-xl leading-none focus:ring-2 focus:ring-amber-500 focus:outline-none rounded"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-game-text font-display mt-0 mb-6 tracking-wider uppercase border-b border-[#3d3124] pb-3 flex items-center gap-2">
          <span className="text-game-accent">⌨️</span> Keyboard Shortcuts
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[#2d2319]">
            <span className="text-game-text">Draw Card / Cycle Deck</span>
            <div className="flex gap-2">
              <kbd className="px-2 py-1 text-sm font-mono bg-[#120e0a] border border-[#251e16] rounded text-amber-400">Space</kbd>
              <kbd className="px-2 py-1 text-sm font-mono bg-[#120e0a] border border-[#251e16] rounded text-amber-400">D</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#2d2319]">
            <span className="text-game-text">Deselect Card</span>
            <kbd className="px-2 py-1 text-sm font-mono bg-[#120e0a] border border-[#251e16] rounded text-amber-400">Esc</kbd>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#2d2319]">
            <span className="text-game-text">New Game / Reset</span>
            <kbd className="px-2 py-1 text-sm font-mono bg-[#120e0a] border border-[#251e16] rounded text-amber-400">N</kbd>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-game-text">Show Keyboard Shortcuts</span>
            <div className="flex gap-2">
              <kbd className="px-2 py-1 text-sm font-mono bg-[#120e0a] border border-[#251e16] rounded text-amber-400">?</kbd>
              <kbd className="px-2 py-1 text-sm font-mono bg-[#120e0a] border border-[#251e16] rounded text-amber-400">H</kbd>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#3d3124] text-xs text-game-muted">
          <p>Shortcuts are disabled when typing in input fields or when modals are open.</p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
