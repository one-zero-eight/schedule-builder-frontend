import React from 'react';
import Link from './router/Link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <h1>Hello there!</h1>
      <nav>
        <Link href="/">Go to home</Link>
        <Link href="/settings">Go to settings</Link>
        <Link href="/ignored">Go to conflicts</Link>
      </nav>
      {children}
    </div>
  );
}
