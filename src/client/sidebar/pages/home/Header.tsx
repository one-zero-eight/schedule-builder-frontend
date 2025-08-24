import { INNOHASSLE_TOKEN_URL } from '../../../lib/constants';

export function Header() {
  return (
    <div>
      <p>To check the schedule for issues:</p>
      <ol className="list-decimal text-start ml-4">
        <li>
          Go to{' '}
          <a
            target="_blank"
            href={INNOHASSLE_TOKEN_URL}
            rel="noopener noreferer"
            className="text-primary hover:text-secondary"
          >
            this website
          </a>{' '}
          and copy the token.
        </li>
        <li>Paste the token in the field below.</li>
        <li>Press the button "Check the schedule".</li>
      </ol>
    </div>
  );
}
