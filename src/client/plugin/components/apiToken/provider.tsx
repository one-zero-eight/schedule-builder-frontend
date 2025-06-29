import { useState } from 'react';

import { type ApiContextI } from '../../contexts/apiTokenContext';
import apiContext from '../../contexts/apiTokenContext';
import { TOKEN_EXPIRY_DAYS } from '../../../lib/constants';
import { millisecondsToDays } from '../../../lib/utils';

type tokenStorageType = {
  token: string
  savedAt: string
}


export default function ApiTokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<ApiContextI['token']>(() => {
    const storage = localStorage.getItem("saved-api-token")
    if (storage == null) { return undefined }

    let received: tokenStorageType;
    try {
      received = JSON.parse(storage);
    } catch (error) {
      console.error("Failed to parse saved API token:", error);
      return undefined;
    }
    const currentDate = new Date();
    const savedDate = new Date(received.savedAt);
    const timeDiffInMilliseconds = currentDate.getTime() - savedDate.getTime();
    const daysBetween = millisecondsToDays(timeDiffInMilliseconds);

    if (daysBetween >= 0.95) {
      localStorage.removeItem("saved-api-token");
      return undefined;
    }

    return received.token;
  });

  function updateToken(newToken: string) {
    localStorage.setItem("saved-api-token", JSON.stringify({
      token: newToken,
      savedAt: new Date().toISOString(),
    }))
    setToken(newToken);
  }

  return (
    <apiContext.Provider value={{ token, updateToken }}>
      {children}
    </apiContext.Provider>
  );
}
