import { createContext } from 'react';
import { RouteLink } from '../../lib/types';

interface RouterContextType {
  location: string | undefined;
  navigate: (path: RouteLink) => void;
}

const routerContext = createContext<RouterContextType>({
  location: undefined,
  navigate: () => {},
});

export default routerContext;
