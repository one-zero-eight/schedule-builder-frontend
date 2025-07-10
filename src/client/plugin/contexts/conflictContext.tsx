import { createContext } from 'react';
import { ConflictResponse } from '../../lib/types';
import { StateType } from '../../lib/api/types';

export interface ConflictContextI {
  conflicts: StateType<ConflictResponse>;
  updateConflicts: () => void;
}

const conflictContext = createContext<ConflictContextI>({
  conflicts: { error: '', isLoading: false, step: '', payload: [] },
  updateConflicts: () => {},
});

export default conflictContext;
