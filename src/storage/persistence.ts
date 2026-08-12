import { GameState, GameStatus, CampaignState } from '../game';
import { StorageAdapter, LocalStorageAdapter, InMemoryAdapter } from './adapters';

export interface StoredSettings {
  version: 1;
  selectedRedraw: number | null;
}

export interface StoredGameState {
  version: 1;
  savedAt: number;
  state: GameState;
}

export interface StoredCampaignState {
  version: 1;
  savedAt: number;
  campaign: CampaignState;
}

export interface StoredStats {
  version: 1;
  completeVictories: number;
  partialVictories: number;
  pyramidCollapses: number;
  currentStreak: number;
  bestStreak: number;
}

export interface CampaignStats {
  pyramidsExplored: number;
  pyramidsConquered?: number;
  pyramidsCollapsed: number;
  isVictory: boolean;
  totalAttempts: number;
}

export interface StoredCampaignStats extends CampaignStats {
  version: 1;
}

const SETTINGS_KEY = 'cursed_tomb_settings';
const GAME_STATE_KEY = 'cursed_tomb_game_state';
const CAMPAIGN_STATE_KEY = 'cursed_tomb_active_campaign_state';
const STATS_KEY = 'cursed_tomb_stats';
const CAMPAIGN_STATS_KEY = 'cursed_tomb_campaign_stats';

export const DEFAULT_SETTINGS: StoredSettings = {
  version: 1,
  selectedRedraw: 1,
};

