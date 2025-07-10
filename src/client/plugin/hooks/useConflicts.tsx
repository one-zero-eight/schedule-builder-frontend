import { useContext } from 'react';
import conflictContext from '../contexts/conflictContext';

export default function useConflicts() {
  const context = useContext(conflictContext);
  if (!context) {
    throw new Error('useConflicts must be used within a ConflictProvider');
  }
  return context;
}
