import { useMemo, useState, useEffect, useCallback } from 'react';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import {
  canRemovePair,
  canRemoveSingle,
  cyclePile,
  discardStockCard,
  drawCard,
  getCardById,
  getCardLocation,
  getFunctionalValue,
  isBlocked,
  getRemainingPairStats,
  getRemovedCardIds,
  getRemovedCardsCount,
  playCard,
  resignGame,
  startGame,
  initializeGame,
  createCampaign,
  advanceCampaignRound,
  applyEndOfWeekLifecycle,
  computeRoundLifecycleEffects,
  moveWasteToVault,
  movePyramidToVault,
  deselectCard,
  GameState,
  GameMode,
  CampaignState,
  RoundLifecycleEffects,
} from './game';
import { useAutoplay } from './hooks/useAutoplay';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { forceWin, forceLoss } from './solver';
import { GameShell } from './components/GameShell';
import { GameSidebar } from './components/GameSidebar';
import { DebugPanel } from './components/DebugPanel';
import { PyramidBoard } from './components/PyramidBoard';
import { DrawZone } from './components/DrawZone';
import { MatchedCardsModal } from './components/MatchedCardsModal';
import { CampaignEndModal } from './components/CampaignEndModal';
import { CampaignSetupModal } from './components/CampaignSetupModal';
import { RulesModal, RulesTab } from './components/RulesModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { defaultPersistenceManager, StoredStats, StoredCampaignStats } from './storage/persistence';

const initialState: GameState = {
  deck: [],
  pyramid: [],
  drawPile: [],
  discardPile: [],
  selectedCardId: null,
  redrawsRemaining: null,
  status: 'ready',
  mode: 'standard',
};