export const DEFAULT_STATS: StoredStats = {
  version: 1,
  completeVictories: 0,
  partialVictories: 0,
  pyramidCollapses: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export const DEFAULT_CAMPAIGN_STATS: StoredCampaignStats = {
  version: 1,
  pyramidsExplored: 0,
  pyramidsConquered: 0,
  pyramidsCollapsed: 0,
  isVictory: false,
  totalAttempts: 0,
};

export class PersistenceManager {
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    if (adapter) {
      this.adapter = adapter;
    } else {
      const localAdapter = new LocalStorageAdapter();
      this.adapter = localAdapter.isAvailable() ? localAdapter : new InMemoryAdapter();
    }
  }

  getSettings(): StoredSettings {
    try {
      const raw = this.adapter.getItem(SETTINGS_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw);
      if (this.isValidSettings(parsed)) {
        return parsed;
      }
    } catch {
      // Return defaults on error
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(redraw: number | null): void {
    const payload: StoredSettings = {
      version: 1,
      selectedRedraw: redraw,
    };
    try {
      this.adapter.setItem(SETTINGS_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }
  }

  getGameState(): GameState | null {
    try {
      const raw = this.adapter.getItem(GAME_STATE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (this.isValidGameStateWrapper(parsed)) {
        // Handle legacy status normalization
        const state = { ...parsed.state };
        if ((state.status as any) === 'won') {
          state.status = 'partial-victory';
        } else if ((state.status as any) === 'lost') {
          state.status = 'pyramid-collapse';
        }
        delete (state as any).winCondition;
        return this.sanitizeLoadedGameState(state);
      }
    } catch {
      // Fall through on error
    }
    return null;
  }

  saveGameState(state: GameState): void {
    const payload: StoredGameState = {
      version: 1,
      savedAt: Date.now(),
      state,
    };
    try {
      this.adapter.setItem(GAME_STATE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }
  }

  clearGameState(): void {
    try {
      this.adapter.removeItem(GAME_STATE_KEY);
    } catch {
      // Ignore
    }
  }

  getCampaignState(): CampaignState | null {
    try {
      const raw = this.adapter.getItem(CAMPAIGN_STATE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && parsed.campaign) {
        const campaign = parsed.campaign;
        return {
          ...campaign,
          masterDeck: Array.isArray(campaign.masterDeck)
            ? campaign.masterDeck.map((c: any) => ({ ...c, removed: false, faceDown: false, selected: false, anchorAbsorption: c.anchorAbsorption ?? 0 }))
            : [],
          currentRound: this.sanitizeLoadedGameState(campaign.currentRound),
          achievements: campaign.achievements ?? {
            roundsSurvived: (campaign.roundNumber ?? 1) - 1,
            pyramidsCleared: 0,
            perfectWins: 0,
            rankAnchorUnlocked: false,
            unlockedBadges: [],
          },
        };
      }
    } catch {
      // Ignore
    }
    return null;
  }

  private sanitizeLoadedGameState(state: GameState): GameState {
    if (!state) return state;
    return {
      ...state,
      drawPile: Array.isArray(state.drawPile) ? state.drawPile.map((c) => ({ ...c, removed: false })) : [],
      discardPile: Array.isArray(state.discardPile) ? state.discardPile.map((c) => ({ ...c, removed: false })) : [],
      vaultCards: Array.isArray((state as any).vaultCards)
        ? (state as any).vaultCards.map((c: any) => ({ ...c, removed: false }))
        : (state as any).vaultCard
          ? [{ ...(state as any).vaultCard, removed: false }]
          : [],
    };
  }

  saveCampaignState(campaign: CampaignState): void {
    const payload: StoredCampaignState = {
      version: 1,
      savedAt: Date.now(),
      campaign,
    };
    try {
      this.adapter.setItem(CAMPAIGN_STATE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }
  }

  clearCampaignState(): void {
    try {
      this.adapter.removeItem(CAMPAIGN_STATE_KEY);
    } catch {
      // Ignore
    }
  }

  getStats(): StoredStats {
    try {
      const raw = this.adapter.getItem(STATS_KEY);
      if (!raw) return DEFAULT_STATS;
      const parsed = JSON.parse(raw);
      
      // Migrate legacy stats structure if needed
      if (parsed && typeof parsed === 'object' && typeof parsed.wins === 'number') {
        const migrated: StoredStats = {
          version: 1,
          completeVictories: 0,
          partialVictories: parsed.wins ?? 0,
          pyramidCollapses: parsed.losses ?? 0,
          currentStreak: parsed.currentStreak ?? 0,
          bestStreak: parsed.bestStreak ?? 0,
        };
        this.saveStats(migrated);
        return migrated;
      }

      if (this.isValidStats(parsed)) {
        return parsed;
      }
    } catch {
      // Return defaults on error
    }
    return DEFAULT_STATS;
  }

  saveStats(stats: StoredStats): void {
    try {
      this.adapter.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }

  getCampaignStats(): StoredCampaignStats {
    try {
      const raw = this.adapter.getItem(CAMPAIGN_STATS_KEY);
      if (!raw) return DEFAULT_CAMPAIGN_STATS;
      const parsed = JSON.parse(raw);
      if (this.isValidCampaignStats(parsed)) {
        return parsed;
      }
    } catch {
      // Return defaults on error
    }
    return DEFAULT_CAMPAIGN_STATS;
  }

  saveCampaignStats(stats: StoredCampaignStats): void {
    try {
      this.adapter.setItem(CAMPAIGN_STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }

  resetCampaignStats(): StoredCampaignStats {
    try {
      this.adapter.removeItem(CAMPAIGN_STATS_KEY);
    } catch {
      // Ignore
    }
    return DEFAULT_CAMPAIGN_STATS;
  }

  recordOutcome(status: 'complete-victory' | 'partial-victory' | 'pyramid-collapse'): { stats: StoredStats; campaign: StoredCampaignStats } {
    const currentStats = this.getStats();
    const currentCampaign = this.getCampaignStats();

    let updatedStats: StoredStats;
    let updatedCampaign: StoredCampaignStats;

    if (status === 'complete-victory') {
      const newStreak = currentStats.currentStreak + 1;
      updatedStats = {
        ...currentStats,
        completeVictories: currentStats.completeVictories + 1,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, currentStats.bestStreak),
      };
      updatedCampaign = {
        ...currentCampaign,
        pyramidsExplored: currentCampaign.pyramidsExplored + 1,
        pyramidsConquered: (currentCampaign.pyramidsConquered ?? 0) + 1,
        totalAttempts: currentCampaign.totalAttempts + 1,
      };
    } else if (status === 'partial-victory') {
      const newStreak = currentStats.currentStreak + 1;
      updatedStats = {
        ...currentStats,
        partialVictories: currentStats.partialVictories + 1,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, currentStats.bestStreak),
      };
      updatedCampaign = {
        ...currentCampaign,
        pyramidsExplored: currentCampaign.pyramidsExplored + 1,
        totalAttempts: currentCampaign.totalAttempts + 1,
      };
    } else {
      updatedStats = {
        ...currentStats,
        pyramidCollapses: currentStats.pyramidCollapses + 1,
        currentStreak: 0,
      };
      updatedCampaign = {
        ...currentCampaign,
        pyramidsCollapsed: currentCampaign.pyramidsCollapsed + 1,
        totalAttempts: currentCampaign.totalAttempts + 1,
      };
    }

    this.saveStats(updatedStats);
    this.saveCampaignStats(updatedCampaign);
    return { stats: updatedStats, campaign: updatedCampaign };
  }

  resetStats(): StoredStats {
    try {
      this.adapter.removeItem(STATS_KEY);
    } catch {
      // Ignore
    }
    return DEFAULT_STATS;
  }

  private isValidSettings(obj: any): obj is StoredSettings {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.version !== 1) return false;
    if (obj.selectedRedraw !== null && typeof obj.selectedRedraw !== 'number') {
      return false;
    }
    return true;
  }

  private isValidGameStateWrapper(obj: any): obj is StoredGameState {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.version !== 1) return false;
    if (!obj.state || typeof obj.state !== 'object') return false;
    return this.isValidGameState(obj.state);
  }

  private isValidGameState(state: any): state is GameState {
    if (!Array.isArray(state.deck)) return false;
    if (!Array.isArray(state.pyramid)) return false;
    if (!Array.isArray(state.drawPile)) return false;
    if (!Array.isArray(state.discardPile)) return false;
    if (!Array.isArray(state.vaultCards) && !state.vaultCard) return false;
    const validStatuses = ['ready', 'in-progress', 'complete-victory', 'partial-victory', 'pyramid-collapse', 'won', 'lost'];
    if (!validStatuses.includes(state.status)) return false;
    return true;
  }

  private isValidStats(obj: any): obj is StoredStats {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.version !== 1) return false;
    if (typeof obj.completeVictories !== 'number' || obj.completeVictories < 0) return false;
    if (typeof obj.partialVictories !== 'number' || obj.partialVictories < 0) return false;
    if (typeof obj.pyramidCollapses !== 'number' || obj.pyramidCollapses < 0) return false;
    if (typeof obj.currentStreak !== 'number' || obj.currentStreak < 0) return false;
    if (typeof obj.bestStreak !== 'number' || obj.bestStreak < 0) return false;
    return true;
  }

  private isValidCampaignStats(obj: any): obj is StoredCampaignStats {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.version !== 1) return false;
    if (typeof obj.pyramidsExplored !== 'number' || obj.pyramidsExplored < 0) return false;
    if (typeof obj.pyramidsCollapsed !== 'number' || obj.pyramidCollapses < 0 && obj.pyramidsCollapsed < 0) return false;
    if (typeof obj.isVictory !== 'boolean') return false;
    if (typeof obj.totalAttempts !== 'number' || obj.totalAttempts < 0) return false;
    return true;
  }
}

export const defaultPersistenceManager = new PersistenceManager();

