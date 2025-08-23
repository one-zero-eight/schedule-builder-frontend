import { createContext } from 'react';
import { SchemaIssue } from '../../api/types';
import { StateType } from '../../lib/types';

export interface IssuesContextI {
  issues: StateType<SchemaIssue[]>;
  updateIssues: () => void;
}

export const issuesContext = createContext<IssuesContextI>({
  issues: { error: '', isLoading: false, step: '', payload: [] },
  updateIssues: () => {},
});
