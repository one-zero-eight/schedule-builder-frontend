import { createContext } from 'react';
import { SchemaCheckParameters, SchemaIssue } from '../../api/types';
import { DEFAULT_CHECK_PARAMETERS } from '../../lib/endpoints';
import { StateType } from '../../lib/types';

export interface IssuesContextI {
  issues: StateType<SchemaIssue[]>;
  updateIssues: () => void;
  checkParameters: SchemaCheckParameters;
  setCheckParameters: (params: SchemaCheckParameters) => void;
}

export const issuesContext = createContext<IssuesContextI>({
  issues: { error: '', isLoading: false, step: '', payload: [] },
  updateIssues: () => {},
  checkParameters: DEFAULT_CHECK_PARAMETERS,
  setCheckParameters: () => {},
});
