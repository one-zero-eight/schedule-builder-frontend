import { createRoot } from 'react-dom/client';
import Main from './components/Main';
import ApiTokenProvider from './components/apiToken/Provider';
import './styles.css';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(
  <ApiTokenProvider>
    <Main />
  </ApiTokenProvider>
);
