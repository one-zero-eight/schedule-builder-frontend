import { useState } from 'react';

import { type ApiContextI } from '../../contexts/apiTokenContext';
import apiContext from '../../contexts/apiTokenContext';
import { TOKEN_EXPIRY_DAYS, CACHED_AUTH_TOKEN } from '../../../lib/constants';
import { millisecondsToDays } from '../../../lib/utils';

type tokenStorageType = {
  token: string;
  savedAt: string;
};

export default function ApiTokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<ApiContextI['token']>(() => {
    const storage = localStorage.getItem(CACHED_AUTH_TOKEN);
    if (storage == null) return undefined;

    let received: tokenStorageType;
    try {
      received = JSON.parse(storage);
    } catch (error) {
      return undefined;
    }
    const currentDate = new Date();
    const savedDate = new Date(received.savedAt);
    const timeDiffInMilliseconds = currentDate.getTime() - savedDate.getTime();
    const daysBetween = millisecondsToDays(timeDiffInMilliseconds);

    if (daysBetween >= TOKEN_EXPIRY_DAYS) {
      localStorage.removeItem(CACHED_AUTH_TOKEN);
      return undefined;
    }

    return received.token;
  });

  function updateToken(newToken: string) {
    localStorage.setItem(
      CACHED_AUTH_TOKEN,
      JSON.stringify({
        token: newToken,
        savedAt: new Date().toISOString(),
      })
    );
    setToken(newToken);
  }

  return (
    <apiContext.Provider value={{ token, updateToken }}>
      {children}
    </apiContext.Provider>
  );
}
