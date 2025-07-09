import { useContext } from 'react';
import apiContext from '../../contexts/apiTokenContext';

export default function APIForm() {
  const { token, updateToken } = useContext(apiContext);

  return (
    <input
      className="bg-dark border px-2 py-1 rounded-lg border-innohassle focus:border-innohassle/50"
      type="text"
      value={token}
      placeholder="Paste API token here..."
      onChange={(e) => updateToken(e.target.value)}
    />
  );
}
