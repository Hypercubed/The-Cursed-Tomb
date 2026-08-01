import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcutsOptions {
  onDrawOrCycle: () => void;
  onDeselect: () => void;
  onNewGame: () => void;
  onToggleHelp: () => void;
  isModalOpen?: boolean;
}

export function useKeyboardShortcuts({
  onDrawOrCycle,
  onDeselect,
  onNewGame,
  onToggleHelp,
  isModalOpen = false,
}: KeyboardShortcutsOptions) {
  const onDrawOrCycleRef = useRef(onDrawOrCycle);
  onDrawOrCycleRef.current = onDrawOrCycle;

  const onDeselectRef = useRef(onDeselect);
  onDeselectRef.current = onDeselect;

  const onNewGameRef = useRef(onNewGame);
  onNewGameRef.current = onNewGame;

  const onToggleHelpRef = useRef(onToggleHelp);
  onToggleHelpRef.current = onToggleHelp;

  const isModalOpenRef = useRef(isModalOpen);
  isModalOpenRef.current = isModalOpen;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Guard: Don't process shortcuts if a modal is open
    if (isModalOpenRef.current) return;

    // Guard: Don't process shortcuts if typing in an input field or textarea
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    const key = event.key.toLowerCase();

    // Space or D - Draw card or cycle pile
    if (key === ' ' || key === 'd') {
      event.preventDefault();
      onDrawOrCycleRef.current();
      return;
    }

    // Escape - Deselect card
    if (key === 'escape') {
      event.preventDefault();
      onDeselectRef.current();
      return;
    }

    // N - New game
    if (key === 'n') {
      event.preventDefault();
      onNewGameRef.current();
      return;
    }

    // ? or H - Toggle help/shortcuts legend
    if (key === '?' || key === 'h') {
      event.preventDefault();
      onToggleHelpRef.current();
      return;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
