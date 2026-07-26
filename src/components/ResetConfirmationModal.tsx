import { useEffect } from 'react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ResetConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div
        className="bg-[#18130e] border-2 border-[#3d3124] rounded-xl max-w-md w-full flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2319] bg-[#120e0a]">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-game-accent">📜</span>
            <h2 id="reset-modal-title" className="text-lg font-semibold text-game-text font-display tracking-wider uppercase m-0">
              Start New Campaign
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-game-muted hover:text-game-text bg-transparent border-none text-xl font-bold cursor-pointer p-1 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-sm text-game-muted flex flex-col gap-3">
          <p className="m-0 text-game-text font-medium">
            Are you sure you want to start a new campaign?
          </p>
          <p className="m-0 text-xs text-game-muted/80 leading-relaxed">
            This action will end your active campaign and reset your current campaign progress (Pyramids Explored and Pyramids Collapsed).
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#2d2319] bg-[#120e0a] flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="appearance-none bg-transparent border border-game-border rounded-lg text-game-text text-sm cursor-pointer font-[inherit] px-4 py-2 hover:border-game-accent transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="appearance-none bg-amber-950/80 border border-amber-800 text-amber-300 rounded-lg text-sm cursor-pointer font-[inherit] px-4 py-2 hover:bg-amber-900 hover:text-amber-100 transition-colors font-medium"
          >
            Start New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetConfirmationModal;
