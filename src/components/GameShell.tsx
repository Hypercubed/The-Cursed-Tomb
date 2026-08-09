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
    <div className={`safe-area-shell min-h-screen p-3 sm:p-6 lg:py-3 lg:px-6 relative ${isWon ? 'animate-victory-glow' : ''}`}>
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
      <div className="max-w-full 2xl:max-w-[1600px] mx-auto flex flex-col gap-3 lg:gap-4 relative z-10">
        {header && <header className="w-full">{header}</header>}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4 lg:gap-5 items-start">
          <div className="order-2 lg:order-none lg:sticky lg:top-3 lg:max-h-[calc(100vh-1.5rem)] lg:overflow-y-auto custom-scrollbar">{sidebar}</div>
          <main className="order-1 lg:order-none min-w-0">{children}</main>
        </div>
      </div>
      <footer className="mt-6 border-t border-[#2d2319] py-2.5 text-center text-xs font-mono relative z-10 px-2">
        <a
          href="https://github.com/Hypercubed/The-Cursed-Tomb"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub — Hypercubed/The-Cursed-Tomb"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-amber-300/70 hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0a07] rounded-sm px-1 py-0.5 max-w-full"
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="shrink-0"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>Hypercubed/The-Cursed-Tomb</span>
          <span aria-hidden="true" className="text-amber-500/30">
            𓋹
          </span>
          <span>View source on GitHub</span>
        </a>
      </footer>
    </div>
  );
}

export default GameShell;

