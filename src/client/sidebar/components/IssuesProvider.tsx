import { PropsWithChildren } from 'react';
import { issuesContext } from '../contexts/issuesContext';
import useAPI from '../hooks/useAPI';
import { getAllIssues } from '../../lib/endpoints';
import useToken from '../hooks/useToken';

export function IssuesProvider({ children }: PropsWithChildren) {
  const { token } = useToken();

  const getSheetNames = () => {
    try {
      const stored = localStorage.getItem('schedule-builder-sheet-names');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse sheet names from localStorage:', error);
    }
    return ['1st block common (since 25/08)', 'Ru Programs'];
  };

  // Create a wrapper function that matches the expected signature for useAPI
  const getAllIssuesWrapper = async (
    updateRequestState: (step: string) => void,
    token: string
  ) => {
    updateRequestState('Fetching issues...');
    return getAllIssues(token, getSheetNames());
  };

  const [callAPI, issues] = useAPI(getAllIssuesWrapper, []);

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
