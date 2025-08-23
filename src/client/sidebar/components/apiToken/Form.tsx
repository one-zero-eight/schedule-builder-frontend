import useToken from '../../hooks/useToken';

export default function APIForm() {
  const { token, updateToken } = useToken();

  return (
    <input
      className="bg-surface border px-2 py-1 rounded-lg border-primary focus:border-primary/50"
      type="text"
      value={token}
      placeholder="Paste API token here..."
      onChange={(e) => updateToken(e.target.value)}
    />
  );
}
