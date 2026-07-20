import React from 'react';

interface GameShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function GameShell({ sidebar, children }: GameShellProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div>{sidebar}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default GameShell;
