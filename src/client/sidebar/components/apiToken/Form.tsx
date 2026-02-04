import { INNOHASSLE_TOKEN_URL } from '../../../lib/constants';
import useToken from '../../hooks/useToken';

export default function APIForm() {
  const { token, updateToken } = useToken();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-text">
        Set Token
      </label>
      <p className="text-sm text-textSecondary">
        Go to{' '}
        <a
          target="_blank"
          href={INNOHASSLE_TOKEN_URL}
          rel="noopener noreferrer"
          className="text-primary hover:text-secondary"
        >
          this website
        </a>{' '}
        and copy the token.
      </p>
      <input
        className="bg-surface border px-2 py-1 rounded-lg border-primary focus:border-primary/50"
        type="text"
        value={token}
        placeholder="Paste API token here..."
        onChange={(e) => updateToken(e.target.value)}
      />
    </div>
  );
}
