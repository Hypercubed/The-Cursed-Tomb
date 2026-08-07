import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DebugPanel } from './DebugPanel';
import { startGame } from '../game';

describe('DebugPanel Component', () => {
  const dummyGame = startGame(1);

  it('renders Force Win, Force Perfect Win, and Force Loss buttons and handles clicks', async () => {
    const onForceWin = vi.fn();
    const onForcePerfectWin = vi.fn();
    const onForceLoss = vi.fn();

    render(
      <DebugPanel
        game={dummyGame}
        isPlaying={false}
        isThinking={false}
        strategy="greedy"
        speedMs={500}
        moveCount={0}
        onForceWin={onForceWin}
        onForcePerfectWin={onForcePerfectWin}
        onForceLoss={onForceLoss}
        onStepOne={vi.fn()}
        onTogglePlay={vi.fn()}
        onSpeedChange={vi.fn()}
        onStrategyChange={vi.fn()}
      />
    );

    const forceWinBtn = screen.getByRole('button', { name: /⚡ Force Win/i });
    const forcePerfectWinBtn = screen.getByRole('button', { name: /🌟 Force Perfect Win/i });
    const forceLossBtn = screen.getByRole('button', { name: /⚡ Force Loss/i });

    await waitFor(() => expect((forceWinBtn as HTMLButtonElement).disabled).toBe(false));

    fireEvent.click(forceWinBtn);
    expect(onForceWin).toHaveBeenCalledTimes(1);

    fireEvent.click(forcePerfectWinBtn);
    expect(onForcePerfectWin).toHaveBeenCalledTimes(1);

    fireEvent.click(forceLossBtn);
    expect(onForceLoss).toHaveBeenCalledTimes(1);
  });
});
