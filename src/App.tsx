import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  canRemovePair,
  cyclePile,
  drawCard,
  getCardById,
  getRemainingPairStats,
  getRemovedCardIds,
  getRemovedCardsCount,
  playCard,
  resignGame,
  startGame,
  GameState,
} from './game';
import { useAutoplay } from './hooks/useAutoplay';
import { forceWin, forceLoss } from './solver';
import { GameShell } from './components/GameShell';
import { GameSidebar } from './components/GameSidebar';
import { DebugPanel } from './components/DebugPanel';
import { PyramidBoard } from './components/PyramidBoard';
import { DrawZone } from './components/DrawZone';
import { MatchedCardsModal } from './components/MatchedCardsModal';
import { ResetConfirmationModal } from './components/ResetConfirmationModal';
import { defaultPersistenceManager, StoredStats, StoredCampaignStats } from './storage/persistence';

const initialState: GameState = {
  deck: [],
  pyramid: [],
  drawPile: [],
  discardPile: [],
  selectedCardId: null,
  redrawsRemaining: null,
  status: 'ready',
};

function App() {
  const [game, setGame] = useState<GameState>(() => {
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

  const [animatingMatchIds, setAnimatingMatchIds] = useState<string[]>([]);
  const [animatingErrorIds, setAnimatingErrorIds] = useState<string[]>([]);

  const [isMatchedCardsModalOpen, setIsMatchedCardsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleStart = useCallback(() => {
    setGame((currentState) => {
      if (currentState.status === 'in-progress' && !hasRecordedOutcome) {
        const { stats: updated, campaign: updatedCampaign } = defaultPersistenceManager.recordOutcome('pyramid-collapse');
        setStats(updated);
        setCampaignStats(updatedCampaign);
      }
      return startGame(selectedRedraw);
    });
    setHasRecordedOutcome(false);
  }, [hasRecordedOutcome, selectedRedraw]);

  const {
    isPlaying,
    isThinking,
    strategy,
    speedMs,
    moveCount,
    togglePlay,
    stepOne,
    resetCount,
    setSpeedMs,
    setStrategy,
  } = useAutoplay(game, setGame, handleStart);


  // Sync settings when modified
  useEffect(() => {
    defaultPersistenceManager.saveSettings(selectedRedraw);
  }, [selectedRedraw]);

  // Sync game state when modified
  useEffect(() => {
    if (game.status === 'ready') {
      defaultPersistenceManager.clearGameState();
    } else {
      defaultPersistenceManager.saveGameState(game);
    }
  }, [game]);

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
    }
  }, [game.status, hasRecordedOutcome]);

  const topDiscard = game.discardPile[0] ?? null;

  const removedCardsSet = useMemo(() => getRemovedCardIds(game), [game]);
  const removedCardsCount = useMemo(() => getRemovedCardsCount(game), [game]);
  const pairStats = useMemo(() => getRemainingPairStats(game), [game]);

  const handleForceWin = () => {
    setGame((state) => forceWin(state));
  };

  const handleForceLoss = () => {
    setGame((state) => forceLoss(state));
  };

  const handleCardClick = (cardId: string) => {
    if (game.status !== 'in-progress') return;
    if (animatingMatchIds.length > 0) return;

    const targetCard = getCardById(cardId, game);
    if (!targetCard) return;

    // Single King match
    if (targetCard.rank === 13) {
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
      if (selectedCard && canRemovePair(targetCard, selectedCard)) {
        // Valid pair match dissolve animation
        const matchIds = [selectedCard.id, targetCard.id];
        setAnimatingMatchIds(matchIds);
        setTimeout(() => {
          setGame((state) => playCard(state, cardId));
          setAnimatingMatchIds([]);
        }, 220);
        return;
      } else {
        // Invalid pair error shake animation
        const errorIds = [game.selectedCardId, cardId];
        setAnimatingErrorIds(errorIds);
        setTimeout(() => {
          setGame((state) => ({ ...state, selectedCardId: null }));
          setAnimatingErrorIds([]);
        }, 300);
        return;
      }
    }

    // Toggle selection
    setGame((state) => playCard(state, cardId));
  };

  const handleDraw = () => {
    setGame((state) => {
      const next = state.drawPile.length > 0 ? drawCard(state) : cyclePile(state);
      return { ...next, selectedCardId: null };
    });
  };

  const handleRestart = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    defaultPersistenceManager.clearGameState();
    const clearedStats = defaultPersistenceManager.resetStats();
    const clearedCampaign = defaultPersistenceManager.resetCampaignStats();
    setStats(clearedStats);
    setCampaignStats(clearedCampaign);
    setHasRecordedOutcome(true);
    resetCount();
    setGame(initialState);
    setIsResetModalOpen(false);
  };

  const handleCancelReset = () => {
    setIsResetModalOpen(false);
  };

  const handleResign = () => {
    setGame((state) => resignGame(state));
  };

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
      gameStatus={game.status}
      onRedrawChange={setSelectedRedraw}
      onStart={handleStart}
      onRestart={handleRestart}
      onResign={handleResign}
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
            Ancient Egyptian Pyramid Solitaire
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-[#18130e] border border-[#2d2319] rounded-lg text-xs sm:text-sm font-medium text-game-muted flex items-center gap-2">
          <span>Status:</span>
          <span className="text-game-text font-semibold">{statusLabel}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
        onTogglePlay={togglePlay}
        onSpeedChange={setSpeedMs}
        onStrategyChange={setStrategy}
      />
      <GameShell header={header} sidebar={sidebar} gameStatus={game.status}>
        {/* Board: only shown when game is active */}
        {game.status !== 'ready' && (
          <div className="bg-game-panel border border-game-border rounded-2xl p-3 sm:p-5 lg:p-6 overflow-hidden">
            {/* Pyramid — the hero */}
            <PyramidBoard
              pyramid={game.pyramid}
              selectedCardId={game.selectedCardId}
              status={game.status}
              animatingMatchIds={animatingMatchIds}
              animatingErrorIds={animatingErrorIds}
              onCardClick={handleCardClick}
            />

            {/* Draw zone — separate container below the pyramid */}
            <div className="border-t border-game-border mt-2">
              <DrawZone
                drawPileCount={game.drawPile.length}
                topDiscard={topDiscard}
                selectedCardId={game.selectedCardId}
                redrawsRemaining={game.redrawsRemaining}
                canDraw={canDraw}
                canCycle={canCycle}
                gameActive={game.status === 'in-progress'}
                animatingMatchIds={animatingMatchIds}
                animatingErrorIds={animatingErrorIds}
                onDraw={handleDraw}
                onCardClick={handleCardClick}
              />
            </div>
          </div>
        )}

        {/* Pre-game prompt */}
        {game.status === 'ready' && (
          <div className="bg-game-panel border border-game-border rounded-2xl p-8 text-center text-game-muted">
            Configure the game in the sidebar and press <strong className="text-game-text">Explore Pyramid</strong> to begin.
          </div>
        )}
      </GameShell>

      <MatchedCardsModal
        isOpen={isMatchedCardsModalOpen}
        onClose={() => setIsMatchedCardsModalOpen(false)}
        removedCardIds={removedCardsSet}
        pairStats={pairStats}
      />

      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </>
  );
}

export default App;
