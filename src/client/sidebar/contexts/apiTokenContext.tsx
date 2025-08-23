import { createContext } from 'react';

export interface ApiContextI {
  token: string | undefined;
  updateToken: (newToken: string) => void;
}

const apiContext = createContext<ApiContextI>({
  token: undefined,
  updateToken: () => {},
});

export default apiContext;
