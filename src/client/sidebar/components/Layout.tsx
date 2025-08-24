import { PropsWithChildren } from 'react';
import { INNOHASSLE_URL } from '../../lib/constants';
import innohassleSvg from '../innohassle.svg';
import Link from './router/Link';

export function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col gap-3 h-full">
      <h1 className="text-2xl flex items-center justify-center">
        <a
          href={INNOHASSLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mr-2 align-middle"
        >
          <img
            src={innohassleSvg}
            width={48}
            height={48}
            alt="innohassle-logo"
          />
        </a>
        <span>
          InNo<span className="text-primary">Hassle</span> SCR
        </span>
      </h1>

      <nav className="flex justify-between gap-2">
        <Link className="flex-1 text-center" href="/">
          Home
        </Link>
        <Link className="flex-1 text-center" href="/settings">
          Settings
        </Link>
        <Link className="flex-1 text-center" href="/ignored">
          Ignored
        </Link>
      </nav>
      {children}
    </main>
  );
}
