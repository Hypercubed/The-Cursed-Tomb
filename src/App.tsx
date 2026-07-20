import { useMemo, useState } from 'react';
import {
  cyclePile,
  drawCard,
  getCardById,
  isBlocked,
  playCard,
  resignGame,
  startGame,
  WinCondition,
  GameState,
  Card,
} from './game';
import { GameShell } from './components/GameShell';
import { GameSidebar } from './components/GameSidebar';
import { PyramidBoard } from './components/PyramidBoard';
import { DrawZone } from './components/DrawZone';

const rankLabel = (rank: number) => {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
};

const formatCard = (card: Card) => `${rankLabel(card.rank)}${card.suit}`;

const initialState: GameState = {
  deck: [],
  pyramid: [],
  drawPile: [],
  discardPile: [],
  selectedCardId: null,
  redrawsRemaining: null,
  winCondition: 'pyramid-only',
  status: 'ready',
};

function App() {
  const [game, setGame] = useState<GameState>(initialState);
  const [selectedRedraw, setSelectedRedraw] = useState<null | number>(1);
  const [selectedWinCondition, setSelectedWinCondition] = useState<WinCondition>('pyramid-only');

  const topDiscard = game.discardPile[0] ?? null;
  const selectedCard = game.selectedCardId ? getCardById(game.selectedCardId, game) : null;

  const handleStart = () => {
    setGame(startGame(selectedWinCondition, selectedRedraw));
  };

  const handleCardClick = (cardId: string) => {
    setGame((state) => playCard(state, cardId));
  };

  const handleDraw = () => {
    setGame((state) => {
      const next = state.drawPile.length > 0 ? drawCard(state) : cyclePile(state);
      return { ...next, selectedCardId: null };
    });
  };

  const handleRestart = () => {
    setGame(initialState);
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
    if (game.status === 'won') return 'You won!';
    return 'You lost';
  }, [game.status]);

  const sidebar = (
    <GameSidebar
      selectedRedraw={selectedRedraw}
      selectedWinCondition={selectedWinCondition}
      gameStatus={game.status}
      onRedrawChange={setSelectedRedraw}
      onWinConditionChange={setSelectedWinCondition}
      onStart={handleStart}
      onRestart={handleRestart}
      onResign={handleResign}
      statusLabel={statusLabel}
      redrawsRemaining={game.redrawsRemaining}
      drawPileCount={game.drawPile.length}
      topDiscardLabel={topDiscard ? formatCard(topDiscard) : 'None'}
      selectedCardLabel={selectedCard ? formatCard(selectedCard) : 'None'}
    />
  );

  return (
    <GameShell sidebar={sidebar}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-game-text">The Cursed Tomb</h1>
      </div>

      {/* Board: only shown when game is active */}
      {game.status !== 'ready' && (
        <div className="bg-game-panel border border-game-border rounded-2xl p-5">
          {/* Pyramid — the hero */}
          <PyramidBoard
            pyramid={game.pyramid}
            selectedCardId={game.selectedCardId}
            status={game.status}
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
              onDraw={handleDraw}
              onCardClick={handleCardClick}
            />
          </div>
        </div>
      )}

      {/* Pre-game prompt */}
      {game.status === 'ready' && (
        <div className="bg-game-panel border border-game-border rounded-2xl p-8 text-center text-game-muted">
          Configure the game in the sidebar and press <strong className="text-game-text">Start game</strong> to begin.
        </div>
      )}
    </GameShell>
  );
}

export default App;
