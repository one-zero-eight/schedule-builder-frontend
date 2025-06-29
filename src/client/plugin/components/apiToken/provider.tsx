import { useState } from 'react';

import { type ApiContextI } from '../../contexts/apiTokenContext';
import apiContext from '../../contexts/apiTokenContext';

export default function ApiTokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<ApiContextI['token']>(undefined);

  function updateToken(newToken: string) {
    setToken(newToken);
  }

  return (
    <apiContext.Provider value={{ token, updateToken }}>
      {children}
    </apiContext.Provider>
  );
}
