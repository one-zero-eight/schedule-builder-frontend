import { PropsWithChildren, useEffect, useState } from 'react';
import { serverFunctions } from '../../lib/serverFunctions';
import spreadsheetContext from '../contexts/spreadsheetContext';

export function SpreadsheetProvider({ children }: PropsWithChildren) {
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    serverFunctions.getSpreadsheetID().then(setSpreadsheetId).catch(() => {});
  }, []);

  return (
    <spreadsheetContext.Provider value={spreadsheetId}>
      {children}
    </spreadsheetContext.Provider>
  );
}
