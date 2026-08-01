import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('calls onDrawOrCycle when Space key is pressed', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).toHaveBeenCalledTimes(1);
  });

  it('calls onDrawOrCycle when D key is pressed', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'd' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).toHaveBeenCalledTimes(1);
  });

  it('calls onDeselect when Escape key is pressed', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(onDeselect).toHaveBeenCalledTimes(1);
  });

  it('calls onNewGame when N key is pressed', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'n' });
    window.dispatchEvent(event);

    expect(onNewGame).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleHelp when ? key is pressed', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: '?' });
    window.dispatchEvent(event);

    expect(onToggleHelp).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleHelp when H key is pressed', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'h' });
    window.dispatchEvent(event);

    expect(onToggleHelp).toHaveBeenCalledTimes(1);
  });

  it('ignores shortcuts when modal is open', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: true,
      })
    );

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).not.toHaveBeenCalled();
  });

  it('ignores shortcuts when typing in an input field', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    // Create an input element and set it as active
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('ignores shortcuts when typing in a textarea', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    // Create a textarea element and set it as active
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('allows shortcuts when no input element is focused', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    // Ensure no element is focused
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).toHaveBeenCalledTimes(1);
  });

  it('does not call callbacks for unrecognized keys', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'x' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).not.toHaveBeenCalled();
    expect(onDeselect).not.toHaveBeenCalled();
    expect(onNewGame).not.toHaveBeenCalled();
    expect(onToggleHelp).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const onDrawOrCycle = vi.fn();
    const onDeselect = vi.fn();
    const onNewGame = vi.fn();
    const onToggleHelp = vi.fn();

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        onDrawOrCycle,
        onDeselect,
        onNewGame,
        onToggleHelp,
        isModalOpen: false,
      })
    );

    unmount();

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(onDrawOrCycle).not.toHaveBeenCalled();
  });
});
