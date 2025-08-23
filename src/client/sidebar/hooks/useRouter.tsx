import { useContext } from 'react';
import routerContext from '../contexts/routerContext';

export default function useRouter() {
  const context = useContext(routerContext);
  if (!context) {
    throw new Error('useRouter must be used within a StateRouter');
  }
  return context;
}
