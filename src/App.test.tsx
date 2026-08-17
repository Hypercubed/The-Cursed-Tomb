import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { defaultPersistenceManager } from './storage/persistence';
import { createCampaign } from './game';

describe('App - Campaign Stats Reset on New Game', () => {
  beforeEach(() => {
    localStorage.clear();
    defaultPersistenceManager.clearGameState();
    defaultPersistenceManager.clearCampaignState();
    defaultPersistenceManager.resetCampaignStats();
    defaultPersistenceManager.resetStats();
  });

  it('initializes with default zeroed campaign stats when there is no active campaign', () => {
    // Populate old campaign stats without an active campaign
    defaultPersistenceManager.saveCampaignStats({
      version: 1,
      pyramidsExplored: 5,
      pyramidsConquered: 3,
      pyramidsCollapsed: 2,
      isVictory: false,
      totalAttempts: 5,
    });

    render(<App />);

    // Active Campaign section in sidebar should display 0s or not show old values
    // When setup modal is closed, let's start a new game and check sidebar
    const startBtn = screen.getByRole('button', { name: /Start Campaign/i });
    fireEvent.click(startBtn);

    expect(defaultPersistenceManager.getCampaignStats()).toEqual({
      version: 1,
      pyramidsExplored: 0,
      pyramidsConquered: 0,
      pyramidsCollapsed: 0,
      isVictory: false,
      totalAttempts: 0,
    });
  });

  it('resets campaign stats in persistence and state when starting a new campaign from setup modal', () => {
    // Record outcomes in persistence manager
    defaultPersistenceManager.recordOutcome('partial-victory');
    defaultPersistenceManager.recordOutcome('pyramid-collapse');

    let currentStats = defaultPersistenceManager.getCampaignStats();
    expect(currentStats.pyramidsExplored).toBe(1);
    expect(currentStats.pyramidsCollapsed).toBe(1);
    expect(currentStats.totalAttempts).toBe(2);

    // Save an active campaign
    const campaign = createCampaign('cursed-tomb', 1);
    defaultPersistenceManager.saveCampaignState(campaign);

    render(<App />);

    // Click "New Game" in the sidebar to open Campaign Setup Modal
    const newGameButtons = screen.getAllByRole('button', { name: /New Game/i });
    fireEvent.click(newGameButtons[0]);

    // Click "Start Campaign" in the setup modal
    const startCampaignBtn = screen.getByRole('button', { name: /Start Campaign/i });
    fireEvent.click(startCampaignBtn);

    // Verify campaign stats are reset to 0 in persistence
    const resetStats = defaultPersistenceManager.getCampaignStats();
    expect(resetStats.pyramidsExplored).toBe(0);
    expect(resetStats.pyramidsConquered).toBe(0);
    expect(resetStats.pyramidsCollapsed).toBe(0);
    expect(resetStats.totalAttempts).toBe(0);
    expect(resetStats.isVictory).toBe(false);
  });

  it('resets campaign stats when starting a standard game', () => {
    defaultPersistenceManager.recordOutcome('partial-victory');
    const campaign = createCampaign('cursed-tomb', 1);
    defaultPersistenceManager.saveCampaignState(campaign);

    render(<App />);

    // Open setup modal
    const newGameButtons = screen.getAllByRole('button', { name: /New Game/i });
    fireEvent.click(newGameButtons[0]);

    // Select Standard Solitaire mode
    const standardModeBtn = screen.getByRole('button', { name: /Standard Solitaire/i });
    fireEvent.click(standardModeBtn);

    // Start Standard Game
    const startStandardBtn = screen.getByRole('button', { name: /Start Standard Game/i });
    fireEvent.click(startStandardBtn);

    // Verify campaign stats are reset
    const resetStats = defaultPersistenceManager.getCampaignStats();
    expect(resetStats.pyramidsExplored).toBe(0);
    expect(resetStats.totalAttempts).toBe(0);
  });
});
