import { createContext } from 'react';

const spreadsheetContext = createContext<string | null>(null);

export default spreadsheetContext;
