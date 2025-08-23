import { useContext } from 'react';
import { issuesContext } from '../contexts/issuesContext.tsx';

export default function useConflicts() {
  const context = useContext(issuesContext);
  if (!context) {
    throw new Error('useConflicts must be used within a ConflictProvider');
  }
  return context;
}
