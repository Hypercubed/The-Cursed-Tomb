import React from 'react';

interface GameShellProps {
  header?: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  gameStatus?: string;
}

export function GameShell({ header, sidebar, children, gameStatus }: GameShellProps) {
  const isWon = gameStatus === 'won';

  return (
    <div className={`min-h-screen p-3 sm:p-6 lg:p-8 relative ${isWon ? 'animate-victory-glow' : ''}`}>
      <div className="torch-overlay" />
      {/* Victory Tomb Flourish Gold Sparks */}
      {isWon && (
        <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute top-10 left-10 text-game-accent text-3xl animate-bounce">✨</div>
          <div className="absolute top-12 right-12 text-game-accent text-3xl animate-bounce [animation-delay:200ms]">𓋹</div>
          <div className="absolute bottom-20 left-1/4 text-game-accent text-2xl animate-bounce [animation-delay:400ms]">𓃭</div>
          <div className="absolute bottom-24 right-1/4 text-game-accent text-3xl animate-bounce [animation-delay:600ms]">✨</div>
        </div>
      )}
      <div className="max-w-full 2xl:max-w-[1600px] mx-auto flex flex-col gap-4 sm:gap-6 relative z-10">
        {header && <header className="w-full">{header}</header>}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4 sm:gap-6 items-start">
          <div>{sidebar}</div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default GameShell;

