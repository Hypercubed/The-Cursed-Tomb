import { useMemo, useState } from 'react';
import {
  getCardById,
  initializeGame,
  isBlocked,
  playCard,
  redraw,
  startGame,
  visibleCards,
  WinCondition,
  GameState,
  Card,
} from './game';

const redrawOptions = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: 'Infinite', value: null },
] as const;

const winConditions: Array<{ label: string; value: WinCondition }> = [
  { label: 'Pyramid-only', value: 'pyramid-only' },
  { label: 'Complete victory', value: 'complete-victory' },
];

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

  const handleRedraw = () => {
    setGame((state) => {
      const next = redraw(state);
      return {
        ...next,
        selectedCardId: null,
      };
    });
  };

  const canCycleDrawPile = game.drawPile.length === 0 && game.discardPile.length > 0 && (game.redrawsRemaining === null || game.redrawsRemaining > 0);
  const drawButtonLabel = game.drawPile.length > 0 ? 'Draw next card' : canCycleDrawPile ? 'Cycle discard back to draw pile' : 'Empty';

  const handleRestart = () => {
    setGame(initialState);
  };

  const statusLabel = useMemo(() => {
    if (game.status === 'ready') return 'Ready to start';
    if (game.status === 'in-progress') return 'In progress';
    if (game.status === 'won') return 'You won!';
    return 'You lost';
  }, [game.status]);

  const renderCard = (card: Card) => {
    const isSelected = card.id === game.selectedCardId;
    const blocked = card.removed || isBlocked(card.id, game.pyramid);
    const isVisible = !card.removed && !blocked;

    return (
      <button
        type="button"
        key={card.id}
        className={`card${card.removed ? ' removed' : ''}${isSelected ? ' selected' : ''}${blocked ? ' blocked' : ''}`}
        disabled={!isVisible || game.status !== 'in-progress'}
        onClick={() => handleCardClick(card.id)}
      >
        <div>{formatCard(card)}</div>
      </button>
    );
  };

  const gameSummary = (
    <div className="panel">
      <h2>Game Status</h2>
      <div className="summary">
        <div>Status: {statusLabel}</div>
        <div>Redraws remaining: {game.redrawsRemaining === null ? '∞' : game.redrawsRemaining}</div>
        <div>Draw pile: {game.drawPile.length}</div>
        <div>Discard top: {topDiscard ? formatCard(topDiscard) : 'None'}</div>
        <div>Selected card: {selectedCard ? formatCard(selectedCard) : 'None'}</div>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <div className="logo">
        <h1>Pyramid Solitaire</h1>
      </div>

      <div className="panel">
        <h2>Game Setup</h2>
        <div className="controls">
          <label>
            Redraw cycles
            <select value={selectedRedraw === null ? 'infinite' : String(selectedRedraw)} onChange={(event) => setSelectedRedraw(event.target.value === 'infinite' ? null : Number(event.target.value))}>
              {redrawOptions.map((option) => (
                <option key={option.label} value={option.value === null ? 'infinite' : String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Win condition
            <select value={selectedWinCondition} onChange={(event) => setSelectedWinCondition(event.target.value as WinCondition)}>
              {winConditions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button type="button" onClick={handleStart} disabled={game.status === 'in-progress'}>
            Start game
          </button>
          <button type="button" onClick={handleRestart}>
            Reset
          </button>
        </div>
      </div>

      {game.status !== 'ready' && (
        <div className="panel">
          <div className="status-row">
            <div className="game-info">
              <h2>Board</h2>
              <div className="small-text">Click a visible pyramid card to select or remove it. Use Draw next card to reveal the next discard card.</div>
            </div>
          </div>
          <div className="board">
            {game.pyramid.map((row, rowIndex) => (
              <div className="row" key={`row-${rowIndex}`} style={{ justifyContent: 'center' }}>
                {row.map((card) => renderCard(card))}
              </div>
            ))}
          </div>

          <div className="draw-pile" style={{ marginTop: '1rem' }}>
            <div className="draw-card" style={{ display: 'grid', gap: '0.5rem' }}>
              <div>Draw pile</div>
              <button type="button" onClick={handleRedraw} disabled={(game.drawPile.length === 0 && !canCycleDrawPile) || game.status !== 'in-progress'} className="card">
                {drawButtonLabel}
              </button>
              <div className="small-text">Cycles remaining: {game.redrawsRemaining === null ? '∞' : game.redrawsRemaining}</div>
            </div>
            <div className="draw-card" style={{ display: 'grid', gap: '0.5rem' }}>
              <div>Discard top</div>
              {topDiscard ? (
                <button
                  type="button"
                  className={`card${topDiscard.id === game.selectedCardId ? ' selected' : ''}`}
                  onClick={() => handleCardClick(topDiscard.id)}
                  disabled={game.status !== 'in-progress'}
                  style={{ width: '100%' }}
                >
                  {formatCard(topDiscard)}
                </button>
              ) : (
                <div>None</div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameSummary}
    </div>
  );
}

export default App;
