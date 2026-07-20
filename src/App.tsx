import { useMemo, useState } from 'react';
import {
  cyclePile,
  drawCard,
  getCardById,
  initializeGame,
  isBlocked,
  playCard,
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

// 4.3/4.4 Card classes: base + conditional state modifiers
function cardClasses(opts: {
  removed?: boolean;
  selected?: boolean;
  blocked?: boolean;
  red?: boolean;
  fullWidth?: boolean;
}): string {
  return [
    // 4.3 Base card styles
    'w-[72px] min-h-[96px] rounded-xl border p-3 grid place-items-center',
    'font-bold cursor-pointer select-none',
    'bg-gradient-to-b from-game-bg to-game-panel text-game-card-text',
    'transition-[border-color,box-shadow] duration-[120ms] ease-in-out',
    'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-game-accent-light focus-visible:outline-offset-[3px]',
    // 4.5 Button reset + hover state
    'appearance-none font-[inherit]',
    'hover:border-game-accent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Default border
    opts.selected ? 'border-game-accent shadow-[0_0_0_3px_rgba(96,165,250,0.35)]' : 'border-game-border',
    // 4.4 Card state modifiers
    opts.removed ? 'invisible' : '',
    opts.red ? 'text-game-red' : '',
    opts.blocked && !opts.removed ? 'opacity-50 cursor-not-allowed' : '',
    opts.fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

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
      const next = state.drawPile.length > 0 ? drawCard(state) : cyclePile(state);
      return {
        ...next,
        selectedCardId: null,
      };
    });
  };

  const canCycleDrawPile =
    game.drawPile.length === 0 &&
    game.discardPile.length > 0 &&
    (game.redrawsRemaining === null || game.redrawsRemaining > 0);
  const drawButtonLabel =
    game.drawPile.length > 0
      ? 'Draw next card'
      : canCycleDrawPile
        ? 'Cycle discard back to draw pile'
        : 'Empty';

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
    const isRed = card.suit === '♥' || card.suit === '♦';

    return (
      <button
        type="button"
        key={card.id}
        className={cardClasses({
          removed: card.removed,
          selected: isSelected,
          blocked,
          red: isRed,
        })}
        disabled={!isVisible || game.status !== 'in-progress'}
        onClick={() => handleCardClick(card.id)}
      >
        <div>{formatCard(card)}</div>
      </button>
    );
  };

  // 4.8 Game summary panel
  const gameSummary = (
    // 4.2 Panel styles
    <div className="bg-game-panel border border-game-border rounded-2xl p-5">
      <h2 className="mt-0">Game Status</h2>
      {/* 4.8 Summary grid */}
      <div className="grid gap-2">
        <div>Status: {statusLabel}</div>
        <div>Redraws remaining: {game.redrawsRemaining === null ? '∞' : game.redrawsRemaining}</div>
        <div>Draw pile: {game.drawPile.length}</div>
        <div>Discard top: {topDiscard ? formatCard(topDiscard) : 'None'}</div>
        <div>Selected card: {selectedCard ? formatCard(selectedCard) : 'None'}</div>
      </div>
    </div>
  );

  return (
    // 4.1 App shell layout
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto p-6">
      {/* 4.9 Logo row */}
      <div className="flex justify-between items-center gap-4">
        <h1>Pyramid Solitaire</h1>
      </div>

      {/* 4.2 Game setup panel */}
      <div className="bg-game-panel border border-game-border rounded-2xl p-5">
        <h2 className="mt-0">Game Setup</h2>
        {/* 4.1 Controls grid */}
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          <label>
            Redraw cycles
            <select
              value={selectedRedraw === null ? 'infinite' : String(selectedRedraw)}
              onChange={(event) =>
                setSelectedRedraw(
                  event.target.value === 'infinite' ? null : Number(event.target.value),
                )
              }
            >
              {redrawOptions.map((option) => (
                <option key={option.label} value={option.value === null ? 'infinite' : String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Win condition
            <select
              value={selectedWinCondition}
              onChange={(event) => setSelectedWinCondition(event.target.value as WinCondition)}
            >
              {winConditions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {/* 4.5 Button styles via Tailwind */}
          <button
            type="button"
            className="appearance-none bg-transparent border border-game-border rounded-lg text-inherit cursor-pointer font-[inherit] px-4 py-3 hover:border-game-accent disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStart}
            disabled={game.status === 'in-progress'}
          >
            Start game
          </button>
          <button
            type="button"
            className="appearance-none bg-transparent border border-game-border rounded-lg text-inherit cursor-pointer font-[inherit] px-4 py-3 hover:border-game-accent"
            onClick={handleRestart}
          >
            Reset
          </button>
        </div>
      </div>

      {game.status !== 'ready' && (
        // 4.2 Board panel
        <div className="bg-game-panel border border-game-border rounded-2xl p-5">
          {/* 4.8 Status row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* 4.9 Game info */}
            <div className="grid gap-2">
              <h2 className="mt-0">Board</h2>
              <div className="text-game-muted text-[0.95rem]">
                Click a visible pyramid card to select or remove it. Use Draw next card to reveal
                the next discard card.
              </div>
            </div>
          </div>

          {/* 4.6 Board grid */}
          <div className="grid gap-3 justify-items-center">
            {game.pyramid.map((row, rowIndex) => (
              // 4.6 Row flex layout
              <div className="flex gap-3 justify-center" key={`row-${rowIndex}`}>
                {row.map((card) => renderCard(card))}
              </div>
            ))}
          </div>

          {/* 4.7 Draw pile section */}
          <div className="flex gap-3 flex-wrap mt-4">
            {/* 4.7 Draw card */}
            <div className="w-24 min-h-[96px] rounded-xl border border-game-border p-3 grid place-items-center bg-game-bg">
              <div className="grid gap-2">
                <div>Draw pile</div>
                <button
                  type="button"
                  onClick={handleRedraw}
                  disabled={
                    (game.drawPile.length === 0 && !canCycleDrawPile) ||
                    game.status !== 'in-progress'
                  }
                  className={cardClasses({})}
                >
                  {drawButtonLabel}
                </button>
                <div className="text-game-muted text-[0.95rem]">
                  Cycles remaining: {game.redrawsRemaining === null ? '∞' : game.redrawsRemaining}
                </div>
              </div>
            </div>

            {/* 4.7 Discard card */}
            <div className="w-24 min-h-[96px] rounded-xl border border-game-border p-3 grid place-items-center bg-game-bg">
              <div className="grid gap-2">
                <div>Discard top</div>
                {topDiscard ? (
                  <button
                    type="button"
                    className={cardClasses({
                      selected: topDiscard.id === game.selectedCardId,
                      fullWidth: true,
                    })}
                    onClick={() => handleCardClick(topDiscard.id)}
                    disabled={game.status !== 'in-progress'}
                  >
                    {formatCard(topDiscard)}
                  </button>
                ) : (
                  <div>None</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameSummary}
    </div>
  );
}

export default App;
