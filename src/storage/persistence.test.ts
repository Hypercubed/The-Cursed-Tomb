import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryAdapter } from './adapters';
import { PersistenceManager, DEFAULT_SETTINGS, DEFAULT_STATS } from './persistence';
import { startGame } from '../game';

describe('Storage Persistence', () => {
  let adapter: InMemoryAdapter;
  let manager: PersistenceManager;

  beforeEach(() => {
    adapter = new InMemoryAdapter();
    manager = new PersistenceManager(adapter);
  });

  describe('InMemoryAdapter', () => {
    it('stores, retrieves, and removes items', () => {
      adapter.setItem('key1', 'value1');
      expect(adapter.getItem('key1')).toBe('value1');
      adapter.removeItem('key1');
      expect(adapter.getItem('key1')).toBeNull();
    });
  });

  describe('PersistenceManager - Settings', () => {
    it('returns default settings when storage is empty', () => {
      expect(manager.getSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it('saves and retrieves updated settings', () => {
      manager.saveSettings(2);
      const settings = manager.getSettings();
      expect(settings).toEqual({
        version: 1,
        selectedRedraw: 2,
      });
    });

    it('returns default settings when stored settings JSON is corrupted', () => {
      adapter.setItem('cursed_tomb_settings', 'invalid { json');
      expect(manager.getSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it('returns default settings when schema version is invalid or incompatible', () => {
      adapter.setItem(
        'cursed_tomb_settings',
        JSON.stringify({ version: 99, selectedRedraw: 1 })
      );
      expect(manager.getSettings()).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('PersistenceManager - Game State', () => {
    it('returns null when no game state is saved', () => {
      expect(manager.getGameState()).toBeNull();
    });

    it('saves and retrieves an active game state', () => {
      const state = startGame(1);
      manager.saveGameState(state);
      const restored = manager.getGameState();
      expect(restored).not.toBeNull();
      expect(restored?.status).toBe('in-progress');
    });

    it('clears stored game state', () => {
      const state = startGame(1);
      manager.saveGameState(state);
      manager.clearGameState();
      expect(manager.getGameState()).toBeNull();
    });

    it('returns null on corrupted game state JSON', () => {
      adapter.setItem('cursed_tomb_game_state', 'corrupted payload');
      expect(manager.getGameState()).toBeNull();
    });

    it('returns null on invalid game state structure', () => {
      adapter.setItem(
        'cursed_tomb_game_state',
        JSON.stringify({ version: 1, savedAt: Date.now(), state: { status: 'invalid-status' } })
      );
      expect(manager.getGameState()).toBeNull();
    });
  });

  describe('PersistenceManager - Stats', () => {
    it('returns default stats when storage is empty', () => {
      expect(manager.getStats()).toEqual(DEFAULT_STATS);
    });

    it('records outcomes correctly and updates streak', () => {
      manager.recordOutcome('partial-victory');
      let stats = manager.getStats();
      expect(stats.partialVictories).toBe(1);
      expect(stats.completeVictories).toBe(0);
      expect(stats.pyramidCollapses).toBe(0);
      expect(stats.currentStreak).toBe(1);
      expect(stats.bestStreak).toBe(1);

      manager.recordOutcome('complete-victory');
      stats = manager.getStats();
      expect(stats.completeVictories).toBe(1);
      expect(stats.currentStreak).toBe(2);
      expect(stats.bestStreak).toBe(2);
    });

    it('records pyramid collapse and resets current streak while maintaining best streak', () => {
      manager.recordOutcome('partial-victory');
      manager.recordOutcome('complete-victory');
      manager.recordOutcome('pyramid-collapse');
      const stats = manager.getStats();
      expect(stats.partialVictories).toBe(1);
      expect(stats.completeVictories).toBe(1);
      expect(stats.pyramidCollapses).toBe(1);
      expect(stats.currentStreak).toBe(0);
      expect(stats.bestStreak).toBe(2);
    });

    it('migrates legacy stats payload gracefully', () => {
      adapter.setItem(
        'cursed_tomb_stats',
        JSON.stringify({ version: 1, wins: 5, losses: 2, currentStreak: 3, bestStreak: 4 })
      );
      const migrated = manager.getStats();
      expect(migrated).toEqual({
        version: 1,
        completeVictories: 0,
        partialVictories: 5,
        pyramidCollapses: 2,
        currentStreak: 3,
        bestStreak: 4,
      });
    });

    it('manages campaign stats correctly', () => {
      const defaultCampaign = manager.getCampaignStats();
      expect(defaultCampaign).toEqual({
        version: 1,
        pyramidsExplored: 0,
        pyramidsCollapsed: 0,
        isVictory: false,
        totalAttempts: 0,
      });

      manager.recordOutcome('partial-victory');
      let campaign = manager.getCampaignStats();
      expect(campaign.pyramidsExplored).toBe(1);
      expect(campaign.totalAttempts).toBe(1);

      manager.recordOutcome('pyramid-collapse');
      campaign = manager.getCampaignStats();
      expect(campaign.pyramidsCollapsed).toBe(1);
      expect(campaign.totalAttempts).toBe(2);

      manager.recordOutcome('complete-victory');
      campaign = manager.getCampaignStats();
      expect(campaign.isVictory).toBe(true);
      expect(campaign.totalAttempts).toBe(3);

      const resetCampaign = manager.resetCampaignStats();
      expect(resetCampaign.totalAttempts).toBe(0);
      expect(resetCampaign.isVictory).toBe(false);
    });

    it('resets stats to defaults', () => {
      manager.recordOutcome('complete-victory');
      manager.resetStats();
      expect(manager.getStats()).toEqual(DEFAULT_STATS);
    });

    it('returns default stats on corrupted json or invalid schema', () => {
      adapter.setItem('cursed_tomb_stats', 'corrupted');
      expect(manager.getStats()).toEqual(DEFAULT_STATS);

      adapter.setItem(
        'cursed_tomb_stats',
        JSON.stringify({ version: 99, completeVictories: 'invalid' })
      );
      expect(manager.getStats()).toEqual(DEFAULT_STATS);
    });
  });
});

