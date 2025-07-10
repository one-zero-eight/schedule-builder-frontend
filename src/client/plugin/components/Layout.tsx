import React from 'react';
import Link from './router/Link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="text-center text-white flex flex-col gap-3 h-full">
      <nav className="flex justify-between gap-2">
        <Link className="flex-1" href="/">
          Home
        </Link>
        <Link className="flex-1" href="/settings">
          Settings
        </Link>
        <Link className="flex-1" href="/ignored">
          Ignored Conflicts
        </Link>
      </nav>
      <h1>
        InNo<span className="text-innohassle">Hassle</span> SCR
      </h1>
      {children}
    </main>
  );
}
