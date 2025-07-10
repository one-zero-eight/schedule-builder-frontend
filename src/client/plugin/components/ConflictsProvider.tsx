import conflictContext from '../contexts/conflictContext';
import useAPI from '../hooks/useAPI';
import getAllCollisions from '../../lib/api/endpoints';
import useToken from '../hooks/useToken';

interface ConflictsProviderProps {
  children: React.ReactNode;
}

export default function ConflictsProvider({
  children,
}: ConflictsProviderProps) {
  const { token } = useToken();
  const [callAPI, requestState] = useAPI(getAllCollisions, []);

  async function updateConflicts() {
    if (token === undefined || token === '') {
      return;
    }

    await callAPI(token);
  }

  return (
    <conflictContext.Provider
      value={{ conflicts: requestState, updateConflicts }}
    >
      {children}
    </conflictContext.Provider>
  );
}
