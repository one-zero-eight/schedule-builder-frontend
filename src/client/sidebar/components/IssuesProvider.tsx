import { PropsWithChildren } from 'react';
import { issuesContext } from '../contexts/issuesContext';
import useAPI from '../hooks/useAPI';
import getAllIssues from '../../lib/endpoints';
import useToken from '../hooks/useToken';

export function IssuesProvider({ children }: PropsWithChildren) {
  const { token } = useToken();
  const [callAPI, issues] = useAPI(getAllIssues, []);

  async function updateIssues() {
    if (token === undefined || token === '') {
      return;
    }

    await callAPI(token);
  }

  return (
    <issuesContext.Provider value={{ issues, updateIssues }}>
      {children}
    </issuesContext.Provider>
  );
}