function App() {
  const [campaign, setCampaign] = useState<CampaignState | null>(() => {
    return defaultPersistenceManager.getCampaignState();
  });

  const [game, setGame] = useState<GameState>(() => {
    const activeCampaign = defaultPersistenceManager.getCampaignState();
    if (activeCampaign) return activeCampaign.currentRound;
    return defaultPersistenceManager.getGameState() ?? initialState;
  });

  const [stats, setStats] = useState<StoredStats>(() => {
    return defaultPersistenceManager.getStats();
  });

  const [campaignStats, setCampaignStats] = useState<StoredCampaignStats>(() => {
    return defaultPersistenceManager.getCampaignStats();
  });

  const [hasRecordedOutcome, setHasRecordedOutcome] = useState(() => {
    return game.status !== 'in-progress';
  });

  const [selectedRedraw, setSelectedRedraw] = useState<null | number>(() => {
    return defaultPersistenceManager.getSettings().selectedRedraw;
  });

  const [selectedMode, setSelectedMode] = useState<GameMode>('cursed-tomb');
  const [volatileCollapse, setVolatileCollapse] = useState<boolean>(false);

  const [animatingMatchIds, setAnimatingMatchIds] = useState<string[]>([]);
  const [animatingErrorIds, setAnimatingErrorIds] = useState<string[]>([]);

  const [isMatchedCardsModalOpen, setIsMatchedCardsModalOpen] = useState(false);
  const [isCampaignSetupModalOpen, setIsCampaignSetupModalOpen] = useState(() => game.status === 'ready');
  const [isRoundSummaryModalOpen, setIsRoundSummaryModalOpen] = useState(false);
  const [isCampaignEndModalOpen, setIsCampaignEndModalOpen] = useState(false);
  const [campaignEndMode, setCampaignEndMode] = useState<'defeat' | 'victory'>('defeat');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [rulesTab, setRulesTab] = useState<RulesTab>('core-rules');
  const [roundEffects, setRoundEffects] = useState<RoundLifecycleEffects | null>(null);

  const handleStart = useCallback(() => {
    if (game.status === 'in-progress' && !hasRecordedOutcome) {
      const { stats: updated, campaign: updatedCampaign } = defaultPersistenceManager.recordOutcome('pyramid-collapse');
      setStats(updated);
      setCampaignStats(updatedCampaign);
    }

    if (campaign && campaign.status === 'active') {
      const nextCampaign = advanceCampaignRound(campaign);
      setCampaign(nextCampaign);
      setGame(nextCampaign.currentRound);
      defaultPersistenceManager.saveCampaignState(nextCampaign);
      if (nextCampaign.status === 'defeat') {
        setIsRoundSummaryModalOpen(false);
        setCampaignEndMode('defeat');
        setIsCampaignEndModalOpen(true);
      }
    } else {
      setGame(startGame(selectedRedraw, selectedMode));
    }

    setHasRecordedOutcome(false);
    setRoundEffects(null);
    setIsRoundSummaryModalOpen(false);
    if (!campaign || campaign.status !== 'defeat') {
      setIsCampaignEndModalOpen(false);
    }
  }, [campaign, game.status, hasRecordedOutcome, selectedRedraw, selectedMode]);

  const handleStartCampaign = useCallback(
    (difficulty: number | null, mode: GameMode = 'cursed-tomb', volatile: boolean = false) => {
      setSelectedRedraw(difficulty);
      setSelectedMode(mode);
      setVolatileCollapse(volatile);
      defaultPersistenceManager.saveSettings(difficulty);

      if (mode === 'cursed-tomb') {
        const newCampaign = createCampaign(mode, difficulty, volatile);
        setCampaign(newCampaign);
        setGame(newCampaign.currentRound);
        defaultPersistenceManager.saveCampaignState(newCampaign);
      } else {
        setCampaign(null);
        defaultPersistenceManager.clearCampaignState();
        setGame(startGame(difficulty, mode));
      }

      setHasRecordedOutcome(false);
      setRoundEffects(null);
      setIsRoundSummaryModalOpen(false);
      setIsCampaignEndModalOpen(false);
      setIsCampaignSetupModalOpen(false);
    },
    []
  );

  const handleNextCampaignRound = useCallback(() => {
    if (!campaign) return;
    const nextCampaign = advanceCampaignRound(campaign);
    setCampaign(nextCampaign);
    setGame(nextCampaign.currentRound);
    defaultPersistenceManager.saveCampaignState(nextCampaign);
    setHasRecordedOutcome(false);
    setRoundEffects(null);
    setIsRoundSummaryModalOpen(false);
  }, [campaign]);

  const {
    isPlaying,
    isThinking,
    strategy,
    speedMs,
    moveCount,
    togglePlay,
    stepOne,
    stepToConclusion,
    stop: stopAutoplay,
    setSpeedMs,
    setStrategy,
  } = useAutoplay(game, setGame, handleStart);

  const handleRetireCampaign = useCallback(() => {
    if (!campaign) return;
    const retiredCampaign: CampaignState = {
      ...campaign,
      status: 'defeat',
      defeatReason: 'starvation',
    };
    setCampaign(retiredCampaign);
    defaultPersistenceManager.saveCampaignState(retiredCampaign);
    stopAutoplay();
    setIsRoundSummaryModalOpen(false);
    setCampaignEndMode('defeat');
    setIsCampaignEndModalOpen(true);
  }, [campaign, stopAutoplay]);

  // Sync settings when modified
  useEffect(() => {
    defaultPersistenceManager.saveSettings(selectedRedraw);
  }, [selectedRedraw]);

  // Sync game and campaign state when modified
  useEffect(() => {
    if (game.status === 'ready') {
      defaultPersistenceManager.clearGameState();
    } else {
      defaultPersistenceManager.saveGameState(game);
    }

    if (campaign) {
      const updatedCampaign = { ...campaign, currentRound: game };
      defaultPersistenceManager.saveCampaignState(updatedCampaign);
    }
  }, [game, campaign]);

  // Record outcome statistics when game status changes to an end state
  useEffect(() => {
    if (hasRecordedOutcome) return;

    if (
      game.status === 'complete-victory' ||
      game.status === 'partial-victory' ||
      game.status === 'pyramid-collapse'
    ) {
      const { stats: updated, campaign: updatedCampaign } = defaultPersistenceManager.recordOutcome(game.status);
      setStats(updated);
      setCampaignStats(updatedCampaign);
      setHasRecordedOutcome(true);

      if (campaign && game.mode === 'cursed-tomb') {
        const activeCampaign = { ...campaign, currentRound: game };
        const nextCampaignState = applyEndOfWeekLifecycle(activeCampaign);
        const effects = computeRoundLifecycleEffects(campaign.masterDeck, nextCampaignState.masterDeck, game, game.mode);
        setCampaign(nextCampaignState);
        setRoundEffects(effects);

        if (nextCampaignState.status === 'defeat') {
          stopAutoplay();
          setCampaignEndMode('defeat');
          setIsCampaignEndModalOpen(true);
        } else {
          setIsRoundSummaryModalOpen(true);
        }
      }
    }
  }, [game.status, hasRecordedOutcome, campaign, game, stopAutoplay]);

  const topDiscard = game.discardPile[0] ?? null;
  const topStock = game.drawPile[0] ?? null;

  const removedCardsSet = useMemo(() => getRemovedCardIds(game), [game]);
  const removedCardsCount = useMemo(() => getRemovedCardsCount(game), [game]);
  const pairStats = useMemo(() => getRemainingPairStats(game, game.mode, campaign?.masterDeck), [game, campaign?.masterDeck]);

  const handleForceWin = () => {
    setGame((state) => forceWin(state));
  };

  const handleForceLoss = () => {
    setGame((state) => forceLoss(state));
  };

  const handleCardClick = (cardId: string) => {
    console.log('[TOMB DEBUG] handleCardClick triggered for:', cardId, {
      status: game.status,
      selectedCardId: game.selectedCardId,
      interactionMode: game.interactionMode,
      animatingMatchIds,
      animatingErrorIds,
    });

    if (game.status !== 'in-progress') {
      console.log('[TOMB DEBUG] handleCardClick ignored: game status is not in-progress:', game.status);
      return;
    }
    if (animatingMatchIds.length > 0) {
      console.log('[TOMB DEBUG] handleCardClick ignored: match animation in progress:', animatingMatchIds);
      return;
    }

    // Handle Spades/Hearts targeting actions
    if (game.interactionMode && game.interactionMode !== 'normal') {
      setGame((state) => playCard(state, cardId));
      return;
    }

    const targetCard = getCardById(cardId, game);
    if (!targetCard) return;

    // Single King match / Functional Value 13
    if (canRemoveSingle(targetCard, game.mode)) {
      setAnimatingMatchIds([cardId]);
      setTimeout(() => {
        setGame((state) => playCard(state, cardId));
        setAnimatingMatchIds([]);
      }, 220);
      return;
    }

    // If another card is currently selected
    if (game.selectedCardId && game.selectedCardId !== cardId) {
      const selectedCard = getCardById(game.selectedCardId, game);
      const canPair = selectedCard ? canRemovePair(targetCard, selectedCard, game.mode) : false;

      if (selectedCard && canPair) {
        const matchIds = [selectedCard.id, targetCard.id];
        setAnimatingMatchIds(matchIds);
        setTimeout(() => {
          setGame((state) => playCard(state, cardId));
          setAnimatingMatchIds([]);
        }, 220);
        return;
      } else {
        const errorIds = [game.selectedCardId, cardId];
        setAnimatingErrorIds(errorIds);
        setTimeout(() => {
          setGame((state) => ({ ...state, selectedCardId: null }));
          setAnimatingErrorIds([]);
        }, 300);
        return;
      }
    }

    setGame((state) => playCard(state, cardId));
  };

  const handleDraw = () => {
    setGame((state) => {
      const next = state.drawPile.length > 0 ? discardStockCard(state) : cyclePile(state);
      return { ...next, selectedCardId: null };
    });
  };

  const selectedCardForVault = useMemo(() => {
    if (!game.selectedCardId || game.vaultCard) return null;
    const card = getCardById(game.selectedCardId, game);
    if (!card || !card.blessed || card.suit !== '♦') return null;
    const location = getCardLocation(card.id, game);
    const isUnblockedPyramid = location.zone === 'pyramid' && !isBlocked(card.id, game.pyramid);
    const isTopDiscard = location.zone === 'discard' && topDiscard?.id === card.id;
    return (isUnblockedPyramid || isTopDiscard) ? card : null;
  }, [game, topDiscard]);

  const isVaultTargetActive = Boolean(selectedCardForVault);

  const handleVaultSlotClick = () => {
    if (game.status !== 'in-progress') return;
    if (game.vaultCard) return;
    if (!game.selectedCardId) return;

    if (selectedCardForVault) {
      const location = getCardLocation(selectedCardForVault.id, game);
      setGame((state) => {
        const nextState = location.zone === 'discard'
          ? moveWasteToVault(state)
          : movePyramidToVault(state, selectedCardForVault.id);
        return { ...nextState, selectedCardId: null };
      });
    } else {
      const currentSelectedId = game.selectedCardId;
      setAnimatingErrorIds([currentSelectedId]);
      setTimeout(() => {
        setGame((state) => ({ ...state, selectedCardId: null }));
        setAnimatingErrorIds([]);
      }, 300);
    }
  };

  const handleRestart = () => {
    setIsCampaignSetupModalOpen(true);
  };

  const handleResign = () => {
    setGame((state) => resignGame(state));
  };

  useKeyboardShortcuts({
    onDrawOrCycle: handleDraw,
    onDeselect: () => setGame((state) => deselectCard(state)),
    onNewGame: handleRestart,
    onToggleHelp: () => setIsShortcutsModalOpen((prev) => !prev),
    isModalOpen: isCampaignSetupModalOpen || isRoundSummaryModalOpen || isRulesModalOpen || isShortcutsModalOpen || isCampaignEndModalOpen,
  });

  const canDraw = game.drawPile.length > 0;
  const canCycle =
    game.drawPile.length === 0 &&
    game.discardPile.length > 0 &&
    (game.redrawsRemaining === null || game.redrawsRemaining > 0);

  const statusLabel = useMemo(() => {
    if (game.status === 'ready') return 'Ready to start';
    if (game.status === 'in-progress') return 'In progress';
    if (game.status === 'complete-victory') return '🌟 Complete Victory!';
    if (game.status === 'partial-victory') return '📜 Partial Victory!';
    if (game.status === 'pyramid-collapse') return '🏺 Pyramid Collapse';
    return '';
  }, [game.status]);

  const sidebar = (
    <GameSidebar
      selectedRedraw={selectedRedraw}
      gameMode={game.mode}
      onRestart={handleRestart}
      removedCardsCount={removedCardsCount}
      stats={stats}
      campaignStats={campaignStats}
      onOpenMatchedCardsModal={() => setIsMatchedCardsModalOpen(true)}
    />
  );

  const header = (
    <div className="bg-game-panel border border-game-border rounded-2xl p-4 sm:px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl sm:text-3xl text-game-accent">𓋹</span>
        <div>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-game-text tracking-wide">
            The Cursed Tomb
          </h1>
          <p className="text-xs sm:text-sm text-game-muted hidden sm:block">
            {game.mode === 'standard' 
              ? 'Classic Pyramid Solitaire'
              : `Ancient Egyptian Solitaire Campaign ${campaign ? `• Round ${campaign.roundNumber}` : ''}`
            }
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsShortcutsModalOpen(true)}
          className="px-3 py-1.5 bg-[#18130e] border border-amber-900/60 hover:border-amber-600 text-amber-300 rounded-lg text-xs font-semibold hover:bg-[#251d14] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>⌨️</span> Shortcuts
        </button>
        <button
          type="button"
          onClick={() => {
            setRulesTab('core-rules');
            setIsRulesModalOpen(true);
          }}
          className="px-3 py-1.5 bg-[#18130e] border border-amber-900/60 hover:border-amber-600 text-amber-300 rounded-lg text-xs font-semibold hover:bg-[#251d14] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>📖</span> Rules & Guide
        </button>
        {roundEffects && game.status !== 'in-progress' && (
          <button
            type="button"
            onClick={() => setIsRoundSummaryModalOpen(true)}
            className="px-3 py-1.5 bg-[#18130e] border border-amber-800/80 text-amber-300 rounded-lg text-xs font-semibold hover:bg-[#251d14] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>🏺</span> View Round Effects
          </button>
        )}
        {campaign && game.status !== 'in-progress' && (
          <button
            type="button"
            onClick={handleNextCampaignRound}
            className="px-3 py-1.5 bg-amber-950 border border-amber-700 text-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>📜</span> Next Round ({campaign.roundNumber + 1})
          </button>
        )}
        <div className="px-[#0c0906] px-3 py-1.5 bg-[#18130e] border border-[#2d2319] rounded-lg text-xs sm:text-sm font-medium text-game-muted flex items-center gap-2">
          <span>Status:</span>
          <span className="text-game-text font-semibold">{statusLabel}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {import.meta.env.VITE_SHOW_DEBUG === 'true' && (
        <DebugPanel
          game={game}
          isPlaying={isPlaying}
          isThinking={isThinking}
          strategy={strategy}
          speedMs={speedMs}
          moveCount={moveCount}
          onForceWin={handleForceWin}
          onForceLoss={handleForceLoss}
          onStepOne={stepOne}
          onAutoplayRound={stepToConclusion}
          onTogglePlay={togglePlay}
          onSpeedChange={setSpeedMs}
          onStrategyChange={setStrategy}
        />
      )}
      <GameShell header={header} sidebar={sidebar} gameStatus={game.status}>
        {/* Board: only shown when game is active */}
        {game.status !== 'ready' && (
          <div className="relative bg-game-panel border border-game-border rounded-2xl p-3 sm:p-5 lg:p-6 overflow-hidden">
            {game.status === 'in-progress' && (
              <button
                type="button"
                className="absolute top-3 right-3 z-10 appearance-none bg-transparent border border-red-900/50 hover:border-game-red hover:text-game-red text-red-400 rounded-lg text-xs cursor-pointer font-[inherit] px-3 py-1.5 transition-[border-color,color] duration-[120ms]"
                onClick={handleResign}
              >
                Resign
              </button>
            )}
            {/* Pyramid — the hero */}
            <PyramidBoard
              pyramid={game.pyramid}
              selectedCardId={game.selectedCardId}
              status={game.status}
              vaultCard={game.vaultCard}
              interactionMode={game.interactionMode}
              mode={game.mode}
              animatingMatchIds={animatingMatchIds}
              animatingErrorIds={animatingErrorIds}
              onCardClick={handleCardClick}
            />

            {/* Draw zone — separate container below the pyramid */}
            <div className="border-t border-game-border mt-2">
              <DrawZone
                drawPileCount={game.drawPile.length}
                topStock={topStock}
                topDiscard={topDiscard}
                vaultCard={game.vaultCard}
                selectedCardId={game.selectedCardId}
                redrawsRemaining={game.redrawsRemaining}
                canDraw={canDraw}
                canCycle={canCycle}
                gameActive={game.status === 'in-progress'}
                isVaultTargetActive={isVaultTargetActive}
                animatingMatchIds={animatingMatchIds}
                animatingErrorIds={animatingErrorIds}
                mode={game.mode}
                onDraw={handleDraw}
                onCardClick={handleCardClick}
                onVaultSlotClick={handleVaultSlotClick}
              />
            </div>
          </div>
        )}

        {/* Pre-game prompt */}
        {game.status === 'ready' && (
          <div className="bg-game-panel border border-game-border rounded-2xl p-8 text-center text-game-muted flex flex-col items-center gap-3">
            <p className="m-0">
              Select your campaign difficulty and game mode in the setup modal to begin.
            </p>
            <button
              type="button"
              onClick={() => setIsCampaignSetupModalOpen(true)}
              className="appearance-none bg-amber-950/80 border border-amber-800 text-amber-300 rounded-lg text-sm cursor-pointer font-[inherit] px-5 py-2 hover:bg-amber-900 hover:text-amber-100 transition-colors font-medium flex items-center gap-2"
            >
              <span>📜</span> Open Campaign Setup
            </button>
          </div>
        )}
      </GameShell>

      <MatchedCardsModal
        isOpen={isMatchedCardsModalOpen}
        onClose={() => setIsMatchedCardsModalOpen(false)}
        removedCardIds={removedCardsSet}
        pairStats={pairStats}
        masterDeck={campaign?.masterDeck}
        mode={game.mode}
        campaignStats={campaignStats}
        achievements={campaign?.achievements}
      />

      <RoundSummaryModal
        isOpen={isRoundSummaryModalOpen}
        onClose={() => setIsRoundSummaryModalOpen(false)}
        status={game.status}
        mode={game.mode}
        roundNumber={campaign?.roundNumber ?? 1}
        effects={roundEffects}
        campaign={campaign}
        onNextRound={campaign && campaign.status === 'active' ? handleNextCampaignRound : undefined}
        onOpenVault={() => {
          setIsRoundSummaryModalOpen(false);
          setIsMatchedCardsModalOpen(true);
        }}
        onRetireCampaign={campaign && campaign.status === 'active' ? handleRetireCampaign : undefined}
      />

      <CampaignEndModal
        isOpen={isCampaignEndModalOpen}
        mode={campaignEndMode}
        defeatReason={campaign?.defeatReason}
        campaign={campaign}
        campaignStats={campaignStats}
        roundNumber={campaign?.roundNumber ?? 1}
        effects={roundEffects}
        onStartNewCampaign={() => {
          setIsCampaignSetupModalOpen(true);
        }}
        onOpenVault={() => {
          setIsMatchedCardsModalOpen(true);
        }}
      />

      <CampaignSetupModal
        isOpen={isCampaignSetupModalOpen}
        onClose={() => setIsCampaignSetupModalOpen(false)}
        selectedDifficulty={selectedRedraw}
        onSelectDifficulty={setSelectedRedraw}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        volatileCollapse={volatileCollapse}
        onToggleVolatileCollapse={setVolatileCollapse}
        onStartCampaign={handleStartCampaign}
        onOpenFullRules={() => {
          setRulesTab('core-rules');
          setIsRulesModalOpen(true);
        }}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        initialTab={rulesTab}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </>
  );
}

export default App;
