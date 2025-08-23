import { useContext } from 'react';
import apiContext from '../contexts/apiTokenContext';

export default function useToken() {
  const context = useContext(apiContext);
  if (!context) {
    throw new Error('useToken must be used within ApiTokenProvider');
  }
  return context;
}
