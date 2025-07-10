import React from 'react';
import Link from './router/Link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="text-center text-white flex flex-col gap-3 h-full">
      <nav>
        <Link href="/">Go to home</Link>
        <Link href="/settings">Go to settings</Link>
        <Link href="/ignored">Go to conflicts</Link>
      </nav>
      <h1>
        InNo<span className="text-innohassle">Hassle</span> SCR
      </h1>
      {children}
    </main>
  );
}
