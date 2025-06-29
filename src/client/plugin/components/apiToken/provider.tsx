import { useState } from 'react';

import { type ApiContextI } from '../../contexts/apiTokenContext';
import apiContext from '../../contexts/apiTokenContext';

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

    const received: tokenStorageType = JSON.parse(storage)
    const currentDate = new Date()
    const savedDate = new Date(received.savedAt)
    const timeDiffInMilliseconds = currentDate.getTime() - savedDate.getTime()
    const daysBetween = timeDiffInMilliseconds / 1000 / 60 / 60 / 24

    if (daysBetween >= 0.95) {
      localStorage.removeItem("saved-api-token")
      return undefined
    }

    return received.token
  });

  function updateToken(newToken: string) {
    localStorage.setItem("saved-api-token", JSON.stringify({
      token: newToken,
      savedAt: new Date()
    }))
    setToken(newToken);
  }

  return (
    <apiContext.Provider value={{ token, updateToken }}>
      {children}
    </apiContext.Provider>
  );
}
